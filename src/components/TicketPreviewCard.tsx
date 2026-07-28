import React from 'react';
import { PassTicket } from '../types';
import { PASS_TEMPLATES } from '../lib/ticketTemplateMap';
import { QRCodeSVG } from 'qrcode.react';
import { Eye, CheckCircle2, Clock, XCircle, Trash2, Ticket, QrCode } from 'lucide-react';

interface TicketPreviewCardProps {
  ticket: PassTicket;
  onView: (ticket: PassTicket) => void;
  onToggleStatus: (ticketId: string, newStatus: PassTicket['status']) => void;
  onDelete: (ticketId: string) => void;
}

export const TicketPreviewCard: React.FC<TicketPreviewCardProps> = ({
  ticket,
  onView,
  onToggleStatus,
  onDelete,
}) => {
  const template = PASS_TEMPLATES[ticket.category] || PASS_TEMPLATES.general_access;

  return (
    <div className={`group relative rounded-xl border ${template.borderColor} bg-slate-900/90 hover:bg-slate-900 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-xl hover:border-blue-500/50 flex flex-col justify-between`}>
      {/* Top Banner */}
      <div className={`px-4 py-2 flex items-center justify-between border-b border-white/10 bg-slate-950/60`}>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${template.badgeBg}`}>
          {template.badgeText}
        </span>
        <div className="flex items-center gap-1.5">
          {ticket.status === 'valid' && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Valid
            </span>
          )}
          {ticket.status === 'used' && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              <Clock className="w-3 h-3" /> Used
            </span>
          )}
          {ticket.status === 'revoked' && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
              <XCircle className="w-3 h-3" /> Revoked
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-bold text-white text-base font-heading group-hover:text-blue-400 transition-colors line-clamp-1">
              {ticket.holderName || ticket.eventName || 'Official Pass'}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {ticket.holderRole || ticket.holderEmail || ticket.eventName}
            </p>
          </div>
          <div className="p-1.5 bg-white rounded-md shrink-0 border border-slate-300 shadow-sm">
            <QRCodeSVG value={ticket.qrCodeData || ticket.ticketCode} size={42} level="M" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-white/5 text-[11px]">
          <div>
            <span className="text-slate-500 block uppercase text-[9px] font-bold">Pass Code</span>
            <span className="font-mono text-blue-300 font-semibold truncate block">{ticket.ticketCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[9px] font-bold">Pass Type</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] truncate block">
              {ticket.passType === 'staff_badge' ? 'Staff Badge' : ticket.passType === 'qr_only' ? 'QR Pass' : 'Landscape Ticket'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions footer */}
      <div className="px-4 py-2.5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs">
        <button
          onClick={() => onView(ticket)}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition-colors px-2 py-1 rounded hover:bg-blue-500/10"
        >
          <Eye className="w-3.5 h-3.5" /> View Pass
        </button>

        <div className="flex items-center gap-1">
          {ticket.status === 'valid' ? (
            <button
              onClick={() => onToggleStatus(ticket.id, 'used')}
              title="Mark as Used/Scanned"
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onToggleStatus(ticket.id, 'valid')}
              title="Reactivate Pass"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
            >
              <Ticket className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(ticket.id)}
            title="Delete Pass"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
