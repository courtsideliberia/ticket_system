import React, { useState } from 'react';
import {
  Users,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Ticket,
  ShoppingBag,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Award,
} from 'lucide-react';
import { CustomerRecord, PassTicket, OrderRecord } from '../types';
import { formatCurrency } from '../lib/currency';

interface CustomersWorkspaceProps {
  customers: CustomerRecord[];
  tickets: PassTicket[];
  orders: OrderRecord[];
  onSelectCustomer: (customer: CustomerRecord) => void;
  onSelectTicket: (ticket: PassTicket) => void;
}

export const CustomersWorkspace: React.FC<CustomersWorkspaceProps> = ({
  customers,
  tickets,
  orders,
  onSelectCustomer,
  onSelectTicket,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'cust-1');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  // Customer specific items
  const customerTickets = tickets.filter(
    (t) => (t.holderEmail || '').toLowerCase() === selectedCustomer?.email.toLowerCase()
  );
  const customerOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === selectedCustomer?.email.toLowerCase()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> Customer Profiles & History Directory
          </h2>
          <p className="text-xs text-slate-400">
            360-degree customer record with orders, passes, attendance, and notes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Directory List */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredCustomers.map((c) => {
              const isSelected = c.id === selectedCustomerId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-xs shrink-0">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{c.email}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer 360 Profile Panel */}
        {selectedCustomer && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Profile Summary */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-white">
                      {selectedCustomer.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-purple-400" /> {selectedCustomer.email}
                      </span>
                      {selectedCustomer.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-purple-400" /> {selectedCustomer.phone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold self-start sm:self-auto">
                  Joined {selectedCustomer.joinedAt}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Total Orders</p>
                  <p className="text-lg font-bold font-mono text-white mt-0.5">
                    {customerOrders.length || selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Total Lifetime Spent</p>
                  <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ${selectedCustomer.totalSpent} USD
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Passes Issued</p>
                  <p className="text-lg font-bold font-mono text-blue-400 mt-0.5">
                    {customerTickets.length || selectedCustomer.ticketsCount}
                  </p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{selectedCustomer.notes}</span>
                </div>
              )}
            </div>

            {/* Issued Passes */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-400" /> Issued Passes & Tickets ({customerTickets.length})
              </h4>
              <div className="space-y-2">
                {customerTickets.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No passes found for this customer email.</p>
                ) : (
                  customerTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTicket(t)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-blue-500/40 transition-all text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{t.eventName}</p>
                        <p className="text-[10px] font-mono text-blue-400">{t.ticketCode}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                        {formatCurrency(t.price, t.currency)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
