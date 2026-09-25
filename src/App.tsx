import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { AmbientGlow } from './components/layout/AmbientGlow.tsx';
import { Sidebar, PageId } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';
import { CommandPalette } from './components/layout/CommandPalette.tsx';

// Modals
import { RefundModal } from './components/modals/RefundModal.tsx';
import { ManualPostingModal } from './components/modals/ManualPostingModal.tsx';
import { CreateWebhookModal } from './components/modals/CreateWebhookModal.tsx';
import { DangerZoneModal } from './components/modals/DangerZoneModal.tsx';

// Pages
import { OverviewPage } from './pages/OverviewPage.tsx';
import { PaymentDetailsPage } from './pages/PaymentDetailsPage.tsx';
import { LedgerPage } from './pages/LedgerPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { MonitoringPage } from './pages/MonitoringPage.tsx';
import { TransactionsPage } from './pages/TransactionsPage.tsx';
import { CreatePaymentPage } from './pages/CreatePaymentPage.tsx';
import { QrPaymentsPage } from './pages/QrPaymentsPage.tsx';
import { DevelopersPage } from './pages/DevelopersPage.tsx';
import { WebhooksPage } from './pages/WebhooksPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('payment-details');
  const [activePaymentId, setActivePaymentId] = useState<string>('pay_29381bf4');
  const [env, setEnv] = useState<'TEST' | 'LIVE'>('LIVE');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Modal Visibility states
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundPaymentId, setRefundPaymentId] = useState<string>('pay_29381bf4');
  const [refundMaxAmount, setRefundMaxAmount] = useState<number>(2499.0);

  const [isManualPostingOpen, setIsManualPostingOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);

  const handleNavigate = (page: PageId, paymentId?: string) => {
    if (paymentId) {
      setActivePaymentId(paymentId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRefund = (paymentId: string, amount: number = 2499.0) => {
    setRefundPaymentId(paymentId);
    setRefundMaxAmount(amount);
    setIsRefundModalOpen(true);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans relative selection:bg-blue-600 selection:text-white">
        {/* Glassmorphic Ambient Mesh Gradient */}
        <AmbientGlow />

        {/* Global Fixed Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          env={env}
        />

        {/* Main Content Area (Offset for sidebar: pl-72) */}
        <div className="pl-72 pr-6 pt-4 pb-12 transition-all duration-300">
          {/* Top Bar Header */}
          <Header
            env={env}
            onToggleEnv={() => setEnv(prev => (prev === 'LIVE' ? 'TEST' : 'LIVE'))}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onNavigate={handleNavigate}
          />

          {/* Main Dynamic Page Viewport */}
          <main className="mt-6">
            {currentPage === 'overview' && (
              <OverviewPage
                onNavigate={handleNavigate}
                onOpenRefund={handleOpenRefund}
              />
            )}

            {(currentPage === 'payment-details' || currentPage === 'payments') && (
              <PaymentDetailsPage
                paymentId={activePaymentId}
                onNavigate={handleNavigate}
                onOpenRefund={handleOpenRefund}
              />
            )}

            {currentPage === 'transactions' && (
              <TransactionsPage
                onNavigate={handleNavigate}
                onOpenRefund={handleOpenRefund}
              />
            )}

            {currentPage === 'ledger' && (
              <LedgerPage
                onOpenManualPosting={() => setIsManualPostingOpen(true)}
              />
            )}

            {currentPage === 'analytics' && (
              <AnalyticsPage
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'monitoring' && (
              <MonitoringPage />
            )}

            {currentPage === 'create-payment' && (
              <CreatePaymentPage
                onNavigate={handleNavigate}
                env={env}
              />
            )}

            {currentPage === 'qr-payments' && (
              <QrPaymentsPage
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'developers' && (
              <DevelopersPage />
            )}

            {currentPage === 'webhooks' && (
              <WebhooksPage
                onOpenCreateWebhook={() => setIsCreateWebhookOpen(true)}
              />
            )}

            {(currentPage === 'settings' || currentPage === 'api-keys') && (
              <SettingsPage
                onOpenDangerZone={() => setIsDangerZoneOpen(true)}
                env={env}
              />
            )}
          </main>
        </div>

        {/* Command Palette (⌘K) Modal */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Action Modals */}
        <RefundModal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          paymentId={refundPaymentId}
          maxAmount={refundMaxAmount}
        />

        <ManualPostingModal
          isOpen={isManualPostingOpen}
          onClose={() => setIsManualPostingOpen(false)}
        />

        <CreateWebhookModal
          isOpen={isCreateWebhookOpen}
          onClose={() => setIsCreateWebhookOpen(false)}
        />

        <DangerZoneModal
          isOpen={isDangerZoneOpen}
          onClose={() => setIsDangerZoneOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
