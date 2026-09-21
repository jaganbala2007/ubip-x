import React from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { KeyRound, ShieldCheck, UserCheck, Building, Cpu, CheckCircle2, Award } from 'lucide-react';

export const IdentityRegistryView: React.FC = () => {
  const { identities } = useUBIP();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-ubip-accent" />
            <span>Decentralized Identity (DID) & Verifiable Credential Registry</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            W3C DID-compliant identity architecture providing hardware node attestation, operator credentials, and cryptographic revocation registries.
          </p>
        </div>
      </div>

      {/* Identities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {identities.map((id) => (
          <div key={id.did} className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${
                  id.entity_type === 'DEVICE' ? 'bg-cyan-500/20 text-cyan-400' :
                  id.entity_type === 'ORGANIZATION' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {id.entity_type === 'DEVICE' && <Cpu className="w-4 h-4" />}
                  {id.entity_type === 'ORGANIZATION' && <Building className="w-4 h-4" />}
                  {id.entity_type === 'VALIDATOR' && <Award className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{id.name}</div>
                  <span className="text-[10px] text-slate-400 uppercase">{id.role}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                {id.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-ubip-900/80 border border-ubip-700/40 space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-500">DID Identifier:</span>
                <div className="text-ubip-accent truncate font-semibold">{id.did}</div>
              </div>
              <div>
                <span className="text-slate-500">Public Key:</span>
                <div className="text-slate-300 truncate">{id.public_key}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-ubip-700/30 flex items-center justify-between text-[10px] text-slate-400">
              <span>Organization: <span className="text-slate-200">{id.organization}</span></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Signed</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
