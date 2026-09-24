import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { DigitalTwin3D } from '../digital-twin/DigitalTwin3D';
import { DigitalTwinType } from '../../types';
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
  AlertCircle,
  Zap,
  Truck,
  Plane,
  Shield,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DigitalTwinView: React.FC = () => {
  const { selectedAsset, latestEvent, triggerScenario } = useUBIP();
  const [activeTwin, setActiveTwin] = useState<DigitalTwinType>('industry');
  const [explodedView, setExplodedView] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const twinConfig = {
    industry: {
      name: 'High-Pressure Turbine Rotor Blade #A9',
      unit: 'NTPC Ramagundam Unit #4',
      sector: 'Energy & National Power Grid',
      temp: 42.4,
      vibration: 0.21,
      gas: 112,
      sensor1: 'DHT22 Core Sensor',
      sensor2: 'MPU6050 6-DOF IMU',
      sensor3: 'MQ-135 Gas Sensor',
      tempThreshold: '< 65°C',
      vibeThreshold: '< 0.45 G'
    },
    train: {
      name: 'High-Speed Bogie & Axle Assembly #VB-204',
      unit: 'RDSO Lucknow & Vande Bharat Hub',
      sector: 'Indian Railways Rolling Stock & Track',
      temp: 38.6,
      vibration: 0.14,
      gas: 74,
      sensor1: 'PT100 Axle-Box Sensor',
      sensor2: 'Piezo Ultrasonic IMU',
      sensor3: 'Track Acoustic Sensor',
      tempThreshold: '< 75°C',
      vibeThreshold: '< 0.35 G Dynamic'
    },
    airplane: {
      name: 'CFM LEAP-1A High-Bypass Turbofan Jet Core',
      unit: 'DGCA Fleet Registry (Airbus A321neo #AI-902)',
      sector: 'Civil Aviation & Commercial Airline Fleet',
      temp: 592.0,
      vibration: 0.12,
      gas: 145,
      sensor1: 'Thermocouple EGT Core',
      sensor2: 'Optical Fan Flutter Sensor',
      sensor3: 'Combustor Gas Analyzer',
      tempThreshold: '< 650°C EGT',
      vibeThreshold: '< 0.25 G Flutter'
    },
    defense: {
      name: 'LCA Tejas Mk-1A AESA Radar & Tactical Pod',
      unit: 'DRDO Tactical Radar Wing & HAL Division',
      sector: 'Defense Systems & Tactical Avionics',
      temp: 48.2,
      vibration: 0.08,
      gas: 52,
      sensor1: 'Silicon Junction Sensor',
      sensor2: 'MIL-STD-810H Tri-Axial',
      sensor3: 'Inertial Guidance Gyro',
      tempThreshold: '< 70°C MIL-SPEC',
      vibeThreshold: '< 0.15 G Safe'
    }
  }[activeTwin];

  const isTampered = latestEvent?.is_tampered || false;
  const confidenceScore = isTampered ? 18.2 : 96.8;
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
            <span className="text-xs text-slate-400 font-mono">{twinConfig.unit}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Box className="w-6 h-6 text-blue-400" />
            <span>Live Industrial Twin & Telemetry Kinematics</span>
          </h1>
        </div>

        {/* Minimal Control Pill: Exploded Assembly Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExplodedView(!explodedView)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all border ${
              explodedView
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md'
                : 'bg-[#111318] border-[#1E222D] text-slate-300 hover:border-slate-600'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{explodedView ? 'Collapse Assembly' : 'Exploded Assembly'}</span>
          </button>
        </div>
      </div>

      {/* Main Dominant 3D Viewport with Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dominant 3D Canvas (8 Columns) */}
        <div className="lg:col-span-8 h-[560px] rounded-2xl overflow-hidden border border-[#1E222D] bg-[#0A0B0E] relative shadow-xl">
          <DigitalTwin3D 
            interactive={true} 
            explodedView={explodedView} 
            activeTwin={activeTwin}
            onSelectTwin={setActiveTwin}
          />
        </div>

        {/* Side Panel (4 Columns): Minimal Instrument Strip + Trust Assessment */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Asset Spec Card */}
          <div className="p-4 rounded-2xl bg-[#111318] border border-[#1E222D] space-y-1">
            <div className="text-[10px] text-blue-400 uppercase font-mono tracking-wider font-bold">
              Active Sovereign Model
            </div>
            <div className="text-sm font-bold text-white font-sans">
              {twinConfig.name}
            </div>
            <div className="text-xs text-slate-400">
              {twinConfig.sector}
            </div>
          </div>

          {/* Trust Assessment Panel */}
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#1E222D] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Trust Assessment
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                [PQC ATTESTED]
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
                    {isTampered ? 'FLAGGED · TAMPER QUARANTINE' : 'VERIFIED · INTEGRITY ATTESTED'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isTampered ? 'Physical signature mismatch detected' : 'Zero unverified kinematic drift'}
                  </div>
                </div>
              </div>
            </div>

            {/* Radial Percentage Confidence Meter */}
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

            {/* Truncated Copyable Hash */}
            <div className="p-3 bg-[#0D0F14] rounded-xl border border-[#1E222D] flex items-center justify-between gap-2">
              <div className="truncate font-mono text-xs text-slate-400">
                <span className="text-slate-500">Merkle Hash: </span>
                <span className="text-slate-200">{canonicalHash.slice(0, 10)}...{canonicalHash.slice(-8)}</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg hover:bg-[#1E222D] text-slate-400 hover:text-white transition-colors"
                title="Copy Canonical Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Physical Ingestion Readouts */}
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#1E222D] space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">
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
                  <div className="text-[11px] text-slate-500">{twinConfig.sensor1}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {twinConfig.temp.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-500">{twinConfig.tempThreshold}</div>
              </div>
            </div>

            {/* 2. Vibration */}
            <div className="p-3 bg-[#0D0F14] rounded-xl border border-[#1E222D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300">Dynamic Vibration</div>
                  <div className="text-[11px] text-slate-500">{twinConfig.sensor2}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {twinConfig.vibration.toFixed(3)} G
                </div>
                <div className="text-[10px] text-slate-500">{twinConfig.vibeThreshold}</div>
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
                  <div className="text-[11px] text-slate-500">{twinConfig.sensor3}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {twinConfig.gas} PPM
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
