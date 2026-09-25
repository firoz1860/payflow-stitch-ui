import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  QrCode,
  PlusCircle,
  BookOpen,
  Activity,
  Layers,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { MOCK_PAYMENTS, MOCK_LEDGER_POSTINGS, MOCK_NODES } from '../services/api.ts';
import { PageId } from '../components/layout/Sidebar.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface OverviewPageProps {
  onNavigate: (page: PageId, paymentId?: string) => void;
  onOpenRefund?: (paymentId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');

  const livePayments = MOCK_PAYMENTS.slice(0, 6);
  const totalVolume = MOCK_PAYMENTS.reduce((sum, p) => sum + (p.status === 'CAPTURED' ? p.amount : 0), 0);
  const totalCaptured = MOCK_PAYMENTS.filter(p => p.status === 'CAPTURED').length;
  const successRate = ((totalCaptured / MOCK_PAYMENTS.length) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Platform</span>
            <span>&gt;</span>
            <span className="text-blue-600">Executive Overview</span>
            <span>&gt;</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Cluster Ingest Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Payment Orchestration Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time transaction ingress, zero-drift double-entry balance, and payment gateway routing telemetry.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-100/80 p-1 rounded-xl flex items-center border border-slate-200/80 text-xs font-medium">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === 'today' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month to Date
            </button>
          </div>

          <button
            onClick={() => onNavigate('create-payment')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Create Payment Intent
          </button>

          <button
            onClick={() => onNavigate('qr-payments')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            Dynamic UPI QR
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Settled Volume</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{(totalVolume * 14.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs previous window</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{successRate}%</div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>99.98% Gateway SLA</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Average Ingress Latency</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">142 ms</div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 mt-2">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-14ms optimized routing</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ledger Cryptographic Audit</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">Zero Drift</div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-purple-600 mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% DR = CR Balanced</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Feed & Gateway Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Transaction Stream */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base font-bold text-slate-900">Real-time Ingress Stream</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Auto-updating
                </span>
              </div>
              <button
                onClick={() => onNavigate('transactions')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View all transactions
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ingress Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Transaction</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {livePayments.map(payment => (
                    <tr
                      key={payment.id}
                      onClick={() => onNavigate('payment-details', payment.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {payment.id}
                        </div>
                        <div className="text-[11px] text-slate-400">{payment.createdAt.split('·')[0]}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800">{payment.customer.name}</div>
                        <div className="text-[11px] text-slate-400">{payment.customer.email}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {payment.method === 'UPI' && <QrCode className="w-3 h-3 text-emerald-600" />}
                          {payment.method === 'CARD' && <CreditCard className="w-3 h-3 text-blue-600" />}
                          {payment.method} · {payment.subMethod}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 font-mono">
                          ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-400">Net: ₹{payment.netAmount.toFixed(2)}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge variant={payment.status} />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('payment-details', payment.id);
                          }}
                          className="px-2.5 py-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                        >
                          Audit &gt;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Ledger Sync Strip */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Double-entry ledger sync:</span>
              <span className="font-semibold text-slate-700">100% matched across 3 account legs</span>
            </div>
            <button
              onClick={() => onNavigate('ledger')}
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
            >
              Open Ledger Book
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Gateway Health & Quick Links */}
        <div className="space-y-6">
          {/* Gateway Routing Distribution */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Active Gateway Routing
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Auto-failover on
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">Razorpay (Primary India)</span>
                  <span className="font-mono text-slate-600">68% · 112ms</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">PayFlow Internal Direct UPI</span>
                  <span className="font-mono text-slate-600">24% · 84ms</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">Cashfree (Secondary Failover)</span>
                  <span className="font-mono text-slate-600">8% · 198ms</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Global Circuit Breaker:</span>
              <span className="font-semibold text-emerald-600">Closed (0% tripping)</span>
            </div>
          </div>

          {/* Microservices Node Health Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Microservices Telemetry
              </h3>
              <button
                onClick={() => onNavigate('monitoring')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Inspect cluster
              </button>
            </div>

            <div className="space-y-2.5">
              {MOCK_NODES.slice(0, 3).map(node => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">{node.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{node.fileOrRoute}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-medium text-slate-800">{node.metrics.val1}</div>
                    <div className="text-[10px] text-slate-400">{node.metrics.label1}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('developers')}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Spring Boot SDK &amp; Webhook Guides
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
