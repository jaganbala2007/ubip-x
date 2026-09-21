import React, { useState } from 'react';
import { useSetu } from '../../context/SetuContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Key,
  Smartphone,
  Building2,
  Fingerprint,
  ArrowRight,
  Lock
} from 'lucide-react';

export const GovWalletModal: React.FC = () => {
  const { isWalletOpen, setIsWalletOpen } = useSetu();
  const [authMethod, setAuthMethod] = useState<'MERI_PEHCHAN' | 'DIGILOCKER' | 'AADHAAR_ESIGN' | 'NIC_HSM'>('MERI_PEHCHAN');
  const [isConnected, setIsConnected] = useState(false);
  const [operatorName, setOperatorName] = useState('Dr. Rajeshwar Rao (Joint Secretary, MeitY)');

  if (!isWalletOpen) return null;

  const handleConnect = () => {
    setIsConnected(true);
    setTimeout(() => {
      setIsWalletOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsWalletOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-600 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Sovereign Identity & Node Sign-In</h3>
            <p className="text-xs text-slate-400">Authenticate via National Digital Public Infrastructure (DPI)</p>
          </div>
        </div>

        {/* Authentication Methods Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAuthMethod('MERI_PEHCHAN')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              authMethod === 'MERI_PEHCHAN'
                ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span>MeriPehchan (NSSO)</span>
            </div>
            <p className="text-[11px] text-slate-400">Single Sign-On for Gov Officers</p>
          </button>

          <button
            onClick={() => setAuthMethod('DIGILOCKER')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              authMethod === 'DIGILOCKER'
                ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>DigiLocker DPI</span>
            </div>
            <p className="text-[11px] text-slate-400">Citizen Digital Asset Wallet</p>
          </button>

          <button
            onClick={() => setAuthMethod('AADHAAR_ESIGN')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              authMethod === 'AADHAAR_ESIGN'
                ? 'bg-orange-950/60 border-orange-500 ring-1 ring-orange-500'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
              <Fingerprint className="w-3.5 h-3.5 text-orange-400" />
              <span>Aadhaar eSign 3.0</span>
            </div>
            <p className="text-[11px] text-slate-400">Biometric / OTP On-Chain Signing</p>
          </button>

          <button
            onClick={() => setAuthMethod('NIC_HSM')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              authMethod === 'NIC_HSM'
                ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>NIC Validator HSM</span>
            </div>
            <p className="text-[11px] text-slate-400">Hardware Security Enclave Key</p>
          </button>
        </div>

        {/* Selected Method Details */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Identity DID:</span>
            <span className="font-mono text-blue-400">did:setu:gov:meity-9948</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Security Clearance:</span>
            <span className="font-mono text-emerald-400 font-bold">Tier-3 (National Master)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Hardware Enclave:</span>
            <span className="font-mono text-purple-400">FIPS 140-3 HSM Level 4</span>
          </div>
        </div>

        {/* Connect Action */}
        <button
          onClick={handleConnect}
          disabled={isConnected}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isConnected
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-blue-600 via-emerald-600 to-orange-600 hover:opacity-95 text-white shadow-lg shadow-blue-500/25'
          }`}
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Authenticated via Sovereign DPI</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Connect Sovereign DLT Keypair</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
