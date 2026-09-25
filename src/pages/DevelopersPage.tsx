import React, { useState } from 'react';
import {
  Terminal,
  BookOpen,
  Code2,
  Key,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCode,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { CopyButton } from '../components/common/CopyButton.tsx';
import { useToast } from '../context/ToastContext.tsx';

type CodeLanguage = 'curl' | 'java' | 'node' | 'python';

export const DevelopersPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeLang, setActiveLang] = useState<CodeLanguage>('java');
  const [testPayload, setTestPayload] = useState('{"event": "payment.captured", "payment_id": "pay_29381bf4", "amount": 2499.00}');
  const [webhookSecret, setWebhookSecret] = useState('whsec_9812f8a910bc39e1201fa872b');
  const [simulatedSignature, setSimulatedSignature] = useState('t=1729765264,v1=9e81b6e491c3608e0638abf0d046f561912a7a49938bfa79');

  const handleRunPlayground = () => {
    showToast('Executing request in PayFlow Sandbox environment...', 'info');
    setTimeout(() => {
      showToast('200 OK — Intent created with ledger reservation', 'success');
    }, 900);
  };

  const codeSnippets: Record<CodeLanguage, string> = {
    java: `// Spring Boot 3.x / Java 17+ Service Integration
package com.acme.payflow.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PaymentGatewayService {

    private final WebClient webClient;

    public PaymentGatewayService(WebClient.Builder builder) {
        this.webClient = builder
            .baseUrl("https://api.payflow.internal/v1")
            .defaultHeader("Authorization", "Bearer sk_test_881920_payflow_secret")
            .build();
    }

    public Mono<PaymentResponse> createPayment(PaymentRequest request, String idempotencyKey) {
        return this.webClient.post()
            .uri("/payments")
            .header("X-Idempotency-Key", idempotencyKey)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(PaymentResponse.class);
    }
}`,
    curl: `# Create payment intent with strict idempotency
curl -X POST https://api.payflow.internal/v1/payments \\
  -H "Authorization: Bearer sk_test_881920_payflow_secret" \\
  -H "X-Idempotency-Key: idem_98231_payflow_prod_a7x9" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 249900,
    "currency": "INR",
    "method": "UPI",
    "customer": {
      "name": "Rahul Sharma",
      "email": "rahul@acme.in",
      "phone": "+919876543210"
    },
    "routing_preference": "AUTO"
  }'`,
    node: `// Node.js / TypeScript SDK Example
import axios from 'axios';

const payflowClient = axios.create({
  baseURL: 'https://api.payflow.internal/v1',
  headers: {
    'Authorization': 'Bearer sk_test_881920_payflow_secret',
    'Content-Type': 'application/json'
  }
});

export async function createPayment(orderId: string, amount: number) {
  const idempotencyKey = \`idem_\${orderId}_\${Date.now()}\`;

  const response = await payflowClient.post('/payments', {
    amount,
    currency: 'INR',
    method: 'UPI'
  }, {
    headers: { 'X-Idempotency-Key': idempotencyKey }
  });

  return response.data;
}`,
    python: `# Python 3 Requests Example
import requests
import uuid

API_KEY = "sk_test_881920_payflow_secret"
URL = "https://api.payflow.internal/v1/payments"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Idempotency-Key": f"idem_{uuid.uuid4()}",
    "Content-Type": "application/json"
}

payload = {
    "amount": 249900,
    "currency": "INR",
    "method": "UPI",
    "routing_preference": "AUTO"
}

response = requests.post(URL, json=payload, headers=headers)
print(response.json())`
  };

  const errorCatalog = [
    {
      code: 'IDEMPOTENCY_COLLISION',
      status: 409,
      description: 'The request was submitted with an idempotency key that already belongs to an existing transaction with differing payload parameters.',
      resolution: 'Reuse the original idempotency key only when retrying the identical request payload.'
    },
    {
      code: 'LEDGER_OUT_OF_BALANCE',
      status: 500,
      description: 'Double-entry engine detected Debit != Credit constraint violation. Payment is halted to prevent balance drift.',
      resolution: 'Engine automatically triggers isolation rollback. Check ledger audit logs.'
    },
    {
      code: 'ROUTING_CIRCUIT_TRIPPED',
      status: 503,
      description: 'Provider SLA degraded below 95%. Traffic is being diverted to secondary failover gateway.',
      resolution: 'Retry with AUTO routing enabled to allow PayFlow intelligent fallback.'
    },
    {
      code: 'INVALID_SIGNATURE',
      status: 401,
      description: 'Webhook HMAC-SHA256 signature did not match calculated hash using merchant endpoint secret.',
      resolution: 'Verify the webhook secret key in Settings and raw unparsed request body.'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <span>Platform</span>
          <span>&gt;</span>
          <span>Developer &amp; Ops</span>
          <span>&gt;</span>
          <span className="text-blue-600">Developer Suite &amp; API Docs</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          Developer Documentation &amp; SDK Playground
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono font-medium border border-blue-200">
            OpenAPI 3.1
          </span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Native Spring Boot WebClient integration patterns, idempotency semantics, and cryptographically verified webhooks.
        </p>
      </div>

      {/* Main Grid: Code Playground & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Code Playground (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          {/* Editor Header Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveLang('java')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLang === 'java'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Java / Spring Boot
              </button>
              <button
                onClick={() => setActiveLang('curl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLang === 'curl'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveLang('node')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLang === 'node'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Node.js
              </button>
              <button
                onClick={() => setActiveLang('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLang === 'python'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Python
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunPlayground}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Play className="w-3 h-3 fill-current" />
                Test Run
              </button>
              <CopyButton textToCopy={codeSnippets[activeLang]} toastLabel="Snippet copied" />
            </div>
          </div>

          {/* Editor Body */}
          <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed text-slate-300">
            <pre>
              <code>{codeSnippets[activeLang]}</code>
            </pre>
          </div>

          {/* Editor Footer / Response preview */}
          <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sandbox Gateway: https://api.payflow.internal</span>
            </div>
            <span className="font-mono">Status: 200 OK (84ms)</span>
          </div>
        </div>

        {/* Right Column: Key Concepts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Idempotency Flow Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              <Lock className="w-4 h-4 text-blue-600" />
              Strict Idempotency Semantics
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              All payment mutations require the <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">X-Idempotency-Key</code> HTTP header. If network dropouts occur, clients can safely resend with zero risk of duplicate merchant debits.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Redis Distributed Lease</div>
                  <div className="text-[11px] text-slate-500">Atomic lock acquired for 120s during payment pipeline execution.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">PostgreSQL Unique Constraint</div>
                  <div className="text-[11px] text-slate-500">Ledger posting transaction references idempotency key hash.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Signature Verification Guide */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              HMAC-SHA256 Webhook Verification
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Every webhook delivery includes a <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">X-Payflow-Signature</code> header:
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-800 break-all mb-3">
              {simulatedSignature}
            </div>

            <div className="text-xs text-slate-500">
              Compute HMAC using SHA-256 over <code className="font-mono text-slate-700">timestamp + '.' + raw_body</code> with your merchant secret.
            </div>
          </div>
        </div>
      </div>

      {/* Error Code Catalog Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Standard Platform Error Codes &amp; Handling Matrix
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          All API errors return consistent JSON responses conforming to RFC 7807 Problem Details.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Error Code</th>
                <th className="py-2.5 px-3">HTTP Status</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Recommended Client Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {errorCatalog.map(err => (
                <tr key={err.code} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                    {err.code}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700 font-semibold text-[11px]">
                      {err.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{err.description}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{err.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
