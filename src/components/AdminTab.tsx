import React, { useState } from 'react';
import { DEFAULT_EVENT_INFO } from '../lib/ticketTemplateMap';
import { LogoUploader } from './LogoUploader';
import { Settings, ShieldCheck, RefreshCw, Save, Check, Calendar, MapPin, DollarSign, Award } from 'lucide-react';

interface AdminTabProps {
  customLogoUrl?: string;
  onLogoChange: (url: string | undefined) => void;
  onResetDatabase: () => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  customLogoUrl,
  onLogoChange,
  onResetDatabase,
}) => {
  const [eventName, setEventName] = useState(DEFAULT_EVENT_INFO.eventName);
  const [venue, setVenue] = useState(DEFAULT_EVENT_INFO.venue);
  const [eventDate, setEventDate] = useState(DEFAULT_EVENT_INFO.eventDate);
  const [eventTime, setEventTime] = useState(DEFAULT_EVENT_INFO.eventTime);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Courtside Administration & Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure event defaults, custom logos, and system parameters</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Default Event Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Official Event Title</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Stadium / Venue Location</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tip-off Time</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved Successfully' : 'Save Event Config'}
              </button>
            </div>
          </form>

          {/* Logo Uploader */}
          <LogoUploader currentLogoUrl={customLogoUrl} onLogoChange={onLogoChange} />
        </div>

        {/* Right System Reset & Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" /> Database Maintenance
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Reset system database back to initial sample passes. Useful for testing gate check-ins or resetting demo sessions.
            </p>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset the pass database to initial state?')) {
                  onResetDatabase();
                }
              }}
              className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Pass Database
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">System Specifications</h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-slate-400">
              <p>• App: Courtside Digital Pass Suite</p>
              <p>• Version: 2.5.0-PROD</p>
              <p>• QR Engine: High-Density SVG Matrix</p>
              <p>• Gate Audio: Web Audio API Synthesizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
