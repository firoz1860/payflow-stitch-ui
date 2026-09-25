/**
 * PayFlow Core Type Definitions
 * Designed for seamless integration into Spring Boot microservices backend.
 */

export type PaymentStatus = 'CAPTURED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'AUTHORIZED';
export type EnvironmentMode = 'TEST' | 'LIVE';
export type PaymentMethodType = 'UPI' | 'CARD' | 'NETBANKING' | 'QR' | 'WALLET';
export type ProviderType =
  | 'Razorpay'
  | 'Stripe'
  | 'PayFlow Sandbox'
  | 'Fallback Switch'
  | (string & {});

export interface PaymentItem {
  id: string;
  orderId: string;
  amount: number; // in INR
  fee: number;
  netAmount: number;
  currency: 'INR' | 'USD';
  status: PaymentStatus;
  env: EnvironmentMode;
  method: PaymentMethodType;
  subMethod: string; // e.g. "PhonePe", "Visa Infinite (3DS)", "GPay"
  payerVpa?: string;
  provider: ProviderType;
  providerPaymentId: string;
  acquirerRrn: string;
  riskScore: number;
  riskVerdict: 'Auto-Approved (Low)' | 'Moderate' | 'Flagged' | string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    lifetimeSpend: number;
    disputeRate: string;
    totalOrders: number;
  };
  idempotencyKey: string;
  settlementProtocol: string;
  sourceIp: string;
  location: string;
}

export interface AuditStep {
  id: string;
  title: string;
  service: string;
  timestamp: string;
  deltaMs?: string;
  description: string;
  codeRef?: string;
  badge?: string;
}

export interface LedgerPostingLeg {
  accountCode: string;
  accountName: string;
  classification: string;
  debit?: number;
  credit?: number;
  description: string;
}

export interface LedgerPosting {
  id: string;
  sourceEntity: string;
  postingType: 'PAYMENT_CAPTURE' | 'REFUND_REVERSAL' | 'NODAL_PAYOUT' | 'FEE_ADJUSTMENT';
  accountsImpacted: string[];
  totalDebit: number;
  totalCredit: number;
  status: 'BALANCED' | 'UNBALANCED';
  createdAt: string;
  legs: LedgerPostingLeg[];
  deterministicHash: string;
  previousHash: string;
  merkleRoot: string;
  walOffset: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  status: 'ACTIVE' | 'DEGRADED' | 'PAUSED';
  events: string[];
  successRate: number;
  lastDelivery: string;
  sparkline: number[];
  environment?: string;
  secret?: string;
}

export interface WebhookDeliveryLog {
  id: string;
  type: string;
  endpointUrl: string;
  httpStatus: number;
  httpStatusText: string;
  attempts: number;
  maxAttempts: number;
  deliveryStatus: 'DELIVERED' | 'RETRYING' | 'FAILED';
  timestamp: string;
  latencyMs: number;
  paymentId: string;
  payload: Record<string, unknown>;
  signature: string;
  eventType?: string;
  status?: 'DELIVERED' | 'RETRYING' | 'FAILED';
}

export interface ServiceNode {
  id: string;
  name: string;
  fileOrRoute: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  metrics: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
  uptime?: string;
  latency?: string;
  p99?: string;
}

export interface SystemAlert {
  id: string;
  level: 'CRITICAL' | 'WARNING' | 'ROUTINE' | 'INFO';
  title: string;
  description: string;
  timeAgo: string;
  status: 'ACTIVE' | 'NORMAL' | 'INVESTIGATING' | 'RESOLVED';
  extraMeta?: string;
  incidentId?: string;
}
