import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Cpu, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { RecoveryCase } from '../../types';

export const RecoveryCenterView: React.FC = () => {
  const [recoveries, setRecoveries] = useState<RecoveryCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(null);

  const fetchRecoveries = async () => {
    try {
      const res = await fetch('/api/recoveries').then(r => r.json());
      if (res.success) {
        setRecoveries(res.recoveries);
        setSelectedCase(res.recoveries[0] || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecoveries();
  }, []);

  const handleAdvanceStep = async (recoveryId: string) => {
    try {
      const res = await fetch(`/api/recoveries/${recoveryId}/advance`, { method: 'POST' }).then(r => r.json());
      if (res.success) {
        fetchRecoveries();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="glass-cockpit rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Trust Lifecycle Restoration</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Trust Recovery & Reprovisioning Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic 5-stage lifecycle state machine: Quarantine ➔ Revoke Keys ➔ Reprovision ➔ Re-attest ➔ Validate ➔ Restore On-Chain.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs font-bold font-mono">
            5-Stage State Machine Active
          </span>
        </div>
      </div>

      {/* Trust State Machine Flow Ribbon */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold">1. TRUSTED</span>
        <span className="text-slate-500">→</span>
        <span className="px-3 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800/50 font-bold">2. SUSPICIOUS</span>
        <span className="text-slate-500">→</span>
        <span className="px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/50 font-bold">3. QUARANTINED</span>
        <span className="text-slate-500">→</span>
        <span className="px-3 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800/50 font-bold">4. RECOVERING</span>
        <span className="text-slate-500">→</span>
        <span className="px-3 py-1 rounded-lg bg-emerald-900 text-emerald-200 border border-emerald-600 font-bold">5. REVERIFIED ✓</span>
      </div>

      {/* Recovery Cases Grid & Step Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case List */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Quarantine & Recovery Cases</span>
            <span className="text-xs text-emerald-400 font-mono">{recoveries.length} Cases</span>
          </h3>

          <div className="space-y-3">
            {recoveries.map(r => (
              <div
                key={r.recovery_id}
                onClick={() => setSelectedCase(r)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCase?.recovery_id === r.recovery_id
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-400">{r.recovery_id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.current_state === 'REVERIFIED' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {r.current_state}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{r.asset_id} ({r.device_id})</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.initial_trigger}</p>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Started: {new Date(r.started_at).toLocaleTimeString()}</span>
                  <span className="text-blue-400">{r.steps.filter(s => s.status === 'COMPLETED').length}/{r.steps.length} Steps</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed 6-Step Execution Trail */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
          {selectedCase ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{selectedCase.recovery_id}</span>
                    <h3 className="text-lg font-black text-white mt-0.5">{selectedCase.asset_id} Recovery Workflow</h3>
                  </div>

                  {selectedCase.current_state !== 'REVERIFIED' && (
                    <button
                      onClick={() => handleAdvanceStep(selectedCase.recovery_id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Advance Recovery Step</span>
                    </button>
                  )}
                </div>

                {/* Steps List */}
                <div className="mt-6 space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                  {selectedCase.steps.map((step, idx) => (
                    <div key={idx} className="pl-8 relative">
                      <div
                        className={`absolute left-2 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                          step.status === 'COMPLETED'
                            ? 'bg-emerald-400'
                            : step.status === 'IN_PROGRESS'
                            ? 'bg-blue-400 animate-ping'
                            : 'bg-slate-700'
                        }`}
                      />
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{idx + 1}. {step.step_name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            step.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{step.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Trust Recovery Complete</span>
                <span className="text-emerald-400">Ledger State Restored</span>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 my-auto">Select a recovery case to view lifecycle progress.</div>
          )}
        </div>
      </div>
    </div>
  );
};
