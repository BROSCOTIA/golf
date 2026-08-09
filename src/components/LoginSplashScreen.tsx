import React, { useState } from 'react';
import { ShieldCheck, KeyRound, User, AlertTriangle, Store } from 'lucide-react';

interface LoginSplashScreenProps {
  onAuthenticate: () => void;
}

export function LoginSplashScreen({ onAuthenticate }: LoginSplashScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      // Validate credentials case-insensitive for username, exact or lower for convenience
      const validUser = username.trim().toLowerCase() === 'golftown';
      const validPass = password === 'Covid-19';

      if (validUser && validPass) {
        onAuthenticate();
      } else {
        setError('Invalid username or password. Please verify your credentials.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4 overflow-y-auto">
      {/* Ambient background accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-8 text-slate-800">
        {/* Golf Town Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mb-4 shadow-xs">
            <Store className="w-8 h-8 text-emerald-700" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
              Golf Town Canada
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
            Store Credit Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Protected Enterprise Audit System • Authorized Personnel Only
          </p>
        </div>

        {/* Security Banner */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Restricted Access System</p>
            <p className="text-[11px] text-slate-500">Please enter your store credentials to continue.</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-semibold animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="golftown"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <span>Authenticate Portal</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Authorized Personnel: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">golftown</code> / <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">Covid-19</code>
          </p>
        </div>
      </div>
    </div>
  );
}
