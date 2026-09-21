import React from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { FileCheck, ShieldCheck, QrCode, Lock, ArrowRight, Award, Hash, CheckCircle2 } from 'lucide-react';

export const AssetPassportNFTView: React.FC = () => {
  const { nfts, assets, selectedAsset } = useUBIP();

  const currentPassport = nfts[0] || {
    token_id: 1,
    asset_id: 'ASSET-001',
    rfid_tag: 'UBIP-ASSET-001',
    owner_address: '0x71C...4A9',
    organization: 'Apex Precision Dynamics (ORG-A)',
    sector: 'Supply Chain & Aerospace',
    manufacturer: 'Apex Dynamics OEM',
    minted_at: new Date().toISOString(),
    condition: 'EXCELLENT (96%)',
    provenance_hash: '0x4d8a1e2f3b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    is_held: false,
    history_events_count: 42,
    metadata_uri: 'ipfs://QmUbipPassportAsset001Hash'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-ubip-accent" />
            <span>Verifiable Digital Asset Passport (ERC-721 NFT)</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            ERC-721 tokenized digital asset passports tethering physical RFID serial numbers to immutable on-chain provenance records.
          </p>
        </div>
      </div>

      {/* Main Passport Card & Provenance History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Futuristic NFT Digital Passport Card (6 Columns) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-b from-ubip-850 via-ubip-800 to-ubip-900 border border-ubip-accent/40 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Watermark Badge */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-ubip-accent">
            <Award className="w-48 h-48" />
          </div>

          {/* Top Passport Badge */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-ubip-accent uppercase tracking-widest">
                  UBIP-X PASSPORT
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-ubip-accent/20 text-ubip-accent font-bold">
                  NFT #{currentPassport.token_id.toString().padStart(3, '0')}
                </span>
              </div>
              <h3 className="text-lg font-mono font-bold text-white mt-1">
                {assets[0]?.name || 'High-Pressure Turbine Rotor Blade #A9'}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-ubip-900/90 border border-ubip-700 flex items-center justify-center text-ubip-accent">
              <QrCode className="w-7 h-7" />
            </div>
          </div>

          {/* Core Passport Specification Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono relative z-10">
            <div className="p-3 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Physical Asset ID</span>
              <div className="text-white font-bold mt-0.5">{currentPassport.asset_id}</div>
            </div>
            <div className="p-3 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Hardware RFID Tag</span>
              <div className="text-cyan-400 font-bold mt-0.5">{currentPassport.rfid_tag}</div>
            </div>
            <div className="p-3 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Current Owner</span>
              <div className="text-slate-200 font-bold mt-0.5">{currentPassport.owner_address}</div>
            </div>
            <div className="p-3 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Physical Condition</span>
              <div className="text-emerald-400 font-bold mt-0.5">{currentPassport.condition}</div>
            </div>
          </div>

          {/* Cryptographic Genesis Link */}
          <div className="p-4 rounded-xl bg-ubip-900/90 border border-ubip-700/60 text-xs font-mono space-y-1.5 relative z-10">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-ubip-accent" />
                <span>Genesis Provenance Hash:</span>
              </span>
              <span className="text-emerald-400 text-[10px] font-bold">SHA-256 LOCKED</span>
            </div>
            <div className="text-slate-300 font-mono text-[11px] truncate">
              {currentPassport.provenance_hash}
            </div>
          </div>

          {/* Verification Seal & Passport Status */}
          <div className="pt-4 border-t border-ubip-700/50 flex items-center justify-between text-xs font-mono relative z-10">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">AICTE Smart India Hackathon Verified</span>
            </div>
            <span className="text-slate-400 text-[11px]">
              {currentPassport.history_events_count} Provenance Records
            </span>
          </div>
        </div>

        {/* Passport Actions & Compliance Details (6 Columns) */}
        <div className="lg:col-span-6 space-y-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              On-Chain Passport Policy Actions
            </h3>

            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Transfer Physical Ownership</div>
                  <div className="text-[11px] text-slate-400">Transfers ERC-721 token upon physical shipment handoff.</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-ubip-800 hover:bg-ubip-700 text-ubip-accent font-bold transition-colors">
                  Transfer NFT
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Mint Maintenance Passport Stamp</div>
                  <div className="text-[11px] text-slate-400">Appends verifiable inspection log to metadata URI.</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-ubip-800 hover:bg-ubip-700 text-purple-300 font-bold transition-colors">
                  Add Stamp
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Off-Chain Metadata Storage Protocol
            </h3>
            <p className="text-slate-300 text-xs">
              In accordance with UBIP-X Storage Principle 8: Raw telemetry streams, 3D CAD meshes, and inspection logs are held off-chain on IPFS/Encrypted edge stores, while canonical SHA-256 hashes and token ownership live on-chain.
            </p>
            <div className="p-2.5 rounded-lg bg-ubip-900 text-[11px] text-cyan-300 truncate">
              Metadata URI: {currentPassport.metadata_uri}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
