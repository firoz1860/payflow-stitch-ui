import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CreditCard,
  QrCode,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { MOCK_PAYMENTS } from '../services/api.ts';
import { PaymentItem, PaymentStatus } from '../types/index.ts';
import { PageId } from '../components/layout/Sidebar.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface TransactionsPageProps {
  onNavigate: (page: PageId, paymentId?: string) => void;
  onOpenRefund: (paymentId: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  onNavigate,
  onOpenRefund
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(payment => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.payerVpa && payment.payerVpa.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'ALL' || payment.status === selectedStatus;

      const matchesMethod =
        selectedMethod === 'ALL' || payment.method === selectedMethod;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [searchQuery, selectedStatus, selectedMethod]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    showToast('Exporting 24 transactions to CSV (ledger verified)...', 'info');
    setTimeout(() => {
      showToast('PayFlow-Transactions-2024-10.csv generated successfully', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Platform</span>
            <span>&gt;</span>
            <span>Orchestration</span>
            <span>&gt;</span>
            <span className="text-blue-600">Transactions Ledger Ingress</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            Transactions &amp; Payments
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono font-medium">
              {filteredPayments.length} records
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Comprehensive ledger-linked payment records, acquirer trace numbers, and instant refund operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => onNavigate('create-payment')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            New Payment Intent
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Payment ID, Order ID, Customer, or VPA..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CAPTURED">Captured</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Method:</span>
            <select
              value={selectedMethod}
              onChange={e => {
                setSelectedMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">All Methods</option>
              <option value="UPI">UPI (Unified Payments)</option>
              <option value="CARD">Credit/Debit Cards</option>
              <option value="NETBANKING">Netbanking</option>
              <option value="WALLET">Wallets</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Payment ID &amp; Order</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Provider / RRN</th>
                <th className="py-3.5 px-4">Gross Amount</th>
                <th className="py-3.5 px-4">Net Settled</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions match your current filters.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map(payment => (
                  <tr
                    key={payment.id}
                    onClick={() => onNavigate('payment-details', payment.id)}
                    className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  >
                    {/* Payment ID & Order */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {payment.id}
                        </span>
                        <CopyButton textToCopy={payment.id} toastLabel="Payment ID copied" />
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {payment.orderId}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {payment.createdAt.split('·')[0]}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{payment.customer.name}</div>
                      <div className="text-[11px] text-slate-500">{payment.customer.email}</div>
                      <div className="text-[10px] text-slate-400">{payment.customer.phone}</div>
                    </td>

                    {/* Method */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-800 font-medium text-xs">
                        {payment.method === 'UPI' && <QrCode className="w-3.5 h-3.5 text-emerald-600" />}
                        {payment.method === 'CARD' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{payment.method}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-normal">{payment.subMethod}</span>
                      </div>
                      {payment.payerVpa && (
                        <div className="text-[11px] font-mono text-slate-500 mt-1 truncate max-w-[150px]">
                          {payment.payerVpa}
                        </div>
                      )}
                    </td>

                    {/* Provider / RRN */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{payment.provider}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        RRN: {payment.acquirerRrn || 'N/A'}
                      </div>
                    </td>

                    {/* Gross Amount */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">Fee: ₹{payment.fee.toFixed(2)}</div>
                    </td>

                    {/* Net Settled */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-emerald-600 font-mono text-xs">
                        ₹{payment.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">T+1 Auto-batch</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge variant={payment.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={e => e.stopPropagation()}
                      >
                        {payment.status === 'CAPTURED' && (
                          <button
                            onClick={() => onOpenRefund(payment.id)}
                            title="Issue partial or full refund"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onNavigate('payment-details', payment.id)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          Audit
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{' '}
            {filteredPayments.length} entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <span className="px-3 py-1.5 font-semibold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
