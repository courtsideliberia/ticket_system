import React, { useState } from 'react';
import {
  Ticket,
  Search,
  Filter,
  Download,
  Printer,
  Ban,
  RotateCcw,
  Send,
  UserCheck,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Sparkles,
  QrCode,
  Eye,
  Trash2,
  Share2,
  Plus,
  Palette,
  LayoutGrid,
  List,
  Calendar,
  Layers
} from 'lucide-react';
import { PassTicket, PassStatus, PassCategory, EventRecord } from '../types';
import { formatCurrency } from '../lib/currency';
import { TicketPreviewCard } from './TicketPreviewCard';
import { CANVAS_THEMES } from '../lib/ticketTemplateMap';

interface TicketsWorkspaceProps {
  tickets: PassTicket[];
  events?: EventRecord[];
  onSelectTicket: (ticket: PassTicket) => void;
  onUpdateStatus?: (id: string, status: PassStatus) => void;
  onUpdateTicketStatus?: (id: string, status: PassStatus) => void;
  onDeleteTicket: (id: string) => void;
  onOpenIssueModal: () => void;
  onOpenShareModal?: (ticket: PassTicket) => void;
}

type TicketTab = 'All' | 'Available' | 'Sold' | 'Checked In' | 'Cancelled' | 'Refunded' | 'Transferred' | 'Blocked';

export const TicketsWorkspace: React.FC<TicketsWorkspaceProps> = ({
  tickets,
  events = [],
  onSelectTicket,
  onUpdateStatus,
  onUpdateTicketStatus,
  onDeleteTicket,
  onOpenIssueModal,
  onOpenShareModal,
}) => {
  const updateStatus = onUpdateStatus || onUpdateTicketStatus || (() => {});
  const [activeTab, setActiveTab] = useState<TicketTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'holderName' | 'ticketCode' | 'issuedAt' | 'price'>('issuedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    // Tab filter
    if (activeTab === 'Available' && t.status !== 'valid') return false;
    if (activeTab === 'Sold' && t.status !== 'valid' && t.status !== 'used') return false;
    if (activeTab === 'Checked In' && t.status !== 'used') return false;
    if (activeTab === 'Cancelled' && t.status !== 'revoked') return false;
    if (activeTab === 'Refunded' && t.status !== 'refunded') return false;
    if (activeTab === 'Transferred' && t.status !== 'transferred') return false;
    if (activeTab === 'Blocked' && t.status !== 'blocked') return false;

    // Category filter
    if (selectedCategoryFilter !== 'all' && t.category !== selectedCategoryFilter) return false;

    // Search term
    const s = searchTerm.toLowerCase();
    return (
      (t.holderName || '').toLowerCase().includes(s) ||
      t.ticketCode.toLowerCase().includes(s) ||
      (t.holderEmail || '').toLowerCase().includes(s) ||
      t.eventName.toLowerCase().includes(s) ||
      t.category.toLowerCase().includes(s)
    );
  });

  // Sort logic
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSelectAll = () => {
    if (selectedTickets.length === sortedTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(sortedTickets.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter((item) => item !== id));
    } else {
      setSelectedTickets([...selectedTickets, id]);
    }
  };

  const handleBulkAction = (action: 'download' | 'print' | 'cancel' | 'refund') => {
    if (selectedTickets.length === 0) return;
    if (action === 'cancel') {
      selectedTickets.forEach((id) => updateStatus(id, 'revoked'));
      alert(`Revoked ${selectedTickets.length} pass(es) successfully.`);
    } else if (action === 'download' || action === 'print') {
      window.print();
    } else if (action === 'refund') {
      selectedTickets.forEach((id) => updateStatus(id, 'refunded'));
      alert(`Marked ${selectedTickets.length} pass(es) as refunded.`);
    }
    setSelectedTickets([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP CHOICE ACTION CARDS: GENERATE TICKET VS VIEW ALL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Choice Card 1: Generate Tickets Studio */}
        <div
          onClick={onOpenIssueModal}
          className="group relative p-6 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-amber-900/60 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                CANVAS DESIGN STUDIO
              </span>
              <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            </div>

            <div>
              <h3 className="text-xl font-black text-amber-300 font-heading uppercase tracking-tight">
                Generate Pass / Ticket
              </h3>
              <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                Choose from <strong>5 premium canvas design themes</strong> (Gold Foil VIP, Purple Sports, Neon Esports, Sleek Black, Courtside Classic). Input bold event name, upload logo, date, time & price!
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-amber-500/20 flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-amber-300 group-hover:text-white transition-colors">
              + Launch Canvas Studio
            </span>
            <div className="p-2 rounded-xl bg-amber-500 text-black font-extrabold group-hover:translate-x-1 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Choice Card 2: Generated Passes Matrix */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-blue-400" />
                PASS MATRIX MATRIX
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{tickets.length} Total Passes</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white font-heading uppercase tracking-tight">
                Generated Tickets ({sortedTickets.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Inspect, print, export PNG, share via WhatsApp, or manage statuses for your generated passes.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Data Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onOpenIssueModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              + Issue Pass Batch
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Filter Strip */}
      <div className="border-b border-slate-800 flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {(
          [
            'All',
            'Available',
            'Sold',
            'Checked In',
            'Cancelled',
            'Refunded',
            'Transferred',
            'Blocked',
          ] as TicketTab[]
        ).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
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

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search passes by code, holder, event..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Pass Tiers</option>
            <option value="courtside_vip">Courtside VIP</option>
            <option value="vip">VIP Access</option>
            <option value="courtside_box">Courtside Box Suite</option>
            <option value="courtside_floor">Courtside Floor</option>
            <option value="general_access">General Admission</option>
            <option value="media">Press & Media</option>
            <option value="player_staff">Player / Staff</option>
          </select>

          {/* Bulk Action Buttons */}
          {selectedTickets.length > 0 && (
            <div className="flex items-center gap-1.5 animate-in fade-in">
              <button
                onClick={() => handleBulkAction('print')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1"
                title="Print Selected"
              >
                <Printer className="w-3.5 h-3.5" /> Print ({selectedTickets.length})
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs flex items-center gap-1"
                title="Cancel Selected"
              >
                <Ban className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: GRID VIEW (VISUAL TICKET CARDS) */}
      {viewMode === 'grid' ? (
        sortedTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 rounded-2xl bg-slate-900 border border-slate-800">
            No matching generated passes found in current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTickets.map((t) => (
              <TicketPreviewCard
                key={t.id}
                ticket={t}
                onView={onSelectTicket}
                onToggleStatus={(id, st) => updateStatus(id, st)}
                onDelete={onDeleteTicket}
              />
            ))}
          </div>
        )
      ) : (
        /* VIEW 2: TABLE VIEW */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button onClick={handleSelectAll} className="p-1 hover:text-white">
                      {selectedTickets.length === sortedTickets.length && sortedTickets.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </th>
                  <th className="p-3 cursor-pointer hover:text-white" onClick={() => setSortField('holderName')}>
                    Pass Holder & Code
                  </th>
                  <th className="p-3">Theme / Category</th>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Seat Location</th>
                  <th className="p-3 cursor-pointer hover:text-white" onClick={() => setSortField('price')}>
                    Price
                  </th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {sortedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      No matching pass tickets found in current filter.
                    </td>
                  </tr>
                ) : (
                  sortedTickets.map((t) => {
                    const isSelected = selectedTickets.includes(t.id);
                    const themeName = t.themeId ? CANVAS_THEMES[t.themeId]?.name : t.category;

                    return (
                      <tr
                        key={t.id}
                        onClick={() => onSelectTicket(t)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-500/10' : ''
                        }`}
                      >
                        <td className="p-3 text-center" onClick={(e) => toggleSelectOne(t.id, e)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-400 inline" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 inline" />
                          )}
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-white text-xs">{t.holderName}</div>
                          <div className="font-mono text-[10px] text-blue-400">{t.ticketCode}</div>
                        </td>

                        <td className="p-3 font-mono font-bold text-[10px] uppercase">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                            {themeName}
                          </span>
                        </td>

                        <td className="p-3 text-slate-200 font-bold truncate max-w-[160px]">
                          {t.eventName}
                        </td>

                        <td className="p-3 text-slate-400 font-mono text-[11px]">
                          {t.section || 'GA'} • R{t.row || '1'} • S{t.seatNumber || '01'}
                        </td>

                        <td className="p-3 font-bold font-mono text-emerald-400">
                          {formatCurrency(t.price, t.currency)}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                              t.status === 'valid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : t.status === 'used'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onOpenShareModal && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenShareModal(t);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] inline-flex items-center gap-1 border border-emerald-500/30 transition-all"
                                title="Export PNG / WhatsApp / Email Pass"
                              >
                                <Share2 className="w-3 h-3" /> Export / Share
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTicket(t);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-[11px] inline-flex items-center gap-1 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTicket(t.id);
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
                              title="Delete Pass"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
