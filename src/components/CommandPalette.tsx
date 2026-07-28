import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Ticket,
  ShoppingBag,
  Users,
  Calendar,
  QrCode,
  MapPin,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PassTicket, OrderRecord, CustomerRecord, EventRecord, ScannerDevice, AppNavView } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: PassTicket[];
  orders: OrderRecord[];
  customers: CustomerRecord[];
  events: EventRecord[];
  scanners: ScannerDevice[];
  onSelectTicket: (ticket: PassTicket) => void;
  onSelectOrder: (order: OrderRecord) => void;
  onSelectCustomer: (customer: CustomerRecord) => void;
  onSelectEvent?: (event: EventRecord) => void;
  onSelectScanner?: (scanner: ScannerDevice) => void;
  onNavigate?: (view: AppNavView) => void;
  onNavigateView?: (view: AppNavView) => void;
  onOpenSuperAdminModal?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tickets,
  orders,
  customers,
  events,
  scanners,
  onSelectTicket,
  onSelectOrder,
  onSelectCustomer,
  onSelectEvent,
  onSelectScanner,
  onNavigate,
  onNavigateView,
  onOpenSuperAdminModal,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleNav = onNavigate || onNavigateView || (() => {});

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global search filtering
  const q = query.trim().toLowerCase();

  const matchingTickets = q
    ? tickets.filter(
        (t) =>
          t.ticketCode.toLowerCase().includes(q) ||
          (t.holderName || '').toLowerCase().includes(q) ||
          (t.holderEmail || '').toLowerCase().includes(q) ||
          (t.holderPhone && t.holderPhone.includes(q)) ||
          t.category.toLowerCase().includes(q) ||
          t.qrCodeData.toLowerCase().includes(q)
      )
    : tickets.slice(0, 3);

  const matchingOrders = q
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          (o.customerPhone && o.customerPhone.includes(q)) ||
          o.ticketCodes.some((code) => code.toLowerCase().includes(q))
      )
    : orders.slice(0, 3);

  const matchingCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q))
      )
    : customers.slice(0, 3);

  const matchingEvents = q
    ? events.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.status.toLowerCase().includes(q)
      )
    : events.slice(0, 2);

  const matchingScanners = q
    ? scanners.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.gate.toLowerCase().includes(q) ||
          s.currentUser.toLowerCase().includes(q)
      )
    : scanners.slice(0, 2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, orders, customers, QR codes, phone, scanners..."
            className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-5 custom-scrollbar text-xs">
          {/* Owner Code 004455 / Admin Match */}
          {(q.includes('004455') || q.includes('admin') || q.includes('owner') || q.includes('super')) && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                  👑
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Owner / Super Admin Passcode (004455)</p>
                  <p className="text-[10px] text-slate-400">Click to authenticate master administrative access</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onOpenSuperAdminModal) onOpenSuperAdminModal();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0"
              >
                Sign In 004455
              </button>
            </div>
          )}
          {/* Quick Nav Shortcuts */}
          {!q && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    handleNav('events');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 text-left transition-all group"
                >
                  <Calendar className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white">Events</p>
                  <p className="text-[10px] text-slate-400">Manage & Command</p>
                </button>
                <button
                  onClick={() => {
                    handleNav('tickets');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 text-left transition-all group"
                >
                  <Ticket className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white">Tickets</p>
                  <p className="text-[10px] text-slate-400">Pass Matrix</p>
                </button>
                <button
                  onClick={() => {
                    handleNav('orders');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 text-left transition-all group"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white">Orders</p>
                  <p className="text-[10px] text-slate-400">Ledger & Invoices</p>
                </button>
                <button
                  onClick={() => {
                    handleNav('scanners');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 text-left transition-all group"
                >
                  <QrCode className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white">Scanners</p>
                  <p className="text-[10px] text-slate-400">Gate Hardware</p>
                </button>
              </div>
            </div>
          )}

          {/* Matches: Tickets */}
          {matchingTickets.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-blue-400" /> Tickets ({matchingTickets.length})
                </span>
                <button
                  onClick={() => {
                    handleNav('tickets');
                    onClose();
                  }}
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {matchingTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      onSelectTicket(ticket);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-800/40 cursor-pointer flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-blue-400 text-[10px] shrink-0">
                        QR
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{ticket.holderName}</p>
                        <p className="text-[10px] font-mono text-slate-400 truncate">
                          {ticket.ticketCode} • {ticket.category.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                        ${ticket.price} {ticket.currency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches: Orders */}
          {matchingOrders.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" /> Orders ({matchingOrders.length})
                </span>
                <button
                  onClick={() => {
                    handleNav('orders');
                    onClose();
                  }}
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {matchingOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      onSelectOrder(order);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-800/40 cursor-pointer flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-blue-400 text-[10px] shrink-0">
                        ORD
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{order.customerName}</p>
                        <p className="text-[10px] font-mono text-slate-400 truncate">
                          {order.orderNumber} • {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-emerald-400 font-mono text-xs">
                        ${order.totalAmount} USD
                      </p>
                      <p className="text-[10px] text-slate-400">{order.ticketCount} passes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches: Customers */}
          {matchingCustomers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" /> Customers ({matchingCustomers.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {matchingCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => {
                      onSelectCustomer(customer);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-800/40 cursor-pointer flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-xs shrink-0">
                        {customer.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-slate-200 font-mono text-xs">
                        ${customer.totalSpent} spent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {q &&
            matchingTickets.length === 0 &&
            matchingOrders.length === 0 &&
            matchingCustomers.length === 0 &&
            matchingEvents.length === 0 &&
            matchingScanners.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <p className="font-bold text-white mb-1">No matching records found</p>
                <p className="text-xs text-slate-400">
                  Try searching with a ticket code, email, name, phone number or QR code string.
                </p>
              </div>
            )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Esc</kbd> to exit
          </span>
          <span className="flex items-center gap-1 text-blue-400 font-medium">
            <Command className="w-3 h-3" /> Intelligent Search Engine
          </span>
        </div>
      </div>
    </div>
  );
};
