import React from 'react';
import { PassTicket } from '../types';
import { PASS_TEMPLATES } from '../lib/ticketTemplateMap';
import { formatRevenueSummary } from '../lib/currency';
import { Ticket, Users, CheckCircle2, DollarSign, TrendingUp, Sparkles, QrCode, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ClientDashboardProps {
  tickets: PassTicket[];
  onOpenScanner: () => void;
  onOpenGenerator: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  tickets,
  onOpenScanner,
  onOpenGenerator,
}) => {
  const totalIssued = tickets.length;
  const usedTickets = tickets.filter((t) => t.status === 'used');
  const validTickets = tickets.filter((t) => t.status === 'valid');
  const totalAdmitted = usedTickets.length;
  const admissionRate = totalIssued > 0 ? Math.round((totalAdmitted / totalIssued) * 100) : 0;

  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);

  // Category counts
  const categoryCounts = tickets.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> CourtiQ Event Operations
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
            Liberia Basketball Championship Control Center
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Real-time digital ticket issuance, VIP guest monitoring, and gate admission analytics for SKD Sports Complex.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={onOpenScanner}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all uppercase tracking-wider"
          >
            <QrCode className="w-4 h-4" /> Open Gate Scanner
          </button>
          <button
            onClick={onOpenGenerator}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Ticket className="w-4 h-4 text-blue-400" /> Issue Pass
          </button>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <QrCode className="w-64 h-64 text-blue-400" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Passes Issued</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{totalIssued}</p>
          <p className="text-[11px] text-slate-500">{validTickets.length} active valid passes ready</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admitted at Gate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{totalAdmitted}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${admissionRate}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-emerald-400">{admissionRate}%</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-heading font-mono">{formatRevenueSummary(tickets)}</p>
          <p className="text-[11px] text-slate-500">CourtiQ VIP & Box packages included</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Integrity</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">100%</p>
          <p className="text-[11px] text-emerald-400 font-semibold">Zero duplicate entries detected</p>
        </div>
      </div>

      {/* Category Breakdown & Recent Passes List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span>Pass Tiers Breakdown</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </h3>

          <div className="space-y-3 pt-2">
            {Object.keys(PASS_TEMPLATES).map((catKey) => {
              const tpl = PASS_TEMPLATES[catKey as keyof typeof PASS_TEMPLATES];
              const count = categoryCounts[catKey] || 0;
              const percent = totalIssued > 0 ? Math.round((count / totalIssued) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">{tpl.name}</span>
                    <span className="font-mono text-slate-400">{count} passes ({percent}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: tpl.accentColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Recent Activity */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Recent CourtiQ Pass Issuances
            </h3>
            <span className="text-xs text-blue-400 font-semibold">Showing latest</span>
          </div>

          <div className="space-y-2.5">
            {tickets.slice(0, 5).map((t) => {
              const tpl = PASS_TEMPLATES[t.category] || PASS_TEMPLATES.general_access;
              return (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-blue-400 text-xs">
                      iQ
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.holderName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{t.ticketCode}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${tpl.badgeBg}`}>
                      {tpl.badgeText}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{t.section || 'CourtiQ'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
