import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import {
  ShieldAlert,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  Cpu,
  Lock,
  WifiOff,
  Radio,
  Clock,
  Compass,
  FileWarning,
  Copy,
  Volume2,
  Lightbulb,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface AttackScenario {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

const ATTACK_SCENARIOS: AttackScenario[] = [
  { id: '1', type: 'RFID_CLONE', name: '1. Physical RFID Cloning', description: 'Broadcasts duplicate asset identity in Zone C 2s after Zone A (impossible travel velocity).', icon: Radio, color: 'text-orange-400' },
  { id: '2', type: 'REPLAY_ATTACK', name: '2. Stale Event Replay', description: 'Replays 1-hour old signed telemetry packet; rejected by sequence watermark check.', icon: RefreshCw, color: 'text-purple-400' },
  { id: '3', type: 'SENSOR_TAMPERING', name: '3. Sensor Payload Tampering', description: 'Mutates temperature to 92.4°C in transit; fails on-chip SHA-256 signature.', icon: Activity, color: 'text-rose-400' },
  { id: '4', type: 'LOCATION_SPOOF', name: '4. Impossible GPS Movement', description: 'Attempts instant 800km coordinate jump without plausible travel duration.', icon: Compass, color: 'text-amber-400' },
  { id: '5', type: 'TIMESTAMP_MANIPULATION', name: '5. Clock Drift / RTC Tamper', description: 'Desynchronizes hardware timestamp into future (+24h); fails causality check.', icon: Clock, color: 'text-cyan-400' },
  { id: '6', type: 'MODIFIED_TELEMETRY', name: '6. In-Flight MITM Alteration', description: 'Injects false vibration spikes; fails ECDSA / ML-DSA cryptographic verification.', icon: FileWarning, color: 'text-rose-500' },
  { id: '7', type: 'UNAUTHORIZED_DEVICE', name: '7. Unauthorized Device DID', description: 'Injects unapproved rogue ESP32 device DID; dropped by Zero-Trust policy.', icon: Lock, color: 'text-red-400' },
  { id: '8', type: 'DUPLICATE_ASSET_IDENTITY', name: '8. Duplicate Asset Issuance', description: 'Simulates dual active NFT passports for same physical asset on-chain.', icon: Copy, color: 'text-yellow-400' },
  { id: '9', type: 'COMMUNICATION_INTERRUPTION', name: '9. Network Blackout / Jamming', description: 'Disconnects cloud bridge; buffers events in local SQLite store-and-forward queue.', icon: WifiOff, color: 'text-blue-400' },
  { id: '10', type: 'STALE_TELEMETRY', name: '10. Sensor Freeze / Zero-Entropy', description: 'Feeds frozen identical ADC values; caught by AI entropy threshold check.', icon: Cpu, color: 'text-emerald-400' }
];

export const AttackLabView: React.FC = () => {
  const { assets, triggerScenario } = useUBIP();
  const [activeAttackResult, setActiveAttackResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveredMsg, setRecoveredMsg] = useState<string | null>(null);

  const handleRunAttack = async (type: string) => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/attack-lab/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target_asset: 'ASSET-001' })
      }).then(r => r.json());

      if (res.success) {
        setActiveAttackResult(res.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRecoverAsset = async () => {
    setIsRecovering(true);
    try {
      // 1. Advance recovery on backend
      const res = await fetch('/api/recoveries/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: 'ASSET-001',
          device_id: 'ESP32-S3-001',
          trigger: 'Operator Recovery Authorization'
        })
      }).then(r => r.json());

      // 2. Trigger normal scenario to restore baseline
      triggerScenario('NORMAL');
      setRecoveredMsg('Asset credential re-attested & unquarantined. Provenance state restored to VERIFIED.');
      setTimeout(() => setRecoveredMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="surface-card p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Cybersecurity Penetration Testing & Threat Quarantine</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Interactive Attack Laboratory & Hardware Containment
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inject real physical & cryptographic penetration vectors; inspect multi-sensor truth fusion, policy quarantine, and recovery.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-800/50 text-xs font-bold font-mono">
            10 Real Backend Penetration Vectors
          </span>
        </div>
      </div>

      {recoveredMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{recoveredMsg}</span>
        </div>
      )}

      {/* 10 Attack Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ATTACK_SCENARIOS.map(atk => {
          const Icon = atk.icon;
          return (
            <button
              key={atk.id}
              onClick={() => handleRunAttack(atk.type)}
              disabled={isExecuting}
              className="p-4 rounded-xl bg-[#11151C] hover:bg-[#161B24] border border-[#1F242D] hover:border-rose-500/70 transition-all text-left flex flex-col justify-between space-y-2.5 group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500">Vector #{atk.id}</span>
                  <Icon className={`w-4 h-4 ${atk.color}`} />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  {atk.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {atk.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1F242D] flex items-center justify-between text-[11px] text-rose-400 font-semibold">
                <span>Inject Vector</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Containment Trace Console */}
      {activeAttackResult && (
        <div className="surface-card p-6 border-rose-800/60 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F242D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-600 flex items-center justify-center text-rose-400 font-bold font-mono">
                !
              </div>
              <div>
                <span className="text-xs font-mono text-rose-400 font-bold">{activeAttackResult.attack_id}</span>
                <h3 className="text-base font-bold text-white">{activeAttackResult.title}</h3>
                <p className="text-xs text-slate-400">Detected at Layer: <strong className="text-slate-200">{activeAttackResult.detected_at_layer}</strong></p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold font-mono">
                {activeAttackResult.trust_result}
              </span>

              <button
                onClick={handleRecoverAsset}
                disabled={isRecovering}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRecovering ? 'animate-spin' : ''}`} />
                <span>1-Click Recovery</span>
              </button>
            </div>
          </div>

          {/* Hardware Alert Physical Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D] flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-rose-400 animate-bounce" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Hardware Buzzer</span>
                <span className="text-xs font-bold text-rose-300 font-mono">ACTIVE (85 dB ALARM)</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D] flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-red-500 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Node RGB LED</span>
                <span className="text-xs font-bold text-red-400 font-mono">FLASHING RED (QUARANTINE)</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D] flex items-center gap-3">
              <Cpu className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">OLED Enclosure Display</span>
                <span className="text-xs font-bold text-slate-200 font-mono">"SECURITY ALERT: HELD"</span>
              </div>
            </div>
          </div>

          {/* Before vs After Hash Diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 bg-[#0B0D10] rounded-lg border border-[#1F242D]">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Original Canonical Hash (Expected)</span>
              <p className="text-emerald-400 break-all text-[11px]">{activeAttackResult.hash_before}</p>
            </div>
            <div className="p-3.5 bg-[#0B0D10] rounded-lg border border-[#1F242D]">
              <span className="text-[10px] text-rose-400 uppercase block mb-1">Tampered Canonical Hash (Observed)</span>
              <p className="text-rose-400 break-all text-[11px]">{activeAttackResult.hash_after}</p>
            </div>
          </div>

          {/* Layer-by-Layer Propagation Trace */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Layer-by-Layer Cryptographic Containment Audit Trail
            </h4>
            <div className="space-y-1.5">
              {activeAttackResult.propagation_trace?.map((trace: any, idx: number) => (
                <div key={idx} className="p-2.5 bg-[#0B0D10] rounded-lg border border-[#1F242D] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-white shrink-0">{trace.layer}</span>
                    <span className="text-slate-400 truncate">→ {trace.details}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    trace.status === 'CONTAINED' ? 'bg-rose-950 text-rose-300 border border-rose-800/60' :
                    trace.status === 'FLAGGED' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {trace.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
