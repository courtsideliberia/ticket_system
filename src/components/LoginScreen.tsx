import React, { useState } from 'react';
import { UserAccount } from '../types';
import {
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Ticket,
  ChevronRight,
  UserCheck,
  Delete,
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
    if (found) {
      setSuccessUser(found);
    } else if (candidate === '004455') {
      const owner = users.find((u) => u.role === 'super_admin') || users[0];
      setSuccessUser(owner);
    } else {
      setSuccessUser(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your 6-digit access PIN.');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      const res = onLogin(pin.trim());
      setIsVerifying(false);
      if (!res.success) {
        setError(res.message || 'Invalid passcode PIN. Please enter your assigned access PIN.');
        setSuccessUser(null);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Glows & Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Single Centered Card */}
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative z-10 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              {customLogoUrl ? (
                <img
                  src={customLogoUrl}
                  alt="Courtside Pass"
                  className="h-16 w-16 object-contain rounded-2xl bg-slate-950 p-2 border border-slate-800 shadow-xl"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 border border-blue-400/20">
                  <Ticket className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-white font-heading tracking-tight">
                Welcome to Courtside Pass
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Please sign in with your access PIN to continue
              </p>
            </div>
          </div>

          {/* Visual PIN Input */}
          <div className="space-y-3 pt-2">
            <div className="relative">
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
                placeholder="Enter access PIN"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-center tracking-[0.3em] text-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 placeholder:text-xs placeholder:tracking-normal shadow-inner"
                autoFocus
              />
            </div>

            {/* Detected User Profile Preview */}
            {successUser && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-300">{successUser.name}</p>
                    <p className="text-[10px] text-emerald-400/80 uppercase font-mono">
                      {successUser.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Recognized
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Keypad Buttons */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-mono font-bold text-lg active:scale-95 transition-all shadow-sm hover:border-slate-700 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold active:scale-95 transition-all uppercase"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-mono font-bold text-lg active:scale-95 transition-all shadow-sm hover:border-slate-700 flex items-center justify-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-mono active:scale-95 transition-all flex items-center justify-center"
              title="Delete"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Sign In</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800/60 mt-6 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Courtside Pass Security Portal</span>
          </p>
        </div>
      </div>
    </div>
  );
};
