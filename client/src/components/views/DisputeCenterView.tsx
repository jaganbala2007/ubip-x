import React, { useState, useEffect } from 'react';
import { 
  FileQuestion, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Scale, 
  ArrowRight,
  RefreshCw,
  Hash
} from 'lucide-react';
import { DisputeCase } from '../../types';

export const DisputeCenterView: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [isFiling, setIsFiling] = useState(false);

  // Form State
  const [assetId, setAssetId] = useState('ASSET-001');
  const [reason, setReason] = useState('Sensor calibration seal broken prior to receipt at warehouse.');
  const [filedBy, setFiledBy] = useState('ORG-B (Logistics)');
  const [challenger, setChallenger] = useState('ORG-A (Supplier)');

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/disputes').then(r => r.json());
      if (res.success) {
        setDisputes(res.disputes);
        setSelectedDispute(res.disputes[0] || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/disputes/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: assetId,
          event_id: `EVT-${Date.now()}`,
          filed_by_org: filedBy,
          challenger_org: challenger,
          reason,
          evidence_hashes: ['0x9482fba01948ef11488c9a12bc994018e2271891']
        })
      }).then(r => r.json());

      if (res.success) {
        setIsFiling(false);
        fetchDisputes();
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
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Multi-Party Dispute Resolution</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Dispute Resolution & Evidence Arbitrage Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Executes deterministic policy arbitration: freezes evidence hashes, compares provenance chains, and logs smart contract rulings.
            </p>
          </div>

          <button
            onClick={() => setIsFiling(!isFiling)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-1.5"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>{isFiling ? 'Cancel Dispute' : 'File Formal Dispute'}</span>
          </button>
        </div>
      </div>

      {/* File Dispute Form */}
      {isFiling && (
        <form onSubmit={handleFileDispute} className="p-6 bg-slate-900 rounded-2xl border border-amber-800/60 space-y-4 shadow-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">File On-Chain Evidence Dispute</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Target Asset ID</label>
              <input
                type="text"
                value={assetId}
                onChange={e => setAssetId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Filing Entity</label>
              <input
                type="text"
                value={filedBy}
                onChange={e => setFiledBy(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-1">Dispute Reason & Physical Evidence Reference</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Submit to DisputeRegistry.sol
          </button>
        </form>
      )}

      {/* Disputes Directory & Selected Ruling */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Disputes List */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Active & Resolved Cases</span>
            <span className="text-xs text-amber-400 font-mono">{disputes.length} Cases</span>
          </h3>

          <div className="space-y-3">
            {disputes.map(d => (
              <div
                key={d.dispute_id}
                onClick={() => setSelectedDispute(d)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDispute?.dispute_id === d.dispute_id
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-400">{d.dispute_id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold">
                    {d.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{d.asset_id}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.reason}</p>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{d.filed_by_org}</span>
                  <span>{new Date(d.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Case Ruling Deep-Dive */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
          {selectedDispute ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold">{selectedDispute.dispute_id}</span>
                    <h3 className="text-lg font-black text-white mt-0.5">{selectedDispute.asset_id} Arbitration Ruling</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs font-bold font-mono">
                    {selectedDispute.arbitration_ruling?.verdict || 'PENDING_POLICY_REVIEW'}
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Claim Allegation</span>
                    <p className="text-slate-300 leading-relaxed">{selectedDispute.reason}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Frozen Evidence Reference Hashes</span>
                    <div className="space-y-1 font-mono text-[11px] text-amber-400">
                      {selectedDispute.frozen_evidence_hashes.map((h, i) => (
                        <p key={i} className="truncate">Hash #{i + 1}: {h}</p>
                      ))}
                    </div>
                  </div>

                  {selectedDispute.arbitration_ruling && (
                    <div className="p-4 bg-emerald-950/20 border border-emerald-800/50 rounded-xl space-y-2">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Smart Contract Arbitration Finding</span>
                      <p className="text-slate-200 leading-relaxed font-mono">
                        {selectedDispute.arbitration_ruling.policy_action_taken}
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-800">
                        Arbiter: {selectedDispute.arbitration_ruling.arbiter}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>DisputeRegistry.sol</span>
                <span className="text-emerald-400">Policy Determinism Verified</span>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 my-auto">Select a dispute case to view arbitration details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
