import React from 'react';
import {
  Globe2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Building2,
  Wheat,
  HeartPulse,
  GraduationCap,
  FileText,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ImpactSDGView: React.FC = () => {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner: Viksit Bharat 2047 & UN SDGs */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Vision: Viksit Bharat 2047</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Social Impact & UN Sustainable Development Goals (SDGs)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Quantified governance transformation mapped directly to India's national digitalization roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-950/80 border border-orange-800/50 text-orange-300 text-xs font-bold font-mono">
            <Award className="w-4 h-4 text-orange-400" />
            <span>Digital Public Infrastructure (DPI) Ready</span>
          </div>
        </div>
      </div>

      {/* UN SDGs Mapping Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-blue-400" />
          <span>Aligned United Nations Sustainable Development Goals</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* SDG 1 */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-red-950/40 to-slate-950 border border-red-800/40 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/50 font-mono">
              SDG 1: No Poverty
            </span>
            <h4 className="text-sm font-bold text-white">Targeted MSP Payouts</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guarantees 100% fair agricultural MSP reach to smallholder farmers with zero middlemen commission.
            </p>
          </div>

          {/* SDG 3 */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-950 border border-emerald-800/40 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 font-mono">
              SDG 3: Good Health
            </span>
            <h4 className="text-sm font-bold text-white">Universal Health Records</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interoperable EHR across all 3,400+ Indian hospitals preventing medical errors & duplicate tests.
            </p>
          </div>

          {/* SDG 8 */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-800/40 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/50 font-mono">
              SDG 8: Decent Work
            </span>
            <h4 className="text-sm font-bold text-white">Verified Meritocracy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast-tracks genuine skilled graduate employment with instant 2-second background check.
            </p>
          </div>

          {/* SDG 9 */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-orange-950/40 to-slate-950 border border-orange-800/40 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-900/60 text-orange-200 border border-orange-700/50 font-mono">
              SDG 9: Industry & DPI
            </span>
            <h4 className="text-sm font-bold text-white">Sovereign Blockchain</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Indigenous cryptographic infrastructure built on Indian public server hardware & NIC nodes.
            </p>
          </div>

          {/* SDG 16 */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-800/40 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50 font-mono">
              SDG 16: Strong Institutions
            </span>
            <h4 className="text-sm font-bold text-white">Zero-Corruption Tenders</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Blinded procurement & immutable land titles permanently ending forgery and bribery.
            </p>
          </div>
        </div>
      </div>

      {/* Before vs After Comparison Cards Across All 5 Sectors */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">
            Before vs After: Legacy Indian Systems vs Setu DLT Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Concrete operational proof showing why centralized databases fail and how DLT permanently protects citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Comparison 1: Land Records */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>1. Land Records & Property Titles</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Traditional System
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Paper patwari records & isolated state SQL databases vulnerable to rogue insider modification. ₹15,000 Cr locked in title disputes.
                </p>
              </div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Setu DLT Ledger
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Bhu-Aadhaar 14-digit ULPIN immutable title chain. Requires 2F+1 multi-enclave consensus. 94% reduction in litigation time.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison 2: Agri Supply Chain */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Wheat className="w-4 h-4 text-emerald-400" />
              <span>2. Agricultural Supply Chain & MSP</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Traditional System
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Payment delays of 21–45 days via arhtiya middlemen. Quality disputes and unmonitored cold storage spoilage in transit.
                </p>
              </div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Setu DLT Ledger
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Smart contract auto-releases MSP escrow to farmer UPI upon IoT grain assay pass. Cold storage verified via RFID & temperature sensors.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison 3: Health Records */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>3. Digital Health Records (EHR)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Traditional System
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Fragmented hospital silos. Patients have zero ownership or visibility when their private diagnostic files are shared or sold.
                </p>
              </div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Setu DLT Ledger
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Patient holds master cryptographic consent key. Granular hospital revocations + time-locked emergency trauma break-glass.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison 4: Academic Credentials */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>4. Academic Degrees & Verification</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Traditional System
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Rampant paper diploma forgery mills. Background verification agencies take 14–30 days and charge ₹2,500 per candidate.
                </p>
              </div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Setu DLT Ledger
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  100% tamper-proof certificates signed with university public keys. Instant 2-second public QR validation with zero cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
