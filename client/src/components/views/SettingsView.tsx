import React from 'react';
import { Settings, Server, Key, Sun, Moon, Palette, ShieldCheck, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export const SettingsView: React.FC = () => {
  const { theme, isDark, setTheme } = useTheme();

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#E8622C]" />
          <span>SETU DLT Platform Node Settings & Visual System</span>
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          System topology parameters, hardware baud rates, cryptographic key storage, and display theme preferences.
        </p>
      </div>

      {/* Appearance & Theme Mode Section */}
      <div className="human-card p-6 border-[var(--border)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8622C]/10 border border-[#E8622C]/30 flex items-center justify-center text-[#E8622C]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                Console Appearance & Visual Mode
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Switch between Warm Titanium Dark (Low-light Command Center) and Executive Light (High-ambient presentation).
              </p>
            </div>
          </div>

          <ThemeToggle variant="pill" />
        </div>

        {/* Theme Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--border)]">
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              isDark 
                ? 'bg-[#18181B] border-[#E8622C] shadow-lg shadow-[#E8622C]/15 ring-1 ring-[#E8622C]/50' 
                : 'bg-[#111113] border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">Warm Titanium Dark</span>
              </div>
              {isDark && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E8622C] text-white">ACTIVE</span>
              )}
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Subdued charcoal #09090B canvas, high-specular titanium cards, and neon telemetry status chips for mission control.
            </p>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              !isDark 
                ? 'bg-white border-amber-500 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/50' 
                : 'bg-white/95 border-zinc-300 hover:border-zinc-400 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-zinc-900 text-xs">Executive Sovereign Light</span>
              </div>
              {!isDark && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-black">ACTIVE</span>
              )}
            </div>
            <p className="text-zinc-600 text-[11px] leading-relaxed">
              Warm brushed-aluminum #F4F4F6 canvas, pure white card faces, and deep charcoal high-contrast typography.
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Node Network Configuration */}
        <div className="human-card p-5 border-[var(--border)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-500" />
            <span>Hardware Gateway Configuration</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Serial Port Baud Rate</label>
              <input
                type="text"
                disabled
                value="115200 Baud (ESP32-S3 UART)"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase">MQTT Telemetry Topic</label>
              <input
                type="text"
                disabled
                value="ubip/telemetry/ESP32-001 (TLS 8883)"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* AI & Cryptographic Providers */}
        <div className="human-card p-5 border-[var(--border)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-500" />
            <span>AI Copilot & PQC Key Vault</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase">AI Operator Provider</label>
              <input
                type="text"
                disabled
                value="AstraProvider with Deterministic Local Evidence Fallback"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase">Active PQC Scheme</label>
              <input
                type="text"
                disabled
                value="ML-KEM-768 / ML-DSA-87 (NIST FIPS 203/204 Dilithium-5)"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
