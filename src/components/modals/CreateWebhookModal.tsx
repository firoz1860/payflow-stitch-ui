import React, { useState } from 'react';
import { Webhook, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.tsx';

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateWebhookModal: React.FC<CreateWebhookModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [url, setUrl] = useState('https://api.acme.in/v1/payflow/webhook');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'payment.captured',
    'payment.failed',
    'payment.refunded'
  ]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const allEvents = [
    'payment.created',
    'payment.pending',
    'payment.captured',
    'payment.failed',
    'payment.refunded',
    'ledger.balanced',
    'payout.initiated',
    'dispute.created'
  ];

  const toggleEvent = (evt: string) => {
    setSelectedEvents(prev =>
      prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Provisioned new webhook endpoint with signing secret whsec_${Math.random().toString(36).substring(2, 10)}`);
      if (onCreated) onCreated();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Create Webhook Endpoint</h3>
              <p className="text-xs text-slate-500">HMAC-SHA256 Encrypted Egress Destination</p>
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
              Destination HTTPS URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Must accept POST requests and respond with 200 OK within 3,000ms.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Subscribed Event Types ({selectedEvents.length})
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50/50">
              {allEvents.map(evt => {
                const checked = selectedEvents.includes(evt);
                return (
                  <label
                    key={evt}
                    className={`flex items-center gap-2 p-2 rounded-md text-xs font-mono cursor-pointer transition-colors ${
                      checked ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEvent(evt)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{evt}</span>
                  </label>
                );
              })}
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
              disabled={loading || selectedEvents.length === 0}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Registering Endpoint...' : 'Provision Endpoint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
