import React from 'react';
import { useUBIP, ActiveView } from '../../context/UBIPContext';
import {
  LayoutDashboard,
  Box,
  Share2,
  ShieldAlert,
  Globe2,
  Award,
  Cpu,
  Radio,
  FileCheck2,
  Sparkles,
  Lock,
  Layers,
  FileKey2
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  hindiLabel: string;
  icon: React.FC<{ className?: string }>;
  isSpecial?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useUBIP();

  const primaryNavItems: NavItem[] = [
    { id: 'overview', label: 'National Cockpit', hindiLabel: 'राष्ट्रीय अवलोकन', icon: LayoutDashboard },
    { id: 'digital-twin', label: '3D Kinematic Mirror', hindiLabel: 'डिजिटल ट्विन', icon: Box },
    { id: 'pipeline', label: 'Proof & DLT Pipeline', hindiLabel: 'प्रमाणन पाइपलाइन', icon: Share2 },
    { id: 'security', label: 'Cyber Threat Lab', hindiLabel: 'साइबर सुरक्षा लैब', icon: ShieldAlert },
    { id: 'sectors', label: 'Multi-Sector DPI', hindiLabel: 'क्षेत्रीय नेटवर्क (DPI)', icon: Globe2 }
  ];

  const specialNavItems: NavItem[] = [
    { id: 'judge-mode', label: 'Judge Pitch Center', hindiLabel: 'निर्णायक डेमो केंद्र', icon: Award, isSpecial: true }
  ];

  return (
    <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] p-3.5 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4.25rem)] max-h-[calc(100vh-4.25rem)] overflow-y-auto select-none transition-colors duration-250">
      <div className="space-y-4">
        {/* Core Modules */}
        <div>
          <div className="flex items-center justify-between px-3 py-1 mb-1.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">
              Core Modules
            </span>
            <span className="text-[10px] font-bold text-[#E8622C] font-mono tracking-wide">
              सत्यमेव जयते
            </span>
          </div>

          <div className="space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeView === item.id ||
                (item.id === 'pipeline' && (activeView === 'physical-evidence' || activeView === 'trust-graph' || activeView === 'trust-universe' || activeView === 'blockchain')) ||
                (item.id === 'security' && (activeView === 'attack-lab' || activeView === 'ai-intelligence' || activeView === 'pqc-center' || activeView === 'security-center' || activeView === 'recovery-center' || activeView === 'dispute-center')) ||
                (item.id === 'sectors' && activeView === 'sector-hub');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold relative transition-all duration-200 group ${
                    isActive
                      ? 'text-[var(--text-primary)] font-bold bg-[var(--elevated)] border border-[#E8622C]/40 shadow-md shadow-[#E8622C]/[0.08]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted)]/50 border border-transparent'
                  }`}
                >
                  {/* Active left indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#E8622C] shadow-[0_0_6px_rgba(232,98,44,0.5)]" />
                  )}

                  <div className="flex items-center gap-3 z-10 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#E8622C]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                    }`} />
                    <div className="text-left truncate">
                      <span className="block truncate text-[12px] font-bold leading-tight">{item.label}</span>
                      <span className={`block text-[10px] font-medium leading-none mt-0.5 ${
                        isActive ? 'text-[#E8622C]' : 'text-[var(--text-muted)]'
                      }`}>
                        {item.hindiLabel}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Judge Section */}
        <div>
          <div className="px-3 py-1 mb-1.5">
            <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest font-mono">
              SIH 2026 Presentation
            </span>
          </div>

          <div className="space-y-1">
            {specialNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold relative transition-all duration-200 ${
                    isActive
                      ? 'btn-gold text-black shadow-lg shadow-[#D4A017]/25'
                      : 'bg-[#D4A017]/[0.10] hover:bg-[#D4A017]/20 text-[#D4A017] dark:text-[#EAB308] border border-[#D4A017]/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 z-10 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#D4A017]'}`} />
                    <div className="text-left truncate">
                      <span className="block truncate text-[12px] font-extrabold">{item.label}</span>
                      <span className={`block text-[10px] font-medium leading-none mt-0.5 ${
                        isActive ? 'text-black/80' : 'text-[#D4A017]/80'
                      }`}>
                        {item.hindiLabel}
                      </span>
                    </div>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                    isActive ? 'bg-black text-[#D4A017]' : 'bg-[#D4A017] text-black'
                  }`}>
                    9-STEP
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Institutional Mission Badge */}
      <div className="p-4 bg-gradient-to-b from-[var(--elevated)] to-[var(--surface)] rounded-2xl border border-[var(--border)] text-xs space-y-2 mt-4 shadow-lg">
        <div className="flex items-center justify-between text-[var(--text-primary)] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8622C]" />
            <span>AICTE SIH 2026</span>
          </div>
          <span className="text-[10px] font-mono font-bold badge-sienna px-2 py-0.5 rounded">
            PS #26211
          </span>
        </div>
        <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
          National Sovereign Trust Substrate for <strong className="text-[var(--text-primary)]">NTPC Power Grid, RDSO Railways & Bharat Cold-Chain</strong>.
        </p>
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono">
          <span className="text-[var(--text-muted)]">Viksit Bharat @ 2047</span>
          <span className="text-[#22C55E] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            LIVE DPI
          </span>
        </div>
      </div>
    </aside>
  );
};
