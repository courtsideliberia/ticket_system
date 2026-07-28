import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  DollarSign,
  Clock,
  Plus,
  Share2,
  Copy,
  Settings,
  BarChart3,
  QrCode,
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { EventRecord, PassTicket, OrderRecord, ScannerDevice } from '../types';

interface EventsWorkspaceProps {
  events: EventRecord[];
  tickets: PassTicket[];
  orders: OrderRecord[];
  scanners: ScannerDevice[];
  onOpenCreateEventModal: () => void;
  onOpenIssueModal: () => void;
  onSelectTicket: (ticket: PassTicket) => void;
  onSelectOrder?: (order: OrderRecord) => void;
}

type EventTab =
  | 'Overview'
  | 'Tickets'
  | 'Orders'
  | 'Attendees'
  | 'Scanners'
  | 'Analytics'
  | 'Marketing'
  | 'Settings';

export const EventsWorkspace: React.FC<EventsWorkspaceProps> = ({
  events,
  tickets,
  orders,
  scanners,
  onOpenCreateEventModal,
  onOpenIssueModal,
  onSelectTicket,
  onSelectOrder,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [activeSection, setActiveSection] = useState<EventTab>('Overview');

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Filter tickets for this event
  const eventTickets = tickets.filter((t) => t.eventName === selectedEvent?.name);
  const eventOrders = orders.filter((o) => o.eventName === selectedEvent?.name);
  const checkedInAttendees = eventTickets.filter((t) => t.status === 'used');

  if (events.length === 0 || !selectedEvent) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-heading text-white">No Events Published Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first event or tournament match to start issuing passes, setting capacities, and scanning attendees.
          </p>
        </div>
        <button
          onClick={onOpenCreateEventModal}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Your First Event
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Event Selector Header Strip */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center gap-2">
          {events.map((evt) => {
            const isSelected = evt.id === selectedEventId;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {evt.name}
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenCreateEventModal}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Selected Event Workspace Container */}
      {selectedEvent && (
        <div className="space-y-6">
          {/* Hero Banner & Command Center Header */}
          <div
            className={`p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${selectedEvent.bannerGradient} border border-slate-800 shadow-2xl relative overflow-hidden text-white space-y-5 sm:space-y-6 min-w-0`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 relative z-10 min-w-0">
              <div className="space-y-2 max-w-2xl min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-blue-300 font-mono text-[10px] font-extrabold uppercase shrink-0">
                    {selectedEvent.status} Event
                  </span>
                  <span className="text-xs text-slate-200 font-mono font-bold flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {selectedEvent.venue}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-heading font-extrabold tracking-tight break-words">
                  {selectedEvent.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2 flex-wrap">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" /> Date: {selectedEvent.date} at{' '}
                  {selectedEvent.time}
                </p>
              </div>

              {/* Countdown & Quick Command Actions */}
              <div className="p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 text-center space-y-2 w-full lg:w-auto shrink-0">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Event Countdown
                </p>
                <p className="text-lg sm:text-xl font-mono font-extrabold text-blue-400">
                  22D : 14H : 38M
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={onOpenIssueModal}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap flex-1 lg:flex-none"
                  >
                    Issue Pass
                  </button>
                  <button
                    onClick={() => alert('Event access link copied to clipboard!')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors shrink-0"
                    title="Share Event Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
              <div className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[10px] text-slate-300 uppercase font-mono">Tickets Sold</p>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  {selectedEvent.ticketsSold}{' '}
                  <span className="text-xs text-slate-400">/ {selectedEvent.capacity}</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[10px] text-slate-300 uppercase font-mono">Total Revenue</p>
                <p className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                  ${selectedEvent.totalRevenue.toLocaleString()} USD
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[10px] text-slate-300 uppercase font-mono">Admitted Attendees</p>
                <p className="text-lg font-bold font-mono text-red-400 mt-0.5">
                  {checkedInAttendees.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[10px] text-slate-300 uppercase font-mono">Capacity Filled</p>
                <p className="text-lg font-bold font-mono text-blue-300 mt-0.5">
                  {Math.round((selectedEvent.ticketsSold / selectedEvent.capacity) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Workspace Section Navigation Bar */}
          <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {(
              [
                'Overview',
                'Tickets',
                'Orders',
                'Attendees',
                'Scanners',
                'Analytics',
                'Marketing',
                'Settings',
              ] as EventTab[]
            ).map((tab) => {
              const isActive = activeSection === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 shrink-0 ${
                    isActive
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Section Workspace Content */}
          {activeSection === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Event Sales */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Recent Event Ticket Sales</h3>
                  <span className="text-xs text-blue-400 font-mono font-bold">
                    {eventTickets.length} Passes Issued
                  </span>
                </div>

                <div className="space-y-2">
                  {eventTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTicket(t)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-blue-500/40 transition-all"
                    >
                      <div>
                        <p className="font-bold text-white text-xs">{t.holderName}</p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {t.ticketCode} • {t.category.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400 font-mono text-xs">${t.price} USD</p>
                        <p className="text-[10px] text-slate-400">{t.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks Command Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Upcoming Checklist
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Confirm SKD VIP Gate scanner sync</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Print Courtside Box physical passes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-200">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Export Google Sheets backup report</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Tickets' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Event Ticket Matrix</h3>
                <button
                  onClick={onOpenIssueModal}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition-all shadow-md shadow-blue-500/20"
                >
                  Issue Pass
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {eventTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTicket(t)}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer space-y-2"
                  >
                    <p className="font-bold text-white text-xs">{t.holderName}</p>
                    <p className="text-[10px] font-mono text-blue-400">{t.ticketCode}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{t.category.toUpperCase()}</span>
                      <span className="font-bold text-emerald-400">${t.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Orders' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white">Event Orders</h3>
              <div className="space-y-2">
                {eventOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => onSelectOrder && onSelectOrder(o)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-blue-500/40"
                  >
                    <div>
                      <p className="font-bold text-white text-xs">{o.orderNumber} • {o.customerName}</p>
                      <p className="text-[10px] text-slate-400">{o.paymentMethod} • {o.ticketCount} Tickets</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-xs">${o.totalAmount} USD</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Attendees' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white">Live Admitted Roster</h3>
              {checkedInAttendees.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No attendees admitted yet for this event.</p>
              ) : (
                <div className="space-y-2">
                  {checkedInAttendees.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{t.holderName}</p>
                        <p className="text-[10px] text-slate-400">{t.gateEntry || 'VIP Gate'} • Agent Admitted</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                        ADMITTED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'Scanners' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-white">Assigned Gate Scanners</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scanners.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="font-bold text-white text-xs">{s.name}</p>
                    <p className="text-[10px] text-slate-400">Gate: {s.gate} • Battery: {s.battery}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
