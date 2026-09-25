import React, { useMemo, useState } from 'react';
import { Key, Plus, ShieldCheck, Trash2, X, CheckCircle2, Copy, AlertTriangle } from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface ApiKeysPageProps {
  env: 'TEST' | 'LIVE';
}

type KeyStatus = 'ACTIVE' | 'REVOKED';

interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  environment: 'TEST' | 'LIVE';
  scopes: string[];
  createdAt: string;
  lastUsed: string;
  status: KeyStatus;
}

const INITIAL_KEYS: ApiKeyRecord[] = [
  {
    id: 'key_01',
    name: 'Backend Test Key',
    prefix: 'sk_test_********91ad',
    environment: 'TEST',
    scopes: ['payments:read', 'payments:write'],
    createdAt: 'Sep 18, 2026',
    lastUsed: '12 minutes ago',
    status: 'ACTIVE'
  },
  {
    id: 'key_02',
    name: 'Production Backend',
    prefix: 'sk_live_********82fc',
    environment: 'LIVE',
    scopes: ['payments:read', 'payments:write', 'webhooks:read'],
    createdAt: 'Sep 10, 2026',
    lastUsed: '2 hours ago',
    status: 'ACTIVE'
  }
];

const ALL_SCOPES = ['payments:read', 'payments:write', 'webhooks:read', 'ledger:read'];

export const ApiKeysPage: React.FC<ApiKeysPageProps> = ({ env }) => {
  const { showToast } = useToast();
  const [activeEnv, setActiveEnv] = useState<'TEST' | 'LIVE'>(env);
  const [keys, setKeys] = useState<ApiKeyRecord[]>(INITIAL_KEYS);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('Backend Integration');
  const [newKeyEnv, setNewKeyEnv] = useState<'TEST' | 'LIVE'>(env);
  const [newScopes, setNewScopes] = useState<string[]>(['payments:read', 'payments:write']);
  const [oneTimeSecret, setOneTimeSecret] = useState<string | null>(null);
  const [pendingRevoke, setPendingRevoke] = useState<ApiKeyRecord | null>(null);

  const visibleKeys = useMemo(
    () => keys.filter(key => key.environment === activeEnv),
    [keys, activeEnv]
  );

  const toggleScope = (scope: string) => {
    setNewScopes(current =>
      current.includes(scope) ? current.filter(item => item !== scope) : [...current, scope]
    );
  };

  const createKey = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newKeyName.trim() || newScopes.length === 0) {
      showToast('Provide a key name and at least one scope.', 'error');
      return;
    }

    const suffix = Math.random().toString(36).slice(2, 10);
    const secret = `sk_${newKeyEnv.toLowerCase()}_${suffix}_${Math.random().toString(36).slice(2, 18)}`;
    const record: ApiKeyRecord = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      prefix: `sk_${newKeyEnv.toLowerCase()}_********${suffix.slice(-4)}`,
      environment: newKeyEnv,
      scopes: [...newScopes],
      createdAt: 'Just now',
      lastUsed: 'Never',
      status: 'ACTIVE'
    };

    setKeys(current => [record, ...current]);
    setOneTimeSecret(secret);
    setShowCreate(false);
    setActiveEnv(newKeyEnv);
    showToast('API key created. Copy the secret now; it will not be shown again.', 'success');
  };

  const revokeKey = () => {
    if (!pendingRevoke) return;
    setKeys(current =>
      current.map(key => key.id === pendingRevoke.id ? { ...key, status: 'REVOKED' } : key)
    );
    showToast(`${pendingRevoke.name} revoked.`, 'success');
    setPendingRevoke(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Developer &amp; Ops</span>
            <span>&gt;</span>
            <span className="text-blue-600">API Keys</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">API Keys</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage merchant credentials used to access PayFlow APIs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewKeyEnv(activeEnv);
            setShowCreate(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-1.5 inline-flex gap-1">
        {(['TEST', 'LIVE'] as const).map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => setActiveEnv(mode)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeEnv === mode
                ? mode === 'LIVE'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {activeEnv === 'LIVE' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-900">Production credentials</p>
            <p className="text-xs text-amber-700 mt-0.5">
              LIVE keys can authorize real production requests. Existing secrets are always masked.
            </p>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-white/55 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="px-4 py-3.5">Key Name</th>
                <th className="px-4 py-3.5">Masked Key</th>
                <th className="px-4 py-3.5">Scopes</th>
                <th className="px-4 py-3.5">Created</th>
                <th className="px-4 py-3.5">Last Used</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleKeys.map(key => (
                <tr key={key.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{key.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{key.environment}</div>
                  </td>
                  <td className="px-4 py-4 font-mono font-semibold text-slate-700">{key.prefix}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map(scope => (
                        <span key={scope} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px]">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{key.createdAt}</td>
                  <td className="px-4 py-4 text-slate-600">{key.lastUsed}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full font-semibold text-[10px] ${
                      key.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      disabled={key.status === 'REVOKED'}
                      onClick={() => setPendingRevoke(key)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
              {visibleKeys.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    No {activeEnv} API keys created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel-subtle rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-slate-900">Secret handling</p>
          <p className="text-xs text-slate-500 mt-1">
            Existing secret values are never revealed again. Only the masked prefix is shown after creation.
          </p>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={createKey} className="glass-panel-elevated w-full max-w-lg rounded-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create API Key</h2>
                <p className="text-xs text-slate-500">Choose the minimum scopes required.</p>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key Name</label>
                <input
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Environment</label>
                <select
                  value={newKeyEnv}
                  onChange={e => setNewKeyEnv(e.target.value as 'TEST' | 'LIVE')}
                  className="w-full px-3.5 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="TEST">TEST</option>
                  <option value="LIVE">LIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Scopes</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_SCOPES.map(scope => (
                    <label key={scope} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                      <input
                        type="checkbox"
                        checked={newScopes.includes(scope)}
                        onChange={() => toggleScope(scope)}
                      />
                      {scope}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                Create Key
              </button>
            </div>
          </form>
        </div>
      )}

      {oneTimeSecret && (
        <div className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel-elevated w-full max-w-lg rounded-2xl p-6 animate-in zoom-in-95">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">API Key Created</h2>
            <p className="text-xs text-slate-600 mt-1">
              For security reasons, this secret will only be displayed once. Copy it now and store it securely.
            </p>

            <div className="mt-5 p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs flex items-center justify-between gap-3">
              <span className="break-all">{oneTimeSecret}</span>
              <CopyButton textToCopy={oneTimeSecret} toastLabel="Secret copied" />
            </div>

            <button
              type="button"
              onClick={() => setOneTimeSecret(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {pendingRevoke && (
        <div className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel-elevated w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Revoke API Key?</h2>
            <p className="text-xs text-slate-600 mt-1">
              Applications using <strong>{pendingRevoke.name}</strong> will lose access immediately in this demo state.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPendingRevoke(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold">
                Cancel
              </button>
              <button type="button" onClick={revokeKey} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold">
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
