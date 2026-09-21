import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2,
  Zap,
  Truck,
  HeartPulse,
  Sprout,
  GraduationCap,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Blocks,
  FileCheck2,
  Lock,
  Cpu,
  Share2
} from 'lucide-react';

interface SectorNode {
  id: string;
  name: string;
  department: string;
  icon: any;
  primaryAsset: string;
  color: string;
  accentBg: string;
  badge: string;
  slaPolicy: string;
  liveTelemetry: string;
  sampleTx: {
    txHash: string;
    action: string;
    timestamp: string;
    proof: string;
  };
}

const SECTOR_NODES: SectorNode[] = [
  {
    id: 'energy',
    name: 'Critical Infrastructure & Power Grid',
    department: 'NTPC Ramagundam & PowerGrid',
    icon: Zap,
    primaryAsset: 'High-Pressure Turbine Rotor Blade #A9 (Unit #4)',
    color: 'text-amber-400',
    accentBg: 'bg-amber-500/10 border-amber-500/30',
    badge: 'ENERGY ASSET',
    slaPolicy: 'Continuous vibration ($<0.45\\text{ G}$) and thermal ($<65^\\circ\\text{C}$) attestation with zero unverified kinematic drift.',
    liveTelemetry: '42.4°C • 0.210 G Vibration • 112 PPM Gas',
    sampleTx: {
      txHash: '0x8f2a...19e4',
      action: 'NTPC_TURBINE_ATTESTATION',
      timestamp: 'Just now',
      proof: 'Deterministic RFC 8785 + NIST FIPS 204 ML-DSA-65'
    }
  },
  {
    id: 'railways',
    name: 'Indian Railways Rolling Stock & Track',
    department: 'RDSO Lucknow & Vande Bharat Hub',
    icon: Truck,
    primaryAsset: 'High-Speed Bogie Axle Assembly #VB-204',
    color: 'text-blue-400',
    accentBg: 'bg-blue-500/10 border-blue-500/30',
    badge: 'RAIL SAFETY',
    slaPolicy: 'Wheel bearing acoustic ultrasonic signature logged every 5 km; prevents catastrophic axle fracture.',
    liveTelemetry: '0.142 G Dynamic Impact • 38.6°C Axle Box • GPS 130 km/h Track Locked',
    sampleTx: {
      txHash: '0x3c11...88ab',
      action: 'RDSO_AXLE_INTEGRITY_LOG',
      timestamp: '2 mins ago',
      proof: 'Merkle Patricia Inclusion Proof #104,818'
    }
  },
  {
    id: 'healthcare',
    name: 'Cold-Chain Pharma & Public Health',
    department: 'Ministry of Health (ABHA & CDSCO)',
    icon: HeartPulse,
    primaryAsset: 'Lyophilized Vaccine Batch #VAC-IND-8840',
    color: 'text-rose-400',
    accentBg: 'bg-rose-500/10 border-rose-500/30',
    badge: 'COLD CHAIN',
    slaPolicy: 'Cryogenic temperature window strict envelope ($-20^\\circ\\text{C} \\pm 2^\\circ\\text{C}$); breaches trigger automated batch quarantine.',
    liveTelemetry: '-20.4°C Cryo Core • 0.01 G • Tamper Seal INTACT',
    sampleTx: {
      txHash: '0x9a44...f201',
      action: 'CDSCO_VACCINE_VIAL_VERIFIED',
      timestamp: '4 mins ago',
      proof: 'Zero-Knowledge Proof (ZKP) Range Check'
    }
  },
  {
    id: 'agriculture',
    name: 'Agri-Stack & Certified Seed Lineage',
    department: 'ICAR & Ministry of Agriculture',
    icon: Sprout,
    primaryAsset: 'ICAR Certified High-Yield Wheat Seed Batch #W-402',
    color: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    badge: 'AGRI PROVENANCE',
    slaPolicy: 'Seed germination purity certificate permanently bound to RFID packaging tag with automated MSP escrow payout.',
    liveTelemetry: '14.2% Seed Moisture • 98.4% Germination Purity Certified',
    sampleTx: {
      txHash: '0x7e88...bb12',
      action: 'ICAR_SEED_LINEAGE_ANCHOR',
      timestamp: '7 mins ago',
      proof: 'Smart Contract Escrow Transfer to Farmer UPI'
    }
  },
  {
    id: 'academic',
    name: 'Academic Credentials & APAAR Registry',
    department: 'AICTE / Ministry of Education',
    icon: GraduationCap,
    primaryAsset: 'B.Tech Blockchain Engineering Credential #APAAR-7749',
    color: 'text-purple-400',
    accentBg: 'bg-purple-500/10 border-purple-500/30',
    badge: 'VERIFIABLE CREDENTIAL',
    slaPolicy: 'Zero-forgery academic diploma anchored to institutional DID with instant employer background check verification.',
    liveTelemetry: '100% On-Chain Authenticity • W3C Verifiable Credential Standard',
    sampleTx: {
      txHash: '0x12d9...cc90',
      action: 'AICTE_CREDENTIAL_MINT',
      timestamp: '11 mins ago',
      proof: 'W3C DID did:ubip:inst:aicte-apex-01'
    }
  }
];

export const SectorHubView: React.FC = () => {
  const [activeSectorId, setActiveSectorId] = useState<string>('energy');
  const activeSector = SECTOR_NODES.find(s => s.id === activeSectorId) || SECTOR_NODES[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-sans">
              Screen 5 · Multi-Sector Scalability
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">National Sovereign Ledger Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-blue-400" />
            <span>Unified Cross-Sector Trust Topology</span>
          </h1>
        </div>

        {/* Global Multi-Sector Indicator */}
        <div className="flex items-center gap-2 bg-[#111318] border border-[#1E222D] px-3.5 py-2 rounded-xl text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="font-semibold">5 Strategic Indian Sectors</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-blue-400">1 Shared SETU Ledger</span>
        </div>
      </div>

      {/* Dominant Visual Element: Central Ledger Hub & Sector Spokes Map */}
      <div className="p-6 rounded-2xl bg-[#0D0F14] border border-[#1E222D] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E222D] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Blocks className="w-4 h-4 text-blue-400" />
              <span>SETU Sovereign DLT Core (Bharat Shared Ledger)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any connected sector node to inspect how the same underlying cryptographic substrate adapts to physical hardware, cold-chains, and digital credentials.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/20 px-3 py-1 rounded-lg border border-emerald-500/30">
            Cross-Sector Interoperability: 100%
          </div>
        </div>

        {/* Interactive Connected Spoke Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SECTOR_NODES.map((sector) => {
            const Icon = sector.icon;
            const isSelected = activeSectorId === sector.id;

            return (
              <motion.button
                key={sector.id}
                onClick={() => setActiveSectorId(sector.id)}
                whileTap={{ scale: 0.98 }}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? `${sector.accentBg} border-current shadow-lg shadow-black/40`
                    : 'bg-[#111318] border-[#1E222D] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-black/30' : 'bg-[#161922]'} ${sector.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs text-white leading-snug">
                    {sector.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {sector.department}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Sector Deep-Dive Detail View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-xl bg-[#111318] border border-[#1E222D] space-y-4 font-mono text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E222D] pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-[#161922] ${activeSector.color}`}>
                  <activeSector.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{activeSector.name}</div>
                  <div className="text-xs text-slate-400">{activeSector.department}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto ${activeSector.accentBg} ${activeSector.color}`}>
                {activeSector.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary Asset Spec */}
              <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-[#1E222D] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Primary Physical Asset / Credential
                </span>
                <div className="text-white font-semibold text-xs font-sans">
                  {activeSector.primaryAsset}
                </div>
                <div className="text-[11px] text-blue-400 font-mono pt-1">
                  {activeSector.liveTelemetry}
                </div>
              </div>

              {/* Regulatory Policy / SLA */}
              <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-[#1E222D] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Smart Contract SLA Enforcement Rule
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  {activeSector.slaPolicy}
                </p>
              </div>

              {/* Sample Verifiable On-Chain Transaction */}
              <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-[#1E222D] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Live Merkle Proof on Shared Ledger
                </span>
                <div className="text-xs text-emerald-400 font-bold">
                  {activeSector.sampleTx.action}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Tx: <span className="text-slate-200">{activeSector.sampleTx.txHash}</span> • {activeSector.sampleTx.timestamp}
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">
                  Proof: {activeSector.sampleTx.proof}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
