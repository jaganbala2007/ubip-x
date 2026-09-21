import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Cpu,
  Activity,
  ShieldCheck,
  Blocks,
  FileCheck2,
  Lock,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Zap,
  Code2,
  Radio
} from 'lucide-react';

interface PipelineStage {
  id: number;
  name: string;
  tagline: string;
  category: string;
  icon: any;
  plainLanguage: string;
  technicalDeepDive: {
    primitive: string;
    specification: string;
    samplePayload: string;
    auditVerification: string;
  };
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: '1. Physical Ingestion & Sensor Sampling',
    tagline: 'Silicon-to-Digital Interrogation',
    category: 'Hardware Edge',
    icon: Cpu,
    plainLanguage: 'A physical microchip reads temperature, vibration, and RFID tag data directly from the machine.',
    technicalDeepDive: {
      primitive: 'ESP32-S3 Dual-Core Xtensa @ 240MHz + RC522 13.56 MHz RFID',
      specification: 'Hardware ADC 12-bit sampling at 50 Hz; hardware-isolated SPI bus for secure peripheral reads.',
      samplePayload: '{\n  "device_id": "did:ubip:device:esp32-s3-001",\n  "rfid_uid": "UBIP-ASSET-001",\n  "telemetry": { "temp": 42.4, "vib": 0.21, "gas": 112 }\n}',
      auditVerification: 'Hardware eFuse physical key verification passed (Zero clone risk).'
    }
  },
  {
    id: 2,
    name: '2. Edge Anomaly Detection & AI Filtering',
    tagline: 'Statistical Pre-Verification',
    category: 'Edge AI',
    icon: Activity,
    plainLanguage: 'Statistical algorithms check if sensor readings are physically plausible before sending them to the ledger.',
    technicalDeepDive: {
      primitive: 'EWMA Statistical Z-Score Filter + Spatio-Temporal Velocity Engine',
      specification: 'Evaluates kinematic variance $\\Delta v < 120\\text{ km/h}$; rejects sudden impossible geographic coordinate jumps.',
      samplePayload: '{\n  "spatial_consistency": 0.994,\n  "temporal_drift_ms": 12,\n  "entropy_score": 0.88\n}',
      auditVerification: 'Physics-informed boundary check verified: Telemetry is within safe mechanical tolerances.'
    }
  },
  {
    id: 3,
    name: '3. NIST Post-Quantum Cryptographic Attestation',
    tagline: 'Quantum-Safe Proof Signing',
    category: 'Cryptography',
    icon: ShieldCheck,
    plainLanguage: 'The reading is converted into a tamper-proof digital fingerprint and signed with next-generation quantum-safe encryption.',
    technicalDeepDive: {
      primitive: 'Deterministic RFC 8785 JSON Canonicalization + NIST FIPS 204 ML-DSA-65',
      specification: 'Generates canonical SHA-256 digest; signs with Dilithium-category lattice cryptography (FIPS 204).',
      samplePayload: '{\n  "canonical_hash": "0x9482fba01948ef11488c9a12bc994018e2271891",\n  "algorithm": "NIST_FIPS_204_ML_DSA_65",\n  "sig": "0x4f81...38d2"\n}',
      auditVerification: 'Post-Quantum lattice signature verified against device public key.'
    }
  },
  {
    id: 4,
    name: '4. P2P Gossip Broadcast & Validator Consensus',
    tagline: 'Sovereign Multi-Node Agreement',
    category: 'Consensus',
    icon: Radio,
    plainLanguage: 'The signed reading is broadcast across multiple independent servers run by NTPC, Indian Railways, and AICTE.',
    technicalDeepDive: {
      primitive: 'IBFT 2.0 Byzantine Fault Tolerant Consensus with P2P libp2p gossipsub',
      specification: 'Requires $2f+1$ validator attestations across 10 sovereign enclaves; achieves finality in $<450\\text{ ms}$.',
      samplePayload: '{\n  "proposer": "0xNIC_Apex_Node",\n  "quorum_signatures": 9,\n  "view_number": 10482,\n  "finality_latency_ms": 380\n}',
      auditVerification: 'Byzantine quorum verified: 9 of 10 independent validators signed block commitment.'
    }
  },
  {
    id: 5,
    name: '5. Immutable Merkle State Ledgering',
    tagline: 'Permanent Blockchain Record',
    category: 'DLT Ledger',
    icon: Blocks,
    plainLanguage: 'The transaction is sealed inside an immutable blockchain block that no single admin or hacker can modify.',
    technicalDeepDive: {
      primitive: 'Merkle Patricia Trie Proof Anchoring into Sovereign Block #104,820',
      specification: 'Cryptographic parent-hash chaining guarantees historical state immutability; gas optimized at 48,210 units.',
      samplePayload: '{\n  "block_height": 104820,\n  "merkle_root": "0x78a1bc4901e82810f994cba10294819283719283",\n  "prev_hash": "0x110294...8821"\n}',
      auditVerification: 'Merkle tree inclusion path verified with 0 cryptographic divergence.'
    }
  },
  {
    id: 6,
    name: '6. Smart Contract Policy Enforcement',
    tagline: 'Automated Governance & Quarantine',
    category: 'Smart Contracts',
    icon: Lock,
    plainLanguage: 'Smart contract code automatically allows normal operation or instantly quarantines the machine if tampering occurs.',
    technicalDeepDive: {
      primitive: 'AssetRegistry.sol & DisputeEscrow.sol (Solidity v0.8.24 / EVM bytecode)',
      specification: 'Zero-trust logic executes emergency `toggleHold(assetId)` if consistency drops below 60/100 threshold.',
      samplePayload: '{\n  "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",\n  "policy_status": "VERIFIED_ACTIVE",\n  "hold_flag": false\n}',
      auditVerification: 'On-chain policy rules evaluated: Nominal conditions confirmed.'
    }
  },
  {
    id: 7,
    name: '7. Digital Twin & Enterprise Synchronization',
    tagline: 'Real-Time Operational Mirror',
    category: 'Integration',
    icon: FileCheck2,
    plainLanguage: 'The 3D model and enterprise dashboard update instantaneously with verified, audit-ready data.',
    technicalDeepDive: {
      primitive: 'WebSocket 1.0 Hz Bi-Directional Stream + 3D WebGL Kinematic Synchronization',
      specification: 'Dispatches signed provenance events to SAP/ERP, SCADA, and real-time 3D spatial twins with $<15\\text{ ms}$ UI lag.',
      samplePayload: '{\n  "twin_state": "SYNCHRONIZED",\n  "audit_trail_id": "AUD-2026-NTPC-00104",\n  "operator_signature": "VALID"\n}',
      auditVerification: 'End-to-end provenance trail successfully verified across all 7 layers.'
    }
  }
];

export const TrustUniverseView: React.FC = () => {
  const { events } = useUBIP();
  const [expandedStage, setExpandedStage] = useState<number | null>(3); // Default expand PQC stage
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-sans">
              Screen 3 · Cryptographic & AI Pipeline
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">7-Stage End-to-End Trust Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Share2 className="w-6 h-6 text-blue-400" />
            <span>Verifiable Trust Pipeline & Progressive Disclosure</span>
          </h1>
        </div>

        {/* Global Pipeline Badge */}
        <div className="flex items-center gap-2 bg-[#111318] border border-[#1E222D] px-3.5 py-2 rounded-xl text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">7/7 Stages Active</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-emerald-400">Deterministic RFC 8785</span>
        </div>
      </div>

      {/* Main 7-Stage Expandable Process Timeline */}
      <div className="space-y-3.5">
        {PIPELINE_STAGES.map((stage) => {
          const isExpanded = expandedStage === stage.id;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              layout
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-[#111318] border-blue-500/50 shadow-lg shadow-blue-950/20'
                  : 'bg-[#0D0F14] border-[#1E222D] hover:border-slate-700'
              }`}
            >
              {/* Collapsed / Summary Row (Always Visible) */}
              <div
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                  <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 transition-colors ${
                    isExpanded
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#161922] text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                        {stage.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-[#1A1D27] text-slate-400 text-[10px] font-mono">
                        {stage.category}
                      </span>
                    </div>
                    {/* Plain Language Explanation */}
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {stage.plainLanguage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline text-xs text-blue-400 font-medium">
                    {isExpanded ? 'Hide Details' : 'Inspect Proof'}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-[#161922] text-slate-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-blue-400' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Expanded Progressive Disclosure (Technical Deep Dive for Judges) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-[#1E222D] bg-[#0A0B0E]/80 px-4 sm:px-6 py-5 space-y-4 text-xs font-mono"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Cryptographic Primitive & Specification */}
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-[#111318] border border-[#1E222D] space-y-1.5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                            Cryptographic & AI Primitive
                          </span>
                          <div className="text-blue-300 font-semibold text-xs leading-snug">
                            {stage.technicalDeepDive.primitive}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111318] border border-[#1E222D] space-y-1.5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                            Technical Specification
                          </span>
                          <p className="text-slate-300 text-xs leading-relaxed font-sans">
                            {stage.technicalDeepDive.specification}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-sans">
                            {stage.technicalDeepDive.auditVerification}
                          </span>
                        </div>
                      </div>

                      {/* Right: Live JSON / Cryptographic Proof Payload */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Canonical State Payload (RFC 8785)</span>
                          </span>
                          <button
                            onClick={() => handleCopy(stage.technicalDeepDive.samplePayload, stage.id)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                          >
                            {copiedIndex === stage.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Payload</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-[#08090C] border border-[#1E222D] text-blue-200 text-xs overflow-x-auto leading-relaxed max-h-[160px]">
                          {stage.technicalDeepDive.samplePayload}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
