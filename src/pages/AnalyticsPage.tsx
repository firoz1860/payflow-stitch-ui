import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Percent,
  XCircle,
  CreditCard,
  RotateCcw,
  Router,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  ArrowRight,
  QrCode
} from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

interface AnalyticsPageProps {
  onNavigateToLedger?: () => void;
  onInspectPayment?: (id: string) => void;
  onNavigate?: (page: any, paymentId?: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onNavigateToLedger,
  onInspectPayment,
  onNavigate
}) => {
  const [metricMode, setMetricMode] = useState<'volume' | 'count'>('volume');
  const [timeWindow, setTimeWindow] = useState('Last 7 Days');
  const { showToast } = useToast();

  const handleExport = () => {
    showToast('Exporting high-resolution analytics report (PDF/CSV)...');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Live Stream Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Platform</span>
          <span>/</span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Intelligence &amp; Reporting</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Analytics</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-slate-800 font-semibold text-[11px]">Live Stream Active</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400 font-mono text-[11px]">Auto-refresh 30s</span>
        </div>
      </div>

      {/* Header & Temporal Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Payment Analytics
            </h1>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-bold">
              IST +05:30
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Comprehensive volume velocity, conversion funnels, provider routing metrics, and failure diagnostics.
          </p>
        </div>

        {/* Time Window Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          {['Today', 'Last 7 Days', '30 Days', '90 Days'].map(w => (
            <button
              key={w}
              type="button"
              onClick={() => setTimeWindow(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeWindow === w
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {w}
            </button>
          ))}
          <button
            type="button"
            onClick={() => showToast('Opening custom date range picker...')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <span>Custom</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 6-Column KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Gross Volume */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-4 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Gross Volume</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="my-2">
            <div className="font-mono text-xl font-bold text-slate-900">₹18,42,560</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+14.8%</span>
              <span className="text-slate-400 font-normal">vs last week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Successful */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-4 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Successful</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-mono text-xl font-bold text-slate-900">1,196</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <ArrowUp className="w-3 h-3" />
              <span>+9.2%</span>
              <span className="text-slate-400 font-normal">/ 1,280 total</span>
            </div>
          </div>
        </div>

        {/* Card 3: Success Rate */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-4 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Success Rate</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-mono text-xl font-bold text-slate-900">93.4%</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <span>+1.8%</span>
              <span className="text-slate-400 font-normal">improvement</span>
            </div>
          </div>
        </div>

        {/* Card 4: Failed */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-4 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Failed</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-mono text-xl font-bold text-slate-900">84</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <ArrowDown className="w-3 h-3" />
              <span>-12.4%</span>
              <span className="text-slate-400 font-normal">fewer drops</span>
            </div>
          </div>
        </div>

        {/* Card 5: Avg Ticket (APV) */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-4 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Avg Ticket (APV)</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-mono text-xl font-bold text-slate-900">₹2,184</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+4.1%</span>
              <span className="text-slate-400 font-normal">expansion</span>
            </div>
          </div>
        </div>

        {/* Card 6: Refunds */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl p-4 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Refunds</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="font-mono text-xl font-bold text-slate-900">₹12,450</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <span>0.67%</span>
              <span className="text-slate-400 font-normal">healthy ratio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Analytics Section: Volume Curve + Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Volume Over Time (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Payment Volume Over Time
                </h2>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              </div>
              <p className="text-xs text-slate-500">
                Hourly aggregation smoothed to 7-day settlement progression
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 text-xs">
              <button
                type="button"
                onClick={() => setMetricMode('volume')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  metricMode === 'volume'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Volume (INR)
              </button>
              <button
                type="button"
                onClick={() => setMetricMode('count')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  metricMode === 'count'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tx Count
              </button>
            </div>
          </div>

          {/* SVG Vector Visual Area Plot */}
          <div className="relative w-full h-72 my-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 760 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="analyticsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#2563eb" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="analyticsLineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0053db" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Horizontal Guides */}
              <line x1="0" y1="40" x2="760" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="760" y2="100" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="760" y2="160" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="220" x2="760" y2="220" stroke="#e2e8f0" strokeDasharray="4 4" />

              {/* Area Fill */}
              <path
                d="M 30,195 Q 110,180 150,150 T 270,120 T 390,140 T 510,40 T 630,75 T 730,90 L 730,240 L 30,240 Z"
                fill="url(#analyticsAreaGradient)"
              />

              {/* Stroke */}
              <path
                d="M 30,195 Q 110,180 150,150 T 270,120 T 390,140 T 510,40 T 630,75 T 730,90"
                fill="none"
                stroke="url(#analyticsLineStroke)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak Friday Vertical Indicator Line */}
              <line x1="510" y1="40" x2="510" y2="240" stroke="#2563eb" strokeDasharray="3 3" strokeWidth="1.5" />

              {/* Interactive Friday Peak Point */}
              <circle cx="510" cy="40" r="7" fill="#ffffff" stroke="#2563eb" strokeWidth="3" className="animate-pulse" />

              {/* Other Data Nodes */}
              <circle cx="30" cy="195" r="4" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
              <circle cx="150" cy="150" r="4" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
              <circle cx="270" cy="120" r="4" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
              <circle cx="390" cy="140" r="4" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
              <circle cx="630" cy="75" r="4" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
              <circle cx="730" cy="90" r="4" fill="#ffffff" stroke="#004ac6" strokeWidth="2" />
            </svg>

            {/* Floating Glass Tooltip over Friday Peak */}
            <div className="absolute left-[67%] top-3 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 shadow-xl pointer-events-none">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-blue-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                Peak Velocity • Friday
              </div>
              <div className="font-mono text-sm font-bold text-slate-900 mt-0.5">₹4,12,890</div>
              <div className="font-mono text-[10px] text-slate-400">289 transactions settled</div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between items-center text-slate-400 font-mono text-xs pt-2 px-1 border-t border-slate-100">
            <span>Mon (₹1.8L)</span>
            <span>Tue (₹2.4L)</span>
            <span>Wed (₹2.9L)</span>
            <span>Thu (₹2.6L)</span>
            <span className="text-blue-600 font-bold">Fri (₹4.1L)</span>
            <span>Sat (₹3.4L)</span>
            <span>Sun (₹1.2L)</span>
          </div>
        </div>

        {/* Payment Method Distribution Breakdown (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-heading text-lg font-bold text-slate-900">Payment Methods</h2>
              <span className="text-[10px] font-semibold uppercase text-slate-400">By Volume</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Share of processed settlements by channel</p>

            {/* Donut Visualization */}
            <div className="flex items-center justify-center py-2 relative">
              <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="62" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                {/* Net Banking 8% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="18"
                  strokeDasharray="31.1 389.5"
                  strokeDashoffset="-358.4"
                />
                {/* Cards 24% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray="93.5 389.5"
                  strokeDashoffset="-264.9"
                />
                {/* UPI 68% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="18"
                  strokeDasharray="264.9 389.5"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Dominant</span>
                <span className="font-heading text-2xl font-bold text-slate-900">68%</span>
                <span className="font-mono text-xs text-blue-600 font-semibold">UPI Rails</span>
              </div>
            </div>
          </div>

          {/* Itemized List */}
          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">UPI (QR &amp; Intent)</p>
                  <p className="font-mono text-[10px] text-slate-400">68% total share</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <p className="font-bold text-slate-900">₹12,52,940</p>
                <p className="text-[10px] text-emerald-600 font-semibold">98.1% pass</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-semibold text-slate-900">Cards (Credit / Debit)</p>
                  <p className="font-mono text-[10px] text-slate-400">24% total share</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <p className="font-bold text-slate-900">₹4,42,214</p>
                <p className="text-[10px] text-slate-400">89.4% pass</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <div>
                  <p className="font-semibold text-slate-900">Net Banking &amp; Corporate</p>
                  <p className="font-mono text-[10px] text-slate-400">8% total share</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <p className="font-bold text-slate-900">₹1,47,406</p>
                <p className="text-[10px] text-slate-400">94.2% pass</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Diagnostics & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Provider Performance (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-heading text-lg font-bold text-slate-900">Provider Performance</h2>
              <Router className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">Switch routing &amp; gateway telemetry</p>
          </div>

          <div className="space-y-3">
            {/* Provider 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-900">Razorpay Direct Gateway</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  96.2% SLA
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '96.2%' }} />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span>Volume: ₹14.2L routed</span>
                <span className="text-slate-700 font-medium">62ms avg latency</span>
              </div>
            </div>

            {/* Provider 2 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-900">PayFlow Sandbox Node</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  99.8% SLA
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.8%' }} />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span>Volume: High concurrency mock</span>
                <span className="text-slate-700 font-medium">38ms avg latency</span>
              </div>
            </div>

            {/* Provider 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="font-semibold text-slate-900">Fallback Switch Route</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                  91.0% SLA
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '91%' }} />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span>Volume: ₹4.2L fallback</span>
                <span className="text-slate-700 font-medium">140ms avg latency</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200/50 flex items-center justify-between text-blue-700 text-xs">
            <span className="font-medium">Smart Smart-Route V2 Active</span>
            <button
              type="button"
              onClick={() => showToast('Smart Smart-Route V2 failover configuration')}
              className="font-mono font-bold underline"
            >
              Config
            </button>
          </div>
        </div>

        {/* Failure Diagnostics (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-heading text-lg font-bold text-slate-900">Failure Diagnostics</h2>
              <span className="font-mono text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
                84 total drops
              </span>
            </div>
            <p className="text-xs text-slate-500">Categorized dropoff causes across all rails</p>
          </div>

          {/* Horizontal Bar Breakdown */}
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Customer Cancelled / Abandoned</span>
                <span className="font-mono font-bold text-slate-900">42% (35)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Bank Server / NPCI Timeout</span>
                <span className="font-mono font-bold text-rose-600">26% (22)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Insufficient Balance</span>
                <span className="font-mono font-bold text-slate-900">18% (15)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">MPIN Authentication Failed</span>
                <span className="font-mono font-bold text-slate-900">11% (9)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Fraud / Risk Decline</span>
                <span className="font-mono font-bold text-rose-600">3% (3)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-300 h-full rounded-full" style={{ width: '3%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-500">
            <span>Target: &lt; 5.0% Failure Rate</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pass SLA
            </span>
          </div>
        </div>

        {/* Peak Load Heatmap (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-heading text-lg font-bold text-slate-900">Peak Load Heatmap</h2>
              <span className="text-[10px] font-semibold uppercase text-slate-400">24h Velocity</span>
            </div>
            <p className="text-xs text-slate-500">Concentration of payment requests per hour</p>
          </div>

          {/* Micro Bar Heatmap */}
          <div className="h-36 flex items-end justify-between gap-1 pt-4">
            {[
              { h: '00', val: 12 },
              { h: '02', val: 8 },
              { h: '04', val: 15 },
              { h: '06', val: 32 },
              { h: '08', val: 55 },
              { h: '10', val: 72 },
              { h: '12', val: 142, spike: true },
              { h: '14', val: 128, spike: true },
              { h: '16', val: 68 },
              { h: '18', val: 84 },
              { h: '20', val: 178, max: true },
              { h: '22', val: 48 }
            ].map(b => (
              <div key={b.h} className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer">
                {b.max ? (
                  <div className="w-full bg-blue-600 rounded-t h-32 relative shadow-sm">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                      178 tx/h (Max)
                    </span>
                  </div>
                ) : b.spike ? (
                  <div className="w-full bg-blue-500 rounded-t h-24 relative shadow-xs">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                      {b.val} tx/h
                    </span>
                  </div>
                ) : (
                  <div
                    className="w-full bg-slate-200 group-hover:bg-blue-400 rounded-t transition-colors"
                    style={{ height: `${(b.val / 178) * 90}px` }}
                  />
                )}
                <span className={`font-mono text-[9px] ${b.max ? 'font-bold text-blue-600' : 'text-slate-400'}`}>
                  {b.h}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" />
              <span>Spikes: 12-2 PM &amp; 7-9 PM</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">Max: 178 req/m</span>
          </div>
        </div>
      </div>

      {/* Recent High-Value Settlements Table */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Recent High-Value Settlements
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200/50">
                Live Audited
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Individual order execution traces and multi-hop routing paths
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Filtered high value transactions')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter Status</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToLedger}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <span>View All in Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/60">
                <th className="py-3 px-4">Payment Intent &amp; Time</th>
                <th className="py-3 px-4">Channel / Method</th>
                <th className="py-3 px-4">Gateway Route</th>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Row 1 */}
              <tr
                className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                onClick={() => onInspectPayment && onInspectPayment('pay_29381bf4')}
              >
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-blue-600 group-hover:underline">pi_9482fa89bc01</div>
                  <div className="text-[10px] text-slate-400">Just now • 18:42:19 IST</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-900">UPI Intent (GPay)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Razorpay Direct</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-slate-900 font-medium">karan.mehta@okaxis</div>
                  <div className="font-mono text-[10px] text-slate-400">Axis Bank Node</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700">54ms</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ₹14,500.00
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    CAPTURED
                  </span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr
                className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                onClick={() => onInspectPayment && onInspectPayment('pay_29370d99')}
              >
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-blue-600 group-hover:underline">pi_8271dc012a93</div>
                  <div className="text-[10px] text-slate-400">2 mins ago • 18:40:12 IST</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-900">Visa Infinite (3DS)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Razorpay Direct</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-slate-900 font-medium">priya.sharma@corp.in</div>
                  <div className="font-mono text-[10px] text-slate-400">HDFC Credit ••4812</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700">118ms</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ₹32,000.00
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    CAPTURED
                  </span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr
                className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                onClick={() => onInspectPayment && onInspectPayment('pay_29375c88')}
              >
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-blue-600 group-hover:underline">pi_6349ea9902ff</div>
                  <div className="text-[10px] text-slate-400">5 mins ago • 18:37:04 IST</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Net Banking (Corporate)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Fallback Switch</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-slate-900 font-medium">aditya.v@ventureholdings.io</div>
                  <div className="font-mono text-[10px] text-slate-400">ICICI Corporate Desk</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-rose-600 font-semibold">380ms</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ₹78,400.00
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    NPCI_TIMEOUT
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
