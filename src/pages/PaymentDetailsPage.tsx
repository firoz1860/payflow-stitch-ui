import React, { useState } from 'react';
import {
  CreditCard,
  ChevronRight,
  History,
  Download,
  Repeat,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  ShoppingBag,
  User,
  Check,
  Share2,
  Network,
  Webhook as WebhookIcon,
  RotateCcw
} from 'lucide-react';
import { PaymentItem } from '../types/index.ts';
import { MOCK_AUDIT_TRAIL, MOCK_PAYMENTS } from '../services/api.ts';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { RefundModal } from '../components/modals/RefundModal.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface PaymentDetailsPageProps {
  paymentId?: string;
  onNavigateToPayments?: () => void;
  onNavigateToLedger?: () => void;
  onNavigate?: (page: any, paymentId?: string) => void;
  onOpenRefund?: (paymentId: string, amount?: number) => void;
}

export const PaymentDetailsPage: React.FC<PaymentDetailsPageProps> = ({
  paymentId = 'pay_29381bf4',
  onNavigateToPayments,
  onNavigateToLedger,
  onNavigate,
  onOpenRefund
}) => {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const { showToast } = useToast();

  const payment: PaymentItem =
    MOCK_PAYMENTS.find(p => p.id === paymentId) || MOCK_PAYMENTS[0];

  const handleAction = (msg: string) => {
    showToast(msg);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Breadcrumb & Global Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-1.5 flex-wrap text-sm">
          <button
            type="button"
            onClick={onNavigateToPayments}
            className="text-slate-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="font-mono text-xs text-slate-800 bg-slate-100/90 px-2 py-0.5 rounded-md font-semibold">
            {payment.id}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-900 font-semibold">Details</span>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsRefundModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs border border-slate-200/80 transition-all active:scale-95"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Issue Refund</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction('Generating cryptographically signed GST tax invoice...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs border border-slate-200/80 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Receipt &amp; Tax Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction('Republishing event to active webhook subscriber...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs border border-slate-200/80 transition-all active:scale-95"
          >
            <Repeat className="w-3.5 h-3.5 text-slate-500" />
            <span>Resend Webhook</span>
          </button>
          <a
            href="https://dashboard.razorpay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <span>View in Razorpay</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Primary Payment Summary Header Hero Card */}
      <div className="w-full rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-blue-50/50 via-white/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-4">
          {/* Title Row with Identifier and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight">
                {payment.id}
              </span>
              <CopyButton textToCopy={payment.id} toastLabel="Payment ID copied" />

              <StatusBadge status={payment.status} />

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-medium">
                <span>{payment.env} · SETTLED</span>
              </div>
            </div>

            {/* Tabular Amount Hero Display */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Gross Amount Settled
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
                  ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">{payment.currency}</span>
              </div>
            </div>
          </div>

          {/* Financial & Customer Attribute Sub-strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-slate-600 text-xs font-medium border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{payment.createdAt}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Settled via <strong className="text-slate-900 font-semibold">{payment.provider} Direct</strong>
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              <span>Merchant Order:</span>
              <span className="font-mono font-semibold text-blue-600 flex items-center gap-0.5">
                {payment.orderId}
                <CopyButton textToCopy={payment.orderId} toastLabel="Order ID copied" />
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold">{payment.customer.name}</span>
              <span className="text-slate-400">({payment.customer.email} · {payment.customer.phone})</span>
            </div>
          </div>

          {/* Idempotency & Cryptographic Verification Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-500 font-medium shrink-0">Idempotency Key:</span>
              <span className="font-mono text-slate-800 font-semibold truncate">{payment.idempotencyKey}</span>
              <CopyButton textToCopy={payment.idempotencyKey} toastLabel="Idempotency Key copied" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200/50">
                0 COLLISION RISK
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                HMAC SHA-256 SIGNED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workbench: 65% Primary, 35% Inspector Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT MAIN COLUMN (8 cols / 66.6%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. FINANCIAL SUMMARY & ROUTING BENTO CARD */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Financial Summary &amp; Routing
                  </h2>
                  <p className="text-xs text-slate-500">
                    Breakdown of gross transaction value, merchant receivables, and settlement gateway fees
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200/50">
                RECONCILED
              </span>
            </div>

            {/* 3-Column Financial Metrics Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100 my-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-slate-400">Gross Collected</span>
                <span className="font-mono text-xl font-bold text-slate-900 mt-0.5">
                  ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">100% Client Charge</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-slate-400">PayFlow + Gateway Fee</span>
                <span className="font-mono text-xl font-bold text-slate-900 mt-0.5">
                  ₹{payment.fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">2.0% Flat MDR (incl. 18% GST)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-slate-400">Net Payable to Merchant</span>
                <span className="font-mono text-xl font-bold text-blue-600 mt-0.5">
                  ₹{payment.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">Scheduled T+1 Payout</span>
              </div>
            </div>

            {/* Structured Key-Value Attribute Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Payment Method</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100/70 text-blue-700 font-mono text-[10px] font-bold">
                    UPI INTENT
                  </span>
                  <span className="font-semibold text-slate-900">{payment.subMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Payer VPA</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-semibold text-slate-800">{payment.payerVpa}</span>
                  <CopyButton textToCopy={payment.payerVpa || ''} toastLabel="Payer VPA copied" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Gateway Provider</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-900">{payment.provider}</span>
                  <span className="font-mono text-[10px] text-slate-400">(Direct Route)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Gateway Payment ID</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-medium text-slate-800">{payment.providerPaymentId}</span>
                  <CopyButton textToCopy={payment.providerPaymentId} toastLabel="Gateway ID copied" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Acquirer RRN / Ref</span>
                <span className="font-mono font-semibold text-slate-900">{payment.acquirerRrn}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Settlement Currency</span>
                <span className="font-semibold text-slate-900">INR (₹ Indian Rupee)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Risk Score</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200/40">
                    {payment.riskScore} / 100
                  </span>
                  <span className="text-emerald-700 font-medium">{payment.riskVerdict}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">Checkout Flow</span>
                <span className="text-slate-800 font-medium">Dynamic QR / Mobile DeepLink</span>
              </div>
            </div>
          </div>

          {/* 2. DISTRIBUTED LIFECYCLE AUDIT TRAIL */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Network className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Distributed Lifecycle Audit Trail
                  </h2>
                  <p className="text-xs text-slate-500">
                    Trace propagation across microservices with microsecond latency stamps
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Trace Root:</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200/50">
                  trace_9f82a17cb420
                </span>
                <CopyButton textToCopy="trace_9f82a17cb420" toastLabel="Trace ID copied" />
              </div>
            </div>

            {/* Stepped Timeline */}
            <div className="relative pl-6 space-y-6 pt-6 before:absolute before:left-[11px] before:top-8 before:bottom-3 before:w-[2px] before:bg-slate-200">
              {MOCK_AUDIT_TRAIL.map(step => (
                <div key={step.id} className="relative group">
                  {/* Step Dot */}
                  <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-white flex items-center justify-center ring-4 ring-white">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{step.title}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-medium">
                          {step.service}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 font-medium">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. DOUBLE-ENTRY LEDGER POSTINGS (ACCOUNTING FIDELITY) */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg font-bold text-slate-900">
                      Double-Entry Ledger Postings
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200/50">
                      <Check className="w-3 h-3" />
                      BALANCED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ref: <span className="font-mono font-semibold text-slate-800">TXN_POST_8920194</span> · Balanced at 10:22:10 IST · Cryptographically Hash Verified
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAction('Exporting complete ledger posting to CSV...')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Ledger</span>
              </button>
            </div>

            {/* Tabular Journal Table */}
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200/70 mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="px-4 py-3">Account / Subledger</th>
                    <th className="px-4 py-3 text-right">Debit (Dr)</th>
                    <th className="px-4 py-3 text-right">Credit (Cr)</th>
                    <th className="px-4 py-3">Accounting Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">1001 · Payment Clearing Pool</p>
                      <p className="font-mono text-[11px] text-slate-400">Asset Account (Razorpay Node)</p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹2,499.00
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                    <td className="px-4 py-3 text-slate-500">
                      Inflow from Razorpay instant UPI switch settlement
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">2001 · Merchant Payable</p>
                      <p className="font-mono text-[11px] text-slate-400">Liability (Acme India org_8829)</p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹2,449.00
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      Available for next automated merchant payout cycle
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">4001 · PayFlow Platform Revenue</p>
                      <p className="font-mono text-[11px] text-slate-400">Revenue / Processing Fee</p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹50.00
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      2.0% MDR + platform processing fee recognized
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 text-slate-900 font-bold border-t-2 border-slate-200">
                    <td className="px-4 py-3 uppercase tracking-wider font-mono text-[11px] text-slate-500">
                      Journal Totals
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600 text-sm">
                      ₹2,499.00
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600 text-sm">
                      ₹2,499.00
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-emerald-700">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Net Variance: ₹0.00
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payout Window Timeline Badge */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>
                  Settlement Eligibility: <strong className="text-slate-900">Eligible for Instant Settlement</strong> or Default T+1 Cycle
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                Expected Payout: Tomorrow 08:00 AM IST
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT INSPECTOR RAIL (4 cols / 33.3%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. PROVIDER TELEMETRY */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <h3 className="font-heading text-sm font-bold text-slate-900">Provider Telemetry</h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50">
                312ms LATENCY
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Provider Rail</span>
                <span className="font-semibold text-slate-900">Razorpay Direct (Node #4)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Network Ref (RRN)</span>
                <span className="font-mono text-slate-900 font-semibold">{payment.acquirerRrn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payer VPA / Virtual</span>
                <span className="font-mono text-slate-900 truncate max-w-[170px]" title={payment.payerVpa}>
                  {payment.payerVpa}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Auth Authorization Code</span>
                <span className="font-mono text-slate-900">APPR_789102</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Settlement Protocol</span>
                <span className="font-semibold text-slate-900">{payment.settlementProtocol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Source IP &amp; Geolocation</span>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="text-slate-900">{payment.sourceIp}</span>
                  <span className="text-slate-400">({payment.location})</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. WEBHOOK & EVENT DISPATCH */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <WebhookIcon className="w-4 h-4 text-blue-600" />
                <h3 className="font-heading text-sm font-bold text-slate-900">Webhook Dispatch</h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50">
                1 / 1 DELIVERED
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Triggered Event</span>
                <span className="font-mono font-semibold text-blue-600">payment.captured</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">HTTP Response</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">200 OK</span>
                  <span className="text-slate-400 text-[11px]">84ms</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Destination Endpoint</span>
                <div className="font-mono text-[11px] text-slate-800 p-2 rounded-lg bg-slate-50 border border-slate-200/70 truncate">
                  https://api.acme.in/webhooks/payflow
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Timestamp</span>
                <span className="font-mono text-slate-800 text-[11px]">10:22:09.340 IST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Signature</span>
                <span className="font-mono text-slate-400 text-[11px]">sha256=9b72a81...</span>
              </div>

              {/* Raw Payload Preview with Copy */}
              <div className="pt-1">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Payload (application/json)
                  </span>
                  <CopyButton
                    iconOnly={false}
                    label="Copy JSON"
                    textToCopy={JSON.stringify({
                      id: payment.id,
                      entity: 'payment',
                      amount: 249900,
                      currency: 'INR',
                      status: 'captured',
                      order_id: payment.orderId,
                      method: 'upi',
                      vpa: payment.payerVpa,
                      fee: 5000,
                      tax: 762,
                      created_at: 1729745464
                    }, null, 2)}
                    toastLabel="Webhook Payload copied"
                  />
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
{`{
  "id": "${payment.id}",
  "entity": "payment",
  "amount": 249900,
  "currency": "INR",
  "status": "captured",
  "order_id": "${payment.orderId}",
  "method": "upi",
  "vpa": "${payment.payerVpa}",
  "fee": 5000,
  "tax": 762,
  "created_at": 1729745464
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* 3. EXECUTION ATTEMPTS & RETRIES */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h3 className="font-heading text-sm font-bold text-slate-900">Execution Attempts</h3>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                0 RETRIES
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono text-xs">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Attempt #1 · UPI Intent</p>
                  <p className="font-mono text-[11px] text-slate-400">10:21:04 IST</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                SUCCESS
              </span>
            </div>
          </div>

          {/* 4. CUSTOMER PROFILE & METRICS */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-5 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-heading text-sm font-bold text-slate-900">Customer Profile</h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                {payment.customer.id}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                RS
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{payment.customer.name}</p>
                <p className="text-xs text-slate-500 truncate">{payment.customer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/50 flex flex-col">
                <span className="text-[11px] text-slate-400">Lifetime Spend</span>
                <span className="font-mono text-base font-bold text-slate-900 mt-0.5">
                  ₹{payment.customer.lifetimeSpend.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{payment.customer.totalOrders} total orders</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/50 flex flex-col">
                <span className="text-[11px] text-slate-400">Dispute Rate</span>
                <span className="font-mono text-base font-bold text-emerald-600 mt-0.5">
                  {payment.customer.disputeRate}
                </span>
                <span className="text-[10px] text-emerald-600 mt-0.5">Zero chargebacks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        paymentId={payment.id}
        maxAmount={payment.amount}
      />
    </div>
  );
};
