import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  PlusCircle,
  QrCode,
  ArrowLeftRight,
  BookOpen,
  Key,
  Webhook,
  BarChart3,
  Terminal,
  Activity,
  Settings,
  HelpCircle,
  Building2,
  ChevronsUpDown,
  ShieldCheck
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'payments'
  | 'payment-details'
  | 'create-payment'
  | 'qr-payments'
  | 'transactions'
  | 'ledger'
  | 'api-keys'
  | 'webhooks'
  | 'analytics'
  | 'developers'
  | 'monitoring'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  env: 'TEST' | 'LIVE';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const isNavActive = (page: PageId) => {
    if (currentPage === page) return true;
    if (page === 'payments' && currentPage === 'payment-details') return true;
    return false;
  };

  const navItemClass = (page: PageId) => {
    const active = isNavActive(page);
    return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;
  };

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 bg-white/80 backdrop-blur-2xl rounded-2xl z-50 flex flex-col border border-white/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100/80">
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 text-left group"
        >
          {/* PayFlow Geometric Logo Mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4h8a4 4 0 0 1 0 8H7" />
              <path d="M12 12l5 8" className="stroke-blue-200" />
            </svg>
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
            PayFlow
          </span>
        </button>
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold tracking-wider">
          v2.4
        </span>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Core Platform */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Platform
          </div>
          <nav className="space-y-0.5">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className={`w-full ${navItemClass('overview')}`}
            >
              <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('payments')}
              className={`w-full ${navItemClass('payments')}`}
            >
              <CreditCard className="w-[18px] h-[18px] shrink-0" />
              <span>Payments</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('create-payment')}
              className={`w-full ${navItemClass('create-payment')}`}
            >
              <PlusCircle className="w-[18px] h-[18px] shrink-0" />
              <span>Create Payment</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('qr-payments')}
              className={`w-full ${navItemClass('qr-payments')}`}
            >
              <QrCode className="w-[18px] h-[18px] shrink-0" />
              <span>QR Payments</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('transactions')}
              className={`w-full ${navItemClass('transactions')}`}
            >
              <ArrowLeftRight className="w-[18px] h-[18px] shrink-0" />
              <span>Transactions</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ledger')}
              className={`w-full ${navItemClass('ledger')}`}
            >
              <BookOpen className="w-[18px] h-[18px] shrink-0" />
              <span>Ledger</span>
            </button>
          </nav>
        </div>

        {/* Developer & Ops */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Developer &amp; Ops
          </div>
          <nav className="space-y-0.5">
            <button
              type="button"
              onClick={() => onNavigate('api-keys')}
              className={`w-full ${navItemClass('api-keys')}`}
            >
              <Key className="w-[18px] h-[18px] shrink-0" />
              <span>API Keys</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('webhooks')}
              className={`w-full ${navItemClass('webhooks')}`}
            >
              <Webhook className="w-[18px] h-[18px] shrink-0" />
              <span>Webhooks</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className={`w-full ${navItemClass('analytics')}`}
            >
              <BarChart3 className="w-[18px] h-[18px] shrink-0" />
              <span>Analytics</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('developers')}
              className={`w-full ${navItemClass('developers')}`}
            >
              <Terminal className="w-[18px] h-[18px] shrink-0" />
              <span>Developers</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('monitoring')}
              className={`w-full ${navItemClass('monitoring')}`}
            >
              <Activity className="w-[18px] h-[18px] shrink-0" />
              <span>Monitoring</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`w-full ${navItemClass('settings')}`}
            >
              <Settings className="w-[18px] h-[18px] shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer System Strip */}
      <div className="p-3 border-t border-slate-100/80 space-y-2 bg-slate-50/50 rounded-b-2xl">
        {/* Help Link */}
        <button
          type="button"
          onClick={() => onNavigate('developers')}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white text-xs font-medium transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help &amp; Documentation</span>
        </button>

        {/* Live Systems Operational Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] font-medium truncate">All systems operational</span>
        </div>

        {/* PCI-DSS Badge */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/70 border border-slate-200/60 text-[11px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-800 leading-tight">PCI-DSS Level 1</p>
              <p className="text-[10px] text-slate-400 leading-tight">SOC2 Type II</p>
            </div>
          </div>
          <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">Active</span>
        </div>

        {/* Active Merchant Organization */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Acme Payments</p>
              <p className="font-mono text-[10px] text-slate-500 truncate">org_8829</p>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
