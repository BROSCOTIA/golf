import React, { useState } from 'react';
import { CustomerRecord, StoreLocation } from '../types';
import { 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Navigation, 
  Building2, 
  Calendar, 
  Tag, 
  MessageSquare,
  Copy,
  Check,
  Share2,
  Send,
  CheckCircle2,
  ShieldAlert,
  Link2,
  KeyRound
} from 'lucide-react';

interface MobileContactCardProps {
  customer: CustomerRecord;
  store?: StoreLocation;
  onOpenMap: (store: StoreLocation) => void;
  onOpenNameInsight: (customer: CustomerRecord) => void;
  onSendRefundEmail?: (customer: CustomerRecord) => void;
  onSendSmsRefundLink?: (customer: CustomerRecord) => void;
  onUpdateRefundStatus?: (customer: CustomerRecord, status: 'Refunded' | 'Auth Code Needed' | 'Pending') => void;
  isSendingEmail?: boolean;
  onEdit: (customer: CustomerRecord) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const MobileContactCard: React.FC<MobileContactCardProps> = ({
  customer,
  store,
  onOpenMap,
  onOpenNameInsight,
  onSendRefundEmail,
  onSendSmsRefundLink,
  onUpdateRefundStatus,
  isSendingEmail = false,
  onEdit,
  onDelete,
  isSelected = false,
  onToggleSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayStoreName = store 
    ? store.name 
    : customer.storeName || `Store #${customer.storeId}`;
  
  const displayCity = customer.city || store?.city || 'Calgary';
  const displayPhone = customer.phone || store?.phone || '(403) 723-0100';
  const displayEmail = customer.email && customer.email !== '(blank)' ? customer.email : 'No email listed';

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStatus = customer.refundStatus || 'Pending';

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-xs ${
        isSelected
          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
          : isExpanded 
            ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20' 
            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* 
        COLLAPSED VIEW ORDER:
        1. LOCATION
        2. PHONE NUMBER
        3. NAME
        4. EMAIL
        5. AMOUNT
      */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* 1. LOCATION */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                if (onToggleSelect) onToggleSelect(customer.id);
              }}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              aria-label={`Select ${customer.firstName} ${customer.lastName}`}
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[200px]">{displayCity} • #{customer.storeId} ({displayStoreName})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:inline">
              {isExpanded ? 'Tap to close' : 'Tap for details'}
            </span>
            <div className={`p-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-emerald-100 border-emerald-300 text-emerald-800' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Real-time Refund Processing Badge */}
        <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status:</span>
            {currentStatus === 'SMS Dispatched' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs animate-pulse">
                <Send className="w-3 h-3 text-emerald-700" />
                SMS Dispatched (clck.ru)
              </span>
            )}
            {currentStatus === 'Refunded' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                ✓ REFUNDED
              </span>
            )}
            {currentStatus === 'Auth Code Needed' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                <ShieldAlert className="w-3 h-3 text-amber-700" />
                Auth Code Needed ({customer.authCode || 'GT-REQ'})
              </span>
            )}
            {currentStatus === 'Pending' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 border border-slate-300">
                Pending Action
              </span>
            )}
          </div>

          {customer.shortenedUrl && (
            <div className="text-[10px] font-mono text-emerald-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
              <Link2 className="w-3 h-3 text-emerald-600" />
              <span>{customer.shortenedUrl}</span>
            </div>
          )}
        </div>

        {/* 2. PHONE NUMBER - CLICKS GENERATE PRE-TYPED SMS LINK WITH clck.ru SHORTENED DEPOSIT URL */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSendSmsRefundLink) onSendSmsRefundLink(customer);
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-all shadow-xs group cursor-pointer"
            title="Click phone number to generate clck.ru shortened deposit URL and open pre-typed text message"
          >
            <Phone className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform shrink-0" />
            <span>{displayPhone}</span>
            <span className="text-[10px] bg-emerald-700 text-slate-900 px-1.5 py-0.5 rounded font-mono ml-1">SMS Deposit</span>
          </button>

          <button
            onClick={handleCopyPhone}
            title="Copy Phone Number"
            className="p-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span className="text-[10px] font-semibold">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* 3. NAME */}
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{customer.firstName} {customer.lastName}</span>
            {customer.gender && (
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                customer.gender === 'Male' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                customer.gender === 'Female' ? 'bg-pink-50 text-pink-700 border border-pink-200' :
                'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {customer.gender}
              </span>
            )}
          </h3>
          {customer.company && customer.company !== '(blank)' && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" />
              {customer.company}
            </p>
          )}
        </div>

        {/* 4. EMAIL */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <a
            href={customer.email && customer.email !== '(blank)' ? `mailto:${customer.email}` : undefined}
            onClick={(e) => e.stopPropagation()}
            className={`truncate max-w-full ${customer.email && customer.email !== '(blank)' ? 'hover:text-indigo-700 hover:underline font-medium' : 'text-slate-500 italic'}`}
          >
            {displayEmail}
          </a>
        </div>

        {/* 5. AMOUNT */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store Credit Balance</span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-base border shadow-xs ${
            customer.sumOfStoreCreditBalance > 500
              ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-300/60'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <DollarSign className={`w-4 h-4 shrink-0 ${customer.sumOfStoreCreditBalance > 500 ? 'text-rose-600' : 'text-emerald-600'}`} />
            <span>${customer.sumOfStoreCreditBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            {customer.sumOfStoreCreditBalance > 500 && (
              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-slate-900 ml-0.5">
                Over $500
              </span>
            )}
          </div>
        </div>

        {/* Quick Processing Actions Toolbar */}
        {onUpdateRefundStatus && (
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSendSmsRefundLink && onSendSmsRefundLink(customer)}
              className="flex-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              title="Generate clck.ru short link and open text message"
            >
              <Send className="w-3 h-3 text-emerald-600" />
              <span>SMS Link</span>
            </button>

            <button
              onClick={() => onUpdateRefundStatus(customer, 'Refunded')}
              className={`flex-1 px-2.5 py-1.5 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-xs border transition-colors cursor-pointer ${
                currentStatus === 'Refunded' 
                  ? 'bg-emerald-700 text-slate-900 border-emerald-600' 
                  : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-300 hover:border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Refunded</span>
            </button>

            <button
              onClick={() => onUpdateRefundStatus(customer, 'Auth Code Needed')}
              className={`flex-1 px-2.5 py-1.5 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-xs border transition-colors cursor-pointer ${
                currentStatus === 'Auth Code Needed' 
                  ? 'bg-amber-600 text-slate-900 border-amber-500' 
                  : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-300 hover:border-amber-300'
              }`}
            >
              <KeyRound className="w-3 h-3 text-amber-600" />
              <span>Auth Code</span>
            </button>
          </div>
        )}
      </div>

      {/* 
        EXPANDED VIEW (WHEN CARD IS CLICKED - SHOW ALL INFO)
      */}
      {isExpanded && (
        <div 
          className="border-t border-slate-200 bg-slate-50/90 p-4 sm:p-5 space-y-4 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Details</span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                ID: {customer.custId || 'N/A'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Quarter & Year</span>
                <span className="font-semibold text-slate-800">{customer.quarter || 'Q1'} ({customer.year || 2026})</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Last Sale Date</span>
                <span className="font-semibold text-slate-800">{customer.lastSaleDate || '2026'}</span>
              </div>
            </div>
          </div>

          {/* AI Name Explanation / Etymology */}
          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Name Background & Etymology</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenNameInsight(customer);
                }}
                className="text-[11px] font-bold text-indigo-800 hover:underline bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-xs cursor-pointer"
              >
                Expand Search
              </button>
            </div>
            <p className="text-xs text-indigo-900/90 italic leading-relaxed">
              {customer.nameExplanation || `AI analysis indicates "${customer.firstName}" is a classic name prominent in North American demographics.`}
            </p>
          </div>

          {/* Comments / Notes */}
          {customer.comments && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Comments & Store Credit Notes
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {customer.comments}
              </p>
            </div>
          )}

          {/* Store Location Map Direct Trigger */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-xs font-bold text-slate-900 block">{displayStoreName}</span>
              <span className="text-[11px] text-slate-500 block">{store?.address || '130 11500 35 St SE, Calgary'}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (store) onOpenMap(store);
                else onOpenMap({
                  id: customer.storeId,
                  name: displayStoreName,
                  code: customer.storeId,
                  address: '130 11500 35 St SE',
                  city: displayCity
                });
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-slate-900 font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              View Map
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSendSmsRefundLink) onSendSmsRefundLink(customer);
                }}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-slate-900 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Text clck.ru Link</span>
              </button>
              {onSendRefundEmail && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendRefundEmail(customer);
                  }}
                  disabled={isSendingEmail}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Send Store Credit Refund Notice Email via SMTP"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isSendingEmail ? 'Sending Notice...' : 'Email Notice'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(customer);
                }}
                className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 inline-flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-xs"
                title="Edit Customer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(customer.id);
                }}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 inline-flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-xs"
                title="Delete Customer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
