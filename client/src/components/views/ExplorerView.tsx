import React, { useState } from 'react';
import { useSetu } from '../../context/SetuContext';
import { SectorType } from '../../types';
import {
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Cpu,
  Building2,
  Wheat,
  HeartPulse,
  GraduationCap,
  FileText,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ExplorerView: React.FC = () => {
  const { recentBlocks, recentTxs, metrics } = useSetu();
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [searchTx, setSearchTx] = useState('');

  const filteredTxs = recentTxs.filter(tx => {
    const matchesSector = sectorFilter === 'ALL' || tx.sector === sectorFilter;
    const matchesSearch =
      searchTx === '' ||
      tx.txHash.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.action.toLowerCase().includes(searchTx.toLowerCase()) ||
      tx.fromEntity.toLowerCase().includes(searchTx.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const getSectorBadge = (sector: SectorType) => {
    switch (sector) {
      case 'land':
        return <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/40 text-[10px] font-bold">Land</span>;
      case 'agri':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">Agri</span>;
      case 'health':
        return <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/40 text-[10px] font-bold">Health</span>;
      case 'education':
        return <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-bold">Education</span>;
      case 'procurement':
        return <span className="px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800/40 text-[10px] font-bold">Procurement</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Public Merkle Ledger</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Setu Chain Block & Transaction Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live immutable stream of multi-sector sovereign state attestations.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              Height: <strong className="text-emerald-400">#{metrics.blocksMined.toLocaleString()}</strong>
            </span>
            <span className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              Gas: <strong className="text-blue-400">{metrics.gasPriceGwei} Gwei</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Ribbon */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTx}
            onChange={e => setSearchTx(e.target.value)}
            placeholder="Search by Tx Hash, Entity, or Action..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Sector Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'land', 'agri', 'health', 'education', 'procurement'].map(s => (
            <button
              key={s}
              onClick={() => setSectorFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[11px] transition-all ${
                sectorFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Blocks Feed + Transactions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Latest Blocks */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Latest Blocks</span>
            <span className="text-xs text-blue-400 font-mono">IBFT 2.0 Finalized</span>
          </h3>

          <div className="space-y-3">
            {recentBlocks.map(block => (
              <div key={block.blockNumber} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-400">Block #{block.blockNumber}</span>
                  <span className="text-[11px] text-slate-400">{block.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Validator: <strong className="text-slate-200">{block.validatorCity}</strong></span>
                  <span className="font-mono text-emerald-400">{block.txCount} txs</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 truncate">
                  Hash: {block.blockHash}88a4bc10
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transactions Feed */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Validated Multi-Sector Transactions</span>
            <span className="text-xs text-slate-400 font-mono">{filteredTxs.length} Transactions</span>
          </h3>

          <div className="space-y-3">
            {filteredTxs.map((tx, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSectorBadge(tx.sector)}
                    <span className="text-sm font-bold text-white">{tx.action}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">{tx.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold">
                      {tx.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <span>From: <strong className="text-slate-200 font-mono">{tx.fromEntity}</strong></span>
                  <span>To: <strong className="text-slate-200 font-mono">{tx.toEntity}</strong></span>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="truncate max-w-md">Tx: {tx.txHash}</span>
                  <span className="text-blue-400">Gas: {tx.gasUsed.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
