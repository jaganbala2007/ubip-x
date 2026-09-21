import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PhysicalAsset,
  PhysicalTelemetryEvent,
  IdentityCredential,
  BlockchainBlock,
  BlockchainTransaction,
  TokenBalance,
  AssetPassportNFT,
  OrchestratorIncidentTrace,
  SectorConfiguration,
  HardwareNodeStatus,
  EvidenceConsistencyScore,
  SystemDiagnosticSummary,
  CapabilityMatrixItem
} from '../types';

export type ActiveView = 
  | 'overview'
  | 'physical-nodes'
  | 'digital-twin'
  | 'pipeline'
  | 'security'
  | 'sectors'
  | 'judge-mode'
  | 'trust-universe'
  | 'live-assets'
  | 'physical-evidence'
  | 'trust-graph'
  | 'blockchain'
  | 'asset-passport'
  | 'token-economy'
  | 'identity'
  | 'security-center'
  | 'attack-lab'
  | 'ai-intelligence'
  | 'cognitive-orchestrator'
  | 'quantum-lab'
  | 'pqc-center'
  | 'sector-hub'
  | 'offline-network'
  | 'audit-trail'
  | 'dispute-center'
  | 'recovery-center'
  | 'sih-demo'
  | 'settings';

interface UBIPContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  assets: PhysicalAsset[];
  selectedAsset: PhysicalAsset | null;
  setSelectedAsset: (asset: PhysicalAsset | null) => void;
  events: PhysicalTelemetryEvent[];
  latestEvent: PhysicalTelemetryEvent | null;
  identities: IdentityCredential[];
  blocks: BlockchainBlock[];
  transactions: BlockchainTransaction[];
  tokenBalances: TokenBalance[];
  nfts: AssetPassportNFT[];
  incidents: OrchestratorIncidentTrace[];
  sectors: SectorConfiguration[];
  activeSector: string;
  isNetworkOnline: boolean;
  isWsConnected: boolean;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  hardwareNodes: HardwareNodeStatus[];
  evidenceConsistency: EvidenceConsistencyScore | null;
  diagnostics: SystemDiagnosticSummary | null;
  capabilityMatrix: CapabilityMatrixItem[];
  triggerScenario: (scenario: string) => Promise<void>;
  toggleHold: (assetId: string, isHeld: boolean) => Promise<void>;
  switchSector: (sectorId: string) => Promise<void>;
  toggleNetworkOnline: (online: boolean) => Promise<void>;
  runDiagnostics: () => Promise<SystemDiagnosticSummary | null>;
  resetDemo: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const UBIPContext = createContext<UBIPContextType | undefined>(undefined);

export const UBIPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [assets, setAssets] = useState<PhysicalAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<PhysicalAsset | null>(null);
  const [events, setEvents] = useState<PhysicalTelemetryEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<PhysicalTelemetryEvent | null>(null);
  const [identities, setIdentities] = useState<IdentityCredential[]>([]);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<AssetPassportNFT[]>([]);
  const [incidents, setIncidents] = useState<OrchestratorIncidentTrace[]>([]);
  const [sectors, setSectors] = useState<SectorConfiguration[]>([]);
  const [activeSector, setActiveSector] = useState<string>('supply_chain');
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(true);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [hardwareNodes, setHardwareNodes] = useState<HardwareNodeStatus[]>([]);
  const [evidenceConsistency, setEvidenceConsistency] = useState<EvidenceConsistencyScore | null>(null);
  const [diagnostics, setDiagnostics] = useState<SystemDiagnosticSummary | null>(null);
  const [capabilityMatrix, setCapabilityMatrix] = useState<CapabilityMatrixItem[]>([]);

  const fetchInitialData = async () => {
    try {
      const [assetsRes, eventsRes, blocksRes, txsRes, tokensRes, nftsRes, idRes, secRes, incRes, hwRes, evRes, matrixRes] = await Promise.all([
        fetch('/api/assets').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/events').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/blockchain/blocks').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/blockchain/transactions').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/tokens').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/nfts').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/identity').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/sectors').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/ai/orchestrator').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/hardware/nodes').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/hardware/evidence-consistency').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/system/capability-matrix').then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (assetsRes?.success) {
        setAssets(assetsRes.assets);
        setSelectedAsset(assetsRes.assets[0] || null);
      }
      if (eventsRes?.success) {
        setEvents(eventsRes.events);
        setLatestEvent(eventsRes.events[0] || null);
      }
      if (blocksRes?.success) setBlocks(blocksRes.blocks);
      if (txsRes?.success) setTransactions(txsRes.transactions);
      if (tokensRes?.success) setTokenBalances(tokensRes.balances);
      if (nftsRes?.success) setNfts(nftsRes.passports);
      if (idRes?.success) setIdentities(idRes.identities);
      if (secRes?.success) {
        setSectors(secRes.sectors);
        setActiveSector(secRes.activeSector);
      }
      if (incRes?.success) setIncidents(incRes.incidents);
      if (hwRes?.success) setHardwareNodes(hwRes.nodes);
      if (evRes?.success) setEvidenceConsistency(evRes.score);
      if (matrixRes?.success) setCapabilityMatrix(matrixRes.matrix);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // WebSocket live stream setup
    let ws: WebSocket | null = null;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host || 'localhost:5000'}/ws`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'TELEMETRY_EVENT' || msg.type === 'TELEMETRY_UPDATE' || msg.type === 'SCENARIO_TRIGGERED') {
            const newEvent: PhysicalTelemetryEvent = msg.data?.event || msg.event;
            if (newEvent) {
              setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
              setLatestEvent(newEvent);

              // Update associated asset
              setAssets(prev =>
                prev.map(a =>
                  a.asset_id === newEvent.asset_id
                    ? {
                        ...a,
                        latest_telemetry: newEvent.telemetry,
                        latest_hash: newEvent.canonical_hash,
                        trust_score: newEvent.trust_score,
                        trust_state: newEvent.trust_state,
                        state: newEvent.is_tampered ? 'TAMPERED' : a.state,
                        last_updated_at: newEvent.timestamp
                      }
                    : a
                )
              );

              if (selectedAsset && selectedAsset.asset_id === newEvent.asset_id) {
                setSelectedAsset(prev =>
                  prev
                    ? {
                        ...prev,
                        latest_telemetry: newEvent.telemetry,
                        latest_hash: newEvent.canonical_hash,
                        trust_score: newEvent.trust_score,
                        trust_state: newEvent.trust_state,
                        state: newEvent.is_tampered ? 'TAMPERED' : prev.state,
                        last_updated_at: newEvent.timestamp
                      }
                    : null
                );
              }
            }
          }
        } catch (e) {
          console.error('WS parse error', e);
        }
      };

      ws.onclose = () => {
        setIsWsConnected(false);
      };
    } catch (e) {
      setIsWsConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const triggerScenario = async (scenario: string) => {
    try {
      await fetch('/api/telemetry/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      fetchInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleHold = async (assetId: string, isHeld: boolean) => {
    try {
      await fetch('/api/blockchain/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId, is_held: isHeld })
      });
      fetchInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const switchSector = async (sectorId: string) => {
    try {
      const res = await fetch('/api/sectors/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector_id: sectorId })
      }).then(r => r.json());
      if (res.success) {
        setActiveSector(res.activeSector);
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleNetworkOnline = async (online: boolean) => {
    try {
      const res = await fetch('/api/offline/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ online })
      }).then(r => r.json());
      if (res.success) {
        setIsNetworkOnline(res.isOnline);
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const runDiagnostics = async (): Promise<SystemDiagnosticSummary | null> => {
    try {
      const res = await fetch('/api/hardware/diagnostics').then(r => r.json());
      if (res.success) {
        setDiagnostics(res.diagnostics);
        return res.diagnostics;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const resetDemo = async () => {
    try {
      await fetch('/api/system/reset-demo', { method: 'POST' });
      await fetchInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const refreshAllData = async () => {
    await fetchInitialData();
  };

  return (
    <UBIPContext.Provider
      value={{
        activeView,
        setActiveView,
        assets,
        selectedAsset,
        setSelectedAsset,
        events,
        latestEvent,
        identities,
        blocks,
        transactions,
        tokenBalances,
        nfts,
        incidents,
        sectors,
        activeSector,
        isNetworkOnline,
        isWsConnected,
        isCopilotOpen,
        setIsCopilotOpen,
        hardwareNodes,
        evidenceConsistency,
        diagnostics,
        capabilityMatrix,
        triggerScenario,
        toggleHold,
        switchSector,
        toggleNetworkOnline,
        runDiagnostics,
        resetDemo,
        refreshAllData
      }}
    >
      {children}
    </UBIPContext.Provider>
  );
};

export const useUBIP = () => {
  const context = useContext(UBIPContext);
  if (!context) {
    throw new Error('useUBIP must be used within a UBIPProvider');
  }
  return context;
};
