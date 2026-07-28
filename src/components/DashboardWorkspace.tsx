import React from 'react';
import {
  DollarSign,
  Ticket,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  QrCode,
  Plus,
  Download,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Share2,
  Mail,
  MessageSquare,
  Building2,
  UserCheck,
} from 'lucide-react';
import {
  PassTicket,
  OrderRecord,
  EventRecord,
  CustomerRecord,
  ScannerDevice,
  ActivityItem,
  NotificationItem,
  AppNavView,
  UserAccount,
} from '../types';

interface DashboardWorkspaceProps {
  tickets: PassTicket[];
  orders: OrderRecord[];
  events: EventRecord[];
  customers?: CustomerRecord[];
  scanners: ScannerDevice[];
  activities: ActivityItem[];
  notifications?: NotificationItem[];
  currentUser?: UserAccount | null;
  onNavigate?: (view: AppNavView) => void;
  onNavigateView?: (view: AppNavView) => void;
  onOpenIssueModal: () => void;
  onOpenCreateEventModal: () => void;
  onSelectTicket: (ticket: PassTicket) => void;
  onOpenShareModal?: (ticket: PassTicket) => void;
}

export const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({
  tickets,
  orders,
  events,
  customers = [],
  scanners,
  activities,
  notifications = [],
  currentUser,
  onNavigate,
  onNavigateView,
  onOpenIssueModal,
  onOpenCreateEventModal,
  onSelectTicket,
  onOpenShareModal,
}) => {
  const handleNav = onNavigate || onNavigateView || (() => {});

  // Calculated KPIs for the active user's workspace
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.status !== 'refunded' ? t.price : 0), 0);
  const ticketsSold = tickets.filter((t) => t.status === 'valid' || t.status === 'used').length;
  const totalEvents = events.length;
  const totalCustomers = customers.length || new Set(tickets.map((t) => t.holderEmail)).size;
  const totalUsed = tickets.filter((t) => t.status === 'used').length;
  const attendanceRate = ticketsSold > 0 ? Math.round((totalUsed / ticketsSold) * 100) : 0;

  const recentCheckIns = tickets.filter((t) => t.status === 'used').slice(0, 5);
  const recentTickets = tickets.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* 1. PERSONALIZED WELCOME BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              {currentUser?.role ? currentUser.role.replace('_', ' ').toUpperCase() : 'ORGANIZER WORKSPACE'}
            </span>
            {currentUser?.role === 'super_admin' && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                👑 Super Admin Mode (All Events View)
              </span>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Welcome, {currentUser?.name || 'Organizer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Here is your personalized summary for your events, tickets generated, sales revenue, and gate access controls.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenCreateEventModal}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider flex-1 md:flex-none"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
          <button
            type="button"
            onClick={onOpenIssueModal}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-1 md:flex-none"
          >
            <Ticket className="w-4 h-4 text-blue-400" />
            <span>Issue Pass / QR Code</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('scanners')}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-1 md:flex-none"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Gate Scanner</span>
          </button>
        </div>
      </section>

      {/* 2. KPI SUMMARY METRICS */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Your Summary Performance</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Isolated Workspace Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales Revenue</span>
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-heading font-extrabold text-white font-mono">
              ${totalRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-sans">USD</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> Generated from your events
            </p>
          </div>

          {/* Passes Issued */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Passes Generated</span>
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-heading font-extrabold text-white font-mono">
              {tickets.length}{' '}
              <span className="text-xs text-slate-400 font-sans">issued</span>
            </p>
            <p className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> {ticketsSold} active / valid
            </p>
          </div>

          {/* Active Events */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Your Events</span>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-heading font-extrabold text-white font-mono">
              {totalEvents}
            </p>
            <p className="text-[11px] text-slate-400 font-semibold mt-2">
              Published events
            </p>
          </div>

          {/* Gate Admitted */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Gate Check-ins</span>
              <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-heading font-extrabold text-white font-mono">
              {totalUsed}{' '}
              <span className="text-xs text-slate-400 font-sans">({attendanceRate}%)</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-2">
              Admitted guests
            </p>
          </div>
        </div>
      </section>

      {/* 3. GENERATED PASSES DIRECT EXPORT / SHARE LIST */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800/90 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-400" />
              <span>Your Generated Passes & Tickets</span>
            </h3>
            <p className="text-xs text-slate-400">
              Passes created by you. Type who the pass is for, and export or share instantly via WhatsApp, Email, or PNG Download.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenIssueModal}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Pass</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('tickets')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1"
            >
              <span>View All Passes ({tickets.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {recentTickets.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
              <Ticket className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">No Passes Generated Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Start by creating an event, then generate digital passes or QR codes for VIPs, staff, media, or general guests.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenCreateEventModal}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                1. Create Event
              </button>
              <button
                type="button"
                onClick={onOpenIssueModal}
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs"
              >
                2. Issue Pass or QR Code
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold uppercase truncate">
                      {t.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                        t.status === 'valid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : t.status === 'used'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <h4
                      onClick={() => onSelectTicket(t)}
                      className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer transition-colors truncate"
                    >
                      {t.holderName}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{t.eventName}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{t.ticketCode}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {t.price > 0 ? `$${t.price} USD` : 'FREE PASS'}
                  </span>

                  {onOpenShareModal && (
                    <button
                      type="button"
                      onClick={() => onOpenShareModal(t)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Export / Share</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. EVENTS SUMMARY & GATE SCANNER QUICK OVERVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Created Events */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-purple-400" /> Your Events
            </h3>
            <button
              type="button"
              onClick={() => handleNav('events')}
              className="text-xs text-purple-400 hover:underline font-bold"
            >
              View All Events
            </button>
          </div>

          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
                No events created yet. Click <span className="text-blue-400 font-bold">Create Event</span> to start.
              </div>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleNav('events')}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs group-hover:text-purple-400 transition-colors">
                      {evt.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                      {evt.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {evt.date} • {evt.venue}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ${evt.totalRevenue.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Gate Check-ins */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
              <QrCode className="w-4.5 h-4.5 text-emerald-400" /> Recent Gate Admissions
            </h3>
            <button
              type="button"
              onClick={() => handleNav('scanners')}
              className="text-xs text-emerald-400 hover:underline font-bold"
            >
              Gate Scanner
            </button>
          </div>

          <div className="space-y-2">
            {recentCheckIns.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
                No recent gate check-ins recorded yet.
              </div>
            ) : (
              recentCheckIns.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:border-emerald-500/40 transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white text-xs truncate">{t.holderName}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{t.ticketCode}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                      Admitted
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
