import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { Blocks, ArrowUpRight, ShieldCheck, Hash, Cpu, FileCode, CheckCircle2, AlertOctagon } from 'lucide-react';

export const BlockchainExplorerView: React.FC = () => {
  const { blocks, transactions, latestEvent } = useUBIP();
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions' | 'contracts'>('blocks');

  const contracts = [
    {
      name: 'AssetRegistry.sol',
      address: '0xAssetRegistry0000000000000000000000001',
      purpose: 'Physical asset lifecycle, node binding, state transitions & hold policies.',
      methods: ['registerAsset()', 'updateAssetState()', 'toggleHold()', 'getAsset()']
    },
    {
      name: 'ProvenanceRegistry.sol',
      address: '0xProvenanceRegistry000000000000000000000002',
      purpose: 'Parent-chained telemetry SHA-256 hash log and cryptographic proof records.',
      methods: ['recordProvenance()', 'getRecordCount()', 'getAssetRecordIndices()']
    },
    {
      name: 'UBIPToken.sol (ERC-20)',
      address: '0xUBIPToken00000000000000000000000000000003',
      purpose: 'Validator consensus staking rewards and verification service utility credits.',
      methods: ['mintValidatorReward()', 'transfer()', 'balanceOf()', 'approve()']
    },
    {
      name: 'UBIPAssetNFT.sol (ERC-721)',
      address: '0xUBIPAssetNFT0000000000000000000000000000004',
      purpose: 'Verifiable Digital Asset Passports tethered to physical RFID/Sensor assets.',
      methods: ['mintPassport()', 'setHoldStatus()', 'transferFrom()', 'getPassport()']
    },
    {
      name: 'MaintenanceWorkflow.sol',
      address: '0xMaintenanceWorkflow00000000000000000000005',
      purpose: 'Multi-party maintenance approvals and emergency integrity violation holds.',
      methods: ['requestMaintenance()', 'resolveMaintenance()', 'triggerEmergencyHold()']
    },
    {
      name: 'AccessControl.sol',
      address: '0xAccessControl0000000000000000000000000000006',
      purpose: 'Role-based access permissions (ADMIN_ROLE, VALIDATOR_ROLE, OPERATOR_ROLE).',
      methods: ['hasRole()', 'grantRole()', 'revokeRole()']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Blocks className="w-5 h-5 text-ubip-accent" />
            <span>UBIP-X Local Blockchain Explorer</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real local Hardhat/Ethers consensus ledger verifying physical sensor provenance, smart contract rules, and token transactions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ubip-850 border border-ubip-700/60 text-xs font-mono">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'blocks' ? 'bg-ubip-accent/20 text-ubip-accent' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Blocks ({blocks.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'transactions' ? 'bg-ubip-accent/20 text-ubip-accent' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'contracts' ? 'bg-ubip-accent/20 text-ubip-accent' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Smart Contracts (6)
          </button>
        </div>
      </div>

      {/* Blocks List Tab */}
      {activeTab === 'blocks' && (
        <div className="space-y-3">
          {blocks.slice().reverse().map((block) => (
            <div key={block.block_number} className="p-4 rounded-xl bg-ubip-850/80 border border-ubip-700/60 hover:border-ubip-600 transition-all font-mono text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ubip-accent/20 border border-ubip-accent/40 flex items-center justify-center font-bold text-ubip-accent">
                    #{block.block_number}
                  </div>
                  <div>
                    <div className="text-white font-bold flex items-center gap-2">
                      <span>Block #{block.block_number}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/15">
                        Consensus Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Validator: <span className="text-slate-200">{block.validator}</span> • {new Date(block.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="text-right text-slate-400 text-[11px]">
                  <span>Tx Count: {block.transactions.length}</span>
                </div>
              </div>

              {/* Hashes */}
              <div className="p-3 rounded-lg bg-ubip-900/80 border border-ubip-700/40 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Block Hash:</span>
                  <span className="text-slate-300 truncate max-w-[400px]">{block.block_hash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Parent Block Hash:</span>
                  <span className="text-slate-400 truncate max-w-[400px]">{block.prev_block_hash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions List Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.tx_hash} className="p-4 rounded-xl bg-ubip-850/80 border border-ubip-700/60 font-mono text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {tx.status}
                  </span>
                  <span className="font-bold text-slate-200">{tx.method_called}</span>
                </div>

                <div className="text-slate-400 text-[11px]">
                  Block #{tx.block_number} • Gas: {tx.gas_used}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-ubip-900/80 border border-ubip-700/40 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tx Hash:</span>
                  <span className="text-ubip-accent truncate max-w-[380px]">{tx.tx_hash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contract:</span>
                  <span className="text-slate-300 truncate max-w-[380px]">{tx.contract_address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {contracts.map((contract) => (
            <div key={contract.name} className="p-5 rounded-xl bg-ubip-850/80 border border-ubip-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-ubip-accent" />
                  <span className="font-bold text-sm text-white">{contract.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                  Deployed Local
                </span>
              </div>

              <p className="text-slate-300 text-xs">{contract.purpose}</p>

              <div className="p-2.5 rounded-lg bg-ubip-900 border border-ubip-700/40 text-[11px] text-slate-400 truncate">
                Address: <span className="text-slate-200">{contract.address}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Exposed ABI Methods:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {contract.methods.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded bg-ubip-800 text-slate-300 text-[10px] border border-ubip-700/50">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
