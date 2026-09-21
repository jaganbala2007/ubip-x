import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { 
  Box, 
  Thermometer, 
  Activity, 
  Wind, 
  Battery, 
  MapPin, 
  Scan, 
  PlusCircle, 
  ShieldCheck, 
  Lock, 
  Unlock,
  AlertTriangle
} from 'lucide-react';

export const LiveAssetsView: React.FC = () => {
  const { assets, selectedAsset, setSelectedAsset, triggerScenario, toggleHold, activeSector } = useUBIP();
  const [newAssetId, setNewAssetId] = useState('');
  const [newRfid, setNewRfid] = useState('');

  const currentAsset = selectedAsset || assets[0];
  const telemetry = currentAsset?.latest_telemetry || {
    temperature: 42.4,
    vibration: 0.21,
    gas_ppm: 112,
    humidity: 48.5,
    battery_voltage: 3.95,
    location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
  };

  const handleRegisterNewAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetId || !newRfid) return;

    try {
      await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: newAssetId,
          rfid_tag: newRfid,
          node_device_id: 'ESP32-001',
          organization: 'ORG-A',
          sector: activeSector
        })
      });
      setNewAssetId('');
      setNewRfid('');
      window.location.reload();
    } catch (err) {
      console.error('Error registering asset:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-ubip-accent" />
            <span>Physical Asset Registry & RFID Telemetry</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time physical asset monitoring with on-chip cryptographic telemetry signing and RFID identification.
          </p>
        </div>

        {/* Scan RFID Simulator Button */}
        <button
          onClick={() => triggerScenario('NORMAL')}
          className="px-4 py-2 rounded-xl bg-ubip-accent/20 border border-ubip-accent/50 text-ubip-accent font-mono font-bold text-xs flex items-center gap-2 hover:bg-ubip-accent/30 transition-colors"
        >
          <Scan className="w-4 h-4" />
          <span>Simulate RFID Tap (RC522)</span>
        </button>
      </div>

      {/* Asset Selection Grid & Live Sensor Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Cards List (5 Columns) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Registered Physical Assets ({assets.length})
          </h3>

          <div className="space-y-2.5">
            {assets.map((asset) => {
              const isSelected = currentAsset?.asset_id === asset.asset_id;
              return (
                <div
                  key={asset.asset_id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-ubip-850 border-ubip-accent/60 shadow-lg shadow-ubip-accent/10' 
                      : 'bg-ubip-900/80 border-ubip-700/50 hover:border-ubip-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">{asset.asset_id}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          asset.state === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                          asset.state === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                          asset.state === 'ON_HOLD' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {asset.state}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-1">{asset.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">
                        RFID: <span className="text-ubip-accent">{asset.rfid_tag}</span> | Node: {asset.node_device_id}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-slate-200">{asset.trust_score}%</div>
                      <div className="text-[10px] text-slate-400 uppercase">Trust Index</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Register New Asset Form */}
          <form onSubmit={handleRegisterNewAsset} className="p-4 rounded-xl bg-ubip-850/60 border border-ubip-700/40 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-ubip-accent" />
              <span>Register New Physical Asset</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <input
                type="text"
                placeholder="Asset ID (e.g. ASSET-004)"
                value={newAssetId}
                onChange={(e) => setNewAssetId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-ubip-900 border border-ubip-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ubip-accent"
              />
              <input
                type="text"
                placeholder="RFID Tag (e.g. UBIP-TAG-04)"
                value={newRfid}
                onChange={(e) => setNewRfid(e.target.value)}
                className="px-3 py-2 rounded-lg bg-ubip-900 border border-ubip-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ubip-accent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-ubip-800 hover:bg-ubip-700 text-ubip-accent font-mono font-bold text-xs border border-ubip-600/60 transition-colors"
            >
              Mint Genesis Asset Record
            </button>
          </form>
        </div>

        {/* Selected Asset Detailed Live Telemetry (7 Columns) */}
        {currentAsset && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-6">
              {/* Asset Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ubip-700/50">
                <div>
                  <div className="text-xs font-mono text-ubip-accent uppercase font-semibold">Physical Evidence Target</div>
                  <h3 className="text-lg font-mono font-bold text-white mt-0.5">{currentAsset.name}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Asset ID: <span className="text-slate-200">{currentAsset.asset_id}</span> | Organization: <span className="text-slate-200">{currentAsset.organization}</span>
                  </p>
                </div>

                {/* Hold Action Button */}
                <button
                  onClick={() => toggleHold(currentAsset.asset_id, !currentAsset.is_held)}
                  className={`px-4 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2 transition-all ${
                    currentAsset.is_held
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                  }`}
                >
                  {currentAsset.is_held ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{currentAsset.is_held ? 'Release Smart Contract Hold' : 'Trigger Policy Hold'}</span>
                </button>
              </div>

              {/* 4 Multi-Sensor Live Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                {/* Temperature Gauge */}
                <div className="p-4 rounded-xl bg-ubip-900/80 border border-ubip-700/50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span>Temperature</span>
                  </div>
                  <div className={`text-xl font-bold font-mono ${telemetry.temperature > 65 ? 'text-red-400' : 'text-slate-100'}`}>
                    {telemetry.temperature.toFixed(1)}°C
                  </div>
                  <span className="text-[10px] text-slate-500">Threshold: &lt; 65.0°C</span>
                </div>

                {/* Vibration Gauge */}
                <div className="p-4 rounded-xl bg-ubip-900/80 border border-ubip-700/50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>Vibration</span>
                  </div>
                  <div className={`text-xl font-bold font-mono ${telemetry.vibration > 1.0 ? 'text-red-400' : 'text-slate-100'}`}>
                    {telemetry.vibration.toFixed(3)} G
                  </div>
                  <span className="text-[10px] text-slate-500">Baseline: 0.220 G</span>
                </div>

                {/* Gas PPM Gauge */}
                <div className="p-4 rounded-xl bg-ubip-900/80 border border-ubip-700/50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>Gas PPM</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100">
                    {telemetry.gas_ppm} PPM
                  </div>
                  <span className="text-[10px] text-slate-500">Threshold: &lt; 350 PPM</span>
                </div>

                {/* Battery Voltage */}
                <div className="p-4 rounded-xl bg-ubip-900/80 border border-ubip-700/50 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Battery className="w-4 h-4 text-amber-400" />
                    <span>Battery</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100">
                    {telemetry.battery_voltage.toFixed(2)} V
                  </div>
                  <span className="text-[10px] text-slate-500">Nominal 3.7 - 4.2V</span>
                </div>
              </div>

              {/* Location & Provenance Hash */}
              <div className="p-4 rounded-xl bg-ubip-900/80 border border-ubip-700/50 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ubip-accent" />
                    <span>Current Physical Geofence:</span>
                  </span>
                  <span className="text-slate-200 font-semibold">{telemetry.location.zone}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-ubip-700/30">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Canonical Provenance Hash:</span>
                  </span>
                  <span className="text-slate-300 font-mono truncate max-w-[280px]">
                    {currentAsset.latest_hash}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
