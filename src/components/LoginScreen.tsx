import React, { useState } from 'react';
import { UserAccount } from '../types';
import { CourtIQIcon } from './CourtIQLogo';
import {
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Ticket,
  UserCheck,
  ArrowLeft,
  X,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface LoginScreenProps {
  users: UserAccount[];
  onLogin: (passcode: string) => { success: boolean; user?: UserAccount; message?: string };
  customLogoUrl?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin, customLogoUrl }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [successUser, setSuccessUser] = useState<UserAccount | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyClick = (num: string) => {
    if (pin.length < 10) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError('');
      checkPinInstant(nextPin);
    }
  };

  const handleDelete = () => {
    const nextPin = pin.slice(0, -1);
    setPin(nextPin);
    setError('');
    setSuccessUser(null);
  };

  const handleClear = () => {
    setPin('');
    setError('');
    setSuccessUser(null);
  };

  const checkPinInstant = (candidate: string) => {
    const found = users.find((u) => u.passcode === candidate && u.status === 'active');
    let matchedUser: UserAccount | null = null;
    if (found) {
      matchedUser = found;
    } else if (candidate === '004455') {
      matchedUser = users.find((u) => u.role === 'super_admin') || users[0];
    }

    if (matchedUser) {
      setSuccessUser(matchedUser);
      setIsVerifying(true);
      setTimeout(() => {
        const res = onLogin(candidate);
        setIsVerifying(false);
        if (!res.success) {
          setError(res.message || 'Invalid passcode. Please enter your assigned PIN.');
          setSuccessUser(null);
        }
      }, 200);
    } else {
      setSuccessUser(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your access password.');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      const res = onLogin(pin.trim());
      setIsVerifying(false);
      if (!res.success) {
        setError(res.message || 'Invalid passcode. Please enter your assigned PIN.');
        setSuccessUser(null);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Starry Glow & Dark Nebula Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Lock Screen Card */}
      <div className="w-full max-w-sm rounded-3xl bg-slate-900/80 border border-blue-500/20 shadow-[0_0_50px_rgba(15,23,42,0.8)] relative z-10 backdrop-blur-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Top Header Section with Ringed Avatar */}
        <div className="pt-8 pb-4 px-6 flex flex-col items-center text-center bg-gradient-to-b from-blue-950/40 via-slate-900/30 to-transparent relative">
          
          {/* Ringed Circular Icon / Avatar Badge */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-full border-2 border-red-500/60 p-1 flex items-center justify-center bg-slate-950/90 shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all group-hover:border-red-400 group-hover:shadow-[0_0_35px_rgba(220,38,38,0.5)]">
              <CourtIQIcon size="xl" className="w-full h-full" />
            </div>
            {/* Outer subtle halo ring */}
            <div className="absolute -inset-1.5 rounded-full border border-blue-400/30 pointer-events-none animate-pulse" />
          </div>

          {/* App Title & Slogan */}
          <div className="mt-3 flex flex-col items-center">
            <h1 className="text-2xl font-black font-heading tracking-tight flex items-baseline">
              <span className="text-white">Court</span>
              <span className="text-red-500">iQ</span>
            </h1>
            <p className="text-[11px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase mt-0.5">
              Secure. Simple. Smart.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-1 space-y-4">
          
          {/* Oval / Pill-Shaped Password Input Field */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <div className="w-full px-4 py-2.5 rounded-full bg-slate-950/80 border border-blue-400/30 hover:border-blue-400/60 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all flex items-center shadow-inner">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPin(val);
                    setError('');
                    checkPinInstant(val);
                  }}
                  maxLength={10}
                  placeholder="Please enter the password"
                  className="w-full bg-transparent text-white text-center font-mono tracking-[0.3em] text-base focus:outline-none placeholder:text-slate-500 placeholder:tracking-normal placeholder:text-xs placeholder:font-light"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="ml-2 text-blue-400/70 hover:text-blue-300 transition-colors p-1"
                  title="Password Help"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Help Info Drawer */}
            {showHelp && (
              <div className="p-3 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-[11px] text-blue-200 animate-in fade-in duration-200">
                <p className="font-semibold text-white mb-0.5">🔑 Access Information</p>
                <p>Use your assigned account PIN or the Super Admin Master Passcode (<span className="font-mono text-amber-300 font-bold">004455</span>).</p>
              </div>
            )}

            {/* Recognized User Profile Badge */}
            {successUser && (
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-300 leading-tight">{successUser.name}</p>
                    <p className="text-[10px] text-emerald-400/80 uppercase font-mono">
                      {successUser.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Verified
                </span>
              </div>
            )}

            {/* Error Message Alert */}
            {error && (
              <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Keypad Buttons in Elegant Circles */}
          <div className="grid grid-cols-3 gap-3.5 max-w-[250px] mx-auto py-2 justify-items-center">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="w-14 h-14 rounded-full border border-blue-400/30 hover:border-blue-400 bg-slate-950/60 hover:bg-blue-500/20 text-white font-light text-2xl active:scale-90 transition-all flex items-center justify-center shadow-md"
              >
                {num}
              </button>
            ))}

            {/* Bottom Row: Backspace / Left Arrow */}
            <button
              type="button"
              onClick={handleDelete}
              className="w-14 h-14 rounded-full border border-blue-400/30 hover:border-blue-400 bg-slate-950/60 hover:bg-blue-500/20 text-slate-300 hover:text-white active:scale-90 transition-all flex items-center justify-center shadow-md"
              title="Backspace"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Bottom Row: Zero */}
            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="w-14 h-14 rounded-full border border-blue-400/30 hover:border-blue-400 bg-slate-950/60 hover:bg-blue-500/20 text-white font-light text-2xl active:scale-90 transition-all flex items-center justify-center shadow-md"
            >
              0
            </button>

            {/* Bottom Row: Clear / Cancel (X) */}
            <button
              type="button"
              onClick={handleClear}
              className="w-14 h-14 rounded-full border border-blue-400/30 hover:border-blue-400 bg-slate-950/60 hover:bg-blue-500/20 text-slate-300 hover:text-white active:scale-90 transition-all flex items-center justify-center shadow-md"
              title="Clear"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action / Unlock Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Unlocking...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Access</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="py-3 px-4 bg-slate-950/60 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>CourtiQ Security Portal</span>
          </p>
        </div>
      </div>
    </div>
  );
};
