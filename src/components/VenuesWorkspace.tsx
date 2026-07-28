import React from 'react';
import { MapPin, Users, Ticket, QrCode, ShieldCheck, ChevronRight } from 'lucide-react';

export const VenuesWorkspace: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" /> Venue & Capacity Manager
          </h2>
          <p className="text-xs text-slate-400">
            SKD Sports Complex physical seating maps, gate allocations & entry routes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">
                SKD Sports Complex • Primary Arena
              </h3>
              <p className="text-xs text-slate-400">Monrovia, Liberia • Total Capacity: 6,500 Seats</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              ACTIVE VENUE
            </span>
          </div>

          {/* Seat Layout Sections Map */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-blue-400 uppercase font-mono font-bold">Courtside A & B</span>
              <p className="font-bold text-white text-sm">200 VIP Seats</p>
              <p className="text-[10px] text-slate-400">VIP Gate 1 Access</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-blue-400 uppercase font-mono font-bold">Box Suites 01-10</span>
              <p className="font-bold text-white text-sm">150 Suite Seats</p>
              <p className="text-[10px] text-slate-400">Corporate Elevator</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-400 uppercase font-mono font-bold">Floor Seating</span>
              <p className="font-bold text-white text-sm">800 Seats</p>
              <p className="text-[10px] text-slate-400">Tunnel Entrance</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Upper Stand East</span>
              <p className="font-bold text-white text-sm">2,700 Seats</p>
              <p className="text-[10px] text-slate-400">Gate 2 East</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-teal-400 uppercase font-mono font-bold">Upper Stand West</span>
              <p className="font-bold text-white text-sm">2,650 Seats</p>
              <p className="text-[10px] text-slate-400">Gate 3 West</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white">Gate & Access Routing</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-red-400">VIP Gate 1</p>
              <p className="text-slate-300">Dedicated for Courtside VIP & Box Suites</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-blue-400">Gate 2 & 3 General</p>
              <p className="text-slate-300">High-throughput barcode scanning lanes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
