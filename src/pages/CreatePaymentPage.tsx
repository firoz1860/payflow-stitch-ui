import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Copy,
  Info
} from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { PageId } from '../components/layout/Sidebar.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { MOCK_PAYMENTS } from '../services/api.ts';

interface CreatePaymentPageProps {
  onNavigate: (page: PageId, paymentId?: string) => void;
  env: 'TEST' | 'LIVE';
}

export const CreatePaymentPage: React.FC<CreatePaymentPageProps> = ({
  onNavigate,
  env
}) => {
  const { showToast } = useToast();

  const [amount, setAmount] = useState('2499.00');
  const [currency] = useState('INR');
  const [customerName, setCustomerName] = useState('Aditi Roy');
  const [customerEmail, setCustomerEmail] = useState('aditi.roy@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 54321');
  const [orderId, setOrderId] = useState(`order_${Math.floor(10000 + Math.random() * 90000)}`);
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');
  const [upiVpa, setUpiVpa] = useState('aditi@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [routingPreference, setRoutingPreference] = useState<'AUTO' | 'RAZORPAY' | 'STRIPE' | 'SANDBOX'>('AUTO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);

  // Generate unique idempotency key
  const [idempotencyKey, setIdempotencyKey] = useState(
    () => `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  );

  const regenerateIdempotency = () => {
    const key = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setIdempotencyKey(key);
    showToast('New idempotency key generated', 'info');
  };

  const handleCreateIntent = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid amount greater than ₹0.00', 'error');
      return;
    }

    setIsProcessing(true);
    showToast('Initializing payment intent via PayFlow Gateway...', 'info');

    setTimeout(() => {
      setIsProcessing(false);
      const newPayId = `pay_${Math.random().toString(36).substring(2, 10)}`;
      setCreatedPaymentId(newPayId);

      // Prepend to mock payments in session memory
      const newEntry = {
        id: newPayId,
        orderId,
        amount: numAmount,
        fee: Math.round(numAmount * 0.02),
        netAmount: numAmount - Math.round(numAmount * 0.02),
        currency: 'INR' as const,
        status: 'PENDING' as const,
        env,
        method: selectedMethod,
        subMethod: selectedMethod === 'UPI' ? 'GooglePay' : 'Visa Debit',
        payerVpa: selectedMethod === 'UPI' ? upiVpa : undefined,
        provider:
          routingPreference === 'AUTO' || routingPreference === 'SANDBOX'
            ? 'PayFlow Sandbox'
            : routingPreference === 'RAZORPAY'
              ? 'Razorpay'
              : 'Stripe',
        providerPaymentId: `provider_${Math.random().toString(36).substring(2, 10)}`,
        acquirerRrn: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        riskScore: 14,
        riskVerdict: 'Auto-Approved (Low)',
        createdAt: 'Just now · Oct 24, 2024',
        customer: {
          id: `cust_${Math.random().toString(36).substring(2, 8)}`,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          lifetimeSpend: numAmount,
          disputeRate: '0.00%',
          totalOrders: 1
        },
        idempotencyKey,
        settlementProtocol: 'Provider-confirmed UPI',
        sourceIp: '103.21.244.1',
        location: 'Bengaluru, IN'
      };

      MOCK_PAYMENTS.unshift(newEntry);
      showToast(`Payment ${newPayId} created and is awaiting provider confirmation.`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <span>Platform</span>
          <span>&gt;</span>
          <span>Payments</span>
          <span>&gt;</span>
          <span className="text-blue-600">Create Payment Intent</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          New Payment Ingress Intent
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Create a payment intent with idempotency protection. Financial state changes only after trusted provider confirmation.
        </p>
      </div>

      {createdPaymentId ? (
        /* Success State Card */
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 shadow-[0_8px_32px_-4px_rgba(16,185,129,0.12)] text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Payment Created — Awaiting Confirmation</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            The payment intent was created successfully. PayFlow will keep it pending until a verified provider confirmation is received.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl font-mono text-sm font-semibold text-slate-900 mb-8">
            <span>{createdPaymentId}</span>
            <CopyButton textToCopy={createdPaymentId} toastLabel="Copied payment ID" />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCreatedPaymentId(null);
                setOrderId(`order_${Math.floor(10000 + Math.random() * 90000)}`);
                regenerateIdempotency();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all"
            >
              Create Another Intent
            </button>
            <button
              onClick={() => onNavigate('payment-details', createdPaymentId)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              View Payment Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Payment Creation Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <form onSubmit={handleCreateIntent} className="lg:col-span-2 space-y-6">
            {/* Amount & Currency Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                Order &amp; Transaction Value
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Order Amount (INR ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-base font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Merchant Order ID
                  </label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                Customer Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-bold">3</span>
                Select Payment Method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1.5 text-emerald-600" />
                  <div className="text-xs">UPI Intent</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1.5 text-blue-600" />
                  <div className="text-xs">Credit/Debit</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'NETBANKING'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1.5 text-indigo-600" />
                  <div className="text-xs">Netbanking</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('WALLET')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'WALLET'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Wallet className="w-5 h-5 mx-auto mb-1.5 text-amber-600" />
                  <div className="text-xs">Wallets</div>
                </button>
              </div>

              {selectedMethod === 'UPI' && (
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Customer Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="user@bankname"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Supports Google Pay, PhonePe, Paytm, and BHIM 2.0 collect requests.
                  </div>
                </div>
              )}

              {selectedMethod === 'CARD' && (
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Card Number (Tokenized Test Card)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-blue-600" />
                    Provider-tokenized payment data only; raw card data is not stored by PayFlow.
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Orchestrating across payment gateways...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Process Payment Intent (₹{amount})
                </>
              )}
            </button>
          </form>

          {/* Right Column: Idempotency & Routing Meta */}
          <div className="space-y-6">
            {/* Idempotency Key Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Idempotency Key
                </span>
                <button
                  type="button"
                  onClick={regenerateIdempotency}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Guarantees exact-once execution across network retries and webhook replay.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-slate-800 truncate mr-2">
                  {idempotencyKey}
                </span>
                <CopyButton textToCopy={idempotencyKey} toastLabel="Idempotency key copied" />
              </div>
            </div>

            {/* Smart Gateway Routing Config */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Orchestration Gateway Target
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Choose dynamic multi-rail routing or force a specific partner provider.
              </p>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="routing"
                    checked={routingPreference === 'AUTO'}
                    onChange={() => setRoutingPreference('AUTO')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800">Auto Smart Routing</span>
                    <p className="text-[10px] text-slate-400">Lowest latency &amp; highest success rate</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="routing"
                    checked={routingPreference === 'RAZORPAY'}
                    onChange={() => setRoutingPreference('RAZORPAY')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800">Razorpay Direct</span>
                    <p className="text-[10px] text-slate-400">Standard card &amp; netbanking</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="routing"
                    checked={routingPreference === 'STRIPE'}
                    onChange={() => setRoutingPreference('STRIPE')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-800">PayFlow Sandbox</span>
                    <p className="text-[10px] text-slate-400">Zero interchange fee UPI 2.0</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Double-entry Ledger Guarantee */}
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/60 text-xs text-purple-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Info className="w-3.5 h-3.5 text-purple-600" />
                Automatic Double-Entry Posting
              </div>
              <p className="text-[11px] text-purple-700 leading-relaxed">
                When authorized, this payment immediately writes 3 balanced journal legs: Debit Clearing, Credit Merchant Payable, and Credit Revenue.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
