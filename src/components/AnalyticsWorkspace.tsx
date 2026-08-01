import React from 'react';
import { TrendingUp, DollarSign, Users, Ticket, BarChart3, ArrowUpRight } from 'lucide-react';
import { PassTicket } from '../types';

interface AnalyticsWorkspaceProps {
  tickets: PassTicket[];
}

export const AnalyticsWorkspace: React.FC<AnalyticsWorkspaceProps> = ({ tickets }) => {
  const vipPasses = tickets.filter((t) => t.category.includes('vip') || t.category.includes('box'));
  const gaPasses = tickets.filter((t) => t.category === 'general_access');
  const floorPasses = tickets.filter((t) => t.category === 'courtside_floor');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Advanced Executive Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Pass tier conversion rates, average yield per seat, and entry velocity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-400 uppercase font-mono">VIP / Box Tier Yield</p>
          <p className="text-xl font-bold font-mono text-blue-400">{vipPasses.length} Issued</p>
          <p className="text-[10px] text-emerald-400">+24% revenue contribution</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Floor Seating Yield</p>
          <p className="text-xl font-bold font-mono text-blue-400">{floorPasses.length} Issued</p>
          <p className="text-[10px] text-slate-400">CourtiQ perimeter</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-400 uppercase font-mono">General Access Volume</p>
          <p className="text-xl font-bold font-mono text-purple-400">{gaPasses.length} Issued</p>
          <p className="text-[10px] text-slate-400">High volume stadium tiers</p>
        </div>
      </div>
    </div>
  );
};
