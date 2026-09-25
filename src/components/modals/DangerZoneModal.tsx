import React, { useState } from 'react';
import { AlertOctagon, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.tsx';

interface DangerZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DangerZoneModal: React.FC<DangerZoneModalProps> = ({ isOpen, onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const isConfirmed = confirmText === 'DISABLE';

  const handleExecute = () => {
    if (!isConfirmed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Merchant account processing suspended. Re-verification required.', 'error');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-rose-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Halt Payment Processing?</h3>
              <p className="font-mono text-[11px] text-rose-600 font-semibold tracking-wider">CRITICAL LEDGER SUSPENSION</p>
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

        <p className="text-xs text-slate-600 leading-relaxed">
          This will immediately sever connection to NPCI switches, fail all live customer checkouts, revoke all active webhook subscriptions, and lock merchant funds until compliance clearance.
        </p>

        <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <label className="block text-[11px] font-semibold uppercase text-slate-500">
            Type <span className="text-rose-600 font-bold font-mono">"DISABLE"</span> to authorize execution
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="DISABLE"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
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
            type="button"
            disabled={!isConfirmed || loading}
            onClick={handleExecute}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Suspension...' : 'Execute Suspension'}
          </button>
        </div>
      </div>
    </div>
  );
};
