import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { PlayCircle, CheckCircle2, ChevronRight, ArrowRight, RotateCcw, ShieldCheck, Box, Activity, Lock, Layers } from 'lucide-react';

interface DemoStep {
  stepNumber: number;
  title: string;
  description: string;
  actionLabel: string;
  actionHandler: () => void;
  targetView: string;
}

export const SIHDemoView: React.FC = () => {
  const { triggerScenario, toggleHold, switchSector, setActiveView, isNetworkOnline, toggleNetworkOnline } = useUBIP();
  const [currentStep, setCurrentStep] = useState(1);

  const demoSteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Physical Asset Registration',
      description: 'Physical turbine rotor blade ASSET-001 is registered on the AssetRegistry.sol smart contract.',
      actionLabel: '1. Register Asset',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'live-assets'
    },
    {
      stepNumber: 2,
      title: 'Scan Hardware RFID Tag',
      description: 'MFRC522 RFID scanner reads physical tag UBIP-ASSET-001 and binds to device ESP32-001.',
      actionLabel: '2. Scan RFID',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'live-assets'
    },
    {
      stepNumber: 3,
      title: 'Receive Real-Time Sensor Telemetry',
      description: 'ESP32 transmits temperature (42.4°C), vibration (0.21G), and gas (112 PPM) sensor readings.',
      actionLabel: '3. Ingest Telemetry',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'digital-twin'
    },
    {
      stepNumber: 4,
      title: 'AI Anomaly Model Baseline Check',
      description: 'Statistical EWMA and 3-sigma Z-score algorithms confirm operating values are strictly nominal.',
      actionLabel: '4. Run AI Check',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'ai-intelligence'
    },
    {
      stepNumber: 5,
      title: 'Record Blockchain Provenance',
      description: 'Canonical SHA-256 hash is committed to ProvenanceRegistry.sol and awarded 15 UBIP validator credits.',
      actionLabel: '5. Record On-Chain',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'blockchain'
    },
    {
      stepNumber: 6,
      title: 'Mint Digital Asset Passport (NFT)',
      description: 'ERC-721 UBIP Asset Passport #001 is minted on-chain tethered to physical hardware RFID.',
      actionLabel: '6. Mint NFT Passport',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'asset-passport'
    },
    {
      stepNumber: 7,
      title: 'Simulate Physical Telemetry Anomaly',
      description: 'Mechanical bearing wear causes vibration surge to 2.45G and temperature rise to 84.6°C.',
      actionLabel: '7. Trigger Anomaly',
      actionHandler: () => { triggerScenario('ANOMALY'); },
      targetView: 'digital-twin'
    },
    {
      stepNumber: 8,
      title: 'AI Detects Mechanical Anomaly',
      description: 'AI Trust Engine flags HIGH anomaly (Z-score: 8.4) and SNN spike train increases to 88 Hz.',
      actionLabel: '8. Inspect AI Anomaly',
      actionHandler: () => {},
      targetView: 'ai-intelligence'
    },
    {
      stepNumber: 9,
      title: 'Simulate Off-Chain Data Tampering',
      description: 'Attacker modifies intercepted temperature telemetry from 42.2°C to 82.2°C without valid private key.',
      actionLabel: '9. Simulate Tamper',
      actionHandler: () => { triggerScenario('TAMPER'); },
      targetView: 'security-center'
    },
    {
      stepNumber: 10,
      title: 'Blockchain Detects Integrity Mismatch',
      description: 'Canonical SHA-256 hash recalculation fails comparison with signed edge hash.',
      actionLabel: '10. Verify Hash Mismatch',
      actionHandler: () => {},
      targetView: 'security-center'
    },
    {
      stepNumber: 11,
      title: 'Smart Contract Places Asset on Emergency Hold',
      description: 'MaintenanceWorkflow.sol & AssetRegistry.sol trigger automated workflow lockdown.',
      actionLabel: '11. Inspect Smart Contract Hold',
      actionHandler: () => { toggleHold('ASSET-001', true); },
      targetView: 'blockchain'
    },
    {
      stepNumber: 12,
      title: '3D Digital Twin Reacts Instantly',
      description: 'Interactive 3D model turns crimson red with containment shield wireframe.',
      actionLabel: '12. View 3D Twin Response',
      actionHandler: () => {},
      targetView: 'digital-twin'
    },
    {
      stepNumber: 13,
      title: 'Simulate Network Blackout (Offline Mode)',
      description: 'Uplink is cut. Raspberry Pi gateway continues local operation with store-and-forward SQLite queue.',
      actionLabel: '13. Disconnect Network',
      actionHandler: () => { toggleNetworkOnline(false); },
      targetView: 'offline-network'
    },
    {
      stepNumber: 14,
      title: 'Edge Continues Local Integrity Logging',
      description: 'Events are queued with sequence numbers and local hash chaining without data loss.',
      actionLabel: '14. Ingest Offline Events',
      actionHandler: () => { triggerScenario('NORMAL'); },
      targetView: 'offline-network'
    },
    {
      stepNumber: 15,
      title: 'Restore Network Uplink',
      description: 'Cellular/satellite communication returns.',
      actionLabel: '15. Reconnect Link',
      actionHandler: () => { toggleNetworkOnline(true); },
      targetView: 'offline-network'
    },
    {
      stepNumber: 16,
      title: 'Automated Synchronization & Verification',
      description: 'Buffered events are batch-committed and verified on the blockchain ledger.',
      actionLabel: '16. Verify Auto-Sync',
      actionHandler: () => {},
      targetView: 'blockchain'
    },
    {
      stepNumber: 17,
      title: 'Audit Trail Verification',
      description: 'View the end-to-end cryptographic hash logs and consensus proofs.',
      actionLabel: '17. Inspect Audit Log',
      actionHandler: () => {},
      targetView: 'audit-trail'
    },
    {
      stepNumber: 18,
      title: 'Switch Sector to Healthcare / Cold-Chain',
      description: 'Demonstrate sector-adapter architecture: Same core seamlessly re-configures for -80°C mRNA vaccine shipper.',
      actionLabel: '18. Switch Sector',
      actionHandler: () => { switchSector('healthcare'); },
      targetView: 'sector-hub'
    },
    {
      stepNumber: 19,
      title: 'Post-Quantum Cryptography (PQC) Migration',
      description: 'Execute live ML-KEM-768 and ML-DSA-65 NIST FIPS 203/204 benchmarks.',
      actionLabel: '19. Run PQC Benchmark',
      actionHandler: () => {},
      targetView: 'pqc-center'
    },
    {
      stepNumber: 20,
      title: 'Cognitive Multi-Agent Consensus',
      description: 'Inspect 7-Agent collaborative reasoning traces powering autonomous decision bounds.',
      actionLabel: '20. Review Cognitive Trace',
      actionHandler: () => {},
      targetView: 'cognitive-orchestrator'
    }
  ];

  const handleExecuteStep = (step: DemoStep) => {
    step.actionHandler();
    setActiveView(step.targetView as any);
    if (currentStep < 20) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-emerald-400" />
            <span>SIH 2026 20-Step Guided Golden Path Demonstration</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Complete automated 2-5 minute step-by-step hackathon jury presentation proving physical evidence, AI trust, smart contract holds, and PQC security.
          </p>
        </div>

        <button
          onClick={() => { setCurrentStep(1); triggerScenario('NORMAL'); }}
          className="px-3.5 py-1.5 rounded-xl bg-ubip-800 hover:bg-ubip-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Flow</span>
        </button>
      </div>

      {/* Steps List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        {demoSteps.map((step) => {
          const isCurrent = currentStep === step.stepNumber;
          const isCompleted = currentStep > step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent 
                  ? 'bg-ubip-850 border-emerald-500/80 shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/50' 
                  : isCompleted 
                  ? 'bg-ubip-900/60 border-ubip-700/40 text-slate-400' 
                  : 'bg-ubip-900/40 border-ubip-700/20 text-slate-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                    isCurrent ? 'bg-emerald-500 text-black' : 'bg-ubip-800 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : step.stepNumber}
                  </span>
                  <div className="font-bold text-white text-xs">{step.title}</div>
                </div>

                <button
                  onClick={() => handleExecuteStep(step)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isCurrent 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20' 
                      : 'bg-ubip-800 hover:bg-ubip-700 text-slate-300'
                  }`}
                >
                  {step.actionLabel}
                </button>
              </div>

              <p className="text-slate-300 text-[11px] mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
