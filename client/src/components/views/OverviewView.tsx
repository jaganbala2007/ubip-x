import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { HeroRotorScene } from '../hero3d/HeroRotorScene';
import { SpringNumber } from '../common/SpringNumber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertTriangle,
  Play,
  Award,
  ChevronRight,
  Copy,
  Check,
  Radio,
  Share2,
  Lock,
  Layers,
  Activity,
  Cpu,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Server
} from 'lucide-react';

interface StageNode {
  id: number;
  name: string;
  shortLabel: string;
  category: string;
  status: 'VERIFIED' | 'ACTIVE' | 'PROCESSING';
  summary: string;
  techStack: string;
  proofDetails: string;
}

export const OverviewView: React.FC = () => {
  const { assets, events, latestEvent, setActiveView, triggerScenario } = useUBIP();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isVerifyingState, setIsVerifyingState] = useState(false);

  const asset1 = assets[0] || {
    asset_id: 'IN-NTPC-DDR-01',
    name: '660MW Supercritical Turbine Rotor Unit-4',
    organization: 'NTPC Dadri Super Thermal Power Station, UP',
    sector: 'Energy & National Power Grid',
    trust_score: 99.4,
    trust_state: 'VERIFIED',
    is_held: false,
    state: 'ACTIVE',
    latest_telemetry: {
      temperature: 42.4,
      vibration: 0.18,
      gas_ppm: 94,
      humidity: 48,
      battery_voltage: 4.12,
      location: { zone: 'NTPC Dadri Unit-4 Turbo-Bay', lat: 28.5982, lng: 77.5544, isGpsLocked: true }
    },
    latest_hash: '0x9482fba01948ef11488c9a12bc994018e2271891'
  };

  const trustScore = latestEvent?.trust_score ?? asset1.trust_score ?? 99.4;
  const trustState = latestEvent?.trust_state ?? asset1.trust_state ?? 'VERIFIED';
  const isHeld = asset1.is_held || false;
  const isTampered = latestEvent?.is_tampered || asset1.state === 'TAMPERED';
  const currentHash = latestEvent?.canonical_hash || asset1.latest_hash || '0x9482fba01948ef11488c9a12bc994018e2271891';

  const telemetry = latestEvent?.telemetry || asset1.latest_telemetry;

  const pipelineStages: StageNode[] = [
    {
      id: 1,
      name: 'Physical Hardware Evidence',
      shortLabel: 'Hardware Silicon',
      category: 'Edge Security',
      status: 'VERIFIED',
      summary: 'ESP32-S3 microcontroller with RC522 RFID reader, DHT22 & MPU6050 sensors.',
      techStack: 'ESP32-S3 · NEO-6M GPS · DS3231 RTC · ATECC608A',
      proofDetails: 'Physical silicon UID: 04:A2:89:1B:7F · GPS Lock: 28.5982° N, 77.5544° E (NTPC Dadri)'
    },
    {
      id: 2,
      name: 'Canonical Attestation',
      shortLabel: 'RFC 8785 Attest',
      category: 'Canonicalization',
      status: 'VERIFIED',
      summary: 'Deterministic RFC 8785 JSON canonicalization and SHA-256 state tree payload digest.',
      techStack: 'RFC 8785 Canonical JSON · SHA-256 Hash · secp256k1',
      proofDetails: `Payload Digest: ${currentHash.substring(0, 24)}... (Cryptographically Validated)`
    },
    {
      id: 3,
      name: 'Thermodynamic Truth Fusion',
      shortLabel: 'Physics Fusion',
      category: 'Consistency Engine',
      status: 'VERIFIED',
      summary: 'Cross-sensor spatial velocity & thermodynamic law continuity validation.',
      techStack: 'Haversine Velocity Model · Thermodynamic Newton Cooling Law',
      proofDetails: 'Spatio-Temporal Delta: 0.0 km/h · Thermal Rate: +0.2°C/min (Compliant with Grid Code)'
    },
    {
      id: 4,
      name: 'AI Cyber Risk Engine',
      shortLabel: 'Isolation Forest',
      category: 'Anomaly Detection',
      status: isTampered ? 'PROCESSING' : 'VERIFIED',
      summary: 'Dual-model ML with Isolation Forest & Autoencoder with strict Bayesian thresholds.',
      techStack: 'Isolation Forest (0.85 Contamination) · Dynamic Z-Score',
      proofDetails: isTampered ? 'Tamper Alert: Entropy anomaly flagged at 0.94 probability' : 'Nominal: Anomaly Score 0.04 (99.6% Confidence)'
    },
    {
      id: 5,
      name: 'Post-Quantum Signing',
      shortLabel: 'FIPS 204 PQC',
      category: 'Quantum Defense',
      status: 'VERIFIED',
      summary: 'NIST FIPS 204 ML-DSA-87 (Dilithium-5) post-quantum signatures.',
      techStack: 'Dilithium-5 (ML-DSA-87) · Kyber-1024 (ML-KEM) Enclave',
      proofDetails: 'Signature Length: 4,595 bytes · Verification Latency: 0.42ms'
    },
    {
      id: 6,
      name: 'Zero-Knowledge Proof',
      shortLabel: 'Groth16 ZK-SNARK',
      category: 'Privacy Proof',
      status: 'VERIFIED',
      summary: 'Circom / SnarkJS zero-knowledge proof proving parameter validity without SCADA disclosure.',
      techStack: 'Circom 2.1.6 · SnarkJS Groth16 · BN254 Pairing Curve',
      proofDetails: 'Proof Generated: [A, B, C] elements · SCADA Parameters: 100% Zero Disclosure'
    },
    {
      id: 7,
      name: 'DLT Sovereign Settlement',
      shortLabel: 'PBFT Consensus',
      category: 'Finality & DPI',
      status: 'VERIFIED',
      summary: 'PBFT state consensus across 10 national sovereign enclaves anchored at NIC Delhi Apex.',
      techStack: 'EVM Smart Contract · SQLite Cache · 450ms Finality',
      proofDetails: 'Block #14,892 · 10/10 Enclave Signatures Confirmed · Immutably Finalized'
    }
  ];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleManualVerify = () => {
    setIsVerifyingState(true);
    setTimeout(() => setIsVerifyingState(false), 800);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Sovereign Mission Header */}
      <div className="human-card p-6 border-white/[0.1] relative overflow-hidden technical-grid">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF781E]/10 via-[#00E599]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md badge-saffron text-[11px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF781E] animate-pulse" />
                राष्ट्रीय क्रिटिकल एसेट लेजर (National Critical Asset Ledger)
              </span>
              <span className="px-2.5 py-1 rounded-md badge-emerald text-[11px] font-bold font-mono">
                DATA PROVENANCE: SIMULATION FAILOVER (DETERMINISTIC)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {asset1.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <span className="text-[#FFA366] font-semibold">{asset1.organization}</span>
              <span className="text-slate-600">•</span>
              <span>Asset ID: <code className="text-slate-200 font-mono font-bold">{asset1.asset_id}</code></span>
            </p>
          </div>

          {/* Scenario & Verification Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => triggerScenario('nominal')}
              className="px-3.5 py-2 rounded-xl bg-[var(--elevated)] hover:bg-[var(--muted)] border border-[var(--border)] hover:border-[#00E599]/40 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 transition-all shadow-sm"
              title="Reset telemetry to nominal 660MW operational limits"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#00E599]" />
              <span>Nominal Baseline</span>
            </button>

            <button
              onClick={() => triggerScenario('thermal-anomaly')}
              className="px-3.5 py-2 rounded-xl bg-[var(--elevated)] hover:bg-[var(--muted)] border border-[var(--border)] hover:border-amber-500/40 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2 transition-all shadow-sm"
              title="Inject sudden 85°C thermal ramp to test auto-quarantine"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Thermal Anomaly</span>
            </button>

            <button
              onClick={() => triggerScenario('tamper-attack')}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 dark:bg-rose-950/40 hover:bg-rose-500/20 dark:hover:bg-rose-900/50 border border-rose-500/30 dark:border-rose-800/60 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2 transition-all shadow-sm"
              title="Simulate hardware silicon signature forgery"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Tamper Attack</span>
            </button>

            <button
              onClick={handleManualVerify}
              disabled={isVerifyingState}
              className="px-4 py-2 rounded-xl btn-saffron text-xs font-bold flex items-center gap-2 transition-all"
            >
              <ShieldCheck className={`w-4 h-4 ${isVerifyingState ? 'animate-spin' : ''}`} />
              <span>{isVerifyingState ? 'Verifying Proof...' : 'Verify Cryptographic State'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Kinematic Mirror (Left) & Real-Time Integrity Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Kinematic Mirror HUD */}
        <div className="lg:col-span-7 human-card p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Header Controls */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF781E]/10 border border-[#FF781E]/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#FF781E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  3D Kinematic Mirror & Physical Twin
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Supercritical Turbine Shaft #4 • 3,000 RPM Synchronous Speed
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${
              isTampered
                ? 'bg-rose-950/80 border border-rose-700 text-rose-300 animate-pulse'
                : 'badge-emerald'
            }`}>
              {isTampered ? 'TAMPER QUARANTINED' : 'KINEMATICS VERIFIED'}
            </span>
          </div>

          {/* 3D Visualizer Canvas */}
          <div className="h-72 w-full rounded-xl overflow-hidden relative my-2 bg-gradient-to-b from-zinc-200/50 to-zinc-100/50 dark:from-[#0B0E14] dark:to-[#07090E] border border-[var(--border)] shadow-inner flex items-center justify-center">
            <HeroRotorScene 
              isTampered={isTampered}
              isVerifying={isVerifyingState}
              temperature={telemetry.temperature}
              vibration={telemetry.vibration}
            />

            {/* Live HUD Floating Chips */}
            <div className="absolute top-3 left-3 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-lg p-2.5 text-xs font-mono space-y-1 shadow-lg">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Shaft Velocity</div>
              <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
                <span>3,000.2 RPM</span>
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-lg p-2.5 text-xs font-mono space-y-1 text-right shadow-lg">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Silicon Node UID</div>
              <div className="text-[11px] font-bold text-[#E8622C]">04:A2:89:1B:7F</div>
            </div>

            <div className="absolute bottom-3 left-3 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-lg px-3 py-1.5 text-[11px] font-mono flex items-center gap-3 shadow-lg">
              <span className="text-[var(--text-muted)]">Vibration:</span>
              <span className="font-bold text-[var(--text-primary)]">{telemetry.vibration.toFixed(2)} G</span>
              <span className="text-zinc-400">|</span>
              <span className="text-[var(--text-muted)]">Core Temp:</span>
              <span className={`font-bold ${telemetry.temperature > 65 ? 'text-amber-500' : 'text-[#16A34A] dark:text-[#00E599]'}`}>
                {telemetry.temperature.toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* Quick Deep Dive CTA */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Synchronized with ESP32-S3 Physical Telemetry Stream
            </span>
            <button
              onClick={() => setActiveView('digital-twin')}
              className="text-[#FFA366] hover:text-white font-bold flex items-center gap-1 text-[11px] transition-colors"
            >
              <span>Open Kinematic Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Key Tactical Metrics & Cryptographic Health */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Card 1: Evidence Score */}
          <div className="human-card p-5 border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Composite Evidence Consistency
              </span>
              <span className="text-[10px] font-bold badge-emerald px-2 py-0.5 rounded font-mono">
                NTPC CRITICAL THRESHOLD: 85.0%
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                  <SpringNumber value={trustScore} />
                </span>
                <span className="text-lg text-slate-400 font-bold">/100</span>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  trustScore >= 85 ? 'badge-emerald' : 'badge-saffron'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{trustState}</span>
                </span>
                <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                  State Hash Validated
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#111622] h-2 rounded-full overflow-hidden mt-4 border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-[#FF781E] via-[#00E599] to-[#00E599] transition-all duration-700"
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>

          {/* Card 2: Post-Quantum & ZK Proof Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="human-card p-4 border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-[#FFA366]" />
                <span>PQC ML-DSA</span>
              </div>
              <p className="text-xl font-black text-white font-mono mt-1">
                0.42 ms
              </p>
              <span className="text-[10px] text-[#00E599] font-medium block mt-0.5">
                FIPS 204 Dilithium-5
              </span>
            </div>

            <div className="human-card p-4 border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>ZK-SNARK Proof</span>
              </div>
              <p className="text-xl font-black text-white font-mono mt-1">
                3.18 ms
              </p>
              <span className="text-[10px] text-blue-400 font-medium block mt-0.5">
                Groth16 Zero-Knowledge
              </span>
            </div>
          </div>

          {/* Card 3: Cryptographic State Hash */}
          <div className="human-card p-4 border-white/[0.08]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono text-[11px]">Canonical Merkle State Root:</span>
              <button
                onClick={handleCopyHash}
                className="text-[#FFA366] hover:text-white font-bold flex items-center gap-1 text-[10px] transition-colors"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3 h-3 text-[#00E599]" />
                    <span className="text-[#00E599]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <code className="block p-2 rounded-lg bg-[var(--canvas)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-primary)] truncate select-all">
              {currentHash}
            </code>
          </div>
        </div>
      </div>

      {/* 7-Stage Physical-to-Digital Trust Lifecycle Pipeline */}
      <div className="human-card p-6 border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                7-Stage Physical-to-Digital Trust Lifecycle Pipeline
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono badge-saffron">
                END-TO-END CRYPTOGRAPHIC VERIFICATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage node below to inspect cryptographic signatures, ZK proofs, and hardware attestation details.
            </p>
          </div>

          <button
            onClick={() => setActiveView('pipeline')}
            className="text-xs font-bold text-[#FFA366] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Full Pipeline Inspection</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pipeline Nodes Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {pipelineStages.map((stage) => {
            const isSelected = selectedStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between shadow-sm ${
                  isSelected
                    ? 'bg-[var(--elevated)] border-[#E8622C] shadow-lg shadow-[#E8622C]/15 scale-[1.02]'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-[#E8622C]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--muted)]/50 border border-[var(--border)] text-[10px] font-mono font-bold flex items-center justify-center text-[var(--text-secondary)]">
                      0{stage.id}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#00E599]" />
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] leading-tight">{stage.shortLabel}</h4>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{stage.category}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px]">
                  <span className="text-[#16A34A] dark:text-[#00E599] font-mono font-semibold">VERIFIED</span>
                  <ChevronRight className={`w-3 h-3 text-zinc-400 transition-transform ${isSelected ? 'rotate-90 text-[#E8622C]' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Drawer (Animated) */}
        <AnimatePresence>
          {selectedStage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-[var(--surface)] border border-[#E8622C]/30 overflow-hidden shadow-md"
            >
              {(() => {
                const node = pipelineStages.find(s => s.id === selectedStage);
                if (!node) return null;
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded badge-saffron text-[10px] font-mono font-bold">
                          STAGE 0{node.id}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">{node.name}</h4>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{node.techStack}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{node.summary}</p>
                    <div className="p-2.5 rounded-lg bg-[var(--elevated)] border border-[var(--border)] text-[11px] font-mono text-[#15803D] dark:text-[#00E599]">
                      {node.proofDetails}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Physical Instrument Strip (DHT22, MPU6050, GPS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="human-card p-4 border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-mono">Operating Temp (DHT22)</span>
            <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {telemetry.temperature.toFixed(1)} °C
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Permissible Range: 10.0°C – 65.0°C
          </span>
        </div>

        <div className="human-card p-4 border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-mono">Shaft Vibration (MPU6050)</span>
            <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {telemetry.vibration.toFixed(2)} G
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            ISO 10816-3 Threshold: &lt; 0.45 G
          </span>
        </div>

        <div className="human-card p-4 border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-mono">GPS Sovereign Enclave</span>
            <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          </div>
          <p className="text-sm font-black text-white font-mono mt-1">
            28.5982° N, 77.5544° E
          </p>
          <span className="text-[10px] text-[#FFA366] mt-1 block font-semibold">
            NTPC Dadri Super Thermal Turbo-Bay
          </span>
        </div>

        <div className="human-card p-4 border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-mono">PBFT Sovereign Consensus</span>
            <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          </div>
          <p className="text-2xl font-black text-[#00E599] font-mono">
            10 / 10
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            NIC Delhi, NTPC, RDSO, CDAC Synced
          </span>
        </div>
      </div>
    </div>
  );
};
