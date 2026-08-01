import React, { useState } from 'react';
import { PassTicket, PassCategory, PassStatus } from '../types';
import { TicketPreviewCard } from './TicketPreviewCard';
import { PASS_TEMPLATES } from '../lib/ticketTemplateMap';
import { Search, Filter, Plus, Download, Printer, CheckSquare, Square, Ticket, Sparkles, RefreshCw } from 'lucide-react';

interface GeneratedPassesGalleryProps {
  tickets: PassTicket[];
  onViewTicket: (ticket: PassTicket) => void;
  onUpdateStatus: (ticketId: string, status: PassStatus) => void;
  onDeleteTicket: (ticketId: string) => void;
  onOpenGenerator: () => void;
}

export const GeneratedPassesGallery: React.FC<GeneratedPassesGalleryProps> = ({
  tickets,
  onViewTicket,
  onUpdateStatus,
  onDeleteTicket,
  onOpenGenerator,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter calculation
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      (t.holderName || '').toLowerCase().includes(search.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      (t.holderEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.section && t.section.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTickets.map((t) => t.id));
    }
  };

  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0 ? tickets.filter((t) => selectedIds.includes(t.id)) : tickets;
    const headers = ['Ticket Code', 'Holder Name', 'Email', 'Category', 'Section', 'Row', 'Seat', 'Status', 'Price', 'Issued At'];
    const rows = listToExport.map((t) => [
      t.ticketCode,
      `"${t.holderName}"`,
      t.holderEmail,
      t.category,
      t.section || '',
      t.row || '',
      t.seatNumber || '',
      t.status,
      t.price,
      t.issuedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CourtiQ_Passes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by holder name, ticket code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories ({tickets.length})</option>
              {(Object.keys(PASS_TEMPLATES) as PassCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {PASS_TEMPLATES[cat].badgeText}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="valid">Valid Passes</option>
              <option value="used">Admitted / Used</option>
              <option value="revoked">Revoked</option>
            </select>

            {/* Generate Action Button */}
            <button
              onClick={onOpenGenerator}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Issue New Pass
            </button>
          </div>
        </div>

        {/* Quick Batch Toolbar */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {selectedIds.length > 0 && selectedIds.length === filteredTickets.length ? (
                <CheckSquare className="w-4 h-4 text-blue-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>Select All ({filteredTickets.length})</span>
            </button>

            {selectedIds.length > 0 && (
              <span className="text-blue-400 font-semibold">{selectedIds.length} selected</span>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Passes Grid Display */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Ticket className="w-12 h-12 mx-auto text-slate-700" />
          <h4 className="text-base font-bold text-slate-300">No CourtiQ Passes Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or generate new digital tickets.
          </p>
          <button
            onClick={onOpenGenerator}
            className="px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Issue Pass
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTickets.map((ticket) => (
            <TicketPreviewCard
              key={ticket.id}
              ticket={ticket}
              onView={onViewTicket}
              onToggleStatus={onUpdateStatus}
              onDelete={onDeleteTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
};
