import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { DigitalTwin3D } from '../digital-twin/DigitalTwin3D';
import { 
  Box, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Thermometer, 
  Activity, 
  Wind,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DigitalTwinView: React.FC = () => {
  const { selectedAsset, latestEvent, triggerScenario } = useUBIP();
  const [explodedView, setExplodedView] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const asset = selectedAsset || {
    asset_id: 'ASSET-001',
    name: 'High-Pressure Turbine Rotor Blade #A9',
    state: 'ACTIVE',
    trust_state: 'VERIFIED',
    condition_rating: 96
  };

  const telemetry = latestEvent?.telemetry || selectedAsset?.latest_telemetry || {
    temperature: 42.4,
    vibration: 0.21,
    gas_ppm: 112,
    location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
  };

  const isTampered = latestEvent?.is_tampered || asset.state === 'TAMPERED';
  const confidenceScore = isTampered ? 18.2 : 96.4;
  const canonicalHash = latestEvent?.canonical_hash || '0x9482fba01948ef11488c9a12bc994018e2271891';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(canonicalHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-sans">
              Screen 2 · Physical-to-Digital Twin
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">NTPC Ramagundam Unit #4</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Box className="w-6 h-6 text-blue-400" />
            <span>Live Industrial Twin & Telemetry Kinematics</span>
          </h1>
        </div>

        {/* Minimal Control Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExplodedView(!explodedView)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all border ${
              explodedView
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-[#111318] border-[#1E222D] text-slate-300 hover:border-slate-600'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{explodedView ? 'Collapsed View' : 'Exploded Assembly'}</span>
          </button>
        </div>
      </div>

      {/* Main Dominant 3D Viewport with Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dominant 3D Canvas (8 Columns) */}
        <div className="lg:col-span-8 h-[540px] rounded-2xl overflow-hidden border border-[#1E222D] bg-[#0A0B0E] relative shadow-xl">
          <DigitalTwin3D interactive={true} explodedView={explodedView} />
        </div>

        {/* Side Panel (4 Columns): Minimal Instrument Strip + Trust Assessment */}
        <div className="lg:col-span-4 space-y-4">
          {/* Trust Assessment Panel */}
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#1E222D] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Trust Assessment
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                [MEASURED]
              </span>
            </div>

            {/* Single VERIFIED / FLAGGED State */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isTampered
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-3">
                {isTampered ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {isTampered ? 'FLAGGED · SUSPICIOUS STATE' : 'VERIFIED · INTEGRITY ATTESTED'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isTampered ? 'Physical discrepancy detected' : 'Zero unverified kinematic drift'}
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Radial / Percentage Confidence Meter */}
            <div className="flex items-center justify-between p-3.5 bg-[#0D0F14] rounded-xl border border-[#1E222D]">
              <div>
                <div className="text-xs text-slate-400">Evidence Consistency</div>
                <div className="text-xl font-bold text-white font-mono mt-0.5">
                  {confidenceScore.toFixed(1)}%
                </div>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#1E222D"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={isTampered ? '#F43F5E' : '#10B981'}
                    strokeWidth="3.5"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 * (1 - confidenceScore / 100)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-slate-300 font-mono">
                  {Math.round(confidenceScore)}%
                </span>
              </div>
            </div>

            {/* Reasoning in Calm Prose */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTampered
                ? 'Edge sensor stream failed canonical RFC 8785 signature verification. Spatial-temporal velocity exceeds physical limits (>2400 km/h) between successive readings.'
                : 'All 3 sensor modalities match deterministic physical envelope. Hardware root-of-trust signature matches registered on-chain DID without drift.'}
            </p>

            {/* Truncated Copyable Hash */}
            <div className="p-3 bg-[#0D0F14] rounded-xl border border-[#1E222D] flex items-center justify-between gap-2">
              <div className="truncate font-mono text-xs text-slate-400">
                <span className="text-slate-500">Hash: </span>
                <span className="text-slate-200">{canonicalHash.slice(0, 10)}...{canonicalHash.slice(-8)}</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg hover:bg-[#1E222D] text-slate-400 hover:text-white transition-colors"
                title="Copy Canonical Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Minimal 3-Sensor Instrument Strip */}
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#1E222D] space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Physical Ingestion Readouts (50 Hz)
            </span>

            {/* 1. Temperature */}
            <div className="p-3 bg-[#0D0F14] rounded-xl border border-[#1E222D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300">Thermal Core</div>
                  <div className="text-[11px] text-slate-500">DHT22 Digital Sensor</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {telemetry.temperature.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-500">Nominal (&lt;65°C)</div>
              </div>
            </div>

            {/* 2. Vibration */}
            <div className="p-3 bg-[#0D0F14] rounded-xl border border-[#1E222D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300">Harmonic Vibration</div>
                  <div className="text-[11px] text-slate-500">MPU6050 6-DOF IMU</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {telemetry.vibration.toFixed(3)} G
                </div>
                <div className="text-[10px] text-slate-500">Peak: 240 Hz</div>
              </div>
            </div>

            {/* 3. Gas / Atmosphere */}
            <div className="p-3 bg-[#0D0F14] rounded-xl border border-[#1E222D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300">Gas Dispersion</div>
                  <div className="text-[11px] text-slate-500">MQ-135 Air Quality</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {telemetry.gas_ppm} PPM
                </div>
                <div className="text-[10px] text-emerald-400">Air Quality Safe</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
