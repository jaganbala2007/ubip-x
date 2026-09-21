import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { Coins, Award, Send, Wallet, ArrowUpRight, TrendingUp, Info } from 'lucide-react';

export const TokenEconomyView: React.FC = () => {
  const { tokenBalances, triggerScenario } = useUBIP();
  const [transferAmount, setTransferAmount] = useState('50');
  const [recipient, setRecipient] = useState('0x892...FF1');

  const totalSupply = 1000000;
  const circulatingSupply = 17340;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-ubip-accent" />
            <span>UBIP Utility Token Economy (ERC-20 Local Testnet)</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Prototype utility/economic layer for physical data verification credits, validator staking rewards, and trusted-data contribution credits.
          </p>
        </div>
      </div>

      {/* Why Tokenization Callout (Principle 6 Compliance) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-ubip-850 to-ubip-850 border border-blue-500/30 flex items-start gap-3 text-xs font-mono">
        <Info className="w-5 h-5 text-ubip-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">Why Tokenization in Industrial Physical Trust?</div>
          <p className="text-slate-300">
            The UBIP ERC-20 utility token is NOT a speculative cryptocurrency. It serves as an autonomous economic mechanism for incentivizing edge nodes and regional validator nodes to process, verify, and store physical sensor telemetry faithfully without central reliance.
          </p>
        </div>
      </div>

      {/* Macro Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Utility Supply</span>
          <div className="text-2xl font-extrabold text-white">1,000,000 UBIP</div>
          <span className="text-[10px] text-slate-500">ERC-20 Fixed Cap Protocol</span>
        </div>

        <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Circulating Rewards</span>
          <div className="text-2xl font-extrabold text-ubip-accent">{circulatingSupply.toLocaleString()} UBIP</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+15 UBIP per verified batch</span>
        </div>

        <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Validator Reward Pool</span>
          <div className="text-2xl font-extrabold text-purple-400">982,660 UBIP</div>
          <span className="text-[10px] text-slate-500">Smart Contract Escrow</span>
        </div>
      </div>

      {/* Wallets & Transfer Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet Balances (7 Columns) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4 font-mono text-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-ubip-accent" />
            <span>Participating Node Wallets</span>
          </h3>

          <div className="space-y-3">
            {tokenBalances.map((wallet) => (
              <div key={wallet.address} className="p-4 rounded-xl bg-ubip-900/80 border border-ubip-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{wallet.owner_name}</div>
                    <div className="text-[11px] text-slate-400">
                      Address: <span className="text-slate-200">{wallet.address}</span> • Role: <span className="text-cyan-300">{wallet.role}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-ubip-accent">{wallet.balance} UBIP</div>
                    <div className="text-[10px] text-slate-400 uppercase">Available Balance</div>
                  </div>
                </div>

                {/* Recent Rewards */}
                {wallet.reward_history.length > 0 && (
                  <div className="pt-2 border-t border-ubip-700/30 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Latest Validator Rewards:</span>
                    {wallet.reward_history.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>{r.reason} ({r.event_id})</span>
                        <span className="text-emerald-400 font-bold">+{r.amount} UBIP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Service Simulator (5 Columns) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4 font-mono text-xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Send className="w-4 h-4 text-purple-400" />
            <span>Settlement / Transfer Simulator</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Recipient Address / Node</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-ubip-900 border border-ubip-700 text-slate-200 focus:outline-none focus:border-ubip-accent"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Transfer Amount (UBIP Credits)</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-ubip-900 border border-ubip-700 text-slate-200 focus:outline-none focus:border-ubip-accent"
              />
            </div>

            <button
              onClick={() => triggerScenario('NORMAL')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-ubip-accent to-cyan-500 text-black font-bold hover:opacity-90 transition-opacity mt-2"
            >
              Simulate Verification Settlement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
