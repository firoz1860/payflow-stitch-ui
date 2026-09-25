import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Share2,
  Copy,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Zap
} from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { PageId } from '../components/layout/Sidebar.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { MOCK_PAYMENTS } from '../services/api.ts';

interface QrPaymentsPageProps {
  onNavigate: (page: PageId, paymentId?: string) => void;
}

export const QrPaymentsPage: React.FC<QrPaymentsPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const [amount, setAmount] = useState('1499.00');
  const [description, setDescription] = useState('Order #ORD-8829 - Coffee & Bakery');
  const [merchantVpa] = useState('payflow.acme@hdfcbank');
  const [status, setStatus] = useState<'PENDING' | 'CAPTURED' | 'FAILED'>('PENDING');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [activePaymentId, setActivePaymentId] = useState(`pay_qr_${Math.random().toString(36).substring(2, 9)}`);

  // UPI Deep link standard format
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(merchantVpa)}&pn=${encodeURIComponent('PayFlow Acme Store')}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;

  // Expiry countdown timer
  useEffect(() => {
    if (status !== 'PENDING') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    showToast('Simulating customer UPI App authorization...', 'info');
    setTimeout(() => {
      setStatus('CAPTURED');
      showToast(`Payment of ₹${amount} received from priya.nair@okhdfcbank!`, 'success');

      // Add to session payments
      MOCK_PAYMENTS.unshift({
        id: activePaymentId,
        orderId: `ord_qr_${Math.floor(1000 + Math.random() * 9000)}`,
        amount: parseFloat(amount),
        fee: Math.round(parseFloat(amount) * 0.015),
        netAmount: parseFloat(amount) - Math.round(parseFloat(amount) * 0.015),
        currency: 'INR',
        status: 'CAPTURED',
        env: 'LIVE',
        method: 'UPI',
        subMethod: 'BharatQR Dynamic',
        payerVpa: 'priya.nair@okhdfcbank',
        provider: 'PayFlow Sandbox',
        providerPaymentId: `sandbox_${Math.random().toString(36).substring(2, 10)}`,
        acquirerRrn: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        riskScore: 6,
        riskVerdict: 'Auto-Approved (Low)',
        createdAt: 'Just now · Oct 24, 2024',
        customer: {
          id: 'cust_priya99',
          name: 'Priya Nair',
          email: 'priya.nair@gmail.com',
          phone: '+91 99887 76655',
          lifetimeSpend: parseFloat(amount),
          disputeRate: '0.00%',
          totalOrders: 1
        },
        idempotencyKey: `idem_qr_${Date.now()}`,
        settlementProtocol: 'Provider-confirmed UPI',
        sourceIp: '157.34.12.8',
        location: 'Mumbai, IN'
      });
    }, 1500);
  };

  const handleSimulateFailure = () => {
    showToast('Simulating provider-declined QR payment...', 'info');
    setTimeout(() => {
      setStatus('FAILED');
      showToast('Provider reported the payment as failed.', 'error');
    }, 900);
  };

  const handleResetQR = () => {
    setStatus('PENDING');
    setTimeLeft(300);
    setActivePaymentId(`pay_qr_${Math.random().toString(36).substring(2, 9)}`);
    showToast('New dynamic QR generated with fresh 5-minute TTL', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Platform</span>
            <span>&gt;</span>
            <span>Payments</span>
            <span>&gt;</span>
            <span className="text-blue-600">Dynamic BharatQR Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            Dynamic UPI &amp; BharatQR Generator
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
              Provider-confirmed QR
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Generate a fixed-amount UPI QR and keep the payment pending until a verified provider event confirms the result.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetQR}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generate New QR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              QR Parameters
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Amount to Collect (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    disabled={status === 'CAPTURED'}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Order Note / Reference
                </label>
                <input
                  type="text"
                  disabled={status === 'CAPTURED'}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Merchant Virtual Payment Address (VPA)
                </label>
                <div className="p-3 bg-slate-100/70 rounded-xl text-xs font-mono font-medium text-slate-800 flex items-center justify-between">
                  <span>{merchantVpa}</span>
                  <CopyButton textToCopy={merchantVpa} toastLabel="VPA copied" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deep Link URI
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] font-mono text-slate-600 break-all border border-slate-200/70">
                  {upiDeepLink}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleSimulatePayment}
                  disabled={status !== 'PENDING'}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Zap className="w-4 h-4" />
                  Simulate Success
                </button>
                <button
                  onClick={handleSimulateFailure}
                  disabled={status !== 'PENDING'}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all"
                >
                  Simulate Failure
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Demo only: simulates provider-confirmed outcomes. The real backend remains authoritative.
              </p>
            </div>
          </div>
        </div>

        {/* Right QR Display: The PayFlow Dynamic Terminal (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white rounded-3xl p-8 shadow-[0_12px_40px_-6px_rgba(15,23,42,0.1)] text-center relative overflow-hidden">
            {/* Top Pill & Brand */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <span className="font-bold text-slate-900 tracking-tight text-sm">PayFlow POS</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Price Pill */}
            <div className="mb-6">
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                ₹{parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>

            {/* QR Card Container */}
            <div className="relative mx-auto w-64 h-64 p-4 rounded-2xl bg-white border-2 border-slate-200/80 shadow-inner flex items-center justify-center">
              {status === 'CAPTURED' ? (
                <div className="text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="text-base font-bold text-slate-900">Payment Received!</div>
                  <div className="text-xs font-mono text-emerald-600 font-semibold mt-1">₹{amount} CAPTURED</div>
                  <div className="text-[10px] text-slate-400 mt-1">Ref: {activePaymentId}</div>
                </div>
              ) : status === 'FAILED' ? (
                <div className="text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
                    <span className="text-2xl font-black">!</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">Payment Failed</div>
                  <div className="text-xs font-mono text-rose-600 font-semibold mt-1">Provider declined or could not complete the payment</div>
                  <div className="text-[10px] text-slate-400 mt-1">Ref: {activePaymentId}</div>
                </div>
              ) : (
                /* Crisp SVG Simulated QR Code with PayFlow Logo in Center */
                <div className="w-full h-full relative flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    {/* Top-left marker */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                    {/* Top-right marker */}
                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                    {/* Bottom-left marker */}
                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />

                    {/* QR Code data matrix dots */}
                    <rect x="38" y="8" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="8" width="5" height="5" fill="#0f172a" />
                    <rect x="56" y="8" width="5" height="5" fill="#0f172a" />

                    <rect x="38" y="18" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="24" width="5" height="5" fill="#0f172a" />
                    <rect x="56" y="18" width="5" height="5" fill="#0f172a" />

                    <rect x="8" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="18" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="28" y="38" width="5" height="5" fill="#0f172a" />

                    <rect x="8" y="48" width="5" height="5" fill="#0f172a" />
                    <rect x="24" y="48" width="5" height="5" fill="#0f172a" />
                    <rect x="18" y="56" width="5" height="5" fill="#0f172a" />

                    <rect x="68" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="78" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="88" y="48" width="5" height="5" fill="#0f172a" />

                    <rect x="68" y="56" width="5" height="5" fill="#0f172a" />
                    <rect x="78" y="56" width="5" height="5" fill="#0f172a" />
                    <rect x="88" y="56" width="5" height="5" fill="#0f172a" />

                    <rect x="38" y="68" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="74" width="5" height="5" fill="#0f172a" />
                    <rect x="56" y="68" width="5" height="5" fill="#0f172a" />

                    <rect x="38" y="84" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="88" width="5" height="5" fill="#0f172a" />
                    <rect x="56" y="84" width="5" height="5" fill="#0f172a" />
                    <rect x="68" y="84" width="5" height="5" fill="#0f172a" />
                    <rect x="84" y="84" width="5" height="5" fill="#0f172a" />
                  </svg>
                  {/* Center PayFlow Icon */}
                  <div className="absolute w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                    ₹
                  </div>
                </div>
              )}
            </div>

            {/* Apps Supported Badges */}
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Scan with any app:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">GPay</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">PhonePe</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">Paytm</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">BHIM</span>
            </div>

            {/* Post payment actions */}
            {status === 'CAPTURED' && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('payment-details', activePaymentId)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  Inspect Audit Record
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
