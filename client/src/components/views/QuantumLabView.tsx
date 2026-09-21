import React, { useState } from 'react';
import { Atom, ShieldAlert, Cpu, Binary, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';

export const QuantumLabView: React.FC = () => {
  const [activeCircuit, setActiveCircuit] = useState<'bell' | 'grover'>('bell');

  const bellStateVector = [
    { state: '|00⟩', prob: 50, amplitude: '0.7071' },
    { state: '|01⟩', prob: 0, amplitude: '0.0000' },
    { state: '|10⟩', prob: 0, amplitude: '0.0000' },
    { state: '|11⟩', prob: 50, amplitude: '0.7071' }
  ];

  const groverStateVector = [
    { state: '|000⟩', prob: 3, amplitude: '0.1768' },
    { state: '|001⟩', prob: 3, amplitude: '0.1768' },
    { state: '|010⟩', prob: 3, amplitude: '0.1768' },
    { state: '|011⟩', prob: 3, amplitude: '0.1768' },
    { state: '|100⟩', prob: 3, amplitude: '0.1768' },
    { state: '|101⟩ [Target]', prob: 78, amplitude: '0.8839' },
    { state: '|110⟩', prob: 3, amplitude: '0.1768' },
    { state: '|111⟩', prob: 3, amplitude: '0.1768' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Atom className="w-5 h-5 text-pink-400" />
            <span>Quantum Computing Research Lab & Threat Simulation</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Software quantum circuit simulator analyzing Shor's algorithm threat models against classical RSA/ECDSA cryptography and PQC migration paths.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
            SIMULATION ONLY
          </span>
        </div>
      </div>

      {/* Threat Timeline Warning Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-ubip-850 to-ubip-850 border border-pink-500/40 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-pink-400" />
          <span>Shor's Algorithm Threat Horizon (Harvest Now, Decrypt Later)</span>
        </div>
        <p className="text-slate-300">
          Classical asymmetric cryptography (RSA-2048, ECDSA-secp256k1) used in IoT and blockchain is vulnerable to polynomial-time period-finding on fault-tolerant quantum computers (~4,096 logical qubits). UBIP-X integrates post-quantum lattice primitives (ML-KEM / ML-DSA) to neutralize this vector.
        </p>
      </div>

      {/* Circuit Simulator Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* State Vector Probability Matrix (7 Columns) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>State Vector Quantum Probability Distribution</span>
            </h3>

            <div className="flex items-center gap-1 bg-ubip-900 p-1 rounded-lg border border-ubip-700/50">
              <button
                onClick={() => setActiveCircuit('bell')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  activeCircuit === 'bell' ? 'bg-pink-500/20 text-pink-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bell State |Φ⁺⟩
              </button>
              <button
                onClick={() => setActiveCircuit('grover')}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  activeCircuit === 'grover' ? 'bg-pink-500/20 text-pink-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Grover Oracle
              </button>
            </div>
          </div>

          {/* Probability Bars */}
          <div className="space-y-2.5">
            {(activeCircuit === 'bell' ? bellStateVector : groverStateVector).map((item) => (
              <div key={item.state} className="p-3 rounded-xl bg-ubip-900/80 border border-ubip-700/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">{item.state}</span>
                  <span className="text-slate-300 font-bold">{item.prob}% (Ampl: {item.amplitude})</span>
                </div>
                <div className="w-full bg-ubip-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${item.prob}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantum Circuit Architecture & Gates (5 Columns) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Binary className="w-4 h-4 text-purple-400" />
            <span>Simulated Circuit Gates</span>
          </h3>

          <div className="p-4 rounded-xl bg-ubip-900/90 border border-ubip-700/50 space-y-3">
            <div className="text-slate-300 font-bold">
              {activeCircuit === 'bell' ? '2-Qubit Bell Entanglement' : '3-Qubit Grover Key Search'}
            </div>
            <div className="p-2.5 rounded-lg bg-ubip-800 font-mono text-cyan-300 text-[11px]">
              {activeCircuit === 'bell' 
                ? 'q[0]: ──[H]───●───[M]\nq[1]: ─────────X───[M]'
                : 'q[0]: ──[H]──[Oracle]──[Diff]──[M]\nq[1]: ──[H]──[Oracle]──[Diff]──[M]\nq[2]: ──[H]──[Oracle]──[Diff]──[M]'}
            </div>
            <p className="text-[11px] text-slate-400">
              {activeCircuit === 'bell'
                ? 'Creates maximally entangled Einstein-Podolsky-Rosen pair.'
                : 'Provides quadratic speedup O(sqrt(N)) for un-structured key space search.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
