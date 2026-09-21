import React from 'react';
import { useSetu } from '../../context/SetuContext';
import { ThreatEvent } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Layers,
  ArrowRight,
  Database,
  Terminal,
  Activity
} from 'lucide-react';

export const CybersecurityThreatView: React.FC = () => {
  const {
    threatEvents,
    activeThreat,
    isSimulatingThreat,
    triggerThreatSimulation,
    recentBlocks
  } = useSetu();

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Theme: Cybersecurity Operations</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Live Threat Defense & Byzantine Fault Containment
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visually answers the jury's key question: <em>"Why blockchain over a conventional centralized database?"</em>
            </p>
          </div>

          <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Zero-Trust Byzantine Defense Active
          </span>
        </div>
      </div>

      {/* 4 Interactive Attack Simulator Triggers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>1-Click Interactive Attack Scenarios</span>
          </h3>
          <span className="text-xs text-slate-500">Click any vector to simulate live breach attempt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attack 1 */}
          <button
            onClick={() => triggerThreatSimulation('SQL_DEED_TAMPER')}
            disabled={isSimulatingThreat}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/80 transition-all text-left group shadow-lg flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-rose-400 font-bold mb-2">
                <span>Vector 1: SQL Injection</span>
                <Database className="w-4 h-4 text-rose-400" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Land Deed Database Tampering
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rogue DBA modifies title ownership directly in local MySQL database.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-rose-400 font-semibold flex items-center gap-1">
              <span>Execute Attack</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Attack 2 */}
          <button
            onClick={() => triggerThreatSimulation('SYBIL_ROGUE_NODE')}
            disabled={isSimulatingThreat}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/80 transition-all text-left group shadow-lg flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-orange-400 font-bold mb-2">
                <span>Vector 2: Sybil Injection</span>
                <Cpu className="w-4 h-4 text-orange-400" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                Rogue Validator Node Injection
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Attacker spins up 15 forged cloud nodes to manipulate consensus vote.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-orange-400 font-semibold flex items-center gap-1">
              <span>Execute Attack</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Attack 3 */}
          <button
            onClick={() => triggerThreatSimulation('SIGNATURE_REPLAY')}
            disabled={isSimulatingThreat}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/80 transition-all text-left group shadow-lg flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-2">
                <span>Vector 3: Signature Replay</span>
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                Academic Credential Replay
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Intercepted genuine IIT signature attempted on an unauthorized identity.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-purple-400 font-semibold flex items-center gap-1">
              <span>Execute Attack</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Attack 4 */}
          <button
            onClick={() => triggerThreatSimulation('FIFTY_ONE_COLLUSION')}
            disabled={isSimulatingThreat}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/80 transition-all text-left group shadow-lg flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-2">
                <span>Vector 4: 51% Collusion</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                Byzantine Cartel Collusion
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cartel compromises 3 nodes to unseal ₹42 Cr highway tender bids.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-semibold flex items-center gap-1">
              <span>Execute Attack</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Active Attack Response Display */}
      {activeThreat && (
        <div className={`p-6 rounded-2xl border transition-all ${
          activeThreat.status === 'BLOCKED_IMMUTABLE'
            ? 'bg-emerald-950/20 border-emerald-800/80 shadow-2xl shadow-emerald-950/40'
            : 'bg-rose-950/30 border-rose-800/80 shadow-2xl shadow-rose-950/40'
        } space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {activeThreat.status === 'BLOCKED_IMMUTABLE' ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-600 flex items-center justify-center text-rose-400 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-xs font-mono text-rose-400 font-bold">{activeThreat.id}</span>
                <h4 className="text-base font-black text-white">{activeThreat.title}</h4>
                <p className="text-xs text-slate-400">Target: {activeThreat.sectorTarget}</p>
              </div>
            </div>

            <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono uppercase self-start sm:self-auto ${
              activeThreat.status === 'BLOCKED_IMMUTABLE'
                ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                : 'bg-rose-900 text-rose-200 border border-rose-600 animate-pulse'
            }`}>
              {activeThreat.status === 'BLOCKED_IMMUTABLE' ? 'Threat Isolated & Blocked in 12ms' : 'Analyzing State Root...'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Attacker Vector</span>
              <p className="text-slate-300 leading-relaxed">{activeThreat.attackerVector}</p>
            </div>
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Consensus Defense Response</span>
              <p className="text-slate-200 leading-relaxed">{activeThreat.systemResponse}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Cryptographic Proof of Defense</span>
            <p className="text-emerald-400 mt-1">{activeThreat.cryptographicProof}</p>
          </div>
        </div>
      )}

      {/* Visual Immutable Hash-Chain Explorer */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Visual Immutable Hash-Chain Architecture</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Every block links cryptographically to its predecessor's Merkle root. Altering one byte invalidates all subsequent blocks across all 10 national enclaves.
          </p>
        </div>

        {/* Horizontal Block Chain */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentBlocks.slice(0, 3).map((block, idx) => (
            <div key={block.blockNumber} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/90 relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">Block #{block.blockNumber}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {block.timestamp}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Block Hash</span>
                  <p className="text-emerald-400 truncate">{block.blockHash}88a4bc10</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Prev Block Hash</span>
                  <p className="text-slate-400 truncate">{block.prevBlockHash}991e0412</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Merkle Root</span>
                  <p className="text-purple-400 truncate">{block.merkleRoot}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Validator: <strong className="text-slate-200">{block.validatorCity}</strong></span>
                <span>Txs: <strong className="text-blue-400 font-mono">{block.txCount}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
