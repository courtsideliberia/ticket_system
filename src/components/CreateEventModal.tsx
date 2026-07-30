import React, { useState } from 'react';
import { Calendar, X, MapPin, Users, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';
import { EventRecord } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: EventRecord) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00 GMT');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState(1000);
  const [gaPrice, setGaPrice] = useState(15);
  const [vipPrice, setVipPrice] = useState(150);
  const [currency, setCurrency] = useState<'USD' | 'LRD'>('USD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEvent: EventRecord = {
      id: `evt-${Date.now()}`,
      name: name.trim(),
      date: date || new Date().toISOString().split('T')[0],
      time: time || '18:00 GMT',
      venue: venue.trim() || 'Custom Venue',
      capacity: Number(capacity) || 1000,
      ticketsSold: 0,
      totalRevenue: 0,
      attendanceCount: 0,
      status: 'upcoming',
      bannerGradient: 'from-blue-700 via-red-600 to-slate-900',
      currency,
      gaPrice: Number(gaPrice) || 0,
      vipPrice: Number(vipPrice) || 0,
    };

    onCreateEvent(newEvent);
    // Reset form
    setName('');
    setDate('');
    setTime('18:00 GMT');
    setVenue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white uppercase tracking-wider">
                Create New Event
              </h3>
              <p className="text-xs text-slate-400">Publish match or tournament configuration</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Title / Match Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. LBA Playoff Semifinals: Oilers vs Invincible 11"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Time *
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="18:00 GMT"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Venue Location Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Venue Name / Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Type venue name e.g. SKD Indoor Gymnasium, Monrovia"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Pricing Currency *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  currency === 'USD'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>USD ($) - US Dollars</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('LRD')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  currency === 'LRD'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>LRD (L$) - Liberian Dollars</span>
              </button>
            </div>
          </div>

          {/* Capacity and Ticket Tier Prices */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                GA Price ({currency === 'LRD' ? 'L$' : '$'})
              </label>
              <input
                type="number"
                value={gaPrice}
                onChange={(e) => setGaPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                VIP Price ({currency === 'LRD' ? 'L$' : '$'})
              </label>
              <input
                type="number"
                value={vipPrice}
                onChange={(e) => setVipPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Publishing automatically provisions ticket inventory and scanner device profiles.</span>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={!name.trim() || !venue.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Publish Event Immediately
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
