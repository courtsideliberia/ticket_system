import React from 'react';
import {
  X,
  Ticket as TicketIcon,
  ShoppingBag,
  User,
  QrCode,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Download,
  CheckCircle2,
  AlertOctagon,
  CreditCard,
  Phone,
  Mail,
  RotateCcw,
  Ban,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PassTicket, OrderRecord, CustomerRecord, ScannerDevice, PassStatus } from '../types';

export type DrawerItem =
  | { type: 'ticket'; data: PassTicket }
  | { type: 'order'; data: OrderRecord }
  | { type: 'customer'; data: CustomerRecord }
  | { type: 'scanner'; data: ScannerDevice }
  | null;

interface SideDetailPanelProps {
  item?: DrawerItem;
  selectedTicket?: PassTicket | null;
  selectedOrder?: OrderRecord | null;
  selectedCustomer?: CustomerRecord | null;
  selectedScanner?: ScannerDevice | null;
  onClose: () => void;
  onUpdateTicketStatus?: (id: string, newStatus: PassStatus) => void;
  onDeleteTicket?: (id: string) => void;
}

export const SideDetailPanel: React.FC<SideDetailPanelProps> = ({
  item: providedItem,
  selectedTicket,
  selectedOrder,
  selectedCustomer,
  selectedScanner,
  onClose,
  onUpdateTicketStatus,
  onDeleteTicket,
}) => {
  let activeItem: DrawerItem = providedItem || null;

  if (!activeItem) {
    if (selectedTicket) activeItem = { type: 'ticket', data: selectedTicket };
    else if (selectedOrder) activeItem = { type: 'order', data: selectedOrder };
    else if (selectedCustomer) activeItem = { type: 'customer', data: selectedCustomer };
    else if (selectedScanner) activeItem = { type: 'scanner', data: selectedScanner };
  }

  if (!activeItem) return null;

  const item = activeItem;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full shadow-2xl shadow-black flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all shrink-0 mr-1"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Go Back</span>
            </button>

            {item.type === 'ticket' && <TicketIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />}
            {item.type === 'order' && <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />}
            {item.type === 'customer' && <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />}
            {item.type === 'scanner' && <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />}

            <h2 className="font-heading font-extrabold text-xs sm:text-base text-white uppercase tracking-wider truncate">
              {item.type === 'ticket' && 'Pass Inspector Drawer'}
              {item.type === 'order' && 'Order Summary Drawer'}
              {item.type === 'customer' && 'Customer Profile Drawer'}
              {item.type === 'scanner' && 'Scanner Device Detail'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 sm:space-y-6 custom-scrollbar text-xs">
          {/* TICKET DETAILS */}
          {item.type === 'ticket' && (
            <div className="space-y-4 sm:space-y-6">
              {/* QR & Code Box */}
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-3 sm:space-y-4 shadow-inner">
                <div className="p-2.5 sm:p-3 bg-white rounded-2xl shadow-xl">
                  <QRCodeSVG value={item.data.qrCodeData} size={130} level="H" className="sm:w-[150px] sm:h-[150px]" />
                </div>
                <div className="w-full">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-xs font-bold inline-block">
                    {item.data.ticketCode}
                  </span>
                  <h3 className="text-base sm:text-lg font-heading font-extrabold text-white mt-2 truncate">
                    {item.data.holderName || 'Guest'}
                  </h3>
                  <p className="text-slate-400 text-xs truncate">{item.data.holderEmail}</p>
                </div>
              </div>

              {/* Event Info Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Pass Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                      item.data.status === 'valid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : item.data.status === 'used'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {item.data.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Event</p>
                    <p className="font-bold text-white text-xs">{item.data.eventName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Category</p>
                    <p className="font-bold text-blue-400 text-xs">
                      {item.data.category.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Venue</p>
                    <p className="font-semibold text-slate-200 text-xs">{item.data.venue}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Seat / Row / Sec</p>
                    <p className="font-semibold text-slate-200 text-xs">
                      {item.data.section || 'GA'} • Row {item.data.row || '1'} • Seat{' '}
                      {item.data.seatNumber || '01'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Pass Price</p>
                    <p className="font-bold text-emerald-400 text-xs font-mono">
                      ${item.data.price} {item.data.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Issued On</p>
                    <p className="text-slate-300 font-mono text-xs">
                      {new Date(item.data.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {item.data.scannedAt && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 space-y-1">
                    <p className="font-bold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Scanned & Admitted
                    </p>
                    <p className="text-[10px]">
                      Gate: {item.data.gateEntry || 'VIP Gate'} • Agent: {item.data.scannedBy || 'Gate Scanner'}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="space-y-2">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Administrative Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      onUpdateTicketStatus &&
                      onUpdateTicketStatus(
                        item.data.id,
                        item.data.status === 'valid' ? 'used' : 'valid'
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Toggle Status
                  </button>

                  <button
                    onClick={() =>
                      onUpdateTicketStatus && onUpdateTicketStatus(item.data.id, 'revoked')
                    }
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Revoke Pass
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ORDER DETAILS */}
          {item.type === 'order' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {item.data.orderNumber}
                    </span>
                    <h3 className="font-bold text-sm text-white">{item.data.customerName}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    {item.data.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <p className="text-slate-400 text-[10px]">Customer Email</p>
                    <p className="font-medium text-xs truncate">{item.data.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Phone Number</p>
                    <p className="font-medium text-xs">{item.data.customerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Payment Method</p>
                    <p className="font-medium text-xs">{item.data.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Total Amount</p>
                    <p className="font-bold text-emerald-400 font-mono text-sm">
                      ${item.data.totalAmount} {item.data.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-2">
                  Included Ticket Passes ({item.data.ticketCodes.length})
                </p>
                <div className="space-y-1.5">
                  {item.data.ticketCodes.map((code) => (
                    <div
                      key={code}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs"
                    >
                      <span className="font-bold text-blue-400">{code}</span>
                      <span className="text-slate-400">Issued</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER DETAILS */}
          {item.type === 'customer' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  {item.data.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{item.data.name}</h3>
                <p className="text-slate-400 text-xs">{item.data.email}</p>
                <p className="text-slate-400 text-xs">{item.data.phone || 'No phone'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-slate-400 text-[10px] uppercase">Total Orders</p>
                  <p className="text-xl font-bold font-mono text-white mt-1">
                    {item.data.totalOrders}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-slate-400 text-[10px] uppercase">Total Lifetime Spent</p>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    ${item.data.totalSpent}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCANNER DETAILS */}
          {item.type === 'scanner' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">{item.data.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      item.data.isOnline
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {item.data.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <p className="text-slate-400 text-[10px]">Gate Assignment</p>
                    <p className="font-bold text-white text-xs">{item.data.gate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Battery Level</p>
                    <p className="font-bold text-blue-400 text-xs font-mono">
                      {item.data.battery}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Assigned Operator</p>
                    <p className="font-medium text-xs">{item.data.currentUser}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Today's Check-ins</p>
                    <p className="font-bold text-emerald-400 text-xs font-mono">
                      {item.data.todayScans}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Go Back / Close Panel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
