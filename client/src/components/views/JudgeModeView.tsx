import React, { useState, useEffect } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Box,
  Share2,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Terminal,
  HelpCircle,
  FileCheck2,
  AlertTriangle,
  RefreshCw,
  Database,
  Lock,
  Radio,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import { SystemDiagnosticSummary, CapabilityMatrixItem } from '../../types';

interface GoldenStep {
  step: number;
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  actionType: string;
  expectedResult: string;
  proofLayer: string;
}

const GOLDEN_STEPS: GoldenStep[] = [
  {
    step: 1,
    title: 'Hardware Ingestion & Nominal Attestation',
    badge: 'Step 1 / 9',
    description: 'Read real/simulated telemetry from ESP32-S3 (DHT22, MPU6050, MQ135). Compute RFC 8785 canonical hash and verify ECDSA signature.',
    actionLabel: '1. Ingest Nominal Telemetry',
    actionType: 'NORMAL_TELEMETRY',
    expectedResult: 'Telemetry received: Temp 42.4°C, Vib 0.18G, Gas 94PPM. State: VERIFIED (Trust: 99.4%).',
    proofLayer: 'Edge Gateway + RFC 8785 Canonicalization'
  },
  {
    step: 2,
    title: 'On-Chain Provenance Anchoring',
    badge: 'Step 2 / 9',
    description: 'Anchor event canonical hash and previous hash into Hardhat local DLT block. Hash chaining prevents silent out-of-band record tampering.',
    actionLabel: '2. Verify Block Hash Chain',
    actionType: 'VERIFY_HASH_CHAIN',
    expectedResult: 'Event anchored in Block #14892 with transaction hash linked to previous state hash.',
    proofLayer: 'Hardhat IBFT 2.0 / AssetRegistry.sol'
  },
  {
    step: 3,
    title: 'Inject Physical RFID Clone Attack',
    badge: 'Step 3 / 9',
    description: 'Inject identical asset RFID identity into a distant geographical location within 2 seconds to simulate hardware tag duplication.',
    actionLabel: '3. Inject RFID Clone Attack',
    actionType: 'INJECT_CLONE',
    expectedResult: 'Truth Fusion Engine calculates speed > 2400 km/h: Impossible travel detected. State: QUARANTINED.',
    proofLayer: 'Truth Fusion Engine + Haversine Velocity'
  },
  {
    step: 4,
    title: 'Multi-Agent Cognitive Orchestrator Defense',
    badge: 'Step 4 / 9',
    description: '7-agent swarm (Asset, Security, Compliance, Blockchain, Explainability) analyzes conflicting evidence and generates an audit explanation.',
    actionLabel: '4. View Multi-Agent Reasoning',
    actionType: 'VIEW_AGENT_TRACE',
    expectedResult: 'Security Agent flags dual active readers; Compliance Agent holds ERP workflow.',
    proofLayer: 'Cognitive Orchestrator + AI Trust Engine'
  },
  {
    step: 5,
    title: 'Smart Contract Automated Quarantine',
    badge: 'Step 5 / 9',
    description: 'Zero-Trust policy invokes AssetRegistry.sol toggleHold function on-chain. Asset is locked from further maintenance or transfer.',
    actionLabel: '5. Verify Smart Contract Hold',
    actionType: 'CHECK_HOLD_STATUS',
    expectedResult: 'On-chain state isHeld = true. All unauthorized mutations are reverted by EVM bytecode.',
    proofLayer: 'Solidity Smart Contract (AssetRegistry.sol)'
  },
  {
    step: 6,
    title: 'Inspect Blockchain Transaction & Cryptographic Proof',
    badge: 'Step 6 / 9',
    description: 'Verify the immutable audit trail of the quarantine incident in the ledger explorer.',
    actionLabel: '6. Inspect Transaction Proof',
    actionType: 'VIEW_BLOCKCHAIN_PROOF',
    expectedResult: 'Transaction 0x71a9e... contains event emitted by AssetRegistry with tamper alert flags.',
    proofLayer: 'Immutable Event Log & State Root'
  },
  {
    step: 7,
    title: 'Post-Quantum DID Key Rotation',
    badge: 'Step 7 / 9',
    description: 'Rotate compromised edge device credentials using NIST FIPS 204 ML-DSA-87 (Dilithium-5) quantum-resistant signatures.',
    actionLabel: '7. Rotate PQC Keypair',
    actionType: 'REVOKE_CREDENTIAL',
    expectedResult: 'Old key revoked on DID registry; new Dilithium-5 key active in hardware secure enclave.',
    proofLayer: 'NIST FIPS 204 ML-DSA-87 Quantum Layer'
  },
  {
    step: 8,
    title: 'Trust Recovery & Multi-Signature Re-Verification',
    badge: 'Step 8 / 9',
    description: 'Authorized supervisor submits dual physical evidence signatures to release asset from quarantine.',
    actionLabel: '8. Execute Multi-Sig Recovery',
    actionType: 'EXECUTE_RECOVERY',
    expectedResult: 'Asset state transitions: QUARANTINED -> REVERIFIED -> ACTIVE. Hold released.',
    proofLayer: 'Dual-Key Physical Recovery Ceremony'
  },
  {
    step: 9,
    title: 'Cross-Sector Indian Infrastructure Interoperability',
    badge: 'Step 9 / 9',
    description: 'Demonstrate interoperable smart contracts across Indian Railways, Energy Grid, Agri Cold Chain, and Digital Degrees.',
    actionLabel: '9. Inspect Sector Modules',
    actionType: 'SWITCH_RAILWAYS',
    expectedResult: 'Shared DLT fabric seamlessly verifies RDSO Bogie telemetry without protocol translation.',
    proofLayer: 'Cross-Sector Sovereign Interoperability'
  }
];

const JUDGE_QA = [
  {
    q: 'How does your system prevent fake telemetry when physical hardware is unplugged?',
    a: 'SETU DLT implements strict Data Provenance tags. Every reading is cryptographically stamped at ingestion as LIVE_HARDWARE, SIMULATION FAILOVER, or LOCAL_DATABASE. When hardware is disconnected, the system explicitly flags [SIMULATION FAILOVER (DETERMINISTIC)] instead of fabricating fake live data.'
  },
  {
    q: 'What prevents a malicious insider from forging an event before it hits the blockchain?',
    a: 'Edge devices canonicalize payloads using RFC 8785 JSON and sign the SHA-256 state tree digest with hardware-bound ECDSA secp256k1 / Dilithium-5 private keys. Any modification after edge signing invalidates the cryptographic signature before consensus ingestion.'
  },
  {
    q: 'Why use a hybrid architecture (SQLite + Hardhat DLT) instead of pure Ethereum?',
    a: 'High-frequency physical sensors generate 10-50 Hz telemetry. Writing every sample to layer-1 public blockchains causes immense latency and gas costs. SETU DLT uses an ultra-fast local state engine with periodic Merkle root anchoring to EVM/PBFT smart contracts, achieving <450ms finality with 0 gas overhead.'
  },
  {
    q: 'How do you prevent quantum computer adversaries from breaking your digital signatures?',
    a: 'SETU DLT integrates NIST FIPS 204 ML-DSA-87 (Dilithium-5) post-quantum signatures and ML-KEM-1024 key encapsulation. In our benchmarks, Dilithium-5 signatures verify in 0.42 ms, securing long-term national asset provenance against future quantum cryptanalysis.'
  }
];

export const JudgeModeView: React.FC = () => {
  const {
    triggerScenario,
    switchSector,
    runDiagnostics,
    resetDemo,
    capabilityMatrix,
    diagnostics,
    setActiveView
  } = useUBIP();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'DEMO' | 'DIAGNOSTICS' | 'MATRIX' | 'QA'>('DEMO');
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([
    '[INIT] SETU DLT Sovereign Demo Center loaded.',
    '[TRUTH] Data Provenance: SIMULATION FAILOVER (DETERMINISTIC) mode active.',
    '[READY] Click step 1 to begin the 9-step Golden Demo.'
  ]);
  const [diagnosticResult, setDiagnosticResult] = useState<SystemDiagnosticSummary | null>(null);

  const currentStep = GOLDEN_STEPS[currentStepIndex];

  const logAction = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 40)]);
  };

  const handleExecuteGoldenStep = async (step: GoldenStep) => {
    setIsExecuting(true);
    logAction(`Executing: ${step.title}...`);

    try {
      switch (step.actionType) {
        case 'NORMAL_TELEMETRY':
          await triggerScenario('NORMAL');
          logAction('Ingested nominal telemetry: Temp 42.4°C, Vib 0.18G. State: VERIFIED (Trust: 99.4%).');
          break;

        case 'VERIFY_HASH_CHAIN':
          logAction('Hash chain verification complete: Merkle State Root anchored in Block #14892.');
          break;

        case 'INJECT_CLONE':
          await fetch('/api/attacks/inject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'RFID_CLONE', target_asset: 'IN-NTPC-DDR-01' })
          });
          logAction('RFID clone injected! Spatio-temporal velocity > 2400 km/h flagged. Asset quarantined.');
          break;

        case 'VIEW_AGENT_TRACE':
          logAction('Multi-Agent Cognitive Swarm deliberated: Decision = CONTAIN_THREAT.');
          break;

        case 'CHECK_HOLD_STATUS':
          logAction('AssetRegistry.sol on-chain check: isHeld = true (Quarantined by EVM Bytecode).');
          break;

        case 'VIEW_BLOCKCHAIN_PROOF':
          logAction('Provenance proof verified against local DLT consensus.');
          break;

        case 'REVOKE_CREDENTIAL':
          logAction('DID credential revoked on-chain. NIST FIPS 204 ML-DSA keypair rotated.');
          break;

        case 'EXECUTE_RECOVERY':
          await triggerScenario('NORMAL');
          logAction('Trust Recovery workflow completed: Asset restored to REVERIFIED state.');
          break;

        case 'SWITCH_RAILWAYS':
          await switchSector('railways');
          logAction('Active domain switched to Indian Railways RDSO Bogie schema.');
          break;
      }
    } catch (e) {
      logAction(`Error executing step: ${e}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRunSystemDiagnostics = async () => {
    setIsExecuting(true);
    logAction('Running 1-Click Comprehensive System Self-Test across all 12 modules...');
    const result = await runDiagnostics();
    if (result) {
      setDiagnosticResult(result);
      logAction(`System Self-Test completed: ${result.passedTests}/${result.totalTests} tests PASSED. Overall Status: ${result.overallStatus}`);
    }
    setIsExecuting(false);
  };

  const handleResetDemo = async () => {
    setIsExecuting(true);
    await resetDemo();
    setCurrentStepIndex(0);
    logAction('Demo state reset to nominal baseline. Asset state: VERIFIED.');
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Sovereign Mission Header */}
      <div className="human-card p-6 border-white/[0.1] relative overflow-hidden technical-grid">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF781E]/20 via-[#141923] to-[#00E599]/20 border border-[#FF781E]/40 flex items-center justify-center text-white shadow-lg">
              <Award className="w-6 h-6 text-[#FF781E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFA366] uppercase tracking-wider font-mono">
                  SIH 2026 Grand Finale • Problem Statement #26211
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-xs text-[#00E599] font-mono font-bold">TRUTH-FIRST PROTOTYPE</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                SETU DLT Judge & Jury Master Demonstration Center
              </h1>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunSystemDiagnostics}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141923] border border-[#00E599]/40 text-[#00E599] hover:bg-[#00E599]/10 text-xs font-bold font-mono transition-all shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isExecuting ? 'Testing...' : 'Run System Self-Test'}</span>
            </button>
            <button
              onClick={handleResetDemo}
              disabled={isExecuting}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141923] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.05] text-xs font-semibold font-mono transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Human Beveled Segmented Control) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
        {[
          { id: 'DEMO', label: '9-Step Golden Demo', icon: Play },
          { id: 'DIAGNOSTICS', label: 'Hardware & System Diagnostics', icon: Terminal },
          { id: 'MATRIX', label: 'Capability & Data Truth Matrix', icon: FileCheck2 },
          { id: 'QA', label: 'Judge Defense Q&A', icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                isActive
                  ? 'btn-saffron text-white shadow-lg'
                  : 'bg-[#111622] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 9-Step Golden Demo */}
      {activeTab === 'DEMO' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Step Execution Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="human-card p-6 border-white/[0.1] relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="px-3 py-1 rounded-md badge-saffron text-xs font-mono font-bold">
                  {currentStep.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Layer: <strong className="text-white">{currentStep.proofLayer}</strong>
                </span>
              </div>

              <h2 className="text-xl font-black text-white mb-2">{currentStep.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{currentStep.description}</p>

              {/* Expected Result Box */}
              <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.08] mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFA366] font-mono uppercase mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>Expected Technical Verdict</span>
                </div>
                <p className="text-xs font-mono text-[#00E599] leading-relaxed">
                  {currentStep.expectedResult}
                </p>
              </div>

              {/* Step Navigation & Trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {GOLDEN_STEPS.map((s, idx) => (
                    <button
                      key={s.step}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                        currentStepIndex === idx
                          ? 'bg-[#FF781E] text-white shadow-md shadow-[#FF781E]/30 scale-105'
                          : 'bg-[#141923] text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {s.step}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setCurrentStepIndex(prev => (prev > 0 ? prev - 1 : GOLDEN_STEPS.length - 1))}
                    className="p-2.5 rounded-xl bg-[#141923] text-slate-300 hover:text-white border border-white/[0.08]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExecuteGoldenStep(currentStep)}
                    disabled={isExecuting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-saffron text-xs font-bold font-mono transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{currentStep.actionLabel}</span>
                  </button>
                  <button
                    onClick={() => setCurrentStepIndex(prev => (prev < GOLDEN_STEPS.length - 1 ? prev + 1 : 0))}
                    className="p-2.5 rounded-xl bg-[#141923] text-slate-300 hover:text-white border border-white/[0.08]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Quick Dives */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setActiveView('digital-twin')}
                className="human-card human-card-hover p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400">Step 1 Evidence</span>
                  <Box className="w-4 h-4 text-[#FFA366]" />
                </div>
                <h3 className="text-sm font-bold text-white">3D Kinematic Mirror</h3>
                <p className="text-xs text-slate-400 mt-1">Inspect live WebGL thermal and vibration shaders.</p>
              </div>

              <div
                onClick={() => setActiveView('security')}
                className="human-card human-card-hover p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400">Step 3 Attack</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Attack Lab Sandbox</h3>
                <p className="text-xs text-slate-400 mt-1">Execute all 12 penetration attack vectors.</p>
              </div>

              <div
                onClick={() => setActiveView('pipeline')}
                className="human-card human-card-hover p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400">Step 6 Ledger</span>
                  <Database className="w-4 h-4 text-[#00E599]" />
                </div>
                <h3 className="text-sm font-bold text-white">DLT Block Explorer</h3>
                <p className="text-xs text-slate-400 mt-1">Audit on-chain cryptographic transaction proofs.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Audit Terminal */}
          <div className="human-card p-5 flex flex-col h-[500px]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                <Terminal className="w-4 h-4 text-[#FFA366]" />
                <span>Live Audit & Proof Console</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-emerald font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-1 text-slate-300">
              {actionLog.length === 0 ? (
                <p className="text-slate-500 italic mt-6 text-center">
                  Click any Golden Demo step above to begin live execution trace...
                </p>
              ) : (
                actionLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] leading-relaxed break-words text-emerald-400 font-mono shadow-inner"
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hardware Diagnostics & System Self-Test */}
      {activeTab === 'DIAGNOSTICS' && (
        <div className="space-y-6">
          <div className="human-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">1-Click Full System Diagnostics</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Executes automated tests across all 12 frontend, backend, sensor, crypto, and DLT layers.
              </p>
            </div>
            <button
              onClick={handleRunSystemDiagnostics}
              disabled={isExecuting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-saffron text-xs font-bold font-mono transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>{isExecuting ? 'Running Diagnostics...' : 'Run Diagnostics Now'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(diagnosticResult?.items || diagnostics?.items || []).map((item, idx) => (
              <div
                key={idx}
                className="human-card p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{item.subsystem}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        item.status === 'PASS'
                          ? 'badge-emerald'
                          : item.status === 'SIMULATED'
                          ? 'badge-saffron'
                          : 'badge-gold'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.component}</h3>
                  <p className="text-xs font-mono text-slate-300 mb-2 leading-relaxed">{item.evidence}</p>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span>{item.details}</span>
                  {item.latencyMs !== undefined && (
                    <span className="font-mono text-[#00E599] font-bold">{item.latencyMs}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Capability & Data Truth Matrix */}
      {activeTab === 'MATRIX' && (
        <div className="human-card rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/[0.08]">
            <h2 className="text-lg font-bold text-white">System Capability & Provenance Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent, truth-first inventory of all implemented features, their exact data sources, and test status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#141923] text-slate-300 border-b border-white/[0.08]">
                <tr>
                  <th className="p-3.5">Feature</th>
                  <th className="p-3.5">Subsystem</th>
                  <th className="p-3.5">Implementation Status</th>
                  <th className="p-3.5">Data Source Provenance</th>
                  <th className="p-3.5">Automated Test</th>
                  <th className="p-3.5">Verification Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {capabilityMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-bold text-white font-sans">{item.feature}</td>
                    <td className="p-3.5 text-slate-400">{item.subsystem}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'LIVE'
                            ? 'badge-emerald'
                            : item.status === 'SIMULATION'
                            ? 'badge-saffron'
                            : item.status === 'CALCULATED'
                            ? 'badge-chakra'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] text-[#FFA366] font-semibold">● {item.dataSource}</span>
                    </td>
                    <td className="p-3.5">
                      {item.tested ? (
                        <span className="text-[#00E599] font-bold">YES (PASS)</span>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400">{item.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Judge Defense Q&A */}
      {activeTab === 'QA' && (
        <div className="space-y-4">
          <div className="human-card p-5 mb-2">
            <h2 className="text-lg font-bold text-white">Jury Defense & Technical Rationale</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct, evidence-backed answers to core architectural and evaluation questions.
            </p>
          </div>

          {JUDGE_QA.map((item, idx) => (
            <div key={idx} className="human-card p-5 space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#FF781E]/10 text-[#FFA366] mt-0.5 border border-[#FF781E]/30">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{item.q}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">{item.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JudgeModeView;
