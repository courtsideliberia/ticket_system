import React from 'react';
import { PassTicket } from '../types';
import { TicketRenderer } from './TicketRenderer';
import { X, Printer, Download, Mail, CheckCircle2, XCircle, RotateCcw, Share2 } from 'lucide-react';

interface TicketDetailModalProps {
  ticket: PassTicket | null;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, newStatus: PassTicket['status']) => void;
  onOpenShareModal?: (ticket: PassTicket) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onUpdateStatus,
  onOpenShareModal,
}) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStub = () => {
    const element = document.getElementById(`ticket-pass-${ticket.id}`);
    if (!element) return;
    // Trigger standard browser print or save dialog formatted for pass printing
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
            <h3 className="text-lg font-bold text-white font-heading">
              Courtside Ticket Detail • <span className="text-blue-400 font-mono">{ticket.ticketCode}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Render Container */}
        <div className="p-6 space-y-6">
          <div className="overflow-x-auto pb-2">
            <TicketRenderer ticket={ticket} onPrint={handlePrint} />
          </div>

          {/* Quick Management Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">PASS STATUS CONTROL</span>
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

            <div className="flex flex-wrap items-end justify-end gap-2">
              <button
                onClick={() => {
                  if (onOpenShareModal) {
                    onOpenShareModal(ticket);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
              >
                <Share2 className="w-4 h-4" /> Export PNG / WhatsApp / Email
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
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
      </div>
    </div>
  );
};
