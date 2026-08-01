import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle2 } from 'lucide-react';

interface PwaIosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaIosModal: React.FC<PwaIosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold text-white">Install CourtiQ App</h3>
            <p className="text-xs text-slate-400">Add CourtiQ Pass Generator to your Home Screen</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                Tap the Share button <Share className="w-4 h-4 text-blue-400 inline" />
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                In Safari browser at the bottom or top of your screen.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                Select 'Add to Home Screen' <PlusSquare className="w-4 h-4 text-emerald-400 inline" />
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Scroll down in the action list and tap 'Add to Home Screen'.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                Tap 'Add' to launch offline app <CheckCircle2 className="w-4 h-4 text-blue-400 inline" />
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                CourtiQ will appear as an app icon on your home screen for full offline scanning.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};
