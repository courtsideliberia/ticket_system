import React from 'react';
import { BarChart3, Download, FileSpreadsheet, Calendar, DollarSign, Ticket, ShieldCheck } from 'lucide-react';
import { PassTicket } from '../types';

interface ReportsWorkspaceProps {
  tickets: PassTicket[];
}

export const ReportsWorkspace: React.FC<ReportsWorkspaceProps> = ({ tickets }) => {
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.status !== 'refunded' ? t.price : 0), 0);
  const totalValid = tickets.filter((t) => t.status === 'valid' || t.status === 'used').length;
  const totalUsed = tickets.filter((t) => t.status === 'used').length;

  const handleExportCSV = () => {
    const headers = ['ID', 'Ticket Code', 'Holder Name', 'Email', 'Phone', 'Category', 'Price', 'Status', 'Issued At'];
    const rows = tickets.map((t) => [
      t.id,
      t.ticketCode,
      `"${t.holderName}"`,
      t.holderEmail,
      t.holderPhone || '',
      t.category,
      t.price,
      t.status,
      t.issuedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Courtside_Passes_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Executive Financial & Audit Reports
          </h2>
          <p className="text-xs text-slate-400">
            Export official settlement ledgers, attendance CSVs, and audit receipts
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all"
        >
          <Download className="w-4 h-4" /> Download Complete CSV Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total Gross Settlement</p>
          <p className="text-2xl font-bold font-mono text-emerald-400">${totalRevenue.toLocaleString()} USD</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-400 font-mono uppercase">Issued Passes Count</p>
          <p className="text-2xl font-bold font-mono text-white">{totalValid} Passes</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-400 font-mono uppercase">Audited Gate Check-ins</p>
          <p className="text-2xl font-bold font-mono text-blue-400">{totalUsed} Admitted</p>
        </div>
      </div>
    </div>
  );
};
