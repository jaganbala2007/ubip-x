import React from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { FileText, ShieldCheck, CheckCircle2, Hash, ArrowUpRight } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { events, transactions } = useUBIP();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-ubip-accent" />
            <span>Immutable Cryptographic Audit Trail</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Complete chronological audit trail linking raw sensor values, SHA-256 hashes, ECDSA signatures, and blockchain block heights.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 font-mono text-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ubip-700/60 text-slate-400 text-[11px]">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Event Ref</th>
                <th className="pb-2">Asset ID</th>
                <th className="pb-2">Canonical SHA-256 Hash</th>
                <th className="pb-2">Edge Signature</th>
                <th className="pb-2">Block #</th>
                <th className="pb-2">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ubip-700/30 text-slate-200 text-xs">
              {events.map((evt) => (
                <tr key={evt.event_id} className="hover:bg-ubip-800/40">
                  <td className="py-2.5 text-slate-400 text-[11px]">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 font-bold text-cyan-400">{evt.event_id}</td>
                  <td className="py-2.5">{evt.asset_id}</td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-300 truncate max-w-[140px]">
                    {evt.canonical_hash}
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                    {evt.edge_signature}
                  </td>
                  <td className="py-2.5 font-bold text-ubip-accent">
                    #{evt.block_number || 104820}
                  </td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.is_tampered ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {evt.is_tampered ? 'TAMPER DETECTED' : 'CRYPTOGRAPHICALLY VALID'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
