import React, { useState } from 'react';
import { 
  Layers, 
  User, 
  Building2, 
  Cpu, 
  Activity, 
  Radio, 
  Lock, 
  ShieldCheck, 
  CheckCircle2,
  FileCode,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface GraphNodeDisplay {
  id: string;
  label: string;
  type: string;
  category: 'IDENTITY' | 'HARDWARE' | 'EVIDENCE' | 'CONSENSUS';
  details: string;
}

const GRAPH_NODES: GraphNodeDisplay[] = [
  { id: 'org:aicte', label: 'AICTE Apex Org', type: 'ORGANIZATION', category: 'IDENTITY', details: 'DID: did:ubip:org:aicte-01 • Root Governance' },
  { id: 'person:capt-sen', label: 'Capt. Vikram Sen', type: 'PERSON', category: 'IDENTITY', details: 'Chief Trust Architect (Tier-3 Clearance)' },
  { id: 'cred:tech-vc', label: 'W3C Verifiable Credential', type: 'CREDENTIAL', category: 'IDENTITY', details: 'Authorized for High-Voltage & Turbine Assets' },
  { id: 'asset:turbine-01', label: 'ASSET-001 (Gas Turbine)', type: 'ASSET', category: 'HARDWARE', details: 'RFID: UBIP-ASSET-001 • Energy Sector' },
  { id: 'device:esp32-01', label: 'ESP32-S3 Secure Gateway', type: 'DEVICE', category: 'HARDWARE', details: 'ATECC608A Hardware Enclave Signer' },
  { id: 'sensor:dht22', label: 'DHT22 / MPU6050 Sensors', type: 'SENSOR', category: 'HARDWARE', details: 'Thermal & Harmonic Vibration Monitoring' },
  { id: 'evidence:camera', label: 'Camera Inspection Snap', type: 'EVIDENCE', category: 'EVIDENCE', details: 'Off-Chain Image Hash: 0x8f3c...b46a' },
  { id: 'event:evt-1048', label: 'Canonical Event #1048', type: 'EVENT', category: 'EVIDENCE', details: 'SHA-256 State Hash: 0x9482...1891' },
  { id: 'ai:ewma-engine', label: 'AI Trust Engine (EWMA)', type: 'AI_DECISION', category: 'CONSENSUS', details: 'Score: 98.4% • 3-Sigma Anomaly Pass' },
  { id: 'policy:sec-hold', label: 'Cognitive Policy Orchestrator', type: 'POLICY', category: 'CONSENSUS', details: '7-Agent Autonomous Consensus' },
  { id: 'chain:hardhat-tx', label: 'Blockchain Settlement (Block #1489240)', type: 'BLOCKCHAIN_TX', category: 'CONSENSUS', details: 'Committed to Hardhat Provenance Ledger' }
];

export const TrustGraphView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNodeDisplay>(GRAPH_NODES[3]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-cockpit rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Trust Lineage Visualization</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              End-to-End Trust Graph Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Trace the unbroken cryptographic lineage from physical sensor silicon to immutable blockchain block.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-purple-950 text-purple-300 border border-purple-800/50 text-xs font-bold font-mono">
            11 Graph Nodes • 13 Typed Relations
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Lineage Sequence + Node Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lineage Pipeline Steps */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Cryptographic Chain of Custody</span>
          </h3>

          <div className="space-y-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-blue-600/30">
            {GRAPH_NODES.map((node, index) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`pl-9 relative cursor-pointer transition-all ${
                  selectedNode.id === node.id ? 'scale-[1.01]' : 'hover:opacity-90'
                }`}
              >
                <div
                  className={`absolute left-2.5 top-3 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                    selectedNode.id === node.id ? 'bg-cyan-400 ring-4 ring-cyan-500/20' : 'bg-blue-500'
                  }`}
                />
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    selectedNode.id === node.id
                      ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{index + 1}. {node.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {node.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{node.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Deep Inspector */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between backdrop-blur-xl space-y-6">
          <div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
              {selectedNode.type} NODE
            </span>
            <h3 className="text-xl font-black text-white mt-3">{selectedNode.label}</h3>
            <p className="text-xs text-slate-400 mt-1">{selectedNode.details}</p>

            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Node Identifier</span>
                <p className="text-blue-400 font-bold mt-0.5">{selectedNode.id}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Trust Lifecycle Layer</span>
                <p className="text-emerald-400 font-bold mt-0.5">{selectedNode.category}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Cryptographic State</span>
                <p className="text-purple-400 font-bold mt-0.5">ATTESTED & IMMUTABLE</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl text-xs text-slate-300">
            <span className="font-bold text-white block mb-1">Mathematical Linkage:</span>
            Every node in this chain has an on-chain parent hash, preventing man-in-the-middle or identity spoofing.
          </div>
        </div>
      </div>
    </div>
  );
};
