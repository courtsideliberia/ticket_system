import React from 'react';
import { PassTicket } from '../types';
import { TicketRenderer } from './TicketRenderer';
import { X, Printer, Download, Mail, CheckCircle2, XCircle, RotateCcw, Share2, ArrowLeft, Trash2 } from 'lucide-react';

interface TicketDetailModalProps {
  ticket: PassTicket | null;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, newStatus: PassTicket['status']) => void;
  onOpenShareModal?: (ticket: PassTicket) => void;
  onDelete?: (ticketId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onUpdateStatus,
  onOpenShareModal,
  onDelete,
}) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header Bar with Go Back button */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Go Back</span>
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping hidden sm:block shrink-0" />
            <h3 className="text-xs sm:text-base font-bold text-white font-heading truncate">
              Pass Detail • <span className="text-blue-400 font-mono">{ticket.ticketCode}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Render Container */}
        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="overflow-x-auto pb-2 flex justify-center">
            <TicketRenderer ticket={ticket} onPrint={handlePrint} />
          </div>

          {/* Quick Management Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 sm:p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 uppercase font-semibold tracking-wider">PASS STATUS CONTROL</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'valid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    ticket.status === 'valid'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active
                </button>
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'used')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    ticket.status === 'used'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-400" /> Mark Admitted
                </button>
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'revoked')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    ticket.status === 'revoked'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" /> Revoke
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center sm:items-end justify-start sm:justify-end gap-2">
              <button
                onClick={() => {
                  if (onOpenShareModal) {
                    onOpenShareModal(ticket);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
              >
                <Share2 className="w-4 h-4" /> Export / Dispatch Pass
              </button>
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Audit History</h4>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-slate-400">
              <p>• Issued on <strong className="text-slate-200">{new Date(ticket.issuedAt).toLocaleString()}</strong></p>
              {ticket.scannedAt && (
                <p>• Admitted at gate on <strong className="text-emerald-400">{new Date(ticket.scannedAt).toLocaleString()}</strong> by {ticket.scannedBy || 'Gate Scanner'}</p>
              )}
              {ticket.notes && <p>• Notes: <span className="text-blue-300/90 italic">{ticket.notes}</span></p>}
            </div>
          </div>
        </div>

        {/* Modal Footer with explicit Go Back button */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Go Back to Passes</span>
          </button>

          {onDelete && (
            <button
              onClick={() => {
                onDelete(ticket.id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-rose-500/30 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Pass</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
