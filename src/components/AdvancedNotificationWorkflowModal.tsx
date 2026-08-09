import React, { useState, useEffect } from 'react';
import { 
  X, Mail, MessageSquare, ClipboardList, Calculator, Plus, Trash2, 
  Send, Copy, Check, Sparkles, Phone, FileText, AlertCircle, 
  MapPin, UserCheck, ShieldCheck, HelpCircle, History, Landmark,
  Smartphone, RotateCcw, FileSpreadsheet, Lock, ArrowRight, Info
} from 'lucide-react';
import { CustomerRecord, StoreLocation } from '../types';

interface AdvancedNotificationWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerRecord[];
  onUpdateCustomers: (updated: CustomerRecord[]) => void;
  stores?: StoreLocation[];
}

interface SMSStatusItem {
  id: string;
  timestamp: string;
  customerName: string;
  phone: string;
  message: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
}

const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta', gst: 5, pst: 0, hst: 0, description: '5% GST' },
  { code: 'BC', name: 'British Columbia', gst: 5, pst: 7, hst: 0, description: '12% Combined GST+PST' },
  { code: 'ON', name: 'Ontario', gst: 0, pst: 0, hst: 13, description: '13% HST' },
  { code: 'QC', name: 'Quebec', gst: 5, pst: 9.975, hst: 0, description: '14.975% Combined GST+QST' },
  { code: 'SK', name: 'Saskatchewan', gst: 5, pst: 6, hst: 0, description: '11% Combined GST+PST' },
  { code: 'MB', name: 'Manitoba', gst: 5, pst: 7, hst: 0, description: '12% Combined GST+RST' },
  { code: 'NS', name: 'Nova Scotia', gst: 0, pst: 0, hst: 15, description: '15% HST' },
  { code: 'NB', name: 'New Brunswick', gst: 0, pst: 0, hst: 15, description: '15% HST' },
  { code: 'NL', name: 'Newfoundland', gst: 0, pst: 0, hst: 15, description: '15% HST' },
];

export function AdvancedNotificationWorkflowModal({
  isOpen,
  onClose,
  customers,
  onUpdateCustomers,
  stores = []
}: AdvancedNotificationWorkflowModalProps) {
  const [activeTab, setActiveTab] = useState<'refund_calc' | 'notes' | 'sms' | 'email'>('refund_calc');

  // Customer Selector & active customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  // Initialize selected customer if none selected but list is available
  useEffect(() => {
    if (isOpen && customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [isOpen, customers, selectedCustomerId]);

  const activeCustomerId = activeCustomer?.id || '';

  // Sync details when active customer changes
  useEffect(() => {
    if (activeCustomer) {
      setSmsPhone(activeCustomer.phone || '');
      setEmailSubject(`Golf Town Store Credit Refund Notice - $${activeCustomer.sumOfStoreCreditBalance} Issued`);
      setEmailRecipient(activeCustomer.email || '');
      setSmsRecipientName(`${activeCustomer.firstName} ${activeCustomer.lastName}`);
    }
  }, [activeCustomerId, selectedCustomerId]);

  // ==========================================
  // STATE 1: STORE CREDIT REFUND CALCULATOR
  // ==========================================
  const [calcBaseAmount, setCalcBaseAmount] = useState<string>('500.00');
  const [calcRestockingFee, setCalcRestockingFee] = useState<string>('10'); // 10%
  const [calcProvince, setCalcProvince] = useState<string>('AB');
  const [calcLoyaltyBonus, setCalcLoyaltyBonus] = useState<string>('0');
  const [calcStoreId, setCalcStoreId] = useState<string>('504');
  const [calcNotes, setCalcNotes] = useState<string>('Damaged driver shaft return. Original purchase verified.');
  const [calcCustId, setCalcCustId] = useState<string>(() => `GT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [calcFirstName, setCalcFirstName] = useState<string>('');
  const [calcLastName, setCalcLastName] = useState<string>('');
  const [calcEmail, setCalcEmail] = useState<string>('');
  const [calcPhone, setCalcPhone] = useState<string>('');

  const [calcResult, setCalcResult] = useState<{
    subtotal: number;
    restockingDeduction: number;
    taxAddition: number;
    loyaltyAddition: number;
    finalRefund: number;
  }>({ subtotal: 500, restockingDeduction: 50, taxAddition: 22.5, loyaltyAddition: 0, finalRefund: 472.5 });

  // Real-time calculation formula
  useEffect(() => {
    const base = parseFloat(calcBaseAmount) || 0;
    const restockPct = parseFloat(calcRestockingFee) || 0;
    const promoBonus = parseFloat(calcLoyaltyBonus) || 0;

    const restockingDeduction = base * (restockPct / 100);
    const amountAfterRestock = base - restockingDeduction;

    const prov = CANADIAN_PROVINCES.find(p => p.code === calcProvince) || CANADIAN_PROVINCES[0];
    const totalTaxPct = prov.gst + prov.pst + prov.hst;
    const taxAddition = amountAfterRestock * (totalTaxPct / 100);

    const finalRefund = amountAfterRestock + taxAddition + promoBonus;

    setCalcResult({
      subtotal: base,
      restockingDeduction,
      taxAddition,
      loyaltyAddition: promoBonus,
      finalRefund: Math.max(0, parseFloat(finalRefund.toFixed(2)))
    });
  }, [calcBaseAmount, calcRestockingFee, calcProvince, calcLoyaltyBonus]);

  const handleCreateAndIssueRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcFirstName.trim() || !calcLastName.trim()) {
      alert('Please enter first name and last name for the new refund customer.');
      return;
    }

    const newCustomerId = `cust-${Date.now()}`;
    const generatedCustId = calcCustId.trim() || `GT-${Math.floor(10000 + Math.random() * 90000)}`;

    const newCustomer: CustomerRecord = {
      id: newCustomerId,
      custId: generatedCustId,
      firstName: calcFirstName.trim(),
      lastName: calcLastName.trim(),
      email: calcEmail.trim() || '(blank)',
      phone: calcPhone.trim() || '(403) 723-0100',
      storeId: calcStoreId,
      storeName: stores.find(s => s.id === calcStoreId)?.name || `Store ${calcStoreId} - Calgary Golf Town`,
      quarter: 'Q3',
      year: 2026,
      quarterYearKey: '2026-Q3',
      city: stores.find(s => s.id === calcStoreId)?.city || 'Calgary',
      sumOfStoreCreditBalance: calcResult.finalRefund,
      comments: `${calcNotes.trim()} [Refund calc details: Base $${calcBaseAmount}, Restock ${calcRestockingFee}%, Province ${calcProvince}, Bonus $${calcLoyaltyBonus}]`,
      company: 'Golf Town Canada Inc.',
      approvedBy: 'ENI-MGR-SYSTEM',
      gender: 'Unknown' as const,
      lastCreatedDate: new Date().toLocaleDateString(),
      lastSaleDate: new Date().toLocaleDateString(),
      refundStatus: 'Pending',
      // Custom internal notes initial state
      storeCreditAging: 'Under 10 Days'
    };

    // Save and update customer record globally
    onUpdateCustomers([newCustomer, ...customers]);
    
    // Select this customer as active and route to communication tabs
    setSelectedCustomerId(newCustomerId);
    
    // Reset calculator inputs
    setCalcCustId(`GT-${Math.floor(10000 + Math.random() * 90000)}`);
    setCalcFirstName('');
    setCalcLastName('');
    setCalcEmail('');
    setCalcPhone('');
    setCalcNotes('Damaged driver shaft return. Original purchase verified.');
    setCalcBaseAmount('500.00');
    setCalcRestockingFee('10');
    setCalcLoyaltyBonus('0');

    alert(`Successfully generated Store Credit Refund of $${calcResult.finalRefund.toFixed(2)} CAD for ${newCustomer.firstName} ${newCustomer.lastName}. Redirecting to notification sender!`);
    setActiveTab('sms');
  };

  // ==========================================
  // STATE 2: ADVANCED CUSTOMER NOTES HISTORY
  // ==========================================
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [noteTag, setNoteTag] = useState<string>('[DISPATCH]');

  // Stamped notes parsing
  const getParsedNotes = (): { id: string; timestamp: string; content: string; tag?: string }[] => {
    if (!activeCustomer) return [];
    
    // We parse customer comments for stamped notes, or check if we can simulate structured history
    // Since comments often contains notes, we can parse multiple lines containing timestamps or split them.
    const comments = activeCustomer.comments || '';
    const items = comments.split('\n').filter(line => line.trim().length > 0);
    
    return items.map((text, index) => {
      // Look for custom date formats like [YYYY-MM-DD HH:MM] or [Date]
      const dateMatch = text.match(/\[(.*?)\]/);
      const timestamp = dateMatch ? dateMatch[1] : new Date().toLocaleDateString();
      const content = text.replace(/\[.*?\]/g, '').trim();
      return {
        id: `note-${index}`,
        timestamp,
        content
      };
    });
  };

  const handleAddNote = () => {
    if (!activeCustomer || !newNoteContent.trim()) return;

    const timestamp = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString();
    const formattedNote = `[${timestamp}] ${noteTag} ${newNoteContent.trim()}`;
    
    const updatedComments = activeCustomer.comments && activeCustomer.comments !== '(blank)'
      ? `${activeCustomer.comments}\n${formattedNote}`
      : formattedNote;

    const updated = customers.map(c => c.id === activeCustomer.id 
      ? { ...c, comments: updatedComments } 
      : c
    );

    onUpdateCustomers(updated);
    setNewNoteContent('');
    alert('Custom timestamped note added successfully to customer history record!');
  };

  const handleClearAllNotes = () => {
    if (!activeCustomer) return;
    if (confirm('Are you sure you want to clear this customer\'s comment / notes history?')) {
      const updated = customers.map(c => c.id === activeCustomer.id 
        ? { ...c, comments: '' } 
        : c
      );
      onUpdateCustomers(updated);
    }
  };

  // ==========================================
  // STATE 3: CUSTOM SMS DISPATCHER & PREVIEW
  // ==========================================
  const [smsPhone, setSmsPhone] = useState<string>('');
  const [smsRecipientName, setSmsRecipientName] = useState<string>('');
  const [smsTemplate, setSmsTemplate] = useState<'refund_link' | 'otp_challenge' | 'balance_alert' | 'custom'>('refund_link');
  const [customSmsText, setCustomSmsText] = useState<string>('Hi {name}, our store credit audit verified your account. Your outstanding store credit balance of {amount} is ready. Contact store #{storeId} for help.');
  const [smsPIN, setSmsPIN] = useState<string>(() => Math.floor(100000 + Math.random() * 900000).toString());
  
  // Real-time carrier logs
  const [smsHistory, setSmsHistory] = useState<SMSStatusItem[]>([]);

  const getSmsRenderedText = () => {
    const customerName = activeCustomer ? `${activeCustomer.firstName} ${activeCustomer.lastName}` : smsRecipientName || 'Valued Customer';
    const amountStr = activeCustomer ? `$${activeCustomer.sumOfStoreCreditBalance.toFixed(2)}` : '$250.00';
    const storeIdStr = activeCustomer ? activeCustomer.storeId : '504';
    const linkStr = activeCustomer?.shortenedUrl || `https://clck.ru/GT-SESS-${Math.floor(100000 + Math.random() * 900000)}`;

    let text = '';
    if (smsTemplate === 'refund_link') {
      text = `Golf Town eGift Alert: Dear ${customerName}, your store credit refund of ${amountStr} CAD has been finalized. Securely claim your deposit to your bank debit/credit card immediately here: ${linkStr}`;
    } else if (smsTemplate === 'otp_challenge') {
      text = `GOLFTOWN SECURITY: Your requested CashStar secure transfer PIN is ${smsPIN}. For verification, input this within 5 minutes. Do NOT share this verification code.`;
    } else if (smsTemplate === 'balance_alert') {
      text = `Notice from Golf Town Calgary: Hi ${customerName}, our registers indicate an unused Store Credit balance of ${amountStr} on your account. Spend it online or visit us at Store #${storeIdStr}.`;
    } else {
      text = customSmsText
        .replace(/{name}/g, customerName)
        .replace(/{amount}/g, amountStr)
        .replace(/{storeId}/g, storeIdStr)
        .replace(/{link}/g, linkStr);
    }
    return text;
  };

  const handleSendCustomSMS = async () => {
    if (!smsPhone.trim()) {
      alert('Please supply a target phone number for dispatch.');
      return;
    }

    const message = getSmsRenderedText();
    const newLog: SMSStatusItem = {
      id: `sms-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      customerName: activeCustomer ? `${activeCustomer.firstName} ${activeCustomer.lastName}` : smsRecipientName || 'Custom Outbox',
      phone: smsPhone,
      message,
      status: 'QUEUED'
    };

    setSmsHistory(prev => [newLog, ...prev]);

    // Simulate carrier delivery pipeline
    setTimeout(() => {
      setSmsHistory(prev => prev.map(item => item.id === newLog.id ? { ...item, status: 'SENT' } : item));
    }, 1500);

    setTimeout(() => {
      setSmsHistory(prev => prev.map(item => item.id === newLog.id ? { ...item, status: 'DELIVERED' } : item));
      
      // Auto stamp on customer profile
      if (activeCustomer) {
        const timestampStamp = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString();
        const formattedNote = `[${timestampStamp}] [SMS_DISPATCH] Sent "${smsTemplate.toUpperCase()}" SMS notification to ${smsPhone}`;
        
        const updatedComments = activeCustomer.comments && activeCustomer.comments !== '(blank)'
          ? `${activeCustomer.comments}\n${formattedNote}`
          : formattedNote;

        const updated = customers.map(c => c.id === activeCustomer.id 
          ? { ...c, comments: updatedComments, refundStatus: 'SMS Dispatched' as const } 
          : c
        );
        onUpdateCustomers(updated);
      }
    }, 3000);

    // Prompt user with native SMS intent on mobile
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      const isMobileIntent = confirm('Open native messaging app on your phone with this text pre-populated?');
      if (isMobileIntent) {
        window.location.href = `sms:${smsPhone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(message)}`;
      }
    } else {
      alert(`Carrier Dispatch Success!\nSMS queued for delivery to ${smsPhone}.\nLive status monitored in log window below.`);
    }
  };

  // ==========================================
  // STATE 4: CUSTOM EMAIL SENDER (EXT)
  // ==========================================
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailTemplate, setEmailTemplate] = useState<'standard' | 'executive' | 'urgent'>('standard');
  const [emailBodyText, setEmailBodyText] = useState<string>('Your store credit statement is enclosed. Please claim your direct deposit immediately.');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [attachTandC, setAttachTandC] = useState<boolean>(true);
  const [attachReceipt, setAttachReceipt] = useState<boolean>(false);
  const [attachReleaseForm, setAttachReleaseForm] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  const getEmailBodyHtml = () => {
    const customerName = activeCustomer ? `${activeCustomer.firstName} ${activeCustomer.lastName}` : 'Valued Customer';
    const amountStr = activeCustomer ? activeCustomer.sumOfStoreCreditBalance.toFixed(2) : '250.00';
    const storeIdStr = activeCustomer ? activeCustomer.storeId : '504';
    const linkStr = activeCustomer?.shortenedUrl || `https://ais-dev-mwgv7lsbit5fk42mov3lwr.run.app/?deposit_token=GT-${Math.floor(100000+Math.random()*900000)}`;
    const custIdStr = activeCustomer ? activeCustomer.custId : 'GT-CUSTOMER';

    if (emailTemplate === 'standard') {
      return `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #004d25; padding: 24px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">Golf Town Customer Support</h2>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8;">Store Credit Notice</span>
            </div>
            <div style="padding: 30px;">
              <p>Dear <strong>${customerName}</strong>,</p>
              <p>${emailBodyText}</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f3f4f6; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px; font-weight: bold; color: #374151;">Issued Amount:</td>
                  <td style="padding: 16px; text-align: right; font-size: 18px; font-weight: 800; color: #004d25;">$${amountStr} CAD</td>
                </tr>
                <tr style="border-top: 1px solid #e5e7eb; font-size: 12px; color: #4b5563;">
                  <td style="padding: 12px 16px;">Customer Account ID:</td>
                  <td style="padding: 12px 16px; text-align: right; font-family: monospace;">${custIdStr}</td>
                </tr>
                <tr style="border-top: 1px solid #e5e7eb; font-size: 12px; color: #4b5563;">
                  <td style="padding: 12px 16px;">Issuing Location:</td>
                  <td style="padding: 12px 16px; text-align: right;">Golf Town Store #${storeIdStr}</td>
                </tr>
              </table>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${linkStr}" target="_blank" style="display: inline-block; background-color: #004d25; color: white; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 4px;">
                  Claim Credit Deposit ($${amountStr} CAD)
                </a>
              </div>

              <p style="font-size: 11px; color: #6b7280; line-height: 1.4;">
                This link is secured for your account only and is valid for 72 hours. Powered by CashStar Network Services.
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 16px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb;">
              &copy; ${new Date().getFullYear()} Golf Town Canada Inc. All rights reserved.
            </div>
          </div>
        </div>
      `;
    } else if (emailTemplate === 'executive') {
      return `
        <div style="font-family: 'Georgia', serif; color: #1f2937; padding: 40px; background-color: #ffffff; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #d1d5db; border-radius: 4px;">
          <h1 style="font-size: 22px; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-top: 0;">Golf Town Retail Support</h1>
          <p>Dear ${customerName},</p>
          <p>Please review this formal notification regarding the store credit liability allocation for your client ID <strong>${custIdStr}</strong>.</p>
          <p>A direct balance replenishment voucher has been approved by the Store Audit Department for the total of <strong>$${amountStr} CAD</strong>.</p>
          <p>${emailBodyText}</p>
          <p>To authorize payment, please proceed directly to our secure CashStar settlement terminal:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${linkStr}" style="font-weight: bold; color: #004d25; text-decoration: underline; font-size: 16px;">
              Access Secure Settlement Terminal &rarr;
            </a>
          </p>
          <p>Yours sincerely,</p>
          <p style="margin-bottom: 0;"><strong>Executive Escalations Unit</strong><br>Golf Town Customer Services &amp; Loss Prevention</p>
        </div>
      `;
    } else {
      return `
        <div style="font-family: sans-serif; padding: 20px; background-color: #fef2f2; color: #991b1b;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #fca5a5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="background-color: #dc2626; padding: 20px; text-align: center; color: white; font-weight: bold;">
              ⚠️ URGENT COMPLIANCE &amp; SECURITY ALERT
            </div>
            <div style="padding: 24px; color: #374151;">
              <p>Attention: <strong>${customerName}</strong> (ID: ${custIdStr}),</p>
              <p style="font-weight: bold; color: #dc2626;">We have flagged an outstanding store credit of $${amountStr} CAD on your account that is currently nearing inactivity policy expiration.</p>
              <p>${emailBodyText}</p>
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 20px 0; font-size: 13px; color: #991b1b;">
                <strong>Notice:</strong> Failing to claim this balance within 72 hours requires manual regional corporate re-issuance, incurring standard $15 administrative reprocessing deductions.
              </div>
              <div style="text-align: center; margin: 26px 0;">
                <a href="${linkStr}" style="display: inline-block; background-color: #dc2626; color: white; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 6px;">
                  Securely Claim Active Balance Immediately
                </a>
              </div>
            </div>
            <div style="background-color: #fcfcfc; padding: 14px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f3f3;">
              System notification triggered by compliance server ENI-AUD-CALGARY.
            </div>
          </div>
        </div>
      `;
    }
  };

  const handleSendCustomEmail = async () => {
    if (!emailRecipient.trim() || !emailRecipient.includes('@')) {
      alert('Please enter a valid recipient email address.');
      return;
    }

    setSendingEmail(true);
    try {
      const attachmentsList: string[] = [];
      if (attachTandC) attachmentsList.push('Golf_Town_Voucher_Terms.pdf');
      if (attachReceipt) attachmentsList.push(`Alberta_GST_Invoice_${activeCustomer?.custId || 'GT'}.pdf`);
      if (attachReleaseForm) attachmentsList.push('Customer_Signed_Corporate_Release.pdf');

      const res = await fetch('/api/send-refund-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailRecipient,
          recipientName: activeCustomer ? `${activeCustomer.firstName} ${activeCustomer.lastName}` : 'Valued Customer',
          amount: activeCustomer ? activeCustomer.sumOfStoreCreditBalance.toString() : '250.00',
          storeId: activeCustomer ? activeCustomer.storeId : '504',
          custId: activeCustomer ? activeCustomer.custId : 'GT-CUSTOMER',
          comments: `${emailBodyText} [SIMULATED ATTACHMENTS: ${attachmentsList.join(', ')}]`,
          subject: emailSubject || 'Golf Town Store Credit Refund Notice',
          customHtml: getEmailBodyHtml()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Stamp on profile
        if (activeCustomer) {
          const timestampStamp = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString();
          const formattedNote = `[${timestampStamp}] [EMAIL_DISPATCH] Sent custom "${emailTemplate.toUpperCase()}" email notice (Subject: "${emailSubject}") with attachments: ${attachmentsList.join(', ') || 'None'}`;
          
          const updatedComments = activeCustomer.comments && activeCustomer.comments !== '(blank)'
            ? `${activeCustomer.comments}\n${formattedNote}`
            : formattedNote;

          const updated = customers.map(c => c.id === activeCustomer.id 
            ? { ...c, comments: updatedComments, refundStatus: 'Refunded' as const } 
            : c
          );
          onUpdateCustomers(updated);
        }
        alert(`Email Notice successfully dispatched via SMTP! Reference Token: ${data.depositToken || 'SMTP-OK'}`);
      } else {
        alert(`Failed to send custom email notice: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Email dispatch error: ${err.message || err}`);
    } finally {
      setSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Top Header */}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-700/30 flex items-center justify-center text-emerald-800">
              <Sparkles className="w-5 h-5 text-emerald-700 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                Operations &amp; Advanced Comms Hub
              </h2>
              <p className="text-[11px] text-slate-500">
                Unified dispatch center: Store Credit Refund Calculator, Custom Stamped Notes, Carrier-Class SMS Engine, HTML Email Composer.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Selected Customer Quick Bar (Non-Calculator Tab only) */}
        {activeTab !== 'refund_calc' && (
          <div className="bg-emerald-50/60 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Active Record:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-bold focus:outline-none shadow-xs"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.custId || 'No ID'}) — ${c.sumOfStoreCreditBalance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {activeCustomer && (
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600 flex-wrap">
                <div>
                  <span className="text-slate-400">Phone:</span> <span className="font-bold text-slate-900">{activeCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span> <span className="font-bold text-emerald-800">{activeCustomer.email}</span>
                </div>
                <div>
                  <span className="text-slate-400">Store:</span> <span className="font-bold text-slate-900">#{activeCustomer.storeId}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white px-5 py-2 border-b border-slate-200 flex items-center justify-start gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('refund_calc')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'refund_calc' 
                ? 'bg-emerald-700 text-slate-900 shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>1. Refund Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notes' 
                ? 'bg-emerald-700 text-slate-900 shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>2. Customer Notes Thread</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sms' 
                ? 'bg-emerald-700 text-slate-900 shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>3. Custom SMS Dispacher</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'email' 
                ? 'bg-emerald-700 text-slate-900 shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>4. HTML Email Composer</span>
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: STORE CREDIT REFUND CALCULATOR */}
          {activeTab === 'refund_calc' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Input fields */}
              <form onSubmit={handleCreateAndIssueRefund} className="lg:col-span-7 space-y-4 bg-slate-50/50 p-5 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Refund Parameters &amp; Customer Profile</span>
                </div>

                {/* Refund Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Base Item Total ($)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                      <input 
                        type="number"
                        step="0.01"
                        value={calcBaseAmount}
                        onChange={(e) => setCalcBaseAmount(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 shadow-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Restocking Fee</label>
                    <select
                      value={calcRestockingFee}
                      onChange={(e) => setCalcRestockingFee(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none shadow-xs"
                    >
                      <option value="0">0% (Discretionary Waiver)</option>
                      <option value="5">5% (Open Box)</option>
                      <option value="10">10% (Standard Fee)</option>
                      <option value="15">15% (No Tags / Used)</option>
                      <option value="20">20% (Late Return)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Tax Province Rate</label>
                    <select
                      value={calcProvince}
                      onChange={(e) => setCalcProvince(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none shadow-xs"
                    >
                      {CANADIAN_PROVINCES.map(p => (
                        <option key={p.code} value={p.code}>{p.code} - {p.name} ({p.description})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Discretionary Bonus ($)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                      <input 
                        type="number"
                        step="1"
                        value={calcLoyaltyBonus}
                        onChange={(e) => setCalcLoyaltyBonus(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Refund Store Location</label>
                    <select
                      value={calcStoreId}
                      onChange={(e) => setCalcStoreId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none shadow-xs"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>#{s.id} - {s.name}</option>
                      )) || <option value="504">Store 504 - South Calgary</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Customer ID (Manual override)</label>
                    <input 
                      type="text" 
                      value={calcCustId}
                      onChange={(e) => setCalcCustId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
                      placeholder="e.g. GT-89302"
                    />
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Customer Contact Identity</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">First Name</label>
                      <input 
                        type="text"
                        value={calcFirstName}
                        onChange={(e) => setCalcFirstName(e.target.value)}
                        placeholder="Alex"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Last Name</label>
                      <input 
                        type="text"
                        value={calcLastName}
                        onChange={(e) => setCalcLastName(e.target.value)}
                        placeholder="Mercer"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Mobile Phone (Carrier Ready)</label>
                      <input 
                        type="text"
                        value={calcPhone}
                        onChange={(e) => setCalcPhone(e.target.value)}
                        placeholder="(403) 891-2041"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Corporate Email Address</label>
                      <input 
                        type="email"
                        value={calcEmail}
                        onChange={(e) => setCalcEmail(e.target.value)}
                        placeholder="alex.mercer@gmail.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Audit Reference / Audit Notes</label>
                    <textarea
                      rows={2}
                      value={calcNotes}
                      onChange={(e) => setCalcNotes(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 shadow-xs text-slate-700"
                      placeholder="Enter details about why this refund credit is processed..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-slate-900 font-black rounded-xl shadow-lg shadow-emerald-950/10 inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-slate-900" />
                  <span>Issue Store Credit Refund (${calcResult.finalRefund.toFixed(2)} CAD) &amp; Open Dispatcher</span>
                </button>
              </form>

              {/* Live Calculator Receipt Board */}
              <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4 font-mono shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase text-emerald-400">Refund Statement</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Draft Receipt</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Merchandise Subtotal:</span>
                    <span>${calcResult.subtotal.toFixed(2)}</span>
                  </div>

                  {calcResult.restockingDeduction > 0 && (
                    <div className="flex justify-between text-rose-400">
                      <span>Restocking Fee Deduction ({calcRestockingFee}%):</span>
                      <span>-${calcResult.restockingDeduction.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax Province Adjustment ({calcProvince}):</span>
                    <span>+${calcResult.taxAddition.toFixed(2)}</span>
                  </div>

                  {calcResult.loyaltyAddition > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discretionary Bonus Adjustment:</span>
                      <span>+${calcResult.loyaltyAddition.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-800 my-3 pt-3 flex justify-between text-sm font-black">
                    <span className="text-emerald-400">Total Calculated Refund:</span>
                    <span className="text-emerald-400 text-lg">${calcResult.finalRefund.toFixed(2)} CAD</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 border border-slate-800 rounded-xl space-y-2.5 text-[11px] text-slate-400">
                  <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Alberta Store Policy Rules</span>
                  </div>
                  <p className="leading-relaxed">
                    Refund is calculated using standard store return guidelines. Restocking deduction applies to opened equipment. Province tax is automatically recalculated based on regional retail tax parameters.
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-2">
                  CashStar eGift Services Hub • Authorized Operator Terminal
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ADVANCED CUSTOMER NOTES HISTORY */}
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Note thread list */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                    <ClipboardList className="w-4 h-4 text-indigo-700" />
                    <span>Stamped Comments Thread ({getParsedNotes().length})</span>
                  </div>
                  
                  <button
                    onClick={handleClearAllNotes}
                    className="text-[10px] font-bold text-rose-700 hover:text-white hover:bg-rose-700 border border-rose-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear History Thread
                  </button>
                </div>

                {getParsedNotes().length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 space-y-2">
                    <ClipboardList className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No timestamped operational notes recorded yet.</p>
                    <p className="text-[10px] text-slate-400">Append notes in the composer on the right to build the audit history.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {getParsedNotes().map((note, idx) => (
                      <div key={note.id} className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-xs hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start text-[11px] font-mono">
                          <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Operator Stamp #{idx + 1}
                          </span>
                          <span className="text-slate-400">{note.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Note Composer */}
              <div className="md:col-span-5 bg-slate-50 p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <div className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                  Append Note Composer
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">rapid operational tag</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['[DISPATCH]', '[CALL_BACK]', '[COMPLIANCE]', '[CUSTOMER_ISSUE]', '[REFUND_OK]', '[URGENT]'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNoteTag(tag)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                            noteTag === tag 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">stamped comment body</label>
                    <textarea
                      rows={4}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 shadow-xs"
                      placeholder="Type your operational update here. It will automatically prepend the timestamp and current operator ID..."
                    />
                  </div>

                  <button
                    onClick={handleAddNote}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Append Stamped Audit Note</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOM SMS DISPATCHER */}
          {activeTab === 'sms' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* SMS Config Form */}
              <div className="lg:col-span-7 space-y-4 bg-slate-50/50 p-5 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-800 uppercase tracking-widest mb-1 border-b border-slate-200 pb-2">
                  <Smartphone className="w-4 h-4 text-indigo-700" />
                  <span>SMS Dispatcher Panel</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Customer Mobile Phone</label>
                    <input 
                      type="text" 
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 shadow-xs"
                      placeholder="e.g. (403) 723-0100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Template selector</label>
                    <select
                      value={smsTemplate}
                      onChange={(e) => setSmsTemplate(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none shadow-xs"
                    >
                      <option value="refund_link">Template 1: Refund secure claim link</option>
                      <option value="otp_challenge">Template 2: Security Verification PIN</option>
                      <option value="balance_alert">Template 3: Courteous outstanding balance notice</option>
                      <option value="custom">Template 4: Custom freeform outbox text</option>
                    </select>
                  </div>
                </div>

                {smsTemplate === 'custom' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Custom Message Editor</label>
                    <textarea
                      rows={3}
                      value={customSmsText}
                      onChange={(e) => setCustomSmsText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 shadow-xs font-mono"
                    />
                    <div className="text-[9px] text-slate-400 mt-1">
                      Available dynamic tags: <span className="font-bold">{`{name}`}</span>, <span className="font-bold">{`{amount}`}</span>, <span className="font-bold">{`{storeId}`}</span>, <span className="font-bold">{`{link}`}</span>
                    </div>
                  </div>
                )}

                {smsTemplate === 'otp_challenge' && (
                  <div className="flex gap-2 items-center bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-xs text-indigo-900 shadow-xs">
                    <Lock className="w-4 h-4 text-indigo-700 shrink-0" />
                    <div>
                      <span>Generated Challenge Code: </span>
                      <strong className="font-mono bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded">{smsPIN}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSmsPIN(Math.floor(100000 + Math.random() * 900000).toString())}
                      className="ml-auto text-[10px] font-bold text-indigo-700 hover:underline cursor-pointer"
                    >
                      Regenerate
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSendCustomSMS}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Send Message via TryCloudflare Carrier API</span>
                </button>

                {/* SMS Outbox Logs */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Live Carrier dispatch Logs</div>
                  
                  {smsHistory.length === 0 ? (
                    <div className="text-center p-6 bg-white border border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400 font-mono">
                      No active carrier dispatches submitted this session.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {smsHistory.map(item => (
                        <div key={item.id} className="bg-white border border-slate-150 p-2.5 rounded-lg flex items-start justify-between gap-3 text-[11px] font-mono shadow-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">{item.customerName} ({item.phone})</span>
                              <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                            </div>
                            <p className="text-slate-500 font-sans leading-relaxed text-[10px]">{item.message}</p>
                          </div>
                          
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                            item.status === 'DELIVERED' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : item.status === 'SENT' 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* iPhone Simulated Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-[280px] h-[550px] bg-slate-950 rounded-[40px] border-[10px] border-slate-800 relative shadow-2xl flex flex-col overflow-hidden font-sans">
                  
                  {/* Speaker & Camera notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 z-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                  </div>

                  {/* Top Bar info */}
                  <div className="bg-slate-900 px-5 pt-8 pb-2 flex justify-between text-[10px] font-bold text-slate-400 z-10">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center">
                      <span>5G</span>
                      <div className="w-4 h-2 bg-slate-400 rounded-xs"></div>
                    </div>
                  </div>

                  {/* SMS Contact Info */}
                  <div className="bg-slate-900 border-b border-slate-800/80 p-2.5 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shadow-md">
                      GT
                    </div>
                    <span className="text-[11px] font-black text-slate-100 mt-1">Golf Town Help</span>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider">iMessage</span>
                  </div>

                  {/* SMS Chat Area */}
                  <div className="flex-1 bg-slate-950 p-4 space-y-3 overflow-y-auto flex flex-col justify-end">
                    <div className="text-[9px] text-slate-500 text-center font-bold">Today 9:41 AM</div>
                    
                    {/* Simulated Text bubble */}
                    <div className="bg-slate-800 text-slate-100 border border-slate-700/50 p-3 rounded-2xl rounded-bl-sm text-[11px] leading-relaxed self-start max-w-[85%] shadow-lg relative animate-in zoom-in-95 duration-150">
                      {getSmsRenderedText()}
                    </div>
                  </div>

                  {/* iPhone bottom bar */}
                  <div className="bg-slate-900 p-2.5 border-t border-slate-800 flex items-center gap-2">
                    <div className="flex-1 bg-slate-950 rounded-full py-1.5 px-3 text-[10px] text-slate-500 border border-slate-800">
                      Text Message
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center">
                      <Send className="w-3 h-3 text-slate-950 fill-slate-950" />
                    </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-700 rounded-full"></div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: HTML EMAIL COMPOSER */}
          {activeTab === 'email' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Email Parameters Input Form */}
              <div className="lg:col-span-6 space-y-4 bg-slate-50/50 p-5 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-widest mb-1 border-b border-slate-200 pb-2">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Custom Email Configurator</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Recipient Email Address</label>
                    <input 
                      type="email" 
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
                      placeholder="alex.mercer@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Subject line</label>
                    <input 
                      type="text" 
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Layout Template</label>
                      <select
                        value={emailTemplate}
                        onChange={(e) => setEmailTemplate(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none shadow-xs"
                      >
                        <option value="standard">Standard: Golf Town branded layout</option>
                        <option value="executive">Executive: Personal VIP letter style</option>
                        <option value="urgent">Urgent: Compliance balance audit notice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Attachments (Simulated)</label>
                      <div className="space-y-1 border border-slate-200 bg-white p-2 rounded-xl text-[10px] text-slate-600 shadow-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={attachTandC} 
                            onChange={(e) => setAttachTandC(e.target.checked)} 
                            className="w-3.5 h-3.5 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>e-Gift Terms booklet.pdf</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={attachReceipt} 
                            onChange={(e) => setAttachReceipt(e.target.checked)} 
                            className="w-3.5 h-3.5 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Corporate GST Statement.pdf</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={attachReleaseForm} 
                            onChange={(e) => setAttachReleaseForm(e.target.checked)} 
                            className="w-3.5 h-3.5 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Customer Release form.pdf</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Commercial Email Message Content</label>
                    <textarea
                      rows={4}
                      value={emailBodyText}
                      onChange={(e) => setEmailBodyText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 shadow-xs leading-relaxed"
                      placeholder="Type the custom message context to embed in the official email..."
                    />
                  </div>

                  <button
                    onClick={handleSendCustomEmail}
                    disabled={sendingEmail}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/10"
                  >
                    {sendingEmail ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin inline-block"></span>
                        <span>Delivering Outbox...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-900" />
                        <span>Send Custom Email Notice via SMTP Relay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Email HTML Output Rendering Preview */}
              <div className="lg:col-span-6 bg-slate-100 p-4 rounded-2xl border border-slate-200 max-h-[60vh] overflow-y-auto">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 font-mono">HTML Live Render Preview</div>
                <div 
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                  dangerouslySetInnerHTML={{ __html: getEmailBodyHtml() }}
                />
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer bar */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Authenticated Operator: ENI-SYSTEMS-MGR</span>
          </div>
          <span>Active Hub version: v2.4.9</span>
        </div>

      </div>
    </div>
  );
}
