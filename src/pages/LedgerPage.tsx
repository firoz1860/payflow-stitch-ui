import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  CheckCircle2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Lock,
  X,
  Copy,
  ChevronRight,
  TrendingUp,
  Receipt,
  Percent,
  Landmark,
  FileCheck
} from 'lucide-react';
import { LedgerPosting } from '../types/index.ts';
import { MOCK_LEDGER_POSTINGS } from '../services/api.ts';
import { ManualPostingModal } from '../components/modals/ManualPostingModal.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { CopyButton } from '../components/common/CopyButton.tsx';

interface LedgerPageProps {
  onInspectPayment?: (paymentId: string) => void;
  onOpenManualPosting?: () => void;
}

export const LedgerPage: React.FC<LedgerPageProps> = ({
  onInspectPayment,
  onOpenManualPosting
}) => {
  const [postings, setPostings] = useState<LedgerPosting[]>(MOCK_LEDGER_POSTINGS);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Today');
  const [selectedPosting, setSelectedPosting] = useState<LedgerPosting | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const { showToast } = useToast();

  const filteredPostings = postings.filter(p => {
    const matchesType = filterType === 'all' || p.postingType === filterType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.sourceEntity.toLowerCase().includes(q) ||
      p.accountsImpacted.some(a => a.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    showToast('Exporting balanced General Ledger journal to CSV...');
  };

  const handleReconAudit = () => {
    showToast('Reconciliation Audit check: 3,840 postings 100% balanced, 0 delta');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Live Architecture Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
            <span>Platform</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Accounting &amp; Finance</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 font-semibold">Ledger</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Ledger
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold text-blue-700 uppercase">
                Immutable Engine v2.4 Active
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] font-semibold text-emerald-700 uppercase">
                Cryptographic Integrity Verified
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Immutable double-entry financial records and deterministic accounting journal postings.
          </p>
        </div>

        {/* Action Panel */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs border border-slate-200/80 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Journal CSV</span>
          </button>
          <button
            type="button"
            onClick={handleReconAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs border border-slate-200/80 transition-all active:scale-95"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reconciliation Audit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Manual Posting (Admin)</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards (Bento Cluster with Elevated Glass Panels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* 1. GPV */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Payment Volume</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">₹18,42,560.00</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2%</span>
              <span className="text-slate-400 font-mono text-[10px] ml-1">vs yesterday</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-2 border-t border-slate-100">
            <span>1,280 settled captures</span>
            <span className="font-semibold text-blue-600">DR Cleared</span>
          </div>
        </div>

        {/* 2. Merchant Payable Pool */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Merchant Payable Pool</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">₹18,05,708.80</div>
            <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mt-0.5">
              <span>98.0%</span>
              <span className="text-slate-400 font-mono text-[10px] ml-1">of captured pool</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-2 border-t border-slate-100">
            <span>Available for T+0 payout</span>
            <span className="font-semibold text-slate-800">Escrow #2001</span>
          </div>
        </div>

        {/* 3. Fee Revenue (MDR) */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Fee Revenue (MDR)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">₹36,851.20</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2.00%</span>
              <span className="text-slate-400 font-mono text-[10px] ml-1">net blended take</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-2 border-t border-slate-100">
            <span>Earned net margins</span>
            <span className="font-semibold text-emerald-700">Acct #4001</span>
          </div>
        </div>

        {/* 4. Total Postings */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Postings</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">
              3,840 <span className="text-xs text-slate-400 font-normal">entries</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 mt-0.5">
              <span className="text-slate-800 font-semibold">1,280 tx</span>
              <span>× 3 legs</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-2 border-t border-slate-100">
            <span>Zero dropouts</span>
            <span className="font-semibold text-blue-600">Strict Append</span>
          </div>
        </div>

        {/* 5. Ledger Health & Parity */}
        <div className="rounded-2xl bg-gradient-to-br from-white/95 to-blue-50/40 backdrop-blur-xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ledger Health</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              BALANCED
            </span>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Variance</span>
              <span className="font-mono text-xl font-bold text-emerald-700 tracking-tight">₹0.00</span>
            </div>
            <div className="inline-block px-2 py-0.5 rounded bg-white font-mono text-[10px] text-blue-700 font-medium border border-blue-100 mt-1">
              Σ Debits = Σ Credits
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Hash Match
            </span>
            <span className="font-semibold text-slate-800">SHA-256</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filter Bar */}
      <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Segment Pills */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100/80">
            {[
              { id: 'all', label: 'All Postings', count: '3,840' },
              { id: 'PAYMENT_CAPTURE', label: 'Payment Captures' },
              { id: 'REFUND_REVERSAL', label: 'Refund Reversals' },
              { id: 'NODAL_PAYOUT', label: 'Merchant Payouts' },
              { id: 'FEE_ADJUSTMENT', label: 'Fee Adjustments' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === tab.id
                    ? 'bg-white text-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Date Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[280px] flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by Posting ID (post_*), Payment ID, Account..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-lg border border-transparent focus:border-slate-300 outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Preset */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100/80 text-xs">
              {['Today', 'Last 7d', 'Last 30d', 'Custom'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDateRange(d)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    dateRange === d
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* General Ledger Journal Postings Table */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
        {/* Table Header Context Bar */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-heading text-sm font-bold text-slate-900">
              General Ledger Journal Postings
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-semibold">
              Batch 0x93FA-LIVE
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero Asymmetry Verified</span>
            </div>
            <span className="hidden sm:inline">Rounding Rule: Half-Even (Bankers)</span>
          </div>
        </div>

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/60">
                <th className="py-3 px-6">Posting ID</th>
                <th className="py-3 px-4">Source Entity</th>
                <th className="py-3 px-4">Posting Type</th>
                <th className="py-3 px-6">Accounts Impacted</th>
                <th className="py-3 px-4 text-right">Total Debit (DR)</th>
                <th className="py-3 px-4 text-right">Total Credit (CR)</th>
                <th className="py-3 px-4 text-center">Integrity Status</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPostings.map(row => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedPosting(row)}
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-6 font-mono font-bold text-blue-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300 group-hover:text-blue-500 transition-colors">#</span>
                      <span>{row.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        if (onInspectPayment) onInspectPayment(row.sourceEntity);
                      }}
                      className="inline-flex items-center gap-1 font-mono text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-semibold transition-colors"
                    >
                      <span>{row.sourceEntity}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        row.postingType === 'REFUND_REVERSAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                          : row.postingType === 'NODAL_PAYOUT'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200/50'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/50'
                      }`}
                    >
                      {row.postingType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px] flex-wrap">
                      {row.accountsImpacted.map((acct, idx) => (
                        <React.Fragment key={acct}>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            {acct}
                          </span>
                          {idx < row.accountsImpacted.length - 1 && (
                            <span className="text-slate-300">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₹{row.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₹{row.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      BALANCED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {row.createdAt}
                  </td>
                  <td className="py-3.5 px-6 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPosting(row);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-semibold transition-all"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Immutable Guarantee & Pagination */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <p>
              Ledger entries are strictly immutable (append-only). Corrections or disputes are recorded using compensating reversing journal postings.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-slate-500">
            <span>Displaying 1 - 6 of 3,840 postings</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled className="w-7 h-7 rounded bg-white text-slate-300 border border-slate-200 flex items-center justify-center cursor-not-allowed">1</button>
              <button type="button" className="w-7 h-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center">1</button>
              <button type="button" className="w-7 h-7 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition-colors">2</button>
              <button type="button" className="w-7 h-7 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition-colors">3</button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer for 3-Leg Double-Entry Proof (Journal Entry Inspector) */}
      {selectedPosting && (
        <>
          <div
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedPosting(null)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white/95 backdrop-blur-2xl shadow-2xl z-50 border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-slate-400">Journal Entry Inspector</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-emerald-700 font-bold">COMMITTED</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900 mt-1">
                    {selectedPosting.id}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPosting(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60 my-5 text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Source Transaction</span>
                  <div className="font-mono font-bold text-blue-600 mt-0.5">{selectedPosting.sourceEntity}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Entry Intent</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedPosting.postingType}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Committed Timestamp</span>
                  <div className="font-mono text-slate-800 mt-0.5">{selectedPosting.createdAt}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Deterministic Hash</span>
                  <div className="font-mono text-slate-500 truncate mt-0.5" title={selectedPosting.deterministicHash}>
                    {selectedPosting.deterministicHash.substring(0, 16)}...
                  </div>
                </div>
              </div>

              {/* Double-Entry T-Account Breakdown (3 Legs) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-slate-900">
                    T-Account Legs (Double-Entry Balanced)
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-700">
                    DELTA = ₹0.00
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-slate-100 p-2.5 font-mono text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <span className="col-span-6">Account Ledger</span>
                    <span className="col-span-3 text-right">Debit (DR)</span>
                    <span className="col-span-3 text-right">Credit (CR)</span>
                  </div>

                  {selectedPosting.legs.map((leg, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-12 p-3 items-center border-b border-slate-100 ${
                        idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <div className="col-span-6">
                        <p className="font-semibold text-slate-900">{leg.accountCode} • {leg.accountName}</p>
                        <p className="font-mono text-[10px] text-slate-400">{leg.classification}</p>
                      </div>
                      <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                        {leg.debit ? `₹${leg.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                      </div>
                      <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                        {leg.credit ? `₹${leg.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                      </div>
                    </div>
                  ))}

                  {/* Summary Totals Footer */}
                  <div className="grid grid-cols-12 p-3 bg-slate-100/80 font-bold font-mono text-xs text-slate-900">
                    <span className="col-span-6 uppercase text-[11px] text-slate-500">Deterministic Sum</span>
                    <span className="col-span-3 text-right text-blue-600">
                      ₹{selectedPosting.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="col-span-3 text-right text-blue-600">
                      ₹{selectedPosting.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Verification Box */}
              <div className="mt-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Block Parity Chain Verified</span>
                </div>
                <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
                  Previous Hash: {selectedPosting.previousHash}<br />
                  Block Merkle Root: {selectedPosting.merkleRoot}<br />
                  Signature: ECDSA-secp256k1 Verified by Node-Alpha-01
                </p>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPosting(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
              <CopyButton
                iconOnly={false}
                label="Copy Payload JSON"
                textToCopy={JSON.stringify(selectedPosting, null, 2)}
                toastLabel="Ledger Payload copied"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              />
            </div>
          </div>
        </>
      )}

      {/* Manual Posting Creation Modal */}
      <ManualPostingModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSuccess={() => {
          setPostings(MOCK_LEDGER_POSTINGS);
        }}
      />
    </div>
  );
};
