import React, { useState } from 'react';
import {
  Activity,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight
} from 'lucide-react';
import { MOCK_NODES, MOCK_ALERTS } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';

export const MonitoringPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nodes, setNodes] = useState(MOCK_NODES);
  const { showToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Telemetry refreshed from us-east-prod-core cluster');
    }, 700);
  };

  const handleAction = (label: string) => {
    showToast(label);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Platform</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Developer &amp; Ops</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-semibold">Monitoring</span>
          <div className="hidden md:flex items-center ml-2 pl-2 border-l border-slate-200 gap-1.5 font-mono text-[11px] text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>cluster: us-east-prod-core</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-400">Sync rate:</span>
          <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
            1,000ms polling
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            title="Force Refetch"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Header Elevation Block */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                System Monitoring
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-mono font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Real-time health, latency telemetry, message queue backlogs, and database pool saturation across microservices.
            </p>
          </div>

          {/* Action Button Ensemble */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction('Opening Grafana telemetry workspace...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Grafana</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction('Opening Prometheus metric scraper...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Prometheus</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction('Loading incident runbooks...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Incident Runbooks</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction('Configuring PagerDuty alert triggers...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Configure PagerDuty</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Mesh Topology Grid (9 Critical Nodes) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Service Mesh Topology
            </span>
            <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
              9/9 Nodes Online
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Nominal (8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Degraded (1)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {nodes.map(node => (
            <div
              key={node.id}
              className={`rounded-2xl p-5 border transition-all ${
                node.status === 'DEGRADED'
                  ? 'bg-amber-50/70 border-amber-200/80 shadow-xs'
                  : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block mb-0.5">{node.fileOrRoute}</span>
                  <h3 className="font-heading text-sm font-bold text-slate-900">{node.name}</h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    node.status === 'DEGRADED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      node.status === 'DEGRADED' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                    }`}
                  />
                  {node.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">{node.metrics.label1}</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{node.metrics.val1}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">{node.metrics.label2}</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{node.metrics.val2}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">{node.metrics.label3}</div>
                  <div
                    className={`font-mono font-bold mt-0.5 ${
                      node.status === 'DEGRADED' ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {node.metrics.val3}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Metrics & Saturation (2x2 Grid) */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Telemetry Metrics &amp; Saturation
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. End-to-End P95 API Latency */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Edge &amp; Microservice Timing
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  End-to-End P95 API Latency
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous trace across edge, gateway, auth, and ledger commits.
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-slate-900">28.4ms</span>
                <div className="font-mono text-[10px] text-emerald-600 font-semibold">Budget: &lt;150ms</div>
              </div>
            </div>

            {/* SVG Latency Curve */}
            <div className="relative w-full h-40 my-3">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="latencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guides */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" />
                {/* 150ms SLO line */}
                <line x1="0" y1="25" x2="500" y2="25" stroke="#ef4444" strokeDasharray="6 4" strokeWidth="1.5" opacity="0.7" />
                <text x="430" y="20" fill="#ef4444" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">150ms SLO</text>

                {/* Fill */}
                <path
                  d="M 0 135 Q 60 130 110 120 T 210 115 T 310 125 T 390 100 T 440 140 T 500 132 L 500 160 L 0 160 Z"
                  fill="url(#latencyGradient)"
                />
                {/* Path */}
                <path
                  d="M 0 135 Q 60 130 110 120 T 210 115 T 310 125 T 390 100 T 440 140 T 500 132"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="500" cy="132" r="4" fill="#2563eb" />
                <circle cx="500" cy="132" r="8" fill="#2563eb" opacity="0.25" className="animate-ping" />
              </svg>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              <span>06:00 UTC</span>
              <span>08:00 UTC</span>
              <span>10:00 UTC</span>
              <span>Current (12:00 UTC)</span>
            </div>
          </div>

          {/* 2. Ingest Traffic vs Settlement Flow */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Throughput Ingestion
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Ingest Traffic vs Settlement Flow
                </h3>
                <p className="text-xs text-slate-500">
                  Edge requests vs committed double-entry balance executions.
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase font-bold">
                <span className="flex items-center gap-1 text-blue-600">
                  <span className="w-2.5 h-1 bg-blue-600 rounded" /> Gateway
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-1 bg-emerald-600 rounded" /> Payments
                </span>
              </div>
            </div>

            {/* SVG Comparison */}
            <div className="relative w-full h-40 my-3">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                <line x1="0" y1="40" x2="500" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" />

                {/* Gateway Path */}
                <path
                  d="M 0 95 C 70 80, 140 60, 200 70 C 260 80, 320 40, 380 50 C 440 60, 480 35, 500 45"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Settlements Path */}
                <path
                  d="M 0 120 C 70 110, 140 95, 200 102 C 260 110, 320 85, 380 92 C 440 98, 480 78, 500 85"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Gateway: 40.3 req/s</span>
              <span>Ledger: 7.0 tx/s</span>
              <span className="text-emerald-700 font-semibold">Conversion: 98.4%</span>
            </div>
          </div>

          {/* 3. Kafka Consumer Lag & Outbox Drain */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Event Streaming Fabric
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Kafka Consumer Lag &amp; Outbox Drain
                </h3>
                <p className="text-xs text-slate-500">
                  Message partition offsets across transactional settlement topics.
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-emerald-700">12 msgs in queue</span>
                <div className="font-mono text-[10px] text-slate-400">drain rate: 4,800/min</div>
              </div>
            </div>

            {/* Partition Gauges */}
            <div className="grid grid-cols-4 gap-3 my-4">
              {[
                { name: 'Partition 0', count: '2 msgs', pct: 18 },
                { name: 'Partition 1', count: '5 msgs', pct: 35 },
                { name: 'Partition 2', count: '1 msg', pct: 12 },
                { name: 'Partition 3', count: '4 msgs', pct: 28 }
              ].map(p => (
                <div key={p.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400">{p.name}</span>
                  <div className="h-16 flex items-end my-2">
                    <div className="w-full bg-blue-600 rounded-t transition-all" style={{ height: `${p.pct}%` }} />
                  </div>
                  <span className="font-mono font-bold text-slate-900">{p.count}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Transactional Outbox: 0 backlog</span>
              <span className="text-emerald-700 font-semibold">Status: Balanced</span>
            </div>
          </div>

          {/* 4. Connection Pool & JVM Memory Heap */}
          <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Hardware &amp; Resource Allocation
                </span>
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Connection Pool &amp; JVM Memory Heap
                </h3>
                <p className="text-xs text-slate-500">
                  PostgreSQL HikariCP saturation &amp; OpenJDK 21 G1 GC headroom.
                </p>
              </div>
              <Database className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4 my-4 text-xs">
              {/* HikariCP */}
              <div>
                <div className="flex items-center justify-between font-medium mb-1">
                  <span className="text-slate-700">PostgreSQL Pool (HikariCP)</span>
                  <span className="font-mono font-bold text-slate-900">
                    24% <span className="text-slate-400 font-normal">(48 / 200 connections)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              {/* JVM Heap */}
              <div>
                <div className="flex items-center justify-between font-medium mb-1">
                  <span className="text-slate-700">JVM Heap Usage (Ledger &amp; Core)</span>
                  <span className="font-mono font-bold text-slate-900">
                    42% <span className="text-slate-400 font-normal">(1.68GB / 4.0GB)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-slate-500 pt-2 border-t border-slate-100">
              <span>GC Pause: 1.2ms (P99)</span>
              <span className="text-emerald-700 font-semibold">Clean Headroom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts & Incident Triage Panel */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-2xl p-6 border border-white/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Active Alerts &amp; Incident Triage
            </h2>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
              1 Attention Required
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Audited in compliance with SOC2 Type II
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_ALERTS.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors ${
                alert.level === 'WARNING'
                  ? 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-50'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-start gap-3 max-w-3xl">
                {alert.level === 'WARNING' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                ) : alert.level === 'INFO' ? (
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        alert.level === 'WARNING'
                          ? 'bg-amber-200 text-amber-900'
                          : alert.level === 'INFO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {alert.level}
                    </span>
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">{alert.title}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] pt-1">
                    <span>Started {alert.timeAgo}</span>
                    <span>•</span>
                    <span className={alert.status === 'INVESTIGATING' ? 'text-amber-800 font-semibold' : 'text-emerald-700'}>
                      Status: {alert.status}
                    </span>
                    {alert.incidentId && (
                      <>
                        <span>•</span>
                        <span>Incident: {alert.incidentId}</span>
                      </>
                    )}
                    {alert.extraMeta && (
                      <>
                        <span>•</span>
                        <span>{alert.extraMeta}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {alert.level === 'WARNING' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAction('Loading distributed trace for INC-84920...')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    View Trace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('Opening Prometheus provider proxy metrics...')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs transition-colors"
                  >
                    View Metrics
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
