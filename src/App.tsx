import React, { useState } from 'react';
import { ExitControlOnline } from './components/ExitControlOnline';
import { SmartExitProvider, useSmartExit } from './context/SmartExitContext';
import { Navbar, NavTab } from './components/Navbar';
import { VigileScannerView } from './components/VigileScannerView';
import { SecurityDashboard } from './components/SecurityDashboard';
import { DirectionDashboard } from './components/DirectionDashboard';
import { ReconciliationView } from './components/ReconciliationView';
import { HistoryView } from './components/HistoryView';
import { TicketDemoSheet } from './components/TicketDemoSheet';
import { FichePresentationPDF } from './components/FichePresentationPDF';
import { CameraScannerModal } from './components/CameraScannerModal';
import { AnomalyReportModal } from './components/AnomalyReportModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('TABLET_VIGILE');
  const { isCameraModalOpen, setIsCameraModalOpen } = useSmartExit();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'TABLET_VIGILE' && <ExitControlOnline />}
        {activeTab === 'RESPONSABLE_SECURITE' && <SecurityDashboard />}
        {activeTab === 'RAPPROCHEMENT_CAISSE' && <ReconciliationView />}
        {activeTab === 'DASHBOARD_DIRECTION' && <DirectionDashboard />}
        {activeTab === 'HISTORIQUE' && <HistoryView />}
        {activeTab === 'TICKETS_TEST' && (
          <TicketDemoSheet onSwitchToTablet={() => setActiveTab('TABLET_VIGILE')} />
        )}
        {activeTab === 'FICHE_PDF' && <FichePresentationPDF />}
      </main>

      {/* Modals */}
      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
      />
      <AnomalyReportModal />
    </div>
  );
};

export default function App() {
  return (
    <SmartExitProvider>
      <AppContent />
    </SmartExitProvider>
  );
}
