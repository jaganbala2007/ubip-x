import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { OperatorProfile } from '../auth/CockpitLoginModal';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  ShieldCheck, Award, Wifi, WifiOff, Bot, X, ChevronDown, 
  Building2, CheckCircle2, Globe, ExternalLink, Lock, LogOut
} from 'lucide-react';

interface HeaderProps {
  currentOperator: OperatorProfile;
  onLockCockpit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentOperator, onLockCockpit }) => {
  const { 
    activeView, setActiveView, isNetworkOnline, 
    setIsCopilotOpen, toggleNetworkOnline
  } = useUBIP();

  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);

  return (
    <>
      <div className="tricolor-strip" />

      <header className="h-[4.25rem] bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-250">
        {/* Left: Sovereign Crest */}
        <div className="flex items-center gap-3.5 cursor-pointer group select-none" onClick={() => setActiveView('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8622C]/20 via-[#1A1A1C] to-[#6366F1]/15 border border-[#E8622C]/35 flex items-center justify-center shadow-lg group-hover:border-[#E8622C]/60 transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-[#E8622C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">SETU DLT</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md badge-sienna font-mono uppercase tracking-wide">SIH 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <span className="text-[#E8622C] font-bold">सत्यमेव जयते</span>
              <span className="text-zinc-400">•</span>
              <span className="text-[var(--text-secondary)]">National Sovereign Trust Fabric</span>
            </div>
          </div>
        </div>

        {/* Center: Enclave Status */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={() => setIsStatusDrawerOpen(true)}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--elevated)] border border-[var(--border)] hover:border-[#E8622C]/40 text-xs transition-all group shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-green font-bold uppercase tracking-wider">10 ENCLAVES</span>
            <span className="text-[var(--text-primary)] font-semibold font-mono text-[11px] group-hover:text-[#E8622C] transition-colors">NIC Delhi Apex</span>
            <span className="text-zinc-400">|</span>
            <span className="text-[var(--text-secondary)] text-[11px]">NTPC Dadri & RDSO Synced</span>
            <span className="text-[10px] text-[#22C55E] font-mono bg-[#22C55E]/10 px-1.5 py-0.5 rounded border border-[#22C55E]/25">34ms</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toggleNetworkOnline(!isNetworkOnline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              isNetworkOnline
                ? 'bg-[var(--elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[#22C55E]/40'
                : 'bg-rose-950/80 text-rose-200 border-rose-700 animate-pulse'
            }`}
          >
            {isNetworkOnline ? (
              <><Wifi className="w-3.5 h-3.5 text-[#22C55E]" /><span className="hidden sm:inline font-mono text-[11px]">Mesh Online</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-rose-400" /><span className="hidden sm:inline font-mono text-[11px]">Offline Queue</span></>
            )}
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[var(--elevated)] hover:bg-[var(--muted)] border border-[var(--border)] hover:border-[#6366F1]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="hidden md:inline">Copilot</span>
          </button>

          <button
            onClick={() => setActiveView('judge-mode')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              activeView === 'judge-mode'
                ? 'btn-gold ring-2 ring-amber-300/30'
                : 'bg-[#D4A017]/10 hover:bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#D4A017] hover:text-[#92400E] dark:text-[#EAB308] dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="font-extrabold tracking-wide">निर्णायक मोड</span>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle variant="compact" />

          {/* Operator */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-[var(--border)]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E8622C] to-[#C2410C] flex items-center justify-center text-white text-xs font-bold shadow-md">
              {currentOperator.name.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <span className="block text-[11px] font-bold text-[var(--text-primary)] leading-tight">{currentOperator.name}</span>
              <span className="block text-[9px] font-mono text-[#E8622C]">{currentOperator.clearanceLevel.split(' ')[0]}</span>
            </div>
            <button onClick={onLockCockpit} className="p-1 rounded-md hover:bg-[var(--muted)] text-[var(--text-muted)] hover:text-rose-500 transition-colors" title="Lock Console">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Enclave Drawer */}
      {isStatusDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-start pt-20 px-4" onClick={() => setIsStatusDrawerOpen(false)}>
          <div className="w-full max-w-2xl glass-warm p-6 rounded-2xl relative animate-float-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsStatusDrawerOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8622C]/10 border border-[#E8622C]/25 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#E8622C]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">National Sovereign Consensus Enclaves</h3>
                <p className="text-xs text-zinc-400">10 nodes across North, Central & Southern State Grids.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { name: 'NIC Delhi (Shastri Park)', role: 'Apex Root Enclave', latency: '34ms', state: 'Delhi NCR' },
                { name: 'NTPC Dadri, UP', role: 'Turbine SCADA Validator', latency: '18ms', state: 'Uttar Pradesh' },
                { name: 'RDSO Lucknow', role: 'Rolling Stock Node', latency: '22ms', state: 'Uttar Pradesh' },
                { name: 'BHEL Haridwar', role: 'Industrial ZKP Prover', latency: '26ms', state: 'Uttarakhand' },
                { name: 'CDAC Bangalore', role: 'PQC Key Escrow', latency: '41ms', state: 'Karnataka' },
                { name: 'APMC Azadpur, Delhi', role: 'Cold-Chain Settlement', latency: '14ms', state: 'Delhi NCR' }
              ].map((e, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#E8622C]/30 transition-all flex items-center justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">{e.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{e.role} • {e.state}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">{e.latency}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#22C55E]" />PBFT Consensus Active (100% BFT)</span>
              <button onClick={() => { setIsStatusDrawerOpen(false); setActiveView('sectors'); }} className="text-[#E8622C] hover:text-[#EA580C] font-bold flex items-center gap-1">
                <span>View Sectors</span><ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
