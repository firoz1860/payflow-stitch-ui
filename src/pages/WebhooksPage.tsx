import React, { useState } from 'react';
import {
  Webhook,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Copy,
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { MOCK_WEBHOOK_ENDPOINTS, MOCK_WEBHOOK_LOGS, payflowApi } from '../services/api.ts';
import { WebhookEndpoint, WebhookDeliveryLog } from '../types/index.ts';

interface WebhooksPageProps {
  onOpenCreateWebhook: () => void;
}

export const WebhooksPage: React.FC<WebhooksPageProps> = ({ onOpenCreateWebhook }) => {
  const { showToast } = useToast();
  const [endpoints] = useState<WebhookEndpoint[]>(MOCK_WEBHOOK_ENDPOINTS);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>(MOCK_WEBHOOK_LOGS);
  const [selectedLog, setSelectedLog] = useState<WebhookDeliveryLog | null>(null);
  const [replayingId, setReplayingId] = useState<string | null>(null);

  const handleReplay = async (logId: string) => {
    setReplayingId(logId);
    showToast(`Replaying webhook event ${logId}...`, 'info');
    try {
      const res = await payflowApi.replayWebhook(logId);
      if (res.success) {
        showToast(`Webhook delivered successfully! Status: ${res.statusCode} OK`, 'success');
        setLogs(prev =>
          prev.map(l =>
            l.id === logId
              ? { ...l, status: 'DELIVERED', httpStatus: 200, latencyMs: 142 }
              : l
          )
        );
      }
    } catch {
      showToast('Failed to replay webhook event', 'error');
    } finally {
      setReplayingId(null);
    }
  };

  const handleSendPing = (endpointUrl: string) => {
    showToast(`Sending test ping (ping.webhook) to ${endpointUrl}...`, 'info');
    setTimeout(() => {
      showToast('Endpoint responded 200 OK within 118ms', 'success');
    }, 1100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Platform</span>
            <span>&gt;</span>
            <span>Developer &amp; Ops</span>
            <span>&gt;</span>
            <span className="text-blue-600">Webhooks &amp; Event Sinks</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            Webhook Endpoints &amp; Delivery Logs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
              Kafka Event Stream
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time event fan-out with guaranteed at-least-once delivery, exponential backoff retries, and HMAC signing.
          </p>
        </div>

        <button
          onClick={onOpenCreateWebhook}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add Endpoint
        </button>
      </div>

      {/* Configured Endpoints Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Configured Endpoints ({endpoints.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpoints.map(ep => (
            <div
              key={ep.id}
              className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-xs font-semibold text-slate-900">{ep.id}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {ep.environment ?? 'LIVE'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 break-all border border-slate-200/70 mb-3 flex items-center justify-between">
                  <span className="truncate mr-2">{ep.url}</span>
                  <CopyButton textToCopy={ep.url} toastLabel="Endpoint URL copied" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ep.events.map(event => (
                    <span
                      key={event}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-mono"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Secret: whsec_••••••••••••</span>
                <button
                  onClick={() => handleSendPing(ep.url)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg font-medium transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Play className="w-3 h-3" />
                  Test Ping
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Delivery Logs */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Webhook Deliveries</h3>
            <p className="text-xs text-slate-500">Inspecting signed delivery attempts emitted from PayFlow events</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full font-mono text-slate-600">
            {logs.length} deliveries tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Status &amp; Code</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono text-[11px] font-medium">
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] truncate max-w-[200px]">
                    {log.endpointUrl}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.deliveryStatus === 'DELIVERED' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-mono font-semibold text-slate-800">
                        {log.httpStatus || 'ERR'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {log.attempts} / 5
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {log.latencyMs ? `${log.latencyMs}ms` : 'Timeout'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleReplay(log.id)}
                      disabled={replayingId === log.id}
                      className="px-2.5 py-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <RotateCcw className={`w-3 h-3 ${replayingId === log.id ? 'animate-spin' : ''}`} />
                      Replay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
