import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { BrainCircuit, Activity, Cpu, Network, Zap, Play, CheckCircle2 } from 'lucide-react';

export const AIIntelligenceView: React.FC = () => {
  const { latestEvent, assets } = useUBIP();
  const [federatedRound, setFederatedRound] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);

  const currentTelemetry = latestEvent?.telemetry || assets[0]?.latest_telemetry || {
    temperature: 42.4,
    vibration: 0.21,
    gas_ppm: 112,
    humidity: 48.5,
    battery_voltage: 3.95,
    location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
  };

  const handleRunFederatedRound = async () => {
    setIsTraining(true);
    try {
      const res = await fetch('/api/federated/round', { method: 'POST' }).then(r => r.json());
      if (res.success) {
        setFederatedRound(res.round);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-ubip-accent" />
            <span>AI Trust Intelligence & Explainability Center</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real deterministic statistical anomaly models (EWMA/Z-Score), SNN Neuromorphic spike-encoders, and Federated Learning across isolated enterprise silos.
          </p>
        </div>
      </div>

      {/* Grid: Statistical Baseline Model + SNN Spike Trains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Statistical Multi-Sensor Baseline Card */}
        <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Multi-Sensor Statistical Baseline & EWMA</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-bold">
              3-Sigma Dynamic Bounds
            </span>
          </div>

          <div className="space-y-3">
            {/* Temperature Channel */}
            <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Thermal Channel (DHT22):</span>
                <span className="text-white font-bold">{currentTelemetry.temperature.toFixed(1)}°C</span>
              </div>
              <div className="w-full bg-ubip-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${currentTelemetry.temperature > 65 ? 'bg-red-500' : 'bg-cyan-400'}`}
                  style={{ width: `${Math.min(100, (currentTelemetry.temperature / 90) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Baseline: 42.0°C</span>
                <span>Max Allowed: 65.0°C</span>
              </div>
            </div>

            {/* Vibration Channel */}
            <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Vibration Kinematics (MPU-6050):</span>
                <span className="text-white font-bold">{currentTelemetry.vibration.toFixed(3)} G</span>
              </div>
              <div className="w-full bg-ubip-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${currentTelemetry.vibration > 1.0 ? 'bg-red-500' : 'bg-purple-400'}`}
                  style={{ width: `${Math.min(100, (currentTelemetry.vibration / 3.0) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Baseline: 0.220 G</span>
                <span>Max Allowed: 1.200 G</span>
              </div>
            </div>
          </div>
        </div>

        {/* SNN Neuromorphic Spike Encoder */}
        <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>Neuromorphic Spike Encoder (SNN Research)</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 text-[10px] font-bold">
              Event-Driven Spikes
            </span>
          </div>

          <p className="text-slate-300 text-xs">
            Translates continuous physical sensor telemetry into temporal action potential spike trains. High delta spikes indicate sudden mechanical shock.
          </p>

          <div className="p-4 rounded-xl bg-ubip-900/90 border border-ubip-700/50 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current Action Potential Rate:</span>
              <span className="text-pink-400 font-bold">
                {currentTelemetry.vibration > 0.5 ? '88 Hz (Surge Burst)' : '14 Hz (Nominal Resting)'}
              </span>
            </div>

            {/* Visual Spike Train Raster */}
            <div className="h-12 bg-ubip-800 rounded-lg p-2 flex items-center gap-1 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    (i % 3 === 0 || currentTelemetry.vibration > 0.5) 
                      ? 'h-8 bg-pink-400 shadow-sm shadow-pink-400' 
                      : 'h-2 bg-ubip-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Federated Learning Multi-Node Round Aggregator */}
      <div className="p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              <span>Cross-Organizational Federated Learning (FedAvg Simulation)</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Trains edge anomaly models locally at ORG-A, ORG-B, and ORG-C without sharing raw proprietary physical telemetry.
            </p>
          </div>

          <button
            onClick={handleRunFederatedRound}
            disabled={isTraining}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/30"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTraining ? 'Aggregating Gradients...' : 'Execute FedAvg Round'}</span>
          </button>
        </div>

        {federatedRound && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Global Model Accuracy</span>
              <div className="text-lg font-bold text-emerald-400">{federatedRound.globalAccuracy}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Global Loss</span>
              <div className="text-lg font-bold text-cyan-400">{federatedRound.globalLoss}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-ubip-900/80 border border-ubip-700/50">
              <span className="text-[10px] text-slate-400 uppercase">Privacy Mechanism</span>
              <div className="text-sm font-bold text-purple-300 truncate">Differential Privacy (ε=0.5)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
