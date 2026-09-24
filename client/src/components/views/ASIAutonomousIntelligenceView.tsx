import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { 
  BrainCircuit, ShieldAlert, Cpu, Zap, Activity, CheckCircle2, 
  AlertTriangle, RefreshCw, Flame, Radio, Award, Lock, Sparkles,
  ArrowRight, Compass, ShieldCheck, Database, Layers, Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ASIScenario {
  id: string;
  sector: string;
  name: string;
  threat: string;
  severity: 'CRITICAL' | 'HIGH' | 'EMERGENCY';
  detectionTime: string;
  autonomousAction: string;
  proofType: string;
  settlementTx: string;
  impactPrevented: string;
}

const ASI_SCENARIOS: ASIScenario[] = [
  {
    id: 'power-trip',
    sector: 'Critical Energy (NTPC)',
    name: '400kV Grid Cascading Frequency Drop (Dadri Unit-4)',
    threat: 'Unscheduled trip of 660MW generator causing dangerous 48.8Hz grid under-frequency cascade.',
    severity: 'EMERGENCY',
    detectionTime: '0.72 ms',
    autonomousAction: 'ASI triggered micro-shedding of 420MW industrial loads and activated 250MWh battery storage reserves in 850 microseconds before human SCADA operator could respond.',
    proofType: 'NIST ML-DSA-87 + Groth16 ZK-Proof (Gas: 21,400 Gwei)',
    settlementTx: '0x9d4a8f...4e19 (SETU Block #10492)',
    impactPrevented: 'Prevented Northern Regional Grid blackout affecting 280 million citizens.'
  },
  {
    id: 'drdo-jamming',
    sector: 'Defense & Avionics (DRDO)',
    name: 'AESA Radar Phase-Jitter Electronic Countermeasure Attack',
    threat: 'Hostile ground-based electronic jammer injecting nanosecond phase delay into LCA Tejas radar array.',
    severity: 'CRITICAL',
    detectionTime: '0.41 ms',
    autonomousAction: 'ASI isolated compromised antenna subarray, engaged dynamic frequency-hopping L-band waveform, and distributed quantum Dilithium-5 keys to all escort fighters.',
    proofType: 'MIL-STD-1553B Hardware Attestation + ML-KEM-768 Enclave',
    settlementTx: '0x3c71ea...8b21 (SETU Block #10493)',
    impactPrevented: 'Preserved tactical airspace air-superiority bubble with zero radar track drop.'
  },
  {
    id: 'jet-stall',
    sector: 'Civil Aviation (DGCA)',
    name: 'Turbofan Compressor Surge at 36,000 Ft (CFM LEAP-1A)',
    threat: 'Extreme microburst wind shear inducing catastrophic airflow distortion and high-pressure blade stall.',
    severity: 'HIGH',
    detectionTime: '0.64 ms',
    autonomousAction: 'ASI modulated variable stator vane angles by 3.8° and calibrated fuel flow within 620 microseconds, restoring laminar combustion with zero core flameout.',
    proofType: 'FAA/DGCA DO-178C Level-A Compliant Deterministic Proof',
    settlementTx: '0x88f192...c091 (SETU Block #10494)',
    impactPrevented: 'Eliminated inflight engine shutdown for Boeing 787 with 294 passengers.'
  },
  {
    id: 'train-resonance',
    sector: 'Railways (RDSO)',
    name: '160 km/h Bogie Kinetic Harmonic Resonance (Vande Bharat)',
    threat: 'Sub-surface track deformation inducing violent wheel-flange hunt resonance exceeding 0.95 G.',
    severity: 'HIGH',
    detectionTime: '0.88 ms',
    autonomousAction: 'ASI engaged regenerative eddy-current bogie damping and altered traction motor torque distribution across carriages 4 and 5 in 1.1ms, smoothing kinematic oscillation.',
    proofType: 'RDSO-SPEC-4009 Smart Contract Invariant Verification',
    settlementTx: '0x5b29ec...99a4 (SETU Block #10495)',
    impactPrevented: 'Prevented high-speed derailment risk on Delhi-Varanasi high-speed corridor.'
  }
];

export const ASIAutonomousIntelligenceView: React.FC = () => {
  const { assets } = useUBIP();
  const [selectedScenario, setSelectedScenario] = useState<ASIScenario>(ASI_SCENARIOS[0]);
  const [isSimulatingCycle, setIsSimulatingCycle] = useState(false);
  const [cycleProgress, setCycleProgress] = useState(100);
  const [actionLog, setActionLog] = useState<string[]>([
    '[ASI-CORE:T-0ms] Telemetry ingestion: 124,890 sensor vectors correlated across 8 national sectors.',
    '[ASI-MINDS:T-0.3ms] Bayesian Causal Engine identified root-cause node: Dadri 400kV bus.',
    '[ASI-ZK:T-0.6ms] Groth16 safety invariant circuit evaluated true (Invariant #ART-38-CIVIL-SAFETY).',
    '[ASI-ACTUATE:T-0.85ms] Autonomous hardware intervention dispatched via ATECC608A secure element.',
    '[ASI-DLT:T-1.2ms] Immutable Merkle state proof minted on SETU Block #10492.'
  ]);

  const handleRunSwarmCycle = () => {
    setIsSimulatingCycle(true);
    setCycleProgress(0);

    const steps = [
      '[ASI-CORE] Initiating 6-Mind Hyper-Dimensional Swarm Consensus...',
      '[MIND-1: Causal] Evaluating 1,000,000 counterfactual future reality branches...',
      '[MIND-2: Quantum] Verifying NIST FIPS 204 ML-DSA lattice signatures on all telemetry streams...',
      '[MIND-3: Topology] Recalculating dynamic power & transportation flow equilibrium...',
      '[MIND-4: Actuator] Synthesizing sub-millisecond hardware bus actuation command...',
      '[MIND-5: Ethics] Article 38 Constitutional Sovereign Safety constraints: VALIDATED (100%).',
      '[MIND-6: Ledger] Minting Groth16 ZK-SNARK proof & committing state hash to SETU DLT.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCycleProgress(((idx + 1) / steps.length) * 100);
        setActionLog(prev => [step, ...prev.slice(0, 8)]);
        if (idx === steps.length - 1) {
          setIsSimulatingCycle(false);
        }
      }, (idx + 1) * 350);
    });
  };

  const handleSelectScenario = (sc: ASIScenario) => {
    setSelectedScenario(sc);
    setActionLog(prev => [
      `[SCENARIO LOADED] Sector: ${sc.sector} — Incident: ${sc.name}`,
      `[ASI INTERVENTION] Action: ${sc.autonomousAction}`,
      `[PROOF MINTED] ${sc.proofType} (Tx: ${sc.settlementTx})`,
      ...prev.slice(0, 6)
    ]);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Top Banner: Sovereign ASI National Substrate */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-[var(--surface)] to-indigo-950/70 border border-purple-500/30 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Bharat Sovereign ASI Matrix
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                Level-5 Full Autonomy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/40 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                Zero-Human Latency Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Autonomous Artificial Superintelligence substrate securing India's critical infrastructure. 
              Correlates cross-sector telemetry in <strong className="text-purple-300">0.84 milliseconds</strong>, executes deterministic physical failsafes before human cognitive onset, and generates mathematical Groth16 Zero-Knowledge proofs of sovereign constitutional safety.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleRunSwarmCycle}
              disabled={isSimulatingCycle}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2.5 ${
                isSimulatingCycle
                  ? 'bg-purple-900/60 text-purple-300 cursor-not-allowed border border-purple-700/50'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSimulatingCycle ? 'animate-spin' : ''}`} />
              <span>{isSimulatingCycle ? 'Consensus Cycle In Flight...' : 'Engage ASI Swarm Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar for Consensus Cycle */}
        {isSimulatingCycle && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-purple-300">
              <span>Swarm Neural Consensus Synchronization</span>
              <span>{Math.round(cycleProgress)}%</span>
            </div>
            <div className="w-full bg-purple-950/80 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-1.5 bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400"
                style={{ width: `${cycleProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Top Level Telemetry Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>ASI DECISION SPEED</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] font-mono">
            0.84 <span className="text-xs font-normal text-[var(--text-secondary)]">ms</span>
          </div>
          <div className="text-[10px] text-green-400 font-mono">
            ⚡ 535x faster than human reaction (450ms)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>CROSS-SECTOR VECTORS</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] font-mono">
            124,890 <span className="text-xs font-normal text-[var(--text-secondary)]">/sec</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">
            8 Sovereign sectors fully vectorized
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>AUTONOMOUS INTERVENTIONS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-green-400 font-mono">
            54 / 54
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] font-mono">
            100% Zero-failover containment
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>CONSTITUTIONAL ALIGNMENT</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-300 font-mono">
            100.0 <span className="text-xs font-normal text-[var(--text-secondary)]">%</span>
          </div>
          <div className="text-[10px] text-purple-400 font-mono">
            Groth16 mathematical zero-knowledge proof
          </div>
        </div>
      </div>

      {/* Main Body: 6-Mind Council Architecture + Pitch Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): 6 ASI Autonomous Minds Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>The 6 Sovereign ASI Autonomous Minds (Consensus Council)</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Coordinated multi-agent superintelligence architecture eliminating single points of failure.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                ACTIVE SWARM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Mind 1 */}
              <div className="p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                      1
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      Causal Reasoning Mind
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    48-Hr Predictor
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Evaluates 1M counterfactual branches to identify physical failure trajectories (bearing cracks, cavitation) before acoustic detection.
                </p>
                <div className="text-[10px] font-mono text-cyan-300">
                  Model: Quantum Bayesian Multiverse Tree
                </div>
              </div>

              {/* Mind 2 */}
              <div className="p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center font-mono font-bold text-xs">
                      2
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      Zero-Trust Quantum Sentinel
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                    NIST FIPS 204
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Post-quantum ML-DSA cryptographic validator. Neutralizes rogue telemetry packets, adversarial prompt injections, and MITM sensor attacks.
                </p>
                <div className="text-[10px] font-mono text-green-300">
                  Lattice: Kyber-768 & Dilithium-5
                </div>
              </div>

              {/* Mind 3 */}
              <div className="p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-mono font-bold text-xs">
                      3
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      Sub-Millisecond Physical Actuator
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                    &lt; 1.0 ms Bus
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Direct hardware CAN, Modbus, and MIL-STD-1553B bus override. Actuates bypass valves, emergency breakers, and control surfaces.
                </p>
                <div className="text-[10px] font-mono text-yellow-300">
                  Hardware Bus: ATECC608A Protected
                </div>
              </div>

              {/* Mind 4 */}
              <div className="p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
                      4
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      Cross-Sector Topology Mind
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                    Global Swarm
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Dynamic multi-sector load balancer. Re-routes power grid flows, train signalling blocks, and satellite orbital uplinks during regional blackouts.
                </p>
                <div className="text-[10px] font-mono text-purple-300">
                  Mesh: 8 National Sectors Interlinked
                </div>
              </div>

              {/* Mind 5 */}
              <div className="p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      5
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      Constitutional Alignment Mind
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                    Article 38
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Formal verification engine ensuring ASI autonomous actions strictly prioritize human life preservation and sovereign strategic security over economic throughput.
                </p>
                <div className="text-[10px] font-mono text-blue-300">
                  Rule: Strict Sovereign Safety Invariant
                </div>
              </div>

              {/* Mind 6 */}
              <div className="p-3.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] space-y-2 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                      6
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      On-Chain Cryptographic Attestor
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    SETU DLT
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Mints immutable Groth16 zero-knowledge proofs and writes autonomous action receipts to SETU DLT blocks within 2.1 milliseconds for tamper-proof judicial audit.
                </p>
                <div className="text-[10px] font-mono text-indigo-300">
                  Consensus: PoAT Sovereign Proof
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SIH 2026 Judge Scenarios */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] font-mono uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>SIH 2026 Judge Pitch: Test Live ASI Autonomous Interventions</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Click any critical national crisis to watch the ASI Council autonomously detect, verify, and resolve it with cryptographic proofs.
                </p>
              </div>
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                JUDGE EVALUATION SUITE
              </span>
            </div>

            {/* Scenario Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASI_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`p-2.5 rounded-xl text-left transition-all border font-mono ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/60 shadow-md shadow-purple-500/10 text-white'
                        : 'bg-[var(--elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:border-purple-500/30 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-purple-300 truncate">{sc.sector}</div>
                    <div className="text-xs font-extrabold mt-1 truncate">{sc.name.split('(')[0]}</div>
                    <div className="text-[9px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-yellow-400" />
                      <span>{sc.detectionTime}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Scenario Active Detail Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--elevated)] to-purple-950/20 border border-purple-500/30 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                      {selectedScenario.severity} THREAT
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-300">
                      {selectedScenario.sector}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {selectedScenario.name}
                  </h4>
                </div>

                <div className="text-left sm:text-right font-mono text-xs">
                  <div className="text-[var(--text-muted)] text-[10px]">AUTONOMOUS SPEED</div>
                  <div className="text-green-400 font-extrabold text-base flex items-center sm:justify-end gap-1">
                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span>{selectedScenario.detectionTime}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase font-bold tracking-wider">
                    Incident Description:
                  </span>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                    {selectedScenario.threat}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-green-400 uppercase font-bold tracking-wider">
                    ASI Autonomous Intervention Executed:
                  </span>
                  <p className="text-[var(--text-primary)] text-xs font-medium leading-relaxed">
                    {selectedScenario.autonomousAction}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] truncate">
                  <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="truncate">{selectedScenario.proofType}</span>
                </div>
                <div className="text-purple-300 font-bold shrink-0">
                  {selectedScenario.impactPrevented}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Live ASI Cognitive Directive Terminal & Neural Synapse Graph */}
        <div className="space-y-6">
          {/* Animated Synapse Visualizer */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>ASI Neural Topology Graph</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            <div className="relative h-48 w-full rounded-xl bg-black/40 border border-purple-500/20 overflow-hidden flex items-center justify-center">
              {/* Dynamic SVG Synaptic Network */}
              <svg className="w-full h-full" viewBox="0 0 300 180">
                <defs>
                  <linearGradient id="synapseLine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Animated Connection Lines */}
                <line x1="150" y1="90" x2="60" y2="40" stroke="url(#synapseLine)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="150" y1="90" x2="240" y2="40" stroke="url(#synapseLine)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="150" y1="90" x2="60" y2="140" stroke="url(#synapseLine)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="150" y1="90" x2="240" y2="140" stroke="url(#synapseLine)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="150" y1="90" x2="150" y2="25" stroke="url(#synapseLine)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="150" y1="90" x2="150" y2="155" stroke="url(#synapseLine)" strokeWidth="1.5" strokeDasharray="3,3" />

                {/* Satellite Sector Nodes */}
                <circle cx="60" cy="40" r="14" fill="#18181B" stroke="#06B6D4" strokeWidth="2" />
                <text x="60" y="43" textAnchor="middle" fill="#06B6D4" fontSize="8" fontFamily="monospace">POWER</text>

                <circle cx="240" cy="40" r="14" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
                <text x="240" y="43" textAnchor="middle" fill="#A855F7" fontSize="8" fontFamily="monospace">RAIL</text>

                <circle cx="60" cy="140" r="14" fill="#18181B" stroke="#EF4444" strokeWidth="2" />
                <text x="60" y="143" textAnchor="middle" fill="#EF4444" fontSize="8" fontFamily="monospace">DEFENSE</text>

                <circle cx="240" cy="140" r="14" fill="#18181B" stroke="#3B82F6" strokeWidth="2" />
                <text x="240" y="143" textAnchor="middle" fill="#3B82F6" fontSize="8" fontFamily="monospace">AERO</text>

                <circle cx="150" cy="25" r="12" fill="#18181B" stroke="#10B981" strokeWidth="2" />
                <text x="150" y="28" textAnchor="middle" fill="#10B981" fontSize="7" fontFamily="monospace">SPACE</text>

                <circle cx="150" cy="155" r="12" fill="#18181B" stroke="#F59E0B" strokeWidth="2" />
                <text x="150" y="158" textAnchor="middle" fill="#F59E0B" fontSize="7" fontFamily="monospace">HEALTH</text>

                {/* Central ASI Apex Node */}
                <circle cx="150" cy="90" r="24" fill="#2E1065" stroke="#A855F7" strokeWidth="3" />
                <text x="150" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">ASI CORE</text>
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-300 bg-black/60 px-2 py-0.5 rounded border border-purple-500/30">
                Consensus Lattice: 12 Nodes
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
                P2P Delay: 0.12ms
              </div>
            </div>
          </div>

          {/* Real-time Directive Terminal */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>ASI Directive Stream (Live)</span>
              </h3>
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                ONLINE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-[var(--border)] text-[10px] text-slate-300 space-y-2 h-64 overflow-y-auto">
              {actionLog.map((log, i) => (
                <div key={i} className="leading-relaxed border-b border-white/5 pb-1 font-mono">
                  {log.startsWith('[ASI-') || log.startsWith('[MIND-') ? (
                    <span className="text-purple-300 font-bold">{log}</span>
                  ) : log.startsWith('[SCENARIO') ? (
                    <span className="text-yellow-300 font-bold">{log}</span>
                  ) : log.startsWith('[ASI INTERVENTION') ? (
                    <span className="text-green-300">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--elevated)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
              <span>Merkle Root Commitment:</span>
              <span className="text-cyan-400 font-bold font-mono">0x9f4a...4821</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
