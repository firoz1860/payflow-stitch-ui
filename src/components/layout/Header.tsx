import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Bell,
  ChevronDown,
  User,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { PageId } from './Sidebar.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface HeaderProps {
  env: 'TEST' | 'LIVE';
  onToggleEnv: (mode: 'TEST' | 'LIVE') => void;
  onOpenCommandPalette: () => void;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  env,
  onToggleEnv,
  onOpenCommandPalette,
  onNavigate
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const { showToast } = useToast();

  const notifications = [
    {
      id: '1',
      title: 'Settlement Cleared',
      desc: '₹2,499.00 settled via Razorpay Direct (RRN 429810294812)',
      time: '12m ago',
      type: 'success'
    },
    {
      id: '2',
      title: 'High Latency Detected',
      desc: 'Provider Proxy node reported P95 spike of 182ms',
      time: '24m ago',
      type: 'warning'
    },
    {
      id: '3',
      title: 'Ledger Audit Passed',
      desc: 'Double-entry cryptographic hash chain validated',
      time: '1h ago',
      type: 'info'
    }
  ];

  return (
    <header className="fixed top-4 right-4 left-4 lg:left-[18rem] h-16 bg-white/80 backdrop-blur-2xl rounded-2xl z-40 flex items-center justify-between px-6 border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
      {/* Left: Organization & Global Quick Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-2xl">
        <select
          aria-label="Mobile navigation"
          defaultValue=""
          onChange={e => {
            if (e.target.value) onNavigate(e.target.value as PageId);
            e.currentTarget.value = '';
          }}
          className="lg:hidden max-w-[120px] px-2 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-700"
        >
          <option value="" disabled>Navigate</option>
          <option value="overview">Overview</option>
          <option value="payments">Payments</option>
          <option value="create-payment">Create Payment</option>
          <option value="qr-payments">QR Payments</option>
          <option value="transactions">Transactions</option>
          <option value="ledger">Ledger</option>
          <option value="api-keys">API Keys</option>
          <option value="webhooks">Webhooks</option>
          <option value="analytics">Analytics</option>
          <option value="monitoring">Monitoring</option>
          <option value="developers">Developers</option>
          <option value="settings">Settings</option>
        </select>
        {/* Org Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 transition-colors text-left"
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[170px]">
                Acme Retail India Pvt Ltd
              </span>
              <span className="font-mono text-[10px] text-slate-500">org_8829</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showOrgMenu && (
            <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase text-slate-400">
                Switch Organization
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowOrgMenu(false);
                  showToast('Switched to Acme Retail India Pvt Ltd');
                }}
                className="w-full text-left p-2 rounded-lg bg-blue-50 text-blue-900 text-xs font-medium flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">Acme Retail India Pvt Ltd</p>
                  <p className="font-mono text-[10px] text-blue-600">org_8829 (Production)</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOrgMenu(false);
                  showToast('Switched to Acme Sandbox Staging');
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors mt-1"
              >
                <p className="font-semibold">Acme Sandbox Staging</p>
                <p className="font-mono text-[10px] text-slate-400">org_8829_stage</p>
              </button>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden sm:block">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/60 text-slate-500 text-xs transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search payments, orders, keys, traces...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-500 font-mono text-[10px] font-semibold border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Environment Toggle Pill */}
        <div className="flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/60">
          <button
            type="button"
            onClick={() => onToggleEnv('TEST')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
              env === 'TEST'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {env === 'TEST' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            <span>TEST</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleEnv('LIVE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
              env === 'LIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {env === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            <span>LIVE</span>
          </button>
        </div>

        {/* Docs Button */}
        <button
          type="button"
          onClick={() => onNavigate('developers')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Docs</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pt-1">
                {notifications.map(n => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-start gap-2">
                      {n.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900 leading-tight">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">Firoz A.</span>
            <span className="font-mono text-[10px] text-slate-500">Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
};
