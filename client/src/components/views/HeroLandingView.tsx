import React from 'react';
import { useSetu } from '../../context/SetuContext';
import { Network3DVisualizer } from '../network/Network3DVisualizer';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  MapPin, 
  Building2, 
  Wheat, 
  HeartPulse, 
  GraduationCap, 
  FileText,
  Lock,
  Zap
} from 'lucide-react';

export const HeroLandingView: React.FC = () => {
  const { setActiveView, setActiveSector, metrics, recentBlocks, recentTxs, setIsWalletOpen } = useSetu();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 p-8 md:p-12 shadow-2xl">
        {/* Background glow lines */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          {/* SIH 2026 Tagline */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Smart India Hackathon 2026 • Problem Statement #26211</span>
            <span className="text-slate-500">|</span>
            <span className="text-blue-400">Theme: Blockchain & Cybersecurity</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            The Ledger Behind Bitcoin.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent">
              Rebuilt to Run Bharat.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mt-6 leading-relaxed">
            <strong>Setu Chain (सेतु DLT)</strong> proves how decentralized, cryptographic ledger technology can eliminate corruption, fake titles, counterfeit produce, and degree fraud across five non-financial pillars of Indian public governance on <strong>one unified, interoperable sovereign chain</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => setActiveView('sectors')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4" />
              <span>Explore 5 Multi-Sector Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('network')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>3D National Consensus Topology</span>
            </button>

            <button
              onClick={() => setActiveView('judge-presenter')}
              className="px-5 py-3.5 rounded-xl bg-orange-950/60 hover:bg-orange-900/60 border border-orange-700/60 text-orange-300 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Judge Pitch Presentation Mode</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Blocks Finalized</span>
            <p className="text-xl md:text-2xl font-black text-white font-mono mt-1">
              {metrics.blocksMined.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-medium">⚡ &lt;450ms Finality</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">National Nodes</span>
            <p className="text-xl md:text-2xl font-black text-blue-400 font-mono mt-1">
              10 State Enclaves
            </p>
            <span className="text-[10px] text-slate-400">NIC • CDAC • NPCI</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Throughput (TPS)</span>
            <p className="text-xl md:text-2xl font-black text-emerald-400 font-mono mt-1">
              {metrics.tps.toLocaleString()} TPS
            </p>
            <span className="text-[10px] text-emerald-400">IBFT 2.0 Quorum</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Value Secured (₹)</span>
            <p className="text-xl md:text-2xl font-black text-orange-400 font-mono mt-1">
              ₹18,420 Cr
            </p>
            <span className="text-[10px] text-slate-400">Public Deeds & Tenders</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Fraud Prevented (₹)</span>
            <p className="text-xl md:text-2xl font-black text-rose-400 font-mono mt-1">
              ₹2,340 Cr
            </p>
            <span className="text-[10px] text-rose-400">100% Cryptographic Lock</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Verified Records</span>
            <p className="text-xl md:text-2xl font-black text-cyan-400 font-mono mt-1">
              {metrics.recordsVerified.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400">ABHA • Bhu-Aadhaar</span>
          </div>
        </div>
      </div>

      {/* 5 High-Impact Indian Sectors on ONE Sovereign Ledger */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Interoperability Architecture</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              1 Ledger. 5 High-Impact Indian Sectors.
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Not five separate toy demos — a single interoperable Setu DLT backbone solving India's deepest transparency challenges.
            </p>
          </div>
        </div>

        {/* 5 Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sector 1: Land Records */}
          <div 
            onClick={() => { setActiveSector('land'); setActiveView('sectors'); }}
            className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                Bhu-Aadhaar ULPIN
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              1. Land Records & Property Registry
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bhu-Aadhaar 14-digit ULPIN linked parcel deeds. Completely eliminates duplicate registration, forged mutation, and illegal title transfers.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Impact Metric:</span>
              <span className="font-bold text-emerald-400 font-mono">₹2,340 Cr Fraud Prevented</span>
            </div>
          </div>

          {/* Sector 2: Agri Supply Chain */}
          <div 
            onClick={() => { setActiveSector('agri'); setActiveView('sectors'); }}
            className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Wheat className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                e-NAM Smart Escrow
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              2. Agricultural Supply Chain & MSP
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Farm-to-fork QR batch provenance with IoT cold-chain telemetry and automated smart-contract MSP payouts directly to farmer UPI.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Impact Metric:</span>
              <span className="font-bold text-emerald-400 font-mono">40% Faster MSP Payments</span>
            </div>
          </div>

          {/* Sector 3: Digital Health Records */}
          <div 
            onClick={() => { setActiveSector('health'); setActiveView('sectors'); }}
            className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/60 transition-all cursor-pointer shadow-lg hover:shadow-rose-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/40">
                ABHA Consent
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              3. Digital Health Records (EHR)
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Patient-owned Ayushman Bharat (ABHA) records with granular consent policies, zero-knowledge hospital audits, and emergency break-glass protocols.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Impact Metric:</span>
              <span className="font-bold text-emerald-400 font-mono">100% Patient Data Ownership</span>
            </div>
          </div>

          {/* Sector 4: Academic Credentials */}
          <div 
            onClick={() => { setActiveSector('education'); setActiveView('sectors'); }}
            className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                ABC-ID & NAD
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              4. Tamper-Proof Academic Credentials
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Cryptographically signed degree certificates linked to Academic Bank of Credits (ABC-ID). Instant 2-second employer verification with zero fake credentials.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Impact Metric:</span>
              <span className="font-bold text-emerald-400 font-mono">100% Fake Degrees Eliminated</span>
            </div>
          </div>

          {/* Sector 5: Public Procurement & Voting */}
          <div 
            onClick={() => { setActiveSector('procurement'); setActiveView('sectors'); }}
            className="group p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/60 transition-all cursor-pointer shadow-lg hover:shadow-orange-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-950/80 border border-orange-700/50 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-950 text-orange-300 border border-orange-800/40">
                GeM ZKP Sealed Bids
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
              5. Public Procurement & Voting Integrity
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Zero-knowledge blinded tender bidding preventing cartel price-fixing on GeM, combined with auditable Gram Panchayat village-level e-voting ledgers.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Impact Metric:</span>
              <span className="font-bold text-emerald-400 font-mono">₹4,120 Cr Tenders Audited</span>
            </div>
          </div>

          {/* Sector 6: Cybersecurity & Hardware Preview */}
          <div 
            onClick={() => setActiveView('cybersecurity')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Live Threat Defense
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                6. Cybersecurity & Threat Containment
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Test 1-click live attacks (SQL deed tampering, Sybil nodes, Replay forgery) and watch the Byzantine consensus isolate threats in 12ms.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Launch Live Attack Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Embedded 3D Network Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              Live National Consensus Topology
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 3D consensus node mesh across India's premier public infrastructure enclaves.
            </p>
          </div>
          <button
            onClick={() => setActiveView('network')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Open Full Network Visualizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <Network3DVisualizer />
      </div>
    </div>
  );
};
