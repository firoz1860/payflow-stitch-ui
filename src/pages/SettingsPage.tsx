import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  Server,
  Layers,
  Clock,
  AlertTriangle,
  RotateCcw,
  Check,
  Copy,
  Eye,
  EyeOff,
  Save,
  Trash2
} from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface SettingsPageProps {
  onOpenDangerZone: () => void;
  env: 'TEST' | 'LIVE';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenDangerZone, env }) => {
  const { showToast } = useToast();

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [razorpayWeight, setRazorpayWeight] = useState(70);
  const [payflowDirectWeight, setPayflowDirectWeight] = useState(25);
  const [sandboxWeight, setSandboxWeight] = useState(5);
  const [idempotencyTtlHours, setIdempotencyTtlHours] = useState(48);
  const [enableCircuitBreaker, setEnableCircuitBreaker] = useState(true);
  const [slackAlertWebhook, setSlackAlertWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');

  const handleSaveRouting = (e: React.FormEvent) => {
    e.preventDefault();
    if (razorpayWeight + payflowDirectWeight + sandboxWeight !== 100) {
      showToast('Gateway weights must sum up to exactly 100%', 'error');
      return;
    }
    showToast('Gateway routing weights updated and synced across ingress clusters', 'success');
  };

  const handleRollKey = () => {
    showToast('Create or rotate keys from the dedicated API Keys page. Existing secrets are never revealed.', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <span>Platform</span>
          <span>&gt;</span>
          <span>System</span>
          <span>&gt;</span>
          <span className="text-blue-600">Settings &amp; Gateway Configuration</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          Organization Settings &amp; Security Keys
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          API credentials, gateway distribution rules, ledger posting policies, and security credentials.
        </p>
      </div>

      {/* API Keys Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              API Key Credentials ({env} Environment)
            </h2>
            <p className="text-xs text-slate-500">Authenticate API Gateway calls from your Spring Boot microservices</p>
          </div>
          <button
            onClick={handleRollKey}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Roll Key Pair
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Publishable Key (Client-side)</label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-900 flex items-center justify-between">
              <span>pk_{env.toLowerCase()}_882910_payflow_public</span>
              <CopyButton textToCopy={`pk_${env.toLowerCase()}_882910_payflow_public`} toastLabel="Public key copied" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secret Key (Server-side)</label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-900 flex items-center justify-between">
              <span>{'sk_' + env.toLowerCase() + '_••••••••••••••••••••••••••••82fc'}</span>
              <span className="text-[10px] text-slate-400">Existing secrets stay masked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Routing Configuration Card */}
      <form
        onSubmit={handleSaveRouting}
        className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Dynamic Gateway Traffic Allocation
            </h2>
            <p className="text-xs text-slate-500">Configure split weight distribution for automatic payment routing</p>
          </div>
          <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Total: {razorpayWeight + payflowDirectWeight + sandboxWeight}%
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Razorpay India (Primary Acquirer)</span>
              <span className="font-mono">{razorpayWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={razorpayWeight}
              onChange={e => setRazorpayWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>Stripe</span>
              <span className="font-mono">{payflowDirectWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={payflowDirectWeight}
              onChange={e => setPayflowDirectWeight(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
              <span>PayFlow Sandbox</span>
              <span className="font-mono">{sandboxWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sandboxWeight}
              onChange={e => setSandboxWeight(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/25 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Routing Allocation
          </button>
        </div>
      </form>

      {/* Idempotency & Ledger Policies Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          Idempotency &amp; Ledger Policies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Idempotency Cache TTL (Hours)
            </label>
            <input
              type="number"
              value={idempotencyTtlHours}
              onChange={e => setIdempotencyTtlHours(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-[11px] text-slate-400 mt-1">Recommended: 48h for card and UPI transactions</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Automated Circuit Breaker
            </label>
            <div className="flex items-center gap-3 mt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCircuitBreaker}
                  onChange={e => setEnableCircuitBreaker(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Trip when provider error rate exceeds the configured threshold
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Administrative Danger Zone
          </h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Flush redis cache, regenerate all client tokens, or purge sandbox transactions.
          </p>
        </div>

        <button
          onClick={onOpenDangerZone}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          Open Danger Zone
        </button>
      </div>
    </div>
  );
};
