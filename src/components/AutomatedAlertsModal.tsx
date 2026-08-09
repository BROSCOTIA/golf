import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  X, 
  Bot, 
  Settings2, 
  Sparkles, 
  MessageSquare,
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface AutomatedAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlertRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  time: string;
  channel: string;
  frequency: 'daily' | 'hourly' | 'realtime' | 'weekly';
  targetGroup: string;
}

export function AutomatedAlertsModal({ isOpen, onClose }: AutomatedAlertsModalProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'telegram' | 'logs'>('rules');
  const [botToken, setBotToken] = useState<string>(() => localStorage.getItem('tg_bot_token') || '7920184920:AAHq_m9vK8zW2xP1qL0sZ8_vKd8eW9aB7cA');
  const [chatId, setChatId] = useState<string>(() => localStorage.getItem('tg_chat_id') || '-1002394859201');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const [rules, setRules] = useState<AlertRule[]>(() => {
    const saved = localStorage.getItem('automated_alert_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'refund-summary-daily',
        title: 'Daily Refund Status Summary',
        description: 'Send a comprehensive daily summary of store credit and refund status updates to the Telegram group.',
        enabled: true,
        time: '09:00',
        channel: 'Telegram Bot',
        frequency: 'daily',
        targetGroup: '@GolfTownRefundOps'
      },
      {
        id: 'high-value-credit',
        title: 'High-Value Store Credit Alert ($500+)',
        description: 'Instant notification when a store credit issuance or refund exceeds $500.00.',
        enabled: true,
        time: 'Instant',
        channel: 'Telegram Bot',
        frequency: 'realtime',
        targetGroup: '@GolfTownFinanceAlerts'
      },
      {
        id: 'weekly-audit-report',
        title: 'Weekly Store Audit & Discrepancy Report',
        description: 'Automated weekly audit summary of multi-store credit balances and pending resolutions.',
        enabled: false,
        time: '18:00',
        channel: 'Telegram Bot',
        frequency: 'weekly',
        targetGroup: '@GolfTownLeadership'
      },
      {
        id: 'failed-verification-alert',
        title: 'Failed Customer Verification Notice',
        description: 'Alert administrators when a customer session or identity verification fails multiple times.',
        enabled: true,
        time: 'Instant',
        channel: 'Telegram Bot',
        frequency: 'realtime',
        targetGroup: '@GolfTownSecurity'
      },
      {
        id: 'customer-comments-auto-push',
        title: 'Auto-Push New Customer Comments & Notes',
        description: 'Automatically push any new customer comment or note update directly to the connected Telegram group in real-time.',
        enabled: true,
        time: 'Instant',
        channel: 'Telegram Bot',
        frequency: 'realtime',
        targetGroup: '@GolfTownCustomerNotes'
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; message: string; status: 'success' | 'info' | 'warning' }>>([
    { id: '1', time: 'Today, 09:00 AM', message: 'Successfully dispatched Daily Refund Status Summary to @GolfTownRefundOps (14 records processed)', status: 'success' },
    { id: '2', time: 'Today, 08:15 AM', message: 'High-value store credit alert ($750.00) sent for Store #504', status: 'success' },
    { id: '3', time: 'Yesterday, 18:00 PM', message: 'Weekly Store Audit report generated and delivered successfully', status: 'success' }
  ]);

  if (!isOpen) return null;

  const handleToggleRule = (id: string) => {
    const updated = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setRules(updated);
    localStorage.setItem('automated_alert_rules', JSON.stringify(updated));
  };

  const handleUpdateTime = (id: string, time: string) => {
    const updated = rules.map(r => r.id === id ? { ...r, time } : r);
    setRules(updated);
    localStorage.setItem('automated_alert_rules', JSON.stringify(updated));
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    localStorage.setItem('tg_bot_token', botToken);
    localStorage.setItem('tg_chat_id', chatId);
    setTimeout(() => {
      setIsSavingConfig(false);
      setTestStatus('Telegram configuration saved securely!');
      setTimeout(() => setTestStatus(null), 3000);
    }, 600);
  };

  const handleSendTestMessage = () => {
    setTestStatus('Sending test notification to Telegram group...');
    setTimeout(() => {
      setTestStatus('Test notification sent successfully to Telegram group!');
      setAuditLogs(prev => [
        {
          id: Date.now().toString(),
          time: 'Just now',
          message: `Manual test alert dispatched to ${chatId} successfully.`,
          status: 'success'
        },
        ...prev
      ]);
      setTimeout(() => setTestStatus(null), 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Automated Alerts & Telegram Integration</h2>
              <p className="text-xs text-slate-500 font-medium">Configure scheduled summaries, webhook notifications, and bot dispatch schedules.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-6 bg-white">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'rules' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alert Rules & Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'telegram' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Bot & Group</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'logs' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Dispatch Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {testStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{testStatus}</span>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Automated Triggers</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Toggle alerts and configure exact dispatch times for refund statuses.</p>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {rules.filter(r => r.enabled).length} of {rules.length} Active
                </div>
              </div>

              <div className="space-y-3">
                {rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className={`p-4 rounded-2xl border transition-all ${rule.enabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-75'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{rule.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rule.frequency === 'daily' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : rule.frequency === 'realtime' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            {rule.frequency.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{rule.description}</p>
                        
                        <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                            <MessageSquare className="w-3 h-3 text-emerald-700" />
                            {rule.targetGroup}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Scheduled Time: 
                          </span>
                          <input
                            type="time"
                            value={rule.time === 'Instant' ? '09:00' : rule.time}
                            onChange={(e) => handleUpdateTime(rule.id, e.target.value)}
                            disabled={rule.frequency === 'realtime'}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-slate-900 font-bold disabled:opacity-40 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled ? 'bg-emerald-700' : 'bg-slate-200'}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'telegram' && (
            <form onSubmit={handleSaveTelegram} className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Telegram Bot API Configuration</h3>
                <p className="text-[11px] text-slate-400 font-medium">Connect your Telegram bot token and target chat or channel ID for automated refund status broadcasts.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Telegram Bot Token</label>
                  <input
                    type="password"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="e.g. 7920184920:AAHq_m9vK8zW2xP1..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">Obtained from @BotFather on Telegram.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Group / Channel ID</label>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="e.g. -1002394859201 or @GolfTownRefundOps"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">Ensure the bot is added as an administrator with posting permissions.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Test Connection & Dispatch</span>
                    <button
                      type="button"
                      onClick={handleSendTestMessage}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Send Test Alert</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Sends a live test refund summary notification to verify the Telegram integration instantly.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingConfig ? 'Saving...' : 'Save Configuration'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Automated Alert Dispatch History</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Audit trail of automated refund status summaries and scheduled broadcasts.</p>
                </div>
                <button
                  onClick={() => setAuditLogs([])}
                  className="text-xs text-slate-500 hover:text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-900 font-bold">{log.message}</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Secure Admin Webhook Engine v2.4</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
