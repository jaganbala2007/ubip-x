import React, { useState } from 'react';
import { UBIPProvider, useUBIP } from './context/UBIPContext';
import { SetuProvider } from './context/SetuContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PageTransition } from './components/common/PageTransition';
import { PhysicalNodesView } from './components/views/PhysicalNodesView';
import { OverviewView } from './components/views/OverviewView';
import { TrustUniverseView } from './components/views/TrustUniverseView';
import { LiveAssetsView } from './components/views/LiveAssetsView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { PhysicalEvidenceView } from './components/views/PhysicalEvidenceView';
import { TrustGraphView } from './components/views/TrustGraphView';
import { BlockchainExplorerView } from './components/views/BlockchainExplorerView';
import { AssetPassportNFTView } from './components/views/AssetPassportNFTView';
import { TokenEconomyView } from './components/views/TokenEconomyView';
import { IdentityRegistryView } from './components/views/IdentityRegistryView';
import { SecurityOperationsCenterView } from './components/views/SecurityOperationsCenterView';
import { AttackLabView } from './components/views/AttackLabView';
import { AIIntelligenceView } from './components/views/AIIntelligenceView';
import { ASIAutonomousIntelligenceView } from './components/views/ASIAutonomousIntelligenceView';
import { CognitiveOrchestratorView } from './components/views/CognitiveOrchestratorView';
import { QuantumLabView } from './components/views/QuantumLabView';
import { PQCCenterView } from './components/views/PQCCenterView';
import { SectorHubView } from './components/views/SectorHubView';
import { OfflineNetworkView } from './components/views/OfflineNetworkView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { DisputeCenterView } from './components/views/DisputeCenterView';
import { RecoveryCenterView } from './components/views/RecoveryCenterView';
import { SIHDemoView } from './components/views/SIHDemoView';
import { JudgeModeView } from './components/views/JudgeModeView';
import { SettingsView } from './components/views/SettingsView';
import { OperatorCopilotModal } from './components/common/OperatorCopilotModal';
import { CockpitLoginModal, OperatorProfile } from './components/auth/CockpitLoginModal';

import { IntroSplash } from './components/views/IntroSplash';

const DashboardContent: React.FC = () => {
  const { activeView } = useUBIP();
  const [operator, setOperator] = useState<OperatorProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleLoginSuccess = (profile: OperatorProfile) => {
    setOperator(profile);
    setIsAuthenticated(true);
  };

  const handleLockCockpit = () => {
    setIsAuthenticated(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'physical-nodes': return <PhysicalNodesView />;
      case 'physical-evidence': return <PhysicalEvidenceView />;
      case 'pipeline': return <TrustUniverseView />;
      case 'trust-universe': return <TrustUniverseView />;
      case 'digital-twin': return <DigitalTwinView />;
      case 'attack-lab': return <AttackLabView />;
      case 'blockchain': return <BlockchainExplorerView />;
      case 'identity': return <IdentityRegistryView />;
      case 'pqc-center': return <PQCCenterView />;
      case 'trust-graph': return <TrustGraphView />;
      case 'sector-hub': return <SectorHubView />;
      case 'sectors': return <SectorHubView />;
      case 'quantum-lab': return <QuantumLabView />;
      case 'audit-trail': return <AuditTrailView />;
      case 'judge-mode': return <JudgeModeView />;
      case 'live-assets': return <LiveAssetsView />;
      case 'asset-passport': return <AssetPassportNFTView />;
      case 'token-economy': return <TokenEconomyView />;
      case 'security-center': return <SecurityOperationsCenterView />;
      case 'security': return <SecurityOperationsCenterView />;
      case 'asi-intelligence': return <ASIAutonomousIntelligenceView />;
      case 'asi-matrix': return <ASIAutonomousIntelligenceView />;
      case 'ai-intelligence': return <AIIntelligenceView />;
      case 'cognitive-orchestrator': return <CognitiveOrchestratorView />;
      case 'offline-network': return <OfflineNetworkView />;
      case 'dispute-center': return <DisputeCenterView />;
      case 'recovery-center': return <RecoveryCenterView />;
      case 'sih-demo': return <SIHDemoView />;
      case 'settings': return <SettingsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <IntroSplash key="intro" onComplete={() => setShowIntro(false)} />
      ) : !isAuthenticated ? (
        <CockpitLoginModal
          key="login"
          isOpen={true}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-[var(--canvas)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300"
        >
          <Header
            currentOperator={operator || {
              id: 'OP-7749',
              name: 'Capt. Vikram Sen',
              role: 'NTPC Asset Trust Officer',
              organization: 'NTPC Dadri Strategic Node',
              clearanceLevel: 'Tier-3 (Chief Architect)',
              did: 'did:setu:person:vikram-sen-9842',
              avatarGlow: ''
            }}
            onLockCockpit={handleLockCockpit}
          />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-4.25rem)] bg-[var(--canvas)] transition-colors duration-300">
              <AnimatePresence mode="wait">
                <PageTransition viewKey={activeView}>
                  {renderActiveView()}
                </PageTransition>
              </AnimatePresence>
            </main>
          </div>

          <OperatorCopilotModal />
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export function App() {
  return (
    <ThemeProvider>
      <SetuProvider>
        <UBIPProvider>
          <DashboardContent />
        </UBIPProvider>
      </SetuProvider>
    </ThemeProvider>
  );
}

export default App;
