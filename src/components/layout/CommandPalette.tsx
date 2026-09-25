import React, { useState, useEffect } from 'react';
import { Search, CreditCard, BookOpen, Webhook, Activity, Terminal, ArrowRight, X } from 'lucide-react';
import { PageId } from './Sidebar.tsx';
import { MOCK_PAYMENTS, MOCK_LEDGER_POSTINGS } from '../../services/api.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onSelectPayment?: (paymentId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectPayment
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPayments = MOCK_PAYMENTS.filter(
    p =>
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.orderId.toLowerCase().includes(query.toLowerCase()) ||
      p.customer.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPostings = MOCK_LEDGER_POSTINGS.filter(
    l =>
      l.id.toLowerCase().includes(query.toLowerCase()) ||
      l.sourceEntity.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search payments, orders, ledger entries, or navigate..."
            className="w-full bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Pages */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Navigation
            </div>
            <div className="space-y-0.5 mt-1">
              {[
                { name: 'Payment Details (pay_29381bf4)', page: 'payment-details' as PageId, icon: CreditCard },
                { name: 'Payments Overview', page: 'payments' as PageId, icon: CreditCard },
                { name: 'Core Ledger & Journal Entries', page: 'ledger' as PageId, icon: BookOpen },
                { name: 'Analytics & Volume Velocity', page: 'analytics' as PageId, icon: Activity },
                { name: 'System Monitoring & Telemetry', page: 'monitoring' as PageId, icon: Activity },
                { name: 'Webhooks & HMAC-256 Egress', page: 'webhooks' as PageId, icon: Webhook },
                { name: 'Developers & Integration Guide', page: 'developers' as PageId, icon: Terminal }
              ]
                .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
                .map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.page}
                      type="button"
                      onClick={() => {
                        onNavigate(item.page);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        <span>{item.name}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Payments Matching Query */}
          {filteredPayments.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Matching Payments
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredPayments.slice(0, 3).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      if (onSelectPayment) onSelectPayment(p.id);
                      onNavigate('payment-details');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-blue-600">{p.id}</span>
                      <span className="text-slate-500 font-mono text-[11px]">({p.orderId})</span>
                      <span className="text-slate-700 font-medium">• {p.customer.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ledger Postings Matching Query */}
          {filteredPostings.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Matching Ledger Postings
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredPostings.slice(0, 3).map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      onNavigate('ledger');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900">{l.id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px]">
                        {l.postingType}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-700 font-semibold">₹{l.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC or click outside to dismiss</span>
          <span className="font-mono">PayFlow Command Palette</span>
        </div>
      </div>
    </div>
  );
};
