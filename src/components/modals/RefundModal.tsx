import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.tsx';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
  maxAmount: number;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  paymentId,
  maxAmount
}) => {
  const [amount, setAmount] = useState(maxAmount.toString());
  const [reason, setReason] = useState('Customer Requested Cancellation');
  const [speed, setSpeed] = useState<'instant' | 'normal'>('instant');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Initiated ${speed === 'instant' ? 'Instant UPI' : 'Standard'} refund of ₹${parseFloat(amount).toFixed(2)} for ${paymentId}`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Issue Payment Refund</h3>
              <p className="text-xs text-slate-500 font-mono">Target: {paymentId}</p>
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
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Refund Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm font-bold">₹</span>
              <input
                type="number"
                step="0.01"
                max={maxAmount}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                required
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Max refundable amount: ₹{maxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Reason for Refund
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option>Customer Requested Cancellation</option>
              <option>Duplicate Transaction Detected</option>
              <option>Service Disruption or Non-Delivery</option>
              <option>Fraudulent Order Chargeback Mitigation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Disbursement Speed
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSpeed('instant')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  speed === 'instant'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <p className="font-bold">Instant UPI (T+0)</p>
                <p className="text-[10px] text-slate-500">Credited to customer VPA in &lt;15s</p>
              </button>
              <button
                type="button"
                onClick={() => setSpeed('normal')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  speed === 'normal'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <p className="font-bold">Standard Bank (T+2)</p>
                <p className="text-[10px] text-slate-500">Standard clearing cycle</p>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/60 flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This will create an immutable reversing entry in the double-entry ledger debiting Merchant Payable (Acme #2001) and releasing escrow.
            </p>
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
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting to Gateway...' : 'Authorize Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
