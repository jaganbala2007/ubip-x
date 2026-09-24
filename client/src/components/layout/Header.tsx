import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { OperatorProfile } from '../auth/CockpitLoginModal';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  ShieldCheck, Award, Wifi, WifiOff, Bot, X, ChevronDown, 
  Building2, CheckCircle2, Globe, ExternalLink, Lock, LogOut,
  Menu, LayoutDashboard, Box, Share2, ShieldAlert, Globe2,
  Cpu, FileKey2, Layers, Coins, Brain, Compass, Sliders, History,
  Database, Scale, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModulesDropdownOpen, setIsModulesDropdownOpen] = useState(false);

  const allModules = [
    { id: 'overview', label: 'National Cockpit', category: 'Core', icon: LayoutDashboard },
    { id: 'asi-intelligence', label: 'Sovereign ASI Matrix (Artificial Superintelligence)', category: 'Core', icon: BrainCircuit },
    { id: 'digital-twin', label: '3D Kinematic Mirror (Industry, Train, Jet, Radar)', category: 'Core', icon: Box },
    { id: 'pipeline', label: '7-Stage Proof & DLT Pipeline', category: 'Core', icon: Share2 },
    { id: 'security', label: 'Cyber Threat Lab & SOC', category: 'Security', icon: ShieldAlert },
    { id: 'sectors', label: 'Multi-Sector DPI (8 Sectors)', category: 'Sectors', icon: Globe2 },
    { id: 'live-assets', label: 'Live Physical Asset Registry', category: 'Assets', icon: Cpu },
    { id: 'asset-passport', label: 'Asset Passport (NFT)', category: 'Assets', icon: FileKey2 },
    { id: 'blockchain', label: 'National DLT Block Explorer', category: 'DLT', icon: Database },
    { id: 'token-economy', label: 'SETU Sovereign Token Economy', category: 'DLT', icon: Coins },
    { id: 'identity', label: 'W3C DID Identity Registry', category: 'Identity', icon: ShieldCheck },
    { id: 'ai-intelligence', label: 'AI Cyber Risk & Isolation Forest', category: 'AI', icon: Brain },
    { id: 'cognitive-orchestrator', label: 'Cognitive Self-Healing Orchestrator', category: 'AI', icon: Compass },
    { id: 'pqc-center', label: 'NIST FIPS 204 PQC Defense', category: 'Security', icon: Lock },
    { id: 'offline-network', label: 'Offline P2P Mesh Network', category: 'Network', icon: Wifi },
    { id: 'dispute-center', label: 'Automated Dispute Escrow', category: 'Governance', icon: Scale },
    { id: 'audit-trail', label: 'Immutable Audit Trail', category: 'Governance', icon: History },
    { id: 'settings', label: 'System Configuration', category: 'System', icon: Sliders }
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId as any);
    setIsMobileMenuOpen(false);
    setIsModulesDropdownOpen(false);
  };

  return (
    <>
      <div className="tricolor-strip" />

      <header className="h-[4.25rem] bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-250">
        {/* Left: Sovereign Crest */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none" onClick={() => handleNavClick('overview')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E8622C]/20 via-[#1A1A1C] to-[#6366F1]/15 border border-[#E8622C]/35 flex items-center justify-center shadow-lg group-hover:border-[#E8622C]/60 transition-all duration-300">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8622C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] tracking-tight">SETU DLT</span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md badge-sienna font-mono uppercase tracking-wide">SIH 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium">
              <span className="text-[#E8622C] font-bold">सत्यमेव जयते</span>
              <span className="text-zinc-400">•</span>
              <span className="text-[var(--text-secondary)] hidden xs:inline truncate">National Sovereign Trust Fabric</span>
            </div>
          </div>
        </div>

        {/* Center: Enclave Status & Quick Modules Switcher */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setIsStatusDrawerOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--elevated)] border border-[var(--border)] hover:border-[#E8622C]/40 text-xs transition-all group shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-green font-bold uppercase tracking-wider">10 ENCLAVES</span>
            <span className="text-[var(--text-primary)] font-semibold font-mono text-[11px] group-hover:text-[#E8622C] transition-colors">NIC Delhi Apex</span>
            <span className="text-zinc-400">|</span>
            <span className="text-[var(--text-secondary)] text-[11px]">NTPC, RDSO, DRDO Synced</span>
            <span className="text-[10px] text-[#22C55E] font-mono bg-[#22C55E]/10 px-1.5 py-0.5 rounded border border-[#22C55E]/25">34ms</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* ASI Sovereign Superintelligence Live Badge */}
          <button
            onClick={() => handleNavClick('asi-intelligence')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-mono transition-all group shadow-sm text-purple-300"
            title="Launch Sovereign ASI Autonomous Matrix"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="font-bold text-[11px]">ASI CORE</span>
            <span className="text-[9px] text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded font-bold">L5 AUTO</span>
            <span className="text-[10px] text-purple-300 font-bold">0.84ms</span>
          </button>

          {/* Quick Modules Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsModulesDropdownOpen(!isModulesDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--elevated)] hover:bg-[var(--muted)] border border-[var(--border)] hover:border-[#E8622C]/40 text-xs font-semibold text-[var(--text-primary)] transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-[#E8622C]" />
              <span>All Modules</span>
              <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isModulesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Modules Dropdown Menu */}
            <AnimatePresence>
              {isModulesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto p-2 rounded-2xl bg-[#0D0F14] border border-[#1E222D] shadow-2xl z-50 space-y-1 font-sans text-xs"
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1E222D] mb-1 flex items-center justify-between">
                    <span>Sovereign Substrates ({allModules.length})</span>
                    <span className="text-[#E8622C]">Direct Jump</span>
                  </div>
                  {allModules.map((mod) => {
                    const Icon = mod.icon;
                    const isSelected = activeView === mod.id;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => handleNavClick(mod.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-[#161922]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{mod.label}</span>
                        </div>
                        <span className="text-[9px] font-mono opacity-60 ml-2">{mod.category}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Controls & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={() => toggleNetworkOnline(!isNetworkOnline)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isNetworkOnline
                ? 'bg-[var(--elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[#22C55E]/40'
                : 'bg-rose-950/80 text-rose-200 border-rose-700 animate-pulse'
            }`}
            title="Toggle P2P Mesh Connectivity"
          >
            {isNetworkOnline ? (
              <><Wifi className="w-3.5 h-3.5 text-[#22C55E]" /><span className="hidden sm:inline font-mono text-[11px]">Mesh Online</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-rose-400" /><span className="hidden sm:inline font-mono text-[11px]">Offline Queue</span></>
            )}
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--elevated)] hover:bg-[var(--muted)] border border-[var(--border)] hover:border-[#6366F1]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Open AI Operator Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="hidden md:inline">Copilot</span>
          </button>

          <button
            onClick={() => handleNavClick('judge-mode')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              activeView === 'judge-mode'
                ? 'btn-gold ring-2 ring-amber-300/30'
                : 'bg-[#D4A017]/10 hover:bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#D4A017] hover:text-[#92400E] dark:text-[#EAB308] dark:hover:text-white'
            }`}
            title="Launch 9-Step SIH Judge Demo"
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A017]" />
            <span className="font-extrabold tracking-wide">निर्णायक मोड</span>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle variant="compact" />

          {/* Operator Profile */}
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

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-[var(--elevated)] border border-[var(--border)] text-[var(--text-primary)] md:hidden flex items-center justify-center transition-colors"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#E8622C]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex flex-col justify-end" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-[#0D0F14] border-t border-[#1E222D] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1E222D]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8622C]" />
                  <span className="font-bold text-white text-sm">SETU National Navigation</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-2">
                {allModules.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isActive
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                          : 'bg-[#111318] border-[#1E222D] text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <div className="text-xs truncate">{item.label.split('(')[0]}</div>
                        <span className="text-[9px] text-slate-500 block font-mono">{item.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* SIH Judge Pitch Center Direct Button */}
              <button
                onClick={() => handleNavClick('judge-mode')}
                className="w-full py-3 rounded-xl btn-gold text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Award className="w-4 h-4" />
                <span>Open 9-Step Judge Pitch Center</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enclave Status Drawer */}
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
                <p className="text-xs text-zinc-400">10 nodes across North, Central, Southern & Defense Grids.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { name: 'NIC Delhi (Shastri Park)', role: 'Apex Root Enclave', latency: '34ms', state: 'Delhi NCR' },
                { name: 'NTPC Dadri, UP', role: 'Turbine SCADA Validator', latency: '18ms', state: 'Uttar Pradesh' },
                { name: 'RDSO Lucknow', role: 'Rolling Stock Node', latency: '22ms', state: 'Uttar Pradesh' },
                { name: 'DRDO Bangalore', role: 'Tactical Avionics Enclave', latency: '28ms', state: 'Karnataka' },
                { name: 'DGCA Delhi (Aviation Hub)', role: 'Airworthiness Validator', latency: '24ms', state: 'Delhi NCR' },
                { name: 'ISRO ISTRAC Bangalore', role: 'Orbital Ephemeris Node', latency: '38ms', state: 'Karnataka' }
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
              <button onClick={() => { setIsStatusDrawerOpen(false); handleNavClick('sectors'); }} className="text-[#E8622C] hover:text-[#EA580C] font-bold flex items-center gap-1">
                <span>View All 8 Sectors</span><ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
