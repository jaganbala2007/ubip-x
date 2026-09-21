import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, Fingerprint, ArrowRight, CheckCircle2, Sparkles, Lock, Award, Cpu, Globe, Zap } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface CockpitLoginProps {
  onLoginSuccess: (operator: OperatorProfile) => void;
  isOpen: boolean;
}

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  organization: string;
  clearanceLevel: 'Tier-1 (Observer)' | 'Tier-2 (Validator)' | 'Tier-3 (Chief Architect)';
  did: string;
  avatarGlow: string;
}

export const CockpitLoginModal: React.FC<CockpitLoginProps> = ({ onLoginSuccess, isOpen }) => {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'VERIFYING_ZKP' | 'AUTHORIZED'>('IDLE');
  const [scanProgress, setScanProgress] = useState(0);

  const profiles: OperatorProfile[] = [
    {
      id: 'OP-7749',
      name: 'Capt. Vikram Sen',
      role: 'Chief Trust Architect & NTPC Power Grid Lead',
      organization: 'NTPC Dadri Strategic Node',
      clearanceLevel: 'Tier-3 (Chief Architect)',
      did: 'did:setu:key:z6Mku...8A9f',
      avatarGlow: 'from-orange-500 to-red-600'
    },
    {
      id: 'VAL-AICTE-04',
      name: 'Dr. Priya Sharma',
      role: 'AICTE Consensus Validator & Jury Lead',
      organization: 'AICTE MIC Innovation Council',
      clearanceLevel: 'Tier-3 (Chief Architect)',
      did: 'did:setu:val:0x892...FF1',
      avatarGlow: 'from-violet-500 to-indigo-600'
    },
    {
      id: 'AUDIT-SEC-01',
      name: 'Commander Ronald Vance',
      role: 'Zero-Trust Cybersecurity Officer',
      organization: 'Strategic Cyber Defense (RDSO)',
      clearanceLevel: 'Tier-2 (Validator)',
      did: 'did:setu:sec:0x37C...41E',
      avatarGlow: 'from-emerald-500 to-teal-600'
    }
  ];

  if (!isOpen) return null;

  const currentProfile = profiles[selectedProfileIndex];

  const handleStartAuth = () => {
    setScanStatus('SCANNING');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus('VERIFYING_ZKP');
          setTimeout(() => {
            setScanStatus('AUTHORIZED');
            setTimeout(() => {
              onLoginSuccess(currentProfile);
            }, 800);
          }, 900);
          return 100;
        }
        return prev + 20;
      });
    }, 140);
  };

  const clearanceColor = (level: string) => {
    if (level.includes('Tier-3')) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (level.includes('Tier-2')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center login-mesh pattern-grid"
        style={{ backgroundColor: 'var(--canvas)' }}
      >
        {/* Top-Right Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle variant="compact" />
        </div>

        {/* Ambient warm glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] rounded-full bg-[#E8622C]/[0.06] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] rounded-full bg-[#6366F1]/[0.05] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, type: 'spring', stiffness: 200, damping: 24 }}
          className="w-full max-w-xl mx-4 relative"
        >
          {/* Top Institutional Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#E8622C] animate-glow-pulse" />
              <span className="text-[#E8622C] font-bold tracking-wide">Smart India Hackathon 2026</span>
              <span className="text-zinc-400">•</span>
              <span>Problem Statement #26211</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
              सेतु <span className="text-[#E8622C]">DLT</span> Sovereign Console
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm mx-auto leading-relaxed">
              Authenticate via W3C DID Cryptographic Keycard to access the National Physical Trust Infrastructure.
            </p>
          </motion.div>

          {/* Main Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass-warm p-6 sm:p-8 rounded-2xl relative overflow-hidden"
          >
            {/* Top shimmer edge */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8622C]/40 to-transparent" />

            {/* Operator Selection */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono block mb-2.5">
                Select Operator DID Credential
              </label>

              <div className="space-y-2 stagger-children">
                {profiles.map((p, idx) => {
                  const isSelected = selectedProfileIndex === idx;
                  return (
                    <motion.div
                      key={p.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scanStatus === 'IDLE' && setSelectedProfileIndex(idx)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[var(--elevated)] border-[#E8622C]/60 shadow-lg shadow-[#E8622C]/[0.10]'
                          : 'bg-[var(--surface)] border-[var(--border)] hover:border-zinc-400 opacity-75 hover:opacity-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.avatarGlow} flex items-center justify-center font-bold text-white text-sm shadow-md`}>
                          {p.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-normal">({p.id})</span>
                          </div>
                          <div className="text-[11px] text-[var(--text-secondary)]">{p.role}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${clearanceColor(p.clearanceLevel)}`}>
                        {p.clearanceLevel.split(' ')[0]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Biometric Auth Zone */}
            <div className="p-5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-center space-y-4 relative overflow-hidden">
              {/* Scanning laser line */}
              {scanStatus === 'SCANNING' && (
                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E8622C] to-transparent shadow-[0_0_12px_#E8622C]"
                />
              )}

              <div className="flex flex-col items-center space-y-3">
                {/* Fingerprint / Chakra Spinner / Success Check */}
                <motion.div
                  whileHover={scanStatus === 'IDLE' ? { scale: 1.08 } : {}}
                  whileTap={scanStatus === 'IDLE' ? { scale: 0.95 } : {}}
                  onClick={scanStatus === 'IDLE' ? handleStartAuth : undefined}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    scanStatus === 'AUTHORIZED'
                      ? 'bg-[#22C55E] text-black shadow-lg shadow-[#22C55E]/40'
                      : scanStatus === 'VERIFYING_ZKP'
                      ? 'bg-[#6366F1]/20 text-[#818CF8] border-2 border-[#6366F1]/60'
                      : scanStatus === 'SCANNING'
                      ? 'bg-[#E8622C]/15 text-[#F0845C] border-2 border-[#E8622C]/50 animate-pulse'
                      : 'bg-[#1A1A1C] hover:bg-[#27272A] text-zinc-400 hover:text-[#F0845C] border border-[#27272A]'
                  }`}
                >
                  {scanStatus === 'AUTHORIZED' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: 'spring' }}>
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                  ) : scanStatus === 'VERIFYING_ZKP' ? (
                    <div className="chakra-spin" />
                  ) : (
                    <Fingerprint className="w-8 h-8" />
                  )}
                </motion.div>

                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-[#FAFAF9]">
                    {scanStatus === 'IDLE' && 'Tap to Authenticate Identity'}
                    {scanStatus === 'SCANNING' && `Verifying Hardware Biometrics... ${scanProgress}%`}
                    {scanStatus === 'VERIFYING_ZKP' && 'Generating Zero-Knowledge Proof...'}
                    {scanStatus === 'AUTHORIZED' && 'ACCESS GRANTED • CONSOLE UNLOCKED'}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    DID: <span className="text-[#F0845C]">{currentProfile.did}</span>
                  </div>
                </div>

                {/* Scanning progress bar */}
                {(scanStatus === 'SCANNING' || scanStatus === 'VERIFYING_ZKP') && (
                  <div className="w-full max-w-[200px] h-1 bg-[#27272A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: scanStatus === 'VERIFYING_ZKP' ? '100%' : `${scanProgress}%` }}
                      className={`h-full rounded-full ${
                        scanStatus === 'VERIFYING_ZKP'
                          ? 'bg-[#6366F1] animate-pulse'
                          : 'bg-[#E8622C]'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Launch Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartAuth}
                disabled={scanStatus !== 'IDLE'}
                className="w-full py-3.5 rounded-xl btn-sienna text-sm flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <KeyRound className="w-4 h-4" />
                <span className="font-extrabold">Launch Console — {currentProfile.name}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Bottom Institutional Trust Strip */}
            <div className="mt-5 pt-4 border-t border-[#27272A] flex flex-wrap items-center justify-center gap-4 text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#F0845C]" />
                FIPS 204 PQC
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
                ZK-SNARK Proof
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#D4A017]" />
                MeitY • AICTE
              </span>
              <span className="text-zinc-700">•</span>
              <span className="text-[#FF9933] font-bold">सत्यमेव जयते</span>
            </div>
          </motion.div>

          {/* Bottom SIH Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[11px] text-zinc-600 mt-6 font-mono"
          >
            Setu DLT • Viksit Bharat @ 2047 • National Sovereign Trust Infrastructure
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
