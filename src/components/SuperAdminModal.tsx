import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, CheckCircle2, AlertCircle, Sparkles, X, UserCheck, Crown, ShieldAlert, Users } from 'lucide-react';
import { UserAccount } from '../types';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  users: UserAccount[];
  onAuthenticate: (code: string) => { success: boolean; user?: UserAccount; message?: string };
  onLogout: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onAuthenticate,
  onLogout,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserAccount | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = onAuthenticate(code.trim());
    if (res.success && res.user) {
      setSuccess(true);
      setAuthenticatedUser(res.user);
      setTimeout(() => {
        setSuccess(false);
        setCode('');
        onClose();
      }, 1000);
    } else {
      setError(res.message || 'Invalid passcode. Enter 004455 for Super Admin or your assigned user passcode.');
    }
  };

  const handleQuickFill = (passcode: string) => {
    setCode(passcode);
    setError('');
  };

  const activeUser = currentUser || authenticatedUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-blue-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
                User Sign In & Passcode Portal
              </h2>
              <p className="text-xs text-slate-400">Sign in with passcode 004455 or assigned user PIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {activeUser ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase">
                  {activeUser.role === 'super_admin' ? '👑 Owner / Super Admin' : '👤 Signed In User'}
                </span>
                <h3 className="text-lg font-bold text-white pt-2">{activeUser.name}</h3>
                <p className="text-xs text-slate-400">
                  Passcode <span className="font-mono text-blue-400 font-bold">{activeUser.passcode}</span> verified.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Assigned Role:</span>
                  <span className="font-mono font-bold text-emerald-400 uppercase">{activeUser.role.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>User Email:</span>
                  <span className="font-mono text-slate-300">{activeUser.email}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Passcode PIN:</span>
                  <span className="font-mono font-bold text-blue-400">{activeUser.passcode}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
                >
                  Continue Active Session
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setAuthenticatedUser(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-400">
                  <KeyRound className="w-4 h-4" /> Enter Passcode to Sign In
                </div>
                <p>
                  Enter your assigned staff PIN or manager passcode to authenticate and switch accounts.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Security Passcode / PIN
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 004455 or 112233"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 placeholder:text-xs placeholder:tracking-normal"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-400 flex items-center gap-1 font-medium pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                  </p>
                )}
                {success && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Passcode Verified! Signing in...
                  </p>
                )}
              </div>

              {/* Quick Select Preset Passcodes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Active Accounts & Passcodes
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleQuickFill(u.passcode)}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {u.role === 'super_admin' ? '👑' : '👤'} {u.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{u.role.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <span className="font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        PIN: {u.passcode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate Passcode
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

