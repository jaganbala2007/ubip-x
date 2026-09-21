import React, { useState, useEffect } from 'react';
import { Binary, ShieldCheck, Cpu, RefreshCw, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

interface Benchmark {
  algorithm: string;
  type: string;
  nistLevel: string;
  publicKeyBytes: number;
  privateKeyBytes: number;
  signatureOrCiphertextBytes: number;
  keyGenTimeMs: number;
  operationTimeMs: number;
  verificationTimeMs: number;
  status: string;
  quantumResistant: boolean;
}

export const PQCCenterView: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const fetchBenchmarks = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/pqc/benchmark').then(r => r.json());
      if (res.success) {
        setBenchmarks(res.benchmarks);
      }
    } catch (err) {
      console.error('Error fetching PQC benchmarks:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Binary className="w-5 h-5 text-pink-400" />
            <span>Post-Quantum Cryptography (PQC) Benchmark Center</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Live in-process cryptographic benchmarking: Standardized NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA) vs Classical RSA & ECDSA.
          </p>
        </div>

        <button
          onClick={fetchBenchmarks}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Benchmarking CPU...' : 'Execute Live PQC Benchmark'}</span>
        </button>
      </div>

      {/* Benchmark Results Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {benchmarks.map((b) => (
          <div
            key={b.algorithm}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              b.quantumResistant
                ? 'bg-ubip-850 border-pink-500/40 shadow-lg shadow-pink-500/10'
                : 'bg-ubip-900/80 border-ubip-700/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">{b.algorithm}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    b.quantumResistant 
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {b.quantumResistant ? 'QUANTUM RESISTANT' : 'CLASSICAL VULNERABLE'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{b.nistLevel}</div>
              </div>

              <div className={`p-2 rounded-lg ${b.quantumResistant ? 'bg-pink-500/20 text-pink-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {b.quantumResistant ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
            </div>

            {/* Key Sizes & Timing Grid */}
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-ubip-900/90 border border-ubip-700/40">
                <span className="text-[9px] text-slate-500 uppercase">Public Key</span>
                <div className="font-bold text-slate-200 mt-0.5">{b.publicKeyBytes} B</div>
              </div>
              <div className="p-2.5 rounded-lg bg-ubip-900/90 border border-ubip-700/40">
                <span className="text-[9px] text-slate-500 uppercase">Sign / Cipher</span>
                <div className="font-bold text-slate-200 mt-0.5">{b.signatureOrCiphertextBytes} B</div>
              </div>
              <div className="p-2.5 rounded-lg bg-ubip-900/90 border border-ubip-700/40">
                <span className="text-[9px] text-slate-500 uppercase">KeyGen Time</span>
                <div className="font-bold text-ubip-accent mt-0.5">{b.keyGenTimeMs} ms</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-ubip-900/90 border border-ubip-700/40 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Sign / Encapsulate: <span className="text-slate-200 font-bold">{b.operationTimeMs} ms</span></span>
              <span className="text-slate-400">Verify / Decapsulate: <span className="text-slate-200 font-bold">{b.verificationTimeMs} ms</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
