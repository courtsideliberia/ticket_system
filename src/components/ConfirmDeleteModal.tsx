import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export interface DeleteTarget {
  type: 'ticket' | 'event' | 'user' | 'order' | 'reset';
  id: string;
  title: string;
  subtitle?: string;
  warningText?: string;
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  target: DeleteTarget | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  target,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !target) return null;

  const getTypeLabel = () => {
    switch (target.type) {
      case 'ticket':
        return 'Pass / QR Ticket';
      case 'event':
        return 'Event Record';
      case 'user':
        return 'User Account';
      case 'order':
        return 'Order Record';
      case 'reset':
        return 'Complete Database';
      default:
        return 'Item';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
            <Trash2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-extrabold uppercase tracking-wider">
              Confirm Deletion
            </span>
            <h3 className="text-xl font-heading font-extrabold text-white">
              Delete {getTypeLabel()}?
            </h3>
          </div>
        </div>

        {/* Details card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-xs font-bold font-mono text-amber-400 break-words">
            {target.title}
          </p>
          {target.subtitle && (
            <p className="text-xs text-slate-400 break-words">{target.subtitle}</p>
          )}
          <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {target.warningText || 'This action cannot be undone and will permanently remove this item.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
