import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CreditCard,
  Phone,
  Mail,
  User,
  Ticket,
  Printer,
  RotateCcw,
  Clock,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  FileText,
} from 'lucide-react';
import { OrderRecord, PassTicket } from '../types';

interface OrdersWorkspaceProps {
  orders: OrderRecord[];
  tickets: PassTicket[];
  onSelectOrder: (order: OrderRecord) => void;
  onSelectTicket: (ticket: PassTicket) => void;
}

export const OrdersWorkspace: React.FC<OrdersWorkspaceProps> = ({
  orders,
  tickets,
  onSelectOrder,
  onSelectTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    const s = searchTerm.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(s) ||
      o.customerName.toLowerCase().includes(s) ||
      o.customerEmail.toLowerCase().includes(s) ||
      o.paymentMethod.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" /> Order-Centered Ledger ({filteredOrders.length})
          </h2>
          <p className="text-xs text-slate-400">
            Track multi-pass purchases, payment channels, and settlement invoices
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by ID, customer name, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">All Order Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending Settlement</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders List Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
            No orders found matching search criteria.
          </div>
        ) : (
          filteredOrders.map((order) => {
            // Find tickets associated with this order
            const orderTicketObjects = tickets.filter(
              (t) => t.orderId === order.id || order.ticketCodes.includes(t.ticketCode)
            );

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all space-y-4 shadow-xl group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-blue-400 text-xs">
                      ORD
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-400">
                        {order.orderNumber}
                      </span>
                      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                        {order.customerName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold uppercase">
                      {order.status}
                    </span>
                    <span className="font-bold font-mono text-lg text-emerald-400">
                      ${order.totalAmount} {order.currency}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Contact Info</p>
                    <p className="text-slate-200 font-medium truncate">{order.customerEmail}</p>
                    <p className="text-slate-400">{order.customerPhone || 'No phone'}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Payment Channel</p>
                    <p className="text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" /> {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-mono">Timestamp & Date</p>
                    <p className="text-slate-200 font-mono">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Included Ticket Passes */}
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    Order Items ({order.ticketCount} passes)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.ticketCodes.map((code) => (
                      <span
                        key={code}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-blue-400 font-mono text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <Ticket className="w-3 h-3 text-slate-500" /> {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
