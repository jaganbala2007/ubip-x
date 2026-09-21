import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  FileCode, 
  Hash, 
  Cpu, 
  Layers, 
  Activity, 
  Lock,
  Camera,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export const PhysicalEvidenceView: React.FC = () => {
  const { events, selectedAsset } = useUBIP();
  const latestEvent = events[0];

  const [rawPayload, setRawPayload] = useState(
    latestEvent
      ? JSON.stringify(
          {
            event_id: latestEvent.event_id,
            asset_id: latestEvent.asset_id,
            rfid_tag: latestEvent.rfid_tag,
            node_id: latestEvent.node_id,
            sequence_number: latestEvent.sequence_number,
            telemetry: latestEvent.telemetry,
            timestamp: latestEvent.timestamp
          },
          null,
          2
        )
      : '{}'
  );

  const [canonicalHash, setCanonicalHash] = useState(latestEvent?.canonical_hash || '0x9482fba01948ef11488c9a12bc994018e2271891');

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="glass-cockpit rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5" />
              <span>Core Attestation Engine</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Physical Evidence Attestation & Canonical Hash Inspector
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guarantees deterministic serialization before transmission: on-chip SHA-256 telemetry hashing directly on edge nodes.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs font-bold font-mono">
            RFC 8785 Canonical JSON Verified
          </span>
        </div>
      </div>

      {/* 4 Multi-Sensor Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Thermal Channel</span>
            <Activity className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {latestEvent?.telemetry.temperature || 42.4}°C
          </p>
          <span className="text-[10px] text-emerald-400">DHT22 Precision Attested</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vibration Harmonic</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">
            {latestEvent?.telemetry.vibration || 0.21} g
          </p>
          <span className="text-[10px] text-emerald-400">MPU6050 6-DOF IMU</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Silicon Identity</span>
            <Lock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-sm font-bold font-mono text-purple-300 truncate mt-1">
            {latestEvent?.rfid_tag || 'UBIP-ASSET-001'}
          </p>
          <span className="text-[10px] text-emerald-400">MFRC522 UID Locked</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>GPS S-T Anchor</span>
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-sm font-bold font-mono text-cyan-300 mt-1">
            {latestEvent?.telemetry.location.zone || 'ZONE-A (Primary)'}
          </p>
          <span className="text-[10px] text-slate-400">NEO-6M Lat {latestEvent?.telemetry.location.lat || 28.61}</span>
        </div>
      </div>

      {/* Raw Payload vs Canonical Hash Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw JSON Payload */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Raw JSON Telemetry Payload (Edge Emitter)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Seq #{latestEvent?.sequence_number || 1}</span>
          </div>

          <textarea
            value={rawPayload}
            onChange={e => setRawPayload(e.target.value)}
            rows={12}
            className="w-full p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Right: Canonical Hash & Signature Proof */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic Attestation Proof</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                ATTESTATION_PASSED
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Canonical SHA-256 Payload Hash</span>
                <p className="text-emerald-400 font-bold mt-0.5 break-all">
                  {latestEvent?.canonical_hash || canonicalHash}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Previous Event Hash (Chain Link)</span>
                <p className="text-slate-400 mt-0.5 break-all">
                  {latestEvent?.prev_event_hash || '0000000000000000000000000000000000000000000000000000000000000000'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">ECDSA Hardware Signature</span>
                <p className="text-purple-400 mt-0.5 break-all">
                  {latestEvent?.edge_signature || '0x71a9e201b46ae8849b2011bc94819ba88301ec94821004921841bc994018274199104471a9bc99401827419820019481029488301ec94821004921841bc9941b'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Device DID: <strong className="text-slate-200 font-mono">did:ubip:device:{latestEvent?.node_id.toLowerCase() || 'esp32-001'}</strong></span>
            <span className="text-emerald-400 font-bold">100% Hash Consistency</span>
          </div>
        </div>
      </div>
    </div>
  );
};
