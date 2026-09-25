import React, { useState } from 'react';
import { BookOpen, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.tsx';

interface ManualPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ManualPostingModal: React.FC<ManualPostingModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [sourceEntity, setSourceEntity] = useState('pay_manual_adjustment');
  const [postingType, setPostingType] = useState<'PAYMENT_CAPTURE' | 'REFUND_REVERSAL' | 'NODAL_PAYOUT' | 'FEE_ADJUSTMENT'>('FEE_ADJUSTMENT');
  const [debitAmount, setDebitAmount] = useState('100.00');
  const [creditAmount, setCreditAmount] = useState('100.00');
  const [description, setDescription] = useState('Manual interchange fee rebate adjustment');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const isBalanced = Math.abs(parseFloat(debitAmount || '0') - parseFloat(creditAmount || '0')) < 0.001;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      showToast('Accounting Equation Violation: Total Debits must equal Total Credits', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Committed immutable journal posting post_${Math.random().toString(36).substring(2, 8)}`);
      if (onSuccess) onSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Create Manual Journal Posting</h3>
              <p className="text-xs text-slate-500">Postgres Ledger Partition • Append-Only Strict Balance</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Source Entity Reference
              </label>
              <input
                type="text"
                value={sourceEntity}
                onChange={e => setSourceEntity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Posting Intent Type
              </label>
              <select
                value={postingType}
                onChange={e => setPostingType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="FEE_ADJUSTMENT">FEE_ADJUSTMENT</option>
                <option value="REFUND_REVERSAL">REFUND_REVERSAL</option>
                <option value="PAYMENT_CAPTURE">PAYMENT_CAPTURE</option>
                <option value="NODAL_PAYOUT">NODAL_PAYOUT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Accounting Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              required
            />
          </div>

          {/* Double-Entry Balancing Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">T-Account Balancing Check</span>
              {isBalanced ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  BALANCED (Δ ₹0.00)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-700 font-semibold bg-rose-100/60 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  UNBALANCED (Δ ₹{Math.abs(parseFloat(debitAmount || '0') - parseFloat(creditAmount || '0')).toFixed(2)})
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-medium text-slate-500 mb-1">
                  DEBIT (DR) • Acct 1001
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={debitAmount}
                    onChange={e => setDebitAmount(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono font-medium text-slate-500 mb-1">
                  CREDIT (CR) • Acct 4001
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={creditAmount}
                    onChange={e => setCreditAmount(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isBalanced}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validating Merkle Chain...' : 'Commit Immutable Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
