import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  RefreshCw,
  Activity,
  Compass,
  Clock,
  FileWarning,
  Lock,
  Copy,
  WifiOff,
  Cpu,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Terminal,
  Zap
} from 'lucide-react';

interface AttackScenario {
  id: string;
  type: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  detectionMechanism: string;
  quarantineAction: string;
}

const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: '1',
    type: 'RFID_CLONE',
    name: '1. Physical RFID Cloning & Velocity Violation',
    category: 'Identity',
    description: 'Broadcasts duplicate asset identity in Zone C 2 seconds after Zone A (impossible travel velocity >2400 km/h).',
    icon: Radio,
    detectionMechanism: 'Truth Fusion Engine calculates spatial-temporal velocity delta $\\Delta x / \\Delta t$.',
    quarantineAction: 'Quarantines duplicate device DID; triggers hardware buzzer on edge node.'
  },
  {
    id: '2',
    type: 'REPLAY_ATTACK',
    name: '2. Stale Telemetry Event Replay Attack',
    category: 'Network',
    description: 'Replays 1-hour old cryptographically signed telemetry packet to mask an ongoing physical turbine overheat.',
    icon: RefreshCw,
    detectionMechanism: 'Sequence nonce watermark check fails against on-chain block height.',
    quarantineAction: 'Drops packet at edge gateway; records replay penalty in reputation matrix.'
  },
  {
    id: '3',
    type: 'SENSOR_TAMPERING',
    name: '3. Sensor Payload & Temperature Modification',
    category: 'Physical',
    description: 'Mutates in-transit temperature payload to 92.4°C without valid hardware private key signature.',
    icon: Activity,
    detectionMechanism: 'Deterministic RFC 8785 JSON canonical SHA-256 hash divergence.',
    quarantineAction: 'AssetRegistry.sol executes emergency `toggleHold(assetId)` on-chain.'
  },
  {
    id: '4',
    type: 'LOCATION_SPOOF',
    name: '4. Impossible GPS Geospatial Spoofing',
    category: 'Spatial',
    description: 'Injects fake coordinates placing asset in Bay of Bengal while connected to NTPC Ramagundam power bus.',
    icon: Compass,
    detectionMechanism: 'Spatial boundary containment check against sovereign geofence envelope.',
    quarantineAction: 'Flags asset as SUSPICIOUS; halts automated dispatch workflow.'
  },
  {
    id: '5',
    type: 'TIMESTAMP_MANIPULATION',
    name: '5. Hardware Clock Drift / RTC Manipulation',
    category: 'Temporal',
    description: 'Desynchronizes hardware RTC clock into future (+24 hours) to falsify SLA compliance window.',
    icon: Clock,
    detectionMechanism: 'Byzantine validator NTP consensus timestamp window $\\pm 15\\text{ seconds}$.',
    quarantineAction: 'Rejects block inclusion; forces edge hardware NTP resynchronization.'
  },
  {
    id: '6',
    type: 'MODIFIED_TELEMETRY',
    name: '6. In-Flight Man-in-the-Middle Telemetry Surge',
    category: 'Cryptography',
    icon: FileWarning,
    description: 'MITM gateway injects false vibration surges to trigger illegitimate maintenance claims.',
    detectionMechanism: 'NIST FIPS 204 ML-DSA-65 post-quantum signature verification failure.',
    quarantineAction: 'Isolates MITM node; triggers zero-trust perimeter containment.'
  },
  {
    id: '7',
    type: 'UNAUTHORIZED_DEVICE',
    name: '7. Rogue Unenrolled Device DID Injection',
    category: 'Zero-Trust',
    icon: Lock,
    description: 'Injects unauthorized counterfeit ESP32 node attempting to impersonate Unit #4 sensors.',
    detectionMechanism: 'DID authentication against W3C Decentralized Identity Registry fails.',
    quarantineAction: 'Blacklists rogue device MAC/DID; sends incident log to SOC dashboard.'
  },
  {
    id: '8',
    type: 'DUPLICATE_ASSET_IDENTITY',
    name: '8. Duplicate Asset Token Minting Collision',
    category: 'DLT',
    icon: Copy,
    description: 'Simulates dual active ERC-721 Digital Asset Passports for same physical machine serial.',
    detectionMechanism: 'Smart contract singleton asset-registry mapping collision check.',
    quarantineAction: 'Reverts transaction with EVM revert string `ErrDuplicateAssetPassport`.'
  },
  {
    id: '9',
    type: 'COMMUNICATION_INTERRUPTION',
    name: '9. Physical Uplink Jamming / Blackout',
    category: 'Resilience',
    icon: WifiOff,
    description: 'Disconnects internet bridge; tests offline store-and-forward SQLite cryptographic buffer.',
    detectionMechanism: 'Heartbeat liveness detector flags offline status within 3 missing pulses.',
    quarantineAction: 'Edge node buffers signed packets locally; reconciles upon reconnect with 0 loss.'
  },
  {
    id: '10',
    type: 'STALE_TELEMETRY',
    name: '10. Sensor Freeze / Zero-Entropy Anomaly',
    category: 'AI Defense',
    icon: Cpu,
    description: 'Feeds artificially frozen identical ADC readings (0 variance) to simulate dead sensor bypass.',
    detectionMechanism: 'Shannon Entropy threshold detector flags flatlined sensor stream ($H < 0.05$).',
    quarantineAction: 'Switches to redundant secondary sensor channel automatically.'
  }
];

export const SecurityOperationsCenterView: React.FC = () => {
  const { assets, latestEvent, triggerScenario } = useUBIP();
  const [selectedAttack, setSelectedAttack] = useState<AttackScenario>(ATTACK_SCENARIOS[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [attackResult, setAttackResult] = useState<any>(null);
  const [recoveryMsg, setRecoveryMsg] = useState<string | null>(null);

  const asset = assets[0] || {
    asset_id: 'ASSET-001',
    name: 'NTPC Ramagundam Unit #4 Turbine Blade',
    state: 'ACTIVE',
    is_held: false
  };

  const isTampered = latestEvent?.is_tampered || asset.state === 'TAMPERED' || !!attackResult;

  const handleRunAttack = async (scenario: AttackScenario) => {
    setSelectedAttack(scenario);
    setIsExecuting(true);
    setRecoveryMsg(null);
    try {
      const res = await fetch('/api/attack-lab/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: scenario.type, target_asset: 'ASSET-001' })
      }).then(r => r.json());

      if (res.success) {
        setAttackResult(res.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRecover = async () => {
    setIsRecovering(true);
    try {
      await fetch('/api/recoveries/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: 'ASSET-001',
          device_id: 'ESP32-S3-001',
          trigger: 'SOC Officer Emergency Recovery Authorization'
        })
      });

      triggerScenario('NORMAL');
      setAttackResult(null);
      setRecoveryMsg('Asset credential re-attested & unquarantined. Provenance state restored to VERIFIED.');
      setTimeout(() => setRecoveryMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-sans">
              Screen 4 · Cybersecurity & Anomaly Detection
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Threat Containment Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Simulated Attack Containment & Byzantine Quarantine</span>
          </h1>
        </div>

        {/* Global Security Status Pill */}
        <div className="flex items-center gap-2">
          {isTampered ? (
            <button
              onClick={handleRecover}
              disabled={isRecovering}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
            >
              <RotateCcw className={`w-4 h-4 ${isRecovering ? 'animate-spin' : ''}`} />
              <span>{isRecovering ? 'Restoring Ledger...' : '1-Click Trust Recovery'}</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Zero Active Breaches · Perimeter Nominal</span>
            </div>
          )}
        </div>
      </div>

      {/* Recovery Confirmation Banner */}
      <AnimatePresence>
        {recoveryMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 font-mono"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{recoveryMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dominant Hero Element: Interactive Attack-Containment Node Graph */}
      <div className="p-6 rounded-2xl bg-[#0D0F14] border border-[#1E222D] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E222D] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Real-Time Threat Isolation Topology</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isTampered ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isTampered ? 'QUARANTINE ACTIVATED' : 'STATE: SECURE'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live cryptographic topology: Physical Sensor $\rightarrow$ Edge Preprocessing $\rightarrow$ Quarantine Firewall $\rightarrow$ Sovereign Ledger.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Node: <span className="text-slate-200">ESP32-S3-001</span> | Asset: <span className="text-blue-400">NTPC-Unit-4</span>
          </div>
        </div>

        {/* Visual Multi-Node Flow Graph */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Node 1: Physical Sensor */}
          <div className={`p-4 rounded-xl border transition-all ${
            isTampered ? 'bg-rose-950/10 border-rose-500/40' : 'bg-[#111318] border-[#1E222D]'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-[10px]">LAYER 1</span>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-bold text-sm text-white">Physical Microchip</div>
            <p className="text-[11px] text-slate-400 mt-1">
              ESP32-S3 + MIFARE RFID (13.56 MHz)
            </p>
            <div className="mt-3 pt-2 border-t border-[#1E222D] text-[10px] font-mono text-slate-400">
              {isTampered ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Hardware Alert Active
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Silicon Root-of-Trust
                </span>
              )}
            </div>
          </div>

          {/* Node 2: AI & Statistical Filter */}
          <div className={`p-4 rounded-xl border transition-all ${
            isTampered ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-950/20' : 'bg-[#111318] border-[#1E222D]'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-[10px]">LAYER 2</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-bold text-sm text-white">Truth Fusion Filter</div>
            <p className="text-[11px] text-slate-400 mt-1">
              EWMA Z-Score & Velocity Anomaly
            </p>
            <div className="mt-3 pt-2 border-t border-[#1E222D] text-[10px] font-mono text-slate-400">
              {isTampered ? (
                <span className="text-rose-400 font-bold">Anomaly Tripped (18/100)</span>
              ) : (
                <span className="text-emerald-400 font-bold">Kinematic Delta &lt; 2%</span>
              )}
            </div>
          </div>

          {/* Node 3: Zero-Trust Quarantine Firewall */}
          <div className={`p-4 rounded-xl border transition-all ${
            isTampered ? 'bg-rose-950/30 border-rose-500 text-rose-200' : 'bg-[#111318] border-[#1E222D]'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-[10px]">LAYER 3</span>
              <Lock className={`w-4 h-4 ${isTampered ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            </div>
            <div className="font-bold text-sm text-white">Quarantine Barrier</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Smart Contract Policy Firewall
            </p>
            <div className="mt-3 pt-2 border-t border-[#1E222D] text-[10px] font-mono">
              {isTampered ? (
                <span className="text-rose-400 font-bold uppercase tracking-wider">
                  BARRIER SEALED · HOLD
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">Pass-Through Active</span>
              )}
            </div>
          </div>

          {/* Node 4: Sovereign DLT Ledger */}
          <div className="p-4 rounded-xl border bg-[#111318] border-[#1E222D]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-[10px]">LAYER 4</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-bold text-sm text-white">SETU Sovereign Ledger</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Immutable Merkle Patricia Trie
            </p>
            <div className="mt-3 pt-2 border-t border-[#1E222D] text-[10px] font-mono text-emerald-400 font-bold">
              Unbroken State History
            </div>
          </div>
        </div>

        {/* Live Attack Diagnostics / Merkle State Diff */}
        {isTampered && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 text-xs font-mono space-y-2">
            <div className="text-rose-300 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Real-Time Incident Forensic Log</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500">Vector: </span>
                <span className="text-rose-400 font-bold">{selectedAttack.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Action: </span>
                <span className="text-white">{selectedAttack.quarantineAction}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500">Detection Logic: </span>
                <span className="text-slate-200">{selectedAttack.detectionMechanism}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 10 Penetration Vectors Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            10 Hardware & Cryptographic Attack Scenarios (1-Click Test)
          </span>
          <span className="text-xs text-slate-500 font-mono">SIH Grand Finale Lab</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {ATTACK_SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            const isSelected = selectedAttack.id === scenario.id;

            return (
              <div
                key={scenario.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected && isTampered
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                    : 'bg-[#0D0F14] border-[#1E222D] hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#161922] text-rose-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-white text-xs truncate max-w-[240px]">
                        {scenario.name}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#161922] text-slate-400">
                      {scenario.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                    {scenario.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRunAttack(scenario)}
                  disabled={isExecuting}
                  className="w-full py-2 rounded-lg bg-[#161922] hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/40 border border-[#1E222D] text-slate-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-3 h-3 text-rose-400" />
                  <span>Simulate Vector</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
