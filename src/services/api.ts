/**
 * PayFlow API Integration Service Layer
 * 
 * All API interactions are isolated here. To connect to your Spring Boot
 * microservices backend API Gateway, configure API_BASE_URL (defaults to '/api/v1').
 */

import {
  PaymentItem,
  LedgerPosting,
  WebhookEndpoint,
  WebhookDeliveryLog,
  ServiceNode,
  SystemAlert,
  AuditStep
} from '../types/index.ts';

// Configurable gateway endpoint for future Spring Boot proxying
export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || '/api/v1';

// Seed Mock Data - Pixel-faithful to the Stitch Design System
export const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay_29381bf4',
    orderId: 'order_98231',
    amount: 2499.0,
    fee: 50.0,
    netAmount: 2449.0,
    currency: 'INR',
    status: 'CAPTURED',
    env: 'LIVE',
    method: 'UPI',
    subMethod: 'PhonePe',
    payerVpa: 'rahul.sharma@okhdfcbank',
    provider: 'Razorpay',
    providerPaymentId: 'pay_Rzp98210398',
    acquirerRrn: '429810294812',
    riskScore: 12,
    riskVerdict: 'Auto-Approved (Low)',
    createdAt: 'Oct 24, 2024 · 10:21:04 AM IST',
    customer: {
      id: 'cust_89102a',
      name: 'Rahul Sharma',
      email: 'rahul@acme.in',
      phone: '+91 98765 43210',
      lifetimeSpend: 84200,
      disputeRate: '0.00%',
      totalOrders: 14
    },
    idempotencyKey: 'idem_98231_payflow_prod_a7x9',
    settlementProtocol: 'Provider-confirmed UPI',
    sourceIp: '49.37.112.94',
    location: 'Mumbai, IN'
  },
  {
    id: 'pay_29380b12',
    orderId: 'order_98230',
    amount: 1249.0,
    fee: 25.0,
    netAmount: 1224.0,
    currency: 'INR',
    status: 'CAPTURED',
    env: 'LIVE',
    method: 'UPI',
    subMethod: 'Google Pay',
    payerVpa: 'priya.s@okicici',
    provider: 'Razorpay',
    providerPaymentId: 'pay_Rzp98210311',
    acquirerRrn: '429810294119',
    riskScore: 8,
    riskVerdict: 'Auto-Approved (Low)',
    createdAt: 'Oct 24, 2024 · 10:14:02 AM IST',
    customer: {
      id: 'cust_89101b',
      name: 'Priya Sharma',
      email: 'priya@corp.in',
      phone: '+91 98111 22334',
      lifetimeSpend: 42000,
      disputeRate: '0.00%',
      totalOrders: 6
    },
    idempotencyKey: 'idem_98230_payflow_prod_b2y1',
    settlementProtocol: 'Provider-confirmed UPI',
    sourceIp: '157.34.89.201',
    location: 'Bengaluru, IN'
  },
  {
    id: 'pay_29375c88',
    orderId: 'order_98190',
    amount: 850.0,
    fee: 17.0,
    netAmount: 833.0,
    currency: 'INR',
    status: 'REFUNDED',
    env: 'LIVE',
    method: 'CARD',
    subMethod: 'Visa Debit ··4192',
    provider: 'Razorpay',
    providerPaymentId: 'pay_Rzp98210118',
    acquirerRrn: '429810291002',
    riskScore: 22,
    riskVerdict: 'Auto-Approved (Low)',
    createdAt: 'Oct 24, 2024 · 09:48:15 AM IST',
    customer: {
      id: 'cust_89098c',
      name: 'Aditya Verma',
      email: 'aditya.v@ventureholdings.io',
      phone: '+91 97654 32109',
      lifetimeSpend: 112000,
      disputeRate: '0.00%',
      totalOrders: 19
    },
    idempotencyKey: 'idem_98190_payflow_prod_c9z3',
    settlementProtocol: 'Visa EMV 3DS2',
    sourceIp: '115.99.23.41',
    location: 'Delhi, IN'
  },
  {
    id: 'pay_29370d99',
    orderId: 'order_98188',
    amount: 14200.0,
    fee: 284.0,
    netAmount: 13916.0,
    currency: 'INR',
    status: 'CAPTURED',
    env: 'LIVE',
    method: 'CARD',
    subMethod: 'Mastercard Corporate',
    provider: 'Stripe',
    providerPaymentId: 'ch_3M491823901',
    acquirerRrn: '429810289941',
    riskScore: 15,
    riskVerdict: 'Auto-Approved (Low)',
    createdAt: 'Oct 24, 2024 · 09:12:33 AM IST',
    customer: {
      id: 'cust_89077d',
      name: 'Karan Mehta',
      email: 'karan.mehta@okaxis',
      phone: '+91 98223 34455',
      lifetimeSpend: 245000,
      disputeRate: '0.00%',
      totalOrders: 28
    },
    idempotencyKey: 'idem_98188_payflow_prod_d4k8',
    settlementProtocol: 'Mastercard Identity Check',
    sourceIp: '103.21.244.12',
    location: 'Hyderabad, IN'
  },
  {
    id: 'pay_29362e44',
    orderId: 'order_98175',
    amount: 450.0,
    fee: 9.0,
    netAmount: 441.0,
    currency: 'INR',
    status: 'CAPTURED',
    env: 'LIVE',
    method: 'UPI',
    subMethod: 'Paytm UPI',
    payerVpa: 'vikram.k@paytm',
    provider: 'Razorpay',
    providerPaymentId: 'pay_Rzp98209841',
    acquirerRrn: '429810287114',
    riskScore: 5,
    riskVerdict: 'Auto-Approved (Low)',
    createdAt: 'Oct 24, 2024 · 08:55:01 AM IST',
    customer: {
      id: 'cust_89055e',
      name: 'Vikram Kapur',
      email: 'vikram@retailkart.in',
      phone: '+91 99001 12233',
      lifetimeSpend: 31000,
      disputeRate: '0.00%',
      totalOrders: 8
    },
    idempotencyKey: 'idem_98175_payflow_prod_e1m5',
    settlementProtocol: 'Provider-confirmed UPI',
    sourceIp: '49.36.19.82',
    location: 'Pune, IN'
  }
];

export const MOCK_AUDIT_TRAIL: AuditStep[] = [
  {
    id: 'step_1',
    title: 'Payment Created',
    service: 'API Gateway',
    timestamp: '10:21:04.102 IST (+0ms)',
    description: 'Edge API Gateway received HTTPS request from client application. Clamped idempotency key idem_98231_payflow_prod_a7x9 to Redis lock manager.',
    codeRef: 'idem_98231_payflow_prod_a7x9'
  },
  {
    id: 'step_2',
    title: 'API Key & Tenant Identity Verified',
    service: 'Identity & Tenancy',
    timestamp: '10:21:05.040 IST (+938ms)',
    description: 'Validated tenant credentials against JWT keystore (AuthService.java). Scope verified: payments:write.',
    codeRef: 'AuthService.java'
  },
  {
    id: 'step_3',
    title: 'Provider Intent Order Initialized',
    service: 'Provider Service',
    timestamp: '10:21:06.210 IST (+1.17s)',
    description: 'Provider Service initiated upstream charge request to Razorpay UPI Intent endpoint. Received order token order_RP91024_UPI.',
    codeRef: 'order_RP91024_UPI'
  },
  {
    id: 'step_4',
    title: 'Dynamic QR / UPI Intent Rendered',
    service: 'Checkout Engine',
    timestamp: '10:21:12.450 IST (+6.24s)',
    description: 'Dynamic Bharat QR rendered on user screen. DeepLink payload prepared for PhonePe app redirect.'
  },
  {
    id: 'step_5',
    title: 'Customer MPIN Authorization Commenced',
    service: 'NPCI UPI Switch',
    timestamp: '10:21:40.890 IST (+28.4s)',
    description: 'Customer entered 6-digit MPIN in banking app. NPCI routed debited hold from HDFC Bank to beneficiary clearing settlement pool.'
  },
  {
    id: 'step_6',
    title: 'Provider Marked Payment Captured',
    service: 'Payment Service',
    timestamp: '10:22:08.312 IST (+27.4s)',
    description: 'Bank settlement cleared. Razorpay emitted capture status confirmation with Acquirer Reference Number (RRN): 429810294812.',
    codeRef: '429810294812'
  },
  {
    id: 'step_7',
    title: 'Provider Webhook Ingested & Deduplicated',
    service: 'Webhook Ingestion',
    timestamp: '10:22:09.115 IST (+803ms)',
    description: 'HMAC SHA256 signature verified against secret registry. Event stored and deduplicated in Provider Event Store table.'
  },
  {
    id: 'step_8',
    title: 'Transactional Outbox Dispatched Kafka Event',
    service: 'Kafka Cluster',
    timestamp: '10:22:10.004 IST (+889ms)',
    description: 'OutboxPublisher published payment.captured to topic payflow.payments.lifecycle.p0.',
    codeRef: 'payflow.payments.lifecycle.p0'
  },
  {
    id: 'step_9',
    title: 'Double-Entry Journal Postings Committed',
    service: 'Ledger Engine',
    timestamp: '10:22:10.450 IST (+446ms)',
    description: 'Immutable balanced postings written to PostgreSQL Ledger partition. Ledger Reference ID: TXN_POST_8920194.',
    codeRef: 'TXN_POST_8920194'
  }
];

export const MOCK_LEDGER_POSTINGS: LedgerPosting[] = [
  {
    id: 'post_98231a',
    sourceEntity: 'pay_29381bf4',
    postingType: 'PAYMENT_CAPTURE',
    accountsImpacted: ['1001-Clearing', '2001-Payable', '4001-Fee'],
    totalDebit: 2499.0,
    totalCredit: 2499.0,
    status: 'BALANCED',
    createdAt: '10:22:10 AM IST',
    deterministicHash: '0x8f4c2e6a9d1b03847291aeb0384',
    previousHash: '0x3a92ef8914b10294c',
    merkleRoot: 'root_blk_291039',
    walOffset: '0/18A3BC8',
    legs: [
      {
        accountCode: '1001',
        accountName: 'Payment Clearing Pool',
        classification: 'Asset Account (Razorpay Node)',
        debit: 2499.0,
        description: 'Inflow from Razorpay instant UPI switch settlement'
      },
      {
        accountCode: '2001',
        accountName: 'Merchant Payable',
        classification: 'Liability (Acme India org_8829)',
        credit: 2449.0,
        description: 'Available for next automated merchant payout cycle'
      },
      {
        accountCode: '4001',
        accountName: 'PayFlow Platform Revenue',
        classification: 'Revenue / Processing Fee',
        credit: 50.0,
        description: '2.0% MDR + platform processing fee recognized'
      }
    ]
  },
  {
    id: 'post_98230b',
    sourceEntity: 'pay_29380',
    postingType: 'PAYMENT_CAPTURE',
    accountsImpacted: ['1001-Clearing', '2001-Payable', '4001-Fee'],
    totalDebit: 1249.0,
    totalCredit: 1249.0,
    status: 'BALANCED',
    createdAt: '10:14:02 AM IST',
    deterministicHash: '0x7e10df2a98f48031e428a1c900e57201bb8a2049f8290f9b',
    previousHash: '0x4a02c81bc887f48031e428a1c900e57201bb8991ae',
    merkleRoot: 'root_blk_291038',
    walOffset: '0/18A3B80',
    legs: [
      {
        accountCode: '1001',
        accountName: 'Payment Clearing Pool',
        classification: 'Asset (Current)',
        debit: 1249.0,
        description: 'Inflow from GPay instant UPI rail capture'
      },
      {
        accountCode: '2001',
        accountName: 'Merchant Payable',
        classification: 'Liability (Payable)',
        credit: 1224.0,
        description: 'Net merchant settlement allocation'
      },
      {
        accountCode: '4001',
        accountName: 'PayFlow MDR Fee Revenue',
        classification: 'Revenue (Platform)',
        credit: 25.0,
        description: '2.0% MDR fee recognized'
      }
    ]
  },
  {
    id: 'post_98229c',
    sourceEntity: 'pay_29375',
    postingType: 'REFUND_REVERSAL',
    accountsImpacted: ['1001-Clearing', '2001-Payable', '4001-Fee'],
    totalDebit: 850.0,
    totalCredit: 850.0,
    status: 'BALANCED',
    createdAt: '09:48:15 AM IST',
    deterministicHash: '0x992e104cda710294b910',
    previousHash: '0x18a3bc8ef0921a4',
    merkleRoot: 'root_blk_291035',
    walOffset: '0/18A3A40',
    legs: [
      {
        accountCode: '2001',
        accountName: 'Merchant Payable',
        classification: 'Liability Debit (Reversal)',
        debit: 833.0,
        description: 'Debit to merchant payable pool for full refund'
      },
      {
        accountCode: '4001',
        accountName: 'PayFlow MDR Fee Revenue',
        classification: 'Fee Reversal Debit',
        debit: 17.0,
        description: 'Rebate on processing fee'
      },
      {
        accountCode: '1001',
        accountName: 'Payment Clearing Pool',
        classification: 'Asset Credit (Outflow)',
        credit: 850.0,
        description: 'Outflow to bank card rails for customer credit'
      }
    ]
  },
  {
    id: 'post_98228d',
    sourceEntity: 'pay_29370',
    postingType: 'PAYMENT_CAPTURE',
    accountsImpacted: ['1001-Clearing', '2001-Payable', '4001-Fee'],
    totalDebit: 14200.0,
    totalCredit: 14200.0,
    status: 'BALANCED',
    createdAt: '09:12:33 AM IST',
    deterministicHash: '0x44ba9012e10948ac',
    previousHash: '0x22ab8910481239c',
    merkleRoot: 'root_blk_291030',
    walOffset: '0/18A3910',
    legs: [
      {
        accountCode: '1001',
        accountName: 'Payment Clearing Pool',
        classification: 'Asset (Current)',
        debit: 14200.0,
        description: 'Credit Card Settlement ingress'
      },
      {
        accountCode: '2001',
        accountName: 'Merchant Payable',
        classification: 'Liability (Payable)',
        credit: 13916.0,
        description: 'Reserved for daily settlement sweep'
      },
      {
        accountCode: '4001',
        accountName: 'PayFlow MDR Fee Revenue',
        classification: 'Revenue',
        credit: 284.0,
        description: '2.0% blended interchange and fee'
      }
    ]
  },
  {
    id: 'post_98227e',
    sourceEntity: 'pay_29362',
    postingType: 'PAYMENT_CAPTURE',
    accountsImpacted: ['1001-Clearing', '2001-Payable', '4001-Fee'],
    totalDebit: 450.0,
    totalCredit: 450.0,
    status: 'BALANCED',
    createdAt: '08:55:01 AM IST',
    deterministicHash: '0x12bb90847192a01',
    previousHash: '0x992ab018471201f',
    merkleRoot: 'root_blk_291028',
    walOffset: '0/18A3850',
    legs: [
      {
        accountCode: '1001',
        accountName: 'Payment Clearing Pool',
        classification: 'Asset',
        debit: 450.0,
        description: 'Paytm UPI Instant Inflow'
      },
      {
        accountCode: '2001',
        accountName: 'Merchant Payable',
        classification: 'Liability',
        credit: 441.0,
        description: 'Escrow payable balance'
      },
      {
        accountCode: '4001',
        accountName: 'PayFlow Platform Revenue',
        classification: 'Revenue',
        credit: 9.0,
        description: 'Processing tariff recognized'
      }
    ]
  },
  {
    id: 'post_98226f',
    sourceEntity: 'payout_0921',
    postingType: 'NODAL_PAYOUT',
    accountsImpacted: ['2001-Payable', '1002-Nodal Bank'],
    totalDebit: 250000.0,
    totalCredit: 250000.0,
    status: 'BALANCED',
    createdAt: '08:00:00 AM IST',
    deterministicHash: '0xaa81029410b948a',
    previousHash: '0x33b91048190248a',
    merkleRoot: 'root_blk_291020',
    walOffset: '0/18A3700',
    legs: [
      {
        accountCode: '2001',
        accountName: 'Merchant Payable Pool',
        classification: 'Liability Debit',
        debit: 250000.0,
        description: 'Reduction in merchant payable upon bank nodal transfer'
      },
      {
        accountCode: '1002',
        accountName: 'Nodal Bank Clearing Account',
        classification: 'Asset Credit',
        credit: 250000.0,
        description: 'Wire disbursement via HDFC Bank Nodal Escrow'
      }
    ]
  }
];

export const MOCK_WEBHOOK_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: 'wh_end_01hx419k81',
    url: 'https://merchant.example.com/webhooks/payflow',
    status: 'ACTIVE',
    events: ['payment.captured', 'payment.failed', 'payment.refunded'],
    successRate: 99.4,
    lastDelivery: '2 mins ago',
    sparkline: [88, 92, 95, 98, 99.4]
  },
  {
    id: 'wh_end_02bb9930f1',
    url: 'https://api.acme.in/v2/ledger/events',
    status: 'ACTIVE',
    events: ['payment.captured', 'ledger.balanced'],
    successRate: 100.0,
    lastDelivery: '14 mins ago',
    sparkline: [100, 100, 100, 100, 100]
  },
  {
    id: 'wh_end_09d22a87c',
    url: 'https://analytics-collector.acme.internal/sink',
    status: 'DEGRADED',
    events: ['payment.created', 'payment.pending'],
    successRate: 88.1,
    lastDelivery: '41 mins ago',
    sparkline: [95, 92, 90, 85, 88.1]
  }
];

export const MOCK_WEBHOOK_LOGS: WebhookDeliveryLog[] = [
  {
    id: 'evt_91ab42c',
    type: 'payment.captured',
    endpointUrl: 'https://merchant.example.com/webhooks/payflow',
    httpStatus: 200,
    httpStatusText: '200 OK',
    attempts: 1,
    maxAttempts: 5,
    deliveryStatus: 'DELIVERED',
    timestamp: '10:22:09 IST',
    latencyMs: 84,
    paymentId: 'pay_29381bf4',
    signature: 'sha256=9b72a819c4812a01490248f',
    payload: {
      id: 'pay_29381bf4',
      entity: 'payment',
      amount: 249900,
      currency: 'INR',
      status: 'captured',
      order_id: 'order_98231',
      method: 'upi',
      vpa: 'rahul.sharma@okhdfcbank',
      fee: 5000,
      tax: 762,
      created_at: 1729745464
    }
  },
  {
    id: 'evt_82fd19a',
    type: 'payment.captured',
    endpointUrl: 'https://analytics-collector.acme.internal/sink',
    httpStatus: 500,
    httpStatusText: '500 Internal Error',
    attempts: 2,
    maxAttempts: 5,
    deliveryStatus: 'RETRYING',
    timestamp: '10:18:30 IST',
    latencyMs: 312,
    paymentId: 'pay_194729cc',
    signature: 'sha256=11ab9084712a0019',
    payload: {
      id: 'pay_194729cc',
      entity: 'payment',
      amount: 54000,
      currency: 'INR',
      status: 'captured',
      order_id: 'order_98224',
      method: 'card',
      provider: 'stripe'
    }
  },
  {
    id: 'evt_77ab03e',
    type: 'payment.failed',
    endpointUrl: 'https://api.acme.in/v2/ledger/events',
    httpStatus: 408,
    httpStatusText: 'Timeout (408)',
    attempts: 5,
    maxAttempts: 5,
    deliveryStatus: 'FAILED',
    timestamp: '09:54:12 IST',
    latencyMs: 5000,
    paymentId: 'pay_001923ab',
    signature: 'sha256=490184b91048102',
    payload: {
      id: 'pay_001923ab',
      entity: 'payment',
      amount: 119900,
      currency: 'INR',
      status: 'failed',
      failureReason: 'INSUFFICIENT_FUNDS',
      method: 'netbanking',
      provider: 'sandbox'
    }
  },
  {
    id: 'evt_61ff89d',
    type: 'payment.created',
    endpointUrl: 'https://merchant.example.com/webhooks/payflow',
    httpStatus: 200,
    httpStatusText: '200 OK',
    attempts: 1,
    maxAttempts: 5,
    deliveryStatus: 'DELIVERED',
    timestamp: '09:40:02 IST',
    latencyMs: 61,
    paymentId: 'pay_998124ff',
    signature: 'sha256=3381a9084128014',
    payload: {
      id: 'pay_998124ff',
      entity: 'payment',
      amount: 89000,
      currency: 'INR',
      status: 'created',
      method: 'upi',
      provider: 'razorpay'
    }
  }
];

export const MOCK_NODES: ServiceNode[] = [
  {
    id: 'edge_gateway',
    name: 'API Gateway',
    fileOrRoute: 'edge-gateway-v2',
    status: 'HEALTHY',
    metrics: {
      label1: 'Uptime',
      val1: '99.99%',
      label2: 'Throughput',
      val2: '2,420 r/m',
      label3: 'P95 Latency',
      val3: '28ms'
    }
  },
  {
    id: 'auth_service',
    name: 'Auth Service',
    fileOrRoute: 'AuthService.java',
    status: 'HEALTHY',
    metrics: {
      label1: 'Token Validity',
      val1: '100.0%',
      label2: 'JWT Verif',
      val2: '0 failed',
      label3: 'P95 Latency',
      val3: '12ms'
    }
  },
  {
    id: 'payment_service',
    name: 'Payment Service',
    fileOrRoute: 'PaymentService.java',
    status: 'HEALTHY',
    metrics: {
      label1: 'Velocity',
      val1: '420 tx/m',
      label2: 'Success Rate',
      val2: '99.94%',
      label3: 'P95 Latency',
      val3: '46ms'
    }
  },
  {
    id: 'provider_proxy',
    name: 'Provider Proxy',
    fileOrRoute: 'Razorpay / NPCI Relay',
    status: 'DEGRADED',
    metrics: {
      label1: 'Success Ratio',
      val1: '94.2%',
      label2: 'Routing',
      val2: 'Fallback 2',
      label3: 'P95 Spike',
      val3: '182ms'
    }
  },
  {
    id: 'idempotency_lock',
    name: 'Idempotency Lock',
    fileOrRoute: 'redis-idemp-cluster',
    status: 'HEALTHY',
    metrics: {
      label1: 'Collisions',
      val1: '0 keys',
      label2: 'Lock TTL',
      val2: '120s max',
      label3: 'P95 Latency',
      val3: '1.8ms'
    }
  },
  {
    id: 'ledger_engine',
    name: 'Ledger Engine',
    fileOrRoute: 'LedgerService.java',
    status: 'HEALTHY',
    metrics: {
      label1: 'Reconciliation',
      val1: '100% bal',
      label2: 'Audit Trace',
      val2: 'Immutable',
      label3: 'Write Latency',
      val3: '14ms'
    }
  },
  {
    id: 'postgres_primary',
    name: 'PostgreSQL Primary',
    fileOrRoute: 'db-ledger-01 (Primary)',
    status: 'HEALTHY',
    metrics: {
      label1: 'Conn Pool',
      val1: '24% used',
      label2: 'Memory Heap',
      val2: '8.4 / 32 GB',
      label3: 'Replication',
      val3: '0.1ms lag'
    }
  },
  {
    id: 'redis_cache',
    name: 'Redis Cache & Lock',
    fileOrRoute: 'redis-cache-tier1',
    status: 'HEALTHY',
    metrics: {
      label1: 'Memory Load',
      val1: '14% alloc',
      label2: 'Evictions',
      val2: '0 keys',
      label3: 'Hit Ratio',
      val3: '99.1%'
    }
  },
  {
    id: 'kafka_cluster',
    name: 'Kafka Cluster',
    fileOrRoute: 'kafka-events.prod',
    status: 'HEALTHY',
    metrics: {
      label1: 'Partitions',
      val1: '4 active',
      label2: 'Consumer Lag',
      val2: '12 msgs',
      label3: 'Under-rep',
      val3: '0'
    }
  }
];

export const MOCK_ALERTS: SystemAlert[] = [
  {
    id: 'alert_1',
    level: 'WARNING',
    title: 'Provider Latency Increased: Razorpay UPI Rail P95 exceeded 150ms threshold',
    description: 'Observed latency spike: current 182ms vs 45ms baseline. Automatic cascade routing enabled to secondary node.',
    timeAgo: '18m ago',
    status: 'INVESTIGATING',
    incidentId: 'INC-84920'
  },
  {
    id: 'alert_2',
    level: 'INFO',
    title: 'Kafka Consumer Lag: LedgerEventConsumer temporary lag spike',
    description: 'Surge of 142 msgs during scheduled batch settlement cleared normally. Backlog fully drained.',
    timeAgo: '4m ago',
    status: 'RESOLVED',
    extraMeta: 'Offset 1,940,291'
  },
  {
    id: 'alert_3',
    level: 'ROUTINE',
    title: 'Database Auto-Vacuum Completed',
    description: 'PostgreSQL primary ledger partitions pruned successfully. Dead tuples reclaimed: 0.8GB disk savings.',
    timeAgo: '1h ago',
    status: 'NORMAL',
    extraMeta: 'Duration: 18.2s'
  }
];

// Reusable API abstraction methods
export const payflowApi = {
  getPayments: async (): Promise<PaymentItem[]> => {
    // In production, fetch(`${API_BASE_URL}/payments`)
    return [...MOCK_PAYMENTS];
  },

  getPaymentById: async (id: string): Promise<PaymentItem | undefined> => {
    return MOCK_PAYMENTS.find(p => p.id === id) || MOCK_PAYMENTS[0];
  },

  getAuditTrail: async (_paymentId: string): Promise<AuditStep[]> => {
    return [...MOCK_AUDIT_TRAIL];
  },

  getLedgerPostings: async (): Promise<LedgerPosting[]> => {
    return [...MOCK_LEDGER_POSTINGS];
  },

  getLedgerPostingById: async (id: string): Promise<LedgerPosting | undefined> => {
    return MOCK_LEDGER_POSTINGS.find(p => p.id === id) || MOCK_LEDGER_POSTINGS[0];
  },

  getWebhookEndpoints: async (): Promise<WebhookEndpoint[]> => {
    return [...MOCK_WEBHOOK_ENDPOINTS];
  },

  getWebhookLogs: async (): Promise<WebhookDeliveryLog[]> => {
    return [...MOCK_WEBHOOK_LOGS];
  },

  getServiceNodes: async (): Promise<ServiceNode[]> => {
    return [...MOCK_NODES];
  },

  getSystemAlerts: async (): Promise<SystemAlert[]> => {
    return [...MOCK_ALERTS];
  },

  issueRefund: async (paymentId: string, amount: number, reason: string): Promise<{ success: boolean; refundId: string }> => {
    // Simulates Spring Boot /api/v1/refunds call
    return {
      success: true,
      refundId: `rfnd_${Math.random().toString(36).substring(2, 9)}`
    };
  },

  replayWebhook: async (eventId: string): Promise<{ success: boolean; statusCode: number }> => {
    return {
      success: true,
      statusCode: 200
    };
  }
};
