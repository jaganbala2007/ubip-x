import React, { useState, useEffect } from 'react';
import { useSetu } from '../../context/SetuContext';
import {
  Cpu,
  Server,
  Layers,
  ShieldCheck,
  Radio,
  Wifi,
  Database,
  ArrowDown,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

export const TechArchitectureView: React.FC = () => {
  // Live hardware sensor telemetry stream simulation
  const [telemetryStream, setTelemetryStream] = useState({
    deviceType: 'ESP32-S3 Cold-Chain Node #04',
    rfidUid: 'E280-1160-2000-779A',
    tempC: 18.2,
    moisturePct: 22.4,
    gpsLat: 30.7333,
    gpsLng: 76.7794,
    canonicalHash: '0x9482fba01948ef11488c9a12bc994018e2271891',
    signatureStatus: 'ECDSA_P256_ATTESTED'
  });

  useEffect(() => {
    let tick = 0;
    const deltas = [0.1, 0.3, 0.4, 0.2, 0.0, -0.2, -0.4, -0.2];
    const interval = setInterval(() => {
      tick++;
      const delta = deltas[tick % deltas.length];
      const hashSuffix = (0x9482fba0 + tick).toString(16);
      setTelemetryStream(prev => ({
        ...prev,
        tempC: Number((18.2 + delta).toFixed(1)),
        moisturePct: Number((22.4 + delta * 1.2).toFixed(1)),
        canonicalHash: `0x${hashSuffix}1948ef11488c9a12bc994018`
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner: Direct Fit for Category: Hardware */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Category: Hardware & Edge Attestation</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              End-to-End System Architecture & IoT Hardware Layer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guarantees physical trust before data touches the blockchain: on-chip canonical SHA-256 hashing directly on ESP32 & Raspberry Pi devices.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-blue-950 text-blue-300 border border-blue-800/50 text-xs font-bold font-mono">
            4-Tier Sovereign DLT Stack
          </span>
        </div>
      </div>

      {/* 4-Tier Architectural Diagram */}
      <div className="space-y-6">
        {/* Tier 1: Hardware & IoT Layer */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-800/50 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Tier 1: Physical Reality & IoT Sensing</span>
                <h3 className="text-base font-bold text-white">Hardware Sensing & Edge Trust Layer</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              ESP32-S3 • RC522 RFID • DHT22 • MPU6050
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">Soil NPK & Moisture Sensors</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Captures farm quality metrics at harvest gate.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">Cold Chain RFID Tags</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Continuous temperature logging inside reefer trucks.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">Biometric Land Survey PoS</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Survey of India GIS surveyor hardware with GPS lock.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">On-Chip SHA-256 Signer</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Serializes JSON & signs payload in secure hardware enclave.</p>
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-md">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Tier 2: Edge Gateway & Attestation */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/30 border border-blue-800/50 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600 flex items-center justify-center text-blue-400">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Tier 2: Edge Attestation</span>
                <h3 className="text-base font-bold text-white">Raspberry Pi Gateway & Store-and-Forward Buffer</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              MQTT TLS • SQLite Buffer • Schema Validation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">Offline Satellite Resilience</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Local SQLite queue prevents telemetry loss during connectivity blackouts.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">AI Anomaly Pre-Filter</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">EWMA & 3-sigma Z-scores catch sensor drift and physical tampering.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">Zero-Knowledge Attestation</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Proves device validity without exposing internal cryptographic keys.</p>
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-md">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Tier 3: National Consensus & Smart Contracts */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 border border-purple-800/50 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-600 flex items-center justify-center text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Tier 3: Consensus & Settlement</span>
                <h3 className="text-base font-bold text-white">Setu Byzantine Core & Multi-Sector Smart Contracts</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              IBFT 2.0 • PoA • EVM Compatible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
              <strong className="text-purple-300 block">BhuRegistry.sol</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Bhu-Aadhaar parcel title ownership & mutation locks.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
              <strong className="text-emerald-300 block">AgriSettlement.sol</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Automated MSP escrow payout to farmer UPI upon QC check.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
              <strong className="text-rose-300 block">AbhaConsent.sol</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Granular patient consent switchboard & break-glass logging.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
              <strong className="text-orange-300 block">TenderZKP.sol</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Pederson-commitment sealed procurement bidding.</p>
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-md">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Tier 4: Citizen & Officer Application Layer */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 border border-orange-800/50 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-950 border border-orange-600 flex items-center justify-center text-orange-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">Tier 4: Public Delivery & Interoperability</span>
                <h3 className="text-base font-bold text-white">Citizen Portals & National Public API Bridges</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              DigiLocker • MeriPehchan • e-NAM • GeM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">DigiLocker Digital Asset Passports</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Verified certificates & land deeds visible in citizen DigiLocker.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">Employer Background Scanner</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Public QR scanner for instant degree authenticity verification.</p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <strong className="text-white block">NPCI Direct Bank Settlement</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Bridges smart-contract escrow state to real-world Indian Rupee UPI transfer.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Physical Hardware Telemetry Stream Simulator */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-bold text-white">
              Live Edge Hardware Telemetry Stream
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">Broadcasting via MQTT TLS @ 1 Hz</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Device Node</span>
            <p className="text-slate-200 mt-0.5 truncate">{telemetryStream.deviceType}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Cold-Chain Temp</span>
            <p className="text-emerald-400 font-bold mt-0.5">{telemetryStream.tempC} °C</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Soil Moisture</span>
            <p className="text-blue-400 font-bold mt-0.5">{telemetryStream.moisturePct} %</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Hardware Signature</span>
            <p className="text-purple-400 font-bold mt-0.5">{telemetryStream.signatureStatus}</p>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center justify-between font-mono text-[11px]">
          <span className="text-slate-500">On-Chip SHA-256 Canonical Telemetry Hash:</span>
          <span className="text-emerald-400 truncate max-w-md">{telemetryStream.canonicalHash}</span>
        </div>
      </div>
    </div>
  );
};
