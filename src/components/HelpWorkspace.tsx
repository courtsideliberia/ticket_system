import React from 'react';
import { HelpCircle, Command, Calendar, Ticket, BarChart3, QrCode, X, Sparkles, Keyboard } from 'lucide-react';

interface HelpWorkspaceProps {
  onOpenIssueModal: () => void;
  onOpenCreateEventModal: () => void;
  onOpenCommandPalette: () => void;
}

export const HelpWorkspace: React.FC<HelpWorkspaceProps> = ({
  onOpenIssueModal,
  onOpenCreateEventModal,
  onOpenCommandPalette,
}) => {
  const shortcuts = [
    { keys: ['⌘', 'K'], label: 'Global Intelligent Search', action: 'Open Command Palette' },
    { keys: ['N'], label: 'Create Event', action: 'Open Create Event Wizard' },
    { keys: ['T'], label: 'Generate Pass', action: 'Open Issue Pass Generator' },
    { keys: ['R'], label: 'Reports', action: 'Navigate to Reports' },
    { keys: ['S'], label: 'Scanner', action: 'Navigate to Gate Scanner' },
    { keys: ['Esc'], label: 'Close Panel', action: 'Close any active slide-over drawer' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" /> Help Center & Productivity Shortcuts
          </h2>
          <p className="text-xs text-slate-400">
            Keyboard shortcuts matrix and contextual operational documentation
          </p>
        </div>
      </div>

      {/* Shortcuts Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-blue-400" /> Enterprise Keyboard Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white text-xs">{sc.label}</p>
                <p className="text-[10px] text-slate-400">{sc.action}</p>
              </div>

              <div className="flex items-center gap-1">
                {sc.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded bg-slate-800 text-blue-400 font-mono font-bold text-xs border border-slate-700 shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Scanning Web Audio Chimes
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Gate Scanner uses native Web Audio API oscillators to emit dual high-pitch chimes for valid admissions, and low sawtooth buzzers for invalid or duplicate scans.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Slide-over Inspector Panels
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Clicking on any ticket, order, customer, or scanner device anywhere in the application opens a slide-over side drawer panel without navigating away from your current context.
          </p>
        </div>
      </div>
    </div>
  );
};
