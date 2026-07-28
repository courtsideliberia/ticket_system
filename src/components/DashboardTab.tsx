import React from 'react';
import { 
  Calendar, 
  Ticket, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  RefreshCw, 
  Activity
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface DashboardTabProps {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  onRefresh: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
}

export default function DashboardTab({ 
  analytics, 
  loading, 
  onRefresh, 
  autoRefresh, 
  onToggleAutoRefresh 
}: DashboardTabProps) {
  
  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <Activity className="w-12 h-12 text-violet-500 animate-pulse" />
        <p className="text-slate-400 font-medium">Fetching dashboard analytics...</p>
      </div>
    );
  }

  const {
    totalEvents,
    totalTickets,
    totalScanned,
    totalPending,
    duplicateAttempts,
    scanRate,
    scansByEvent,
    scanLogs
  } = analytics;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">System Analytics & Attendance</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Real-time stats, scan progress, and security verification logs.</p>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              autoRefresh 
                ? 'bg-violet-600/20 text-violet-300 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-900/40 hover:text-white'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-violet-300' : 'text-slate-500'}`} />
            <span>{autoRefresh ? 'Auto-refreshing (5s)' : 'Enable auto-refresh'}</span>
          </button>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#121c33] hover:bg-[#1a2644] disabled:opacity-50 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-violet-300' : 'text-slate-400'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl flex items-center justify-between shadow-lg backdrop-blur-md hover:border-violet-500/20 transition-all">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block font-mono">Total Events</span>
            <span className="text-2xl font-black text-white block">{totalEvents}</span>
            <span className="text-[10px] text-slate-500 block font-mono">Active, cancelled or ended</span>
          </div>
          <div className="p-3 bg-violet-950/40 text-violet-300 rounded-2xl border border-violet-900/30">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Total Tickets */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl flex items-center justify-between shadow-lg backdrop-blur-md hover:border-violet-500/20 transition-all">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block font-mono">Tickets Created</span>
            <span className="text-2xl font-black text-white block">{totalTickets}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{totalPending} pending check-in</span>
          </div>
          <div className="p-3 bg-violet-950/40 text-violet-300 rounded-2xl border border-violet-900/30">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        {/* Total Scanned */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl flex items-center justify-between shadow-lg backdrop-blur-md hover:border-emerald-500/20 transition-all">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block font-mono">Checked In</span>
            <span className="text-2xl font-black text-emerald-400 block">{totalScanned}</span>
            <span className="text-[10px] text-emerald-400/80 block font-mono font-semibold">{scanRate}% attendance rate</span>
          </div>
          <div className="p-3 bg-emerald-950/30 text-emerald-400 rounded-2xl border border-emerald-900/30">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Duplicate Scan Attempts */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl flex items-center justify-between shadow-lg backdrop-blur-md hover:border-rose-500/20 transition-all">
          <div className="space-y-1.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block font-mono">Duplicate Scans</span>
            <span className={`text-2xl font-black block ${duplicateAttempts > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              {duplicateAttempts}
            </span>
            <span className="text-[10px] text-slate-550 block font-mono">Rejected security flags</span>
          </div>
          <div className={`p-3 rounded-2xl border ${duplicateAttempts > 0 ? 'bg-rose-950/40 text-rose-400 border-rose-900/40 animate-pulse' : 'bg-slate-950/40 text-slate-500 border-slate-900'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Stats Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Breakdown by Event */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:col-span-2 space-y-6 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white">Event Attendance Breakdown</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Tickets checked in versus total issued per event.</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-5">
            {Object.keys(scansByEvent).length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">No event stats available. Create events and generate tickets.</div>
            ) : (
              Object.keys(scansByEvent).map(eventId => {
                const item = scansByEvent[eventId];
                const pct = item.total > 0 ? Math.round((item.scanned / item.total) * 100) : 0;
                return (
                  <div key={eventId} className="space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-slate-200 block truncate max-w-[280px] md:max-w-md">{item.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">ID: {eventId}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-white font-black">{item.scanned}</span>
                        <span className="text-slate-500"> / {item.total}</span>
                        <span className="text-emerald-400 font-bold ml-2">({pct}%)</span>
                      </div>
                    </div>
                    {/* Progress Bar background */}
                    <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden flex border border-slate-800/60">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 80 ? 'bg-violet-500' : pct >= 40 ? 'bg-emerald-500' : 'bg-violet-500'
                        }`}
                        style={{ width: `${Math.max(item.total > 0 ? 3 : 0, Math.min(pct, 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Security & Audit Summary */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-md">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800/80">
              <h3 className="text-sm font-bold text-white">Security & Audit Status</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Summary of ticket anti-fraud checks.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-950/40 rounded-2xl flex items-center justify-between border border-slate-800/60">
                <span className="text-xs text-slate-300 font-semibold">One-Time-Use Rule</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-900/30 font-mono">Active</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-2xl flex items-center justify-between border border-slate-800/60">
                <span className="text-xs text-slate-300 font-semibold">QR Code Encryption</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-900/30 font-mono">AES-Mock</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-2xl flex items-center justify-between border border-slate-800/60">
                <span className="text-xs text-slate-300 font-semibold">Duplicate Protection</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-900/30 font-mono">Server-Side</span>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-2xl flex items-center justify-between border border-slate-800/60">
                <span className="text-xs text-slate-300 font-semibold">Device Camera Ingress</span>
                <span className="text-[10px] text-violet-300 font-bold bg-violet-950/40 px-2 py-0.5 rounded-lg border border-violet-900/30 font-mono font-bold">HTTPS Ready</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[9px] text-slate-500 text-center font-mono uppercase tracking-widest font-bold">
            TicketVal Secure System v1.0
          </div>
        </div>
      </div>

      {/* Real-time Scan Logs Panel */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800/80 gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Real-time Check-in Log</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Most recent scans, validations, and security block history.</p>
          </div>
          <span className="text-[9px] font-bold font-mono bg-violet-950/40 border border-violet-900/30 text-violet-300 px-2.5 py-1 rounded-lg uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {scanLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">
                No tickets scanned yet. Launch the camera or manually check-in a ticket in the Scan tab!
              </div>
            ) : (
              scanLogs.map((log: any) => {
                const isSuccess = log.status === 'valid';
                const isDuplicate = log.status === 'duplicate';
                
                let badgeClass = 'bg-slate-950 text-slate-400 border border-slate-800';
                if (isSuccess) badgeClass = 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30';
                else if (isDuplicate) badgeClass = 'bg-rose-950/40 text-rose-400 border border-rose-900/30';
                else badgeClass = 'bg-amber-950/40 text-amber-400 border border-amber-900/30';

                return (
                  <div 
                    key={log.id} 
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-slate-950/20 border border-slate-800/60 rounded-2xl gap-3 text-xs"
                  >
                    {/* Left: Status Badge & Message */}
                    <div className="flex items-start md:items-center gap-3">
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg tracking-wider shrink-0 ${badgeClass}`}>
                        {log.status === 'valid' ? 'Success' : log.status === 'duplicate' ? 'Duplicate' : 'Invalid'}
                      </span>
                      <div className="space-y-1">
                        <span className="text-slate-200 font-bold block">{log.message}</span>
                        <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400 font-mono">
                          <span className="text-slate-300 font-medium truncate max-w-[140px] md:max-w-xs">{log.eventName}</span>
                          <span className="text-slate-600">•</span>
                          <span>ID: {log.ticketId.substring(0, 12)}...</span>
                          {log.ticketType && log.ticketType !== 'Unknown' && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-violet-300 font-bold">{log.ticketType}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Timestamp */}
                    <div className="flex items-center gap-2 self-end md:self-auto text-[10px] text-slate-500 font-mono shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>{new Date(log.scannedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
