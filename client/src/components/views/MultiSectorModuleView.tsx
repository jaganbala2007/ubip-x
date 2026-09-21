import React, { useState } from 'react';
import { useSetu } from '../../context/SetuContext';
import { SectorType, LandRecord, AgriBatch, HealthRecord, AcademicCredential, ProcurementTender } from '../../types';
import {
  Building2,
  Wheat,
  HeartPulse,
  GraduationCap,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Lock,
  Unlock,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Clock,
  ArrowRight,
  ExternalLink,
  Zap
} from 'lucide-react';

export const MultiSectorModuleView: React.FC = () => {
  const {
    activeSector,
    setActiveSector,
    landRecords,
    agriBatches,
    healthRecords,
    academicCredentials,
    procurementTenders,
    simulateIllegalDeedMutation,
    simulateMspPaymentRelease,
    toggleHealthConsent,
    verifyDegreeSearch
  } = useSetu();

  // State for Land search & selected record
  const [selectedLandUlpin, setSelectedLandUlpin] = useState<string>(landRecords[0]?.ulpin || '');
  const [landSearchQuery, setLandSearchQuery] = useState('');

  // State for Agri search & selected batch
  const [selectedAgriBatchId, setSelectedAgriBatchId] = useState<string>(agriBatches[0]?.batchId || '');

  // State for Academic degree search
  const [degreeSearchQuery, setDegreeSearchQuery] = useState('IITB-CSE-2025-99201');
  const [searchedDegree, setSearchedDegree] = useState<AcademicCredential | null>(academicCredentials[0] || null);

  const selectedLand = landRecords.find(l => l.ulpin === selectedLandUlpin) || landRecords[0];
  const selectedAgri = agriBatches.find(b => b.batchId === selectedAgriBatchId) || agriBatches[0];
  const selectedHealth = healthRecords[0];
  const selectedTender = procurementTenders[0];

  const handleDegreeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyDegreeSearch(degreeSearchQuery);
    setSearchedDegree(result);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Sector Tab Switcher */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Interoperable Sovereign Chain</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Multi-Sector DLT Command Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              One shared distributed ledger securing five national infrastructure pillars across Bharat.
            </p>
          </div>

          {/* Sector Navigation Tabs */}
          <div className="flex flex-wrap items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1">
            <button
              onClick={() => setActiveSector('land')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSector === 'land'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>1. Land Registry</span>
            </button>

            <button
              onClick={() => setActiveSector('agri')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSector === 'agri'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>2. Agri & MSP</span>
            </button>

            <button
              onClick={() => setActiveSector('health')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSector === 'health'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>3. Digital Health</span>
            </button>

            <button
              onClick={() => setActiveSector('education')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSector === 'education'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>4. Academic Degrees</span>
            </button>

            <button
              onClick={() => setActiveSector('procurement')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSector === 'procurement'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>5. Procurement / Voting</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTOR 1: LAND RECORDS & PROPERTY REGISTRY (BHU-AADHAAR ULPIN)           */}
      {/* ========================================================================= */}
      {activeSector === 'land' && (
        <div className="space-y-6">
          {/* Top Impact Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/50">
              <span className="text-[11px] text-blue-300 uppercase tracking-wider block">Land Fraud Prevented</span>
              <p className="text-2xl font-black text-white font-mono mt-1">₹2,340 Cr</p>
              <span className="text-[10px] text-emerald-400">Zero duplicate registrations</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Litigation Reduction</span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">94% Faster</p>
              <span className="text-[10px] text-slate-400">Title dispute resolution</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Parcels Digitized</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">428,910</p>
              <span className="text-[10px] text-slate-400">Bhu-Aadhaar ULPIN Geo-tagged</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Smart Contract Rule</span>
              <p className="text-xs font-semibold text-slate-200 mt-1 font-mono">BhuRegistry.sol</p>
              <span className="text-[10px] text-slate-400">Aadhaar eSign & GIS Quorum</span>
            </div>
          </div>

          {/* Main Content: Parcel Selector + Deed Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Parcel Directory */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Search Bhu-Aadhaar Parcels</span>
                <span className="text-xs text-blue-400 font-mono">{landRecords.length} Active Parcels</span>
              </h3>

              <div className="space-y-3">
                {landRecords.map(record => (
                  <div
                    key={record.ulpin}
                    onClick={() => setSelectedLandUlpin(record.ulpin)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedLandUlpin === record.ulpin
                        ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400">{record.ulpin}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        record.encumbranceStatus === 'CLEAR'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : record.encumbranceStatus === 'LOCKED_FRAUD_ALERT'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/50 animate-pulse'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                      }`}>
                        {record.encumbranceStatus}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{record.currentOwnerName}</h4>
                    <p className="text-xs text-slate-400">
                      Khasra {record.khasraNo} • {record.village}, {record.district} ({record.areaAcres} Acres)
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                      <span>Deed Date: {record.deedRegistrationDate}</span>
                      <span className="font-mono text-blue-400">Block #{record.lastVerifiedBlock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Immutable Deed Chain & Fraud Attack Simulator */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
              {selectedLand && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono text-blue-400 font-bold">{selectedLand.ulpin}</span>
                      <h3 className="text-lg font-black text-white mt-0.5">
                        {selectedLand.village}, {selectedLand.district}, {selectedLand.state}
                      </h3>
                    </div>

                    {/* Fraud Simulation Button */}
                    <button
                      onClick={() => simulateIllegalDeedMutation(selectedLand.ulpin)}
                      disabled={selectedLand.encumbranceStatus === 'LOCKED_FRAUD_ALERT'}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        selectedLand.encumbranceStatus === 'LOCKED_FRAUD_ALERT'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{selectedLand.encumbranceStatus === 'LOCKED_FRAUD_ALERT' ? 'Tamper Blocked On-Chain' : 'Simulate Illegal Deed Mutation Attempt'}</span>
                    </button>
                  </div>

                  {/* Parcel Details Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase">Registered Owner</span>
                      <p className="text-xs font-bold text-white mt-0.5">{selectedLand.currentOwnerName}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase">Owner Aadhaar Hash</span>
                      <p className="text-xs font-mono text-emerald-400 mt-0.5">{selectedLand.ownerAadhaarHash}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase">Total Parcel Area</span>
                      <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedLand.areaAcres} Acres ({selectedLand.khasraNo})</p>
                    </div>
                  </div>

                  {/* GIS Polygon Boundary */}
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Survey of India GIS Coordinate Boundary</span>
                    <p className="font-mono text-slate-400 mt-1 truncate">{selectedLand.gisBoundary}</p>
                  </div>

                  {/* Immutable Ownership Provenance Chain */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Immutable Cryptographic Deed Chain</span>
                    </h4>

                    <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-600/30">
                      {selectedLand.ownershipHistory.map((h, i) => (
                        <div key={i} className="pl-8 relative">
                          <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900" />
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{h.to}</span>
                              <span className="text-slate-400">{h.date}</span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Transferred from: <span className="text-slate-200">{h.from}</span> • {h.registrarName}
                            </p>
                            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
                              <span>Deed Hash: {h.deedHash.substring(0, 18)}...</span>
                              <span className="text-blue-400">Tx: {h.txHash.substring(0, 14)}...</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTOR 2: AGRICULTURAL SUPPLY CHAIN & FAIR MSP PAYMENTS                  */}
      {/* ========================================================================= */}
      {activeSector === 'agri' && (
        <div className="space-y-6">
          {/* Top Impact Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
              <span className="text-[11px] text-emerald-300 uppercase tracking-wider block">Direct MSP Settled</span>
              <p className="text-2xl font-black text-white font-mono mt-1">₹1,850 Cr</p>
              <span className="text-[10px] text-emerald-400">Direct to farmer UPI accounts</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Payment Acceleration</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">40% Faster</p>
              <span className="text-[10px] text-slate-400">From 21 days to &lt;420ms</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Batches Traced</span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">89,200</p>
              <span className="text-[10px] text-slate-400">Farm-to-fork QR authenticated</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Cold Chain Spoilage</span>
              <p className="text-2xl font-black text-orange-400 font-mono mt-1">-32% Loss</p>
              <span className="text-[10px] text-slate-400">IoT Temperature Enforced</span>
            </div>
          </div>

          {/* Main Content: Batch Selector + Traceability Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Batch Selector */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Select Farm Produce Batch
              </h3>

              <div className="space-y-3">
                {agriBatches.map(batch => (
                  <div
                    key={batch.batchId}
                    onClick={() => setSelectedAgriBatchId(batch.batchId)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAgriBatchId === batch.batchId
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">{batch.batchId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        batch.paymentStatus === 'MSP_DISBURSED_DIRECT_UPI'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                      }`}>
                        {batch.paymentStatus === 'MSP_DISBURSED_DIRECT_UPI' ? 'MSP Settled (UPI)' : 'Escrow Locked'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{batch.commodity}</h4>
                    <p className="text-xs text-slate-400">
                      Farmer: {batch.farmerName} • {batch.farmLocation} ({batch.quantityQuintals} Quintals)
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                      <span>MSP Rate: ₹{batch.mspRatePerQuintalINR}/q</span>
                      <span className="font-bold text-emerald-400 font-mono">₹{batch.totalMspPayableINR.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traceability Timeline & Smart Contract Payment Release */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
              {selectedAgri && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{selectedAgri.batchId}</span>
                      <h3 className="text-lg font-black text-white mt-0.5">
                        {selectedAgri.commodity}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {selectedAgri.variety} • Harvested {selectedAgri.harvestDate}
                      </p>
                    </div>

                    {/* Release MSP Escrow Button */}
                    <button
                      onClick={() => simulateMspPaymentRelease(selectedAgri.batchId)}
                      disabled={selectedAgri.paymentStatus === 'MSP_DISBURSED_DIRECT_UPI'}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        selectedAgri.paymentStatus === 'MSP_DISBURSED_DIRECT_UPI'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{selectedAgri.paymentStatus === 'MSP_DISBURSED_DIRECT_UPI' ? 'MSP Disbursed via NPCI' : 'Trigger Smart Contract MSP Payout'}</span>
                    </button>
                  </div>

                  {/* IoT Telemetry Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Soil Moisture</span>
                      <p className="text-sm font-bold text-blue-400 font-mono mt-0.5">{selectedAgri.iotTelemetry.soilMoisturePct}%</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Cold Storage Temp</span>
                      <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{selectedAgri.iotTelemetry.coldStorageTempC}°C</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Relative Humidity</span>
                      <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">{selectedAgri.iotTelemetry.relativeHumidityPct}%</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">RFID Tag UID</span>
                      <p className="text-xs font-mono text-orange-400 mt-0.5 truncate">{selectedAgri.iotTelemetry.rfidTagUid}</p>
                    </div>
                  </div>

                  {/* QR Scan Farm-to-Fork Timeline */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Farm-to-Fork Verified Checkpoint Trail</span>
                    </h4>

                    <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-600/30">
                      {selectedAgri.checkpoints.map((cp, idx) => (
                        <div key={idx} className="pl-8 relative">
                          <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{cp.stage}</span>
                              <span className="text-slate-400">{cp.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {cp.location} • Verified by: <span className="text-slate-200">{cp.verifiedBy}</span>
                            </p>
                            <p className="text-xs text-emerald-400 font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-800/30">
                              {cp.sensorReading}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTOR 3: DIGITAL HEALTH RECORDS (AYUSHMAN BHARAT / ABHA)               */}
      {/* ========================================================================= */}
      {activeSector === 'health' && (
        <div className="space-y-6">
          {/* Top Impact Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50">
              <span className="text-[11px] text-rose-300 uppercase tracking-wider block">Patient Records Secured</span>
              <p className="text-2xl font-black text-white font-mono mt-1">1.2 Million</p>
              <span className="text-[10px] text-emerald-400">100% ABHA compliant</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Unauthorized Leaks</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">0 Incidents</p>
              <span className="text-[10px] text-slate-400">Zero-Knowledge Encrypted</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Hospitals Connected</span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">3,480+</p>
              <span className="text-[10px] text-slate-400">AIIMS, Apollo, Fortis & Govt Hubs</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Emergency Override Time</span>
              <p className="text-2xl font-black text-rose-400 font-mono mt-1">&lt;300ms</p>
              <span className="text-[10px] text-slate-400">Cryptographic Break-Glass</span>
            </div>
          </div>

          {/* Main Health Interface: Patient Profile + Consent Switchboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Patient ABHA Identity Card */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800/40">
                    ABHA ID: {selectedHealth.abhaId}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-3">{selectedHealth.patientName}</h3>
                <p className="text-xs text-slate-400">
                  Age: {selectedHealth.age} Years • Blood Group: <strong className="text-rose-400">{selectedHealth.bloodGroup}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Decentralized EHR Vault</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Diagnostic Reports</span>
                  <span className="font-bold text-white font-mono">{selectedHealth.recordsCount} Files (IPFS)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Encryption Standard</span>
                  <span className="font-mono text-emerald-400">AES-256-GCM + ZKP</span>
                </div>
              </div>

              {/* Emergency Break-Glass Explainer */}
              <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Emergency Trauma Protocol
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In severe accidents, verified emergency doctors can trigger a time-locked 2-hour medical access pass. Every byte accessed is permanently logged on-chain.
                </p>
              </div>
            </div>

            {/* Granular Patient Consent Switchboard & Access Logs */}
            <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Patient Granular Consent Switchboard</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  You own your health data. Toggle consent permissions in real-time to allow or revoke hospital access.
                </p>
              </div>

              {/* Consent Policies Grid */}
              <div className="space-y-3">
                {selectedHealth.consentPolicies.map((policy, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{policy.hospitalName}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          policy.status === 'ACTIVE_CONSENT'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                        }`}>
                          {policy.status === 'ACTIVE_CONSENT' ? 'Consent Granted' : 'Revoked'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Doctor: {policy.doctorName} • Scope: <span className="text-slate-200">{policy.accessType}</span>
                      </p>
                      <span className="text-[10px] text-slate-500">Valid Until: {policy.expiryDate}</span>
                    </div>

                    <button
                      onClick={() => toggleHealthConsent(selectedHealth.abhaId, policy.hospitalName)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto ${
                        policy.status === 'ACTIVE_CONSENT'
                          ? 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      }`}
                    >
                      {policy.status === 'ACTIVE_CONSENT' ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Revoke Access</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Grant Consent</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Immutable Access Logs */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Forensic On-Chain Access Audit Trail
                </h4>
                <div className="space-y-2">
                  {selectedHealth.accessLogs.map((log, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{log.hospital}</span>
                        <p className="text-[11px] text-slate-400">{log.reason} ({log.actor})</p>
                      </div>
                      <div className="text-right font-mono text-slate-400 text-[11px]">
                        <span>{log.timestamp}</span>
                        <p className="text-blue-400">{log.txHash}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTOR 4: TAMPER-PROOF ACADEMIC CREDENTIALS (ABC-ID & NAD)               */}
      {/* ========================================================================= */}
      {activeSector === 'education' && (
        <div className="space-y-6">
          {/* Top Impact Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50">
              <span className="text-[11px] text-purple-300 uppercase tracking-wider block">Degree Fraud Eliminated</span>
              <p className="text-2xl font-black text-white font-mono mt-1">100% Zero Fake</p>
              <span className="text-[10px] text-emerald-400">AICTE & UGC Registry Validated</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Verification Speed</span>
              <p className="text-2xl font-black text-purple-400 font-mono mt-1">2 Seconds</p>
              <span className="text-[10px] text-slate-400">Instant employer background check</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Degrees On-Chain</span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">3.8 Million</p>
              <span className="text-[10px] text-slate-400">IITs, NITs, Central Universities</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Cost per Verification</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">₹0 (Free)</p>
              <span className="text-[10px] text-slate-400">Replaces ₹2,500 agency fees</span>
            </div>
          </div>

          {/* Instant Degree Verification Search Portal */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span>National Academic Depository (NAD) Cryptographic Verifier</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter any Certificate Roll Number or Student ABC-ID to instantly verify authenticity against university public keys.
              </p>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleDegreeSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={degreeSearchQuery}
                  onChange={e => setDegreeSearchQuery(e.target.value)}
                  placeholder="Try 'IITB-CSE-2025-99201' (Genuine) or 'FAKE-DEG-2023-SUSPECT' (Forged)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
              >
                <span>Verify On-Chain</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Search Buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Quick Test Cases:</span>
              <button
                type="button"
                onClick={() => { setDegreeSearchQuery('IITB-CSE-2025-99201'); setSearchedDegree(academicCredentials[0]); }}
                className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-mono hover:bg-emerald-900/60"
              >
                ✓ Test Genuine IIT Bombay Degree
              </button>
              <button
                type="button"
                onClick={() => { setDegreeSearchQuery('FAKE-DEG-2023-SUSPECT'); setSearchedDegree(academicCredentials[2]); }}
                className="px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300 font-mono hover:bg-rose-900/60"
              >
                ✗ Test Forged Fake Degree (Fraud Alert)
              </button>
            </div>

            {/* Verification Result Card */}
            {searchedDegree ? (
              <div className={`p-6 rounded-2xl border ${
                searchedDegree.verificationStatus === 'GENUINE_AICTE_VERIFIED'
                  ? 'bg-emerald-950/20 border-emerald-800/60'
                  : 'bg-rose-950/20 border-rose-800/60'
              } space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    {searchedDegree.verificationStatus === 'GENUINE_AICTE_VERIFIED' ? (
                      <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-600 flex items-center justify-center text-rose-400">
                        <XCircle className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-black text-white">
                        {searchedDegree.verificationStatus === 'GENUINE_AICTE_VERIFIED'
                          ? 'VERIFIED GENUINE ACADEMIC CREDENTIAL'
                          : 'FRAUD ALERT: TAMPERED HASH / FORGED CERTIFICATE'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Certificate ID: <span className="font-mono text-slate-200">{searchedDegree.certificateId}</span> • ABC ID: <span className="font-mono text-purple-300">{searchedDegree.abcId}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase font-mono self-start sm:self-auto ${
                    searchedDegree.verificationStatus === 'GENUINE_AICTE_VERIFIED'
                      ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600'
                      : 'bg-rose-900/80 text-rose-200 border border-rose-600'
                  }`}>
                    {searchedDegree.verificationStatus}
                  </span>
                </div>

                {/* Degree Certificate Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Student Name</span>
                    <p className="text-sm font-bold text-white mt-0.5">{searchedDegree.studentName}</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Awarding Institution</span>
                    <p className="text-sm font-bold text-purple-300 mt-0.5">{searchedDegree.institution}</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Degree & Major</span>
                    <p className="text-sm font-bold text-slate-200 mt-0.5">{searchedDegree.degreeName} ({searchedDegree.major})</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Academic Score</span>
                    <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">CGPA: {searchedDegree.cgpa} ({searchedDegree.division})</p>
                  </div>
                </div>

                {/* Cryptographic Proof Verification Trace */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Digital Signature (SHA-256):</span>
                    <span className="text-slate-300 truncate max-w-md">{searchedDegree.digitalSignatureSha256}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>University Public Key:</span>
                    <span className="text-purple-400 truncate max-w-md">{searchedDegree.issuerPublicKey}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                No record matched query. Try one of the test buttons above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTOR 5: PUBLIC PROCUREMENT & VOTING INTEGRITY (GeM & VILLAGE E-VOTING) */}
      {/* ========================================================================= */}
      {activeSector === 'procurement' && (
        <div className="space-y-6">
          {/* Top Impact Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/50">
              <span className="text-[11px] text-orange-300 uppercase tracking-wider block">Tenders Audited</span>
              <p className="text-2xl font-black text-white font-mono mt-1">₹4,120 Cr</p>
              <span className="text-[10px] text-emerald-400">Zero pre-opening bid leakage</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Collusion Prevention</span>
              <p className="text-2xl font-black text-orange-400 font-mono mt-1">100% Sealed</p>
              <span className="text-[10px] text-slate-400">Zero-Knowledge Sealed Envelopes</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Gram Panchayat Votes</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">984,200</p>
              <span className="text-[10px] text-slate-400">Anonymized village e-voting</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Transparency Score</span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">99.8 / 100</p>
              <span className="text-[10px] text-slate-400">Public Merkle Audits</span>
            </div>
          </div>

          {/* Active GeM Tender Showcase */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-orange-400 font-bold">{selectedTender.gemReferenceNo}</span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {selectedTender.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Authority: {selectedTender.department} • Budget: <strong className="text-emerald-400">₹{(selectedTender.estimatedBudgetINR / 10000000).toFixed(0)} Cr</strong>
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800/50 text-xs font-bold font-mono self-start sm:self-auto">
                ZKP Sealed Bids (Bidding Open)
              </span>
            </div>

            {/* Blinded Zero-Knowledge Bids Ledger */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Blinded Sealed Envelopes ({selectedTender.bidsCount} Bids Submitted)</span>
                <span className="text-xs text-emerald-400 font-mono">Pederson Commitments Verified</span>
              </h4>

              <div className="space-y-3">
                {selectedTender.bids.map((bid, index) => (
                  <div key={index} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{bid.bidderNameEncrypted}</span>
                        {bid.isLowestVerifiedBid && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold">
                            Lowest Cryptographic Bid (L1)
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-500 truncate max-w-xl">
                        Sealed Hash: {bid.sealedBidHash}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right font-mono">
                        <span className="text-emerald-400 font-bold">₹{(bid.bidAmountINR / 10000000).toFixed(2)} Cr</span>
                        <p className="text-[10px] text-slate-500">{bid.submissionTime}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-bold">
                        ZKP Proof: VALID ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
