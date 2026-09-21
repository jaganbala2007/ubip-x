export type TrustState = 
  | 'UNKNOWN' 
  | 'ATTESTING' 
  | 'VERIFIED' 
  | 'MONITORED' 
  | 'SUSPICIOUS' 
  | 'QUARANTINED' 
  | 'RECOVERING' 
  | 'REVERIFIED'
  | 'CAUTION' 
  | 'BLOCKED';

export type AssetState = 'ACTIVE' | 'WARNING' | 'ANOMALY' | 'TAMPERED' | 'ON_HOLD' | 'OFFLINE' | 'QUARANTINED' | 'RECOVERING';

export type DataSourceBadge = 
  | 'LIVE_HARDWARE'
  | 'LOCAL_DATABASE'
  | 'CALCULATED'
  | 'BLOCKCHAIN'
  | 'USER_INPUT'
  | 'SIMULATION'
  | 'REFERENCE_DATA'
  | 'OFFLINE_QUEUE'
  | 'UNAVAILABLE';

export type DataStatus = 
  | 'LIVE'
  | 'STALE'
  | 'OFFLINE'
  | 'ERROR'
  | 'SIMULATION'
  | 'CALCULATED'
  | 'QUEUED'
  | 'SYNCING';

export type DataQuality = 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'FAULT' | 'UNAVAILABLE';

export interface TelemetryReading<T = number | string> {
  value: T;
  unit: string;
  source: DataSourceBadge;
  device_id: string;
  timestamp: string;
  status: DataStatus;
  quality: DataQuality;
}

export interface HardwareNodeStatus {
  id: string;
  name: string;
  type: 'ESP32_S3' | 'RASPBERRY_PI_5' | 'RFID_RC522' | 'DHT22' | 'MPU6050' | 'MQ135' | 'NEO6M_GPS' | 'DS3231_RTC' | 'ATECC608A' | 'LORA';
  connection: 'CONNECTED' | 'DISCONNECTED' | 'SIMULATED';
  lastSeenSecondsAgo: number;
  telemetryAgeMs: number;
  dataQuality: DataQuality;
  signatureState: 'VALID_ECDSA' | 'VALID_ML_DSA' | 'FORGED' | 'UNSIGNED';
  trustState: TrustState;
  readings?: Record<string, string | number>;
  firmwareVersion?: string;
  isHardwareBacked?: boolean;
}

export interface EvidenceConsistencyScore {
  totalScore: number; // 0-100
  rfidIdentity: 'VALID' | 'CLONED' | 'UNKNOWN';
  gpsConsistency: 'CONSISTENT' | 'IMPOSSIBLE_TRAVEL' | 'SPOOFED' | 'NO_LOCK';
  rtcConsistency: 'CONSISTENT' | 'DRIFT_DETECTED' | 'ROLLBACK';
  thermodynamicConsistency: 'NORMAL' | 'ABRUPT_DELTA' | 'TAMPERED';
  vibrationConsistency: 'NORMAL' | 'ANOMALOUS' | 'SENSOR_FAULT';
  historicalPattern: 'NORMAL' | 'DEVIATING' | 'UNPRECEDENTED';
  details: string;
}

export interface TelemetryLocation {
  zone: string;
  lat: number;
  lng: number;
  isGpsLocked?: boolean;
}

export interface TelemetryData {
  temperature: number; // Celsius
  vibration: number;   // G / mm/s
  gas_ppm: number;     // PPM
  humidity: number;    // %
  battery_voltage: number; // V
  location: TelemetryLocation;
  provenance_source?: DataSourceBadge;
  data_quality?: DataQuality;
  data_status?: DataStatus;
  detailed_readings?: {
    temperature: TelemetryReading<number>;
    vibration: TelemetryReading<number>;
    gas_ppm: TelemetryReading<number>;
    humidity: TelemetryReading<number>;
    location: TelemetryReading<TelemetryLocation>;
  };
}

export interface PhysicalTelemetryEvent {
  event_id: string;
  asset_id: string;
  rfid_tag: string;
  node_id: string;
  timestamp: string;
  sequence_number: number;
  telemetry: TelemetryData;
  canonical_hash: string;
  prev_event_hash: string;
  edge_signature: string;
  public_key: string;
  trust_state: TrustState;
  trust_score: number;
  ai_reasons: string[];
  blockchain_tx?: string;
  block_number?: number;
  is_tampered?: boolean;
  sync_status: 'LOCAL_ONLY' | 'SYNC_PENDING' | 'SYNCED' | 'VERIFIED';
}

export interface PhysicalAsset {
  asset_id: string;
  name: string;
  rfid_tag: string;
  node_device_id: string;
  organization: string;
  sector: string;
  state: AssetState;
  trust_state: TrustState;
  trust_score: number;
  condition_rating: number; // 0-100%
  latest_telemetry: TelemetryData;
  latest_hash: string;
  is_held: boolean;
  nft_token_id?: number;
  registered_at: string;
  last_updated_at: string;
  maintenance_count: number;
}

export interface IdentityCredential {
  did: string;
  entity_type: 'DEVICE' | 'ASSET' | 'OPERATOR' | 'ORGANIZATION' | 'SUPPLIER' | 'VALIDATOR';
  name: string;
  organization: string;
  role: string;
  public_key: string;
  issued_at: string;
  expires_at: string;
  status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED';
  signature: string;
}

export interface BlockchainTransaction {
  tx_hash: string;
  block_number: number;
  contract_address: string;
  method_called: string;
  from: string;
  to: string;
  asset_id?: string;
  event_id?: string;
  canonical_hash?: string;
  previous_hash?: string;
  timestamp: string;
  status: 'SUCCESS' | 'REVERTED' | 'HOLD_TRIGGERED';
  gas_used: number;
}

export interface BlockchainBlock {
  block_number: number;
  block_hash: string;
  prev_block_hash: string;
  timestamp: string;
  transactions: BlockchainTransaction[];
  validator: string;
}

export interface TokenBalance {
  address: string;
  owner_name: string;
  role: string;
  balance: number;
  reward_history: {
    event_id: string;
    amount: number;
    timestamp: string;
    reason: string;
  }[];
}

export interface AssetPassportNFT {
  token_id: number;
  asset_id: string;
  rfid_tag: string;
  owner_address: string;
  organization: string;
  sector: string;
  manufacturer: string;
  minted_at: string;
  condition: string;
  provenance_hash: string;
  is_held: boolean;
  history_events_count: number;
  metadata_uri: string;
}

export interface AgentReasoningStep {
  agent_name: 'Asset Agent' | 'Security Agent' | 'Compliance Agent' | 'Blockchain Agent' | 'Communication Agent' | 'Explainability Agent' | 'Cognitive Orchestrator';
  timestamp: string;
  status: 'INFO' | 'WARNING' | 'ALERT' | 'ACTION_TAKEN';
  statement: string;
  evidence_ref: string;
}

export interface OrchestratorIncidentTrace {
  incident_id: string;
  event_id: string;
  asset_id: string;
  timestamp: string;
  trigger: string;
  decision: 'APPROVE_PROVENANCE' | 'ISSUE_CAUTION' | 'HOLD_WORKFLOW' | 'CONTAIN_THREAT';
  agent_steps: AgentReasoningStep[];
  explanation: string;
}

export interface AttackSimulation {
  attack_id: string;
  type: 'DATA_TAMPERING' | 'REPLAY_ATTACK' | 'INVALID_SIGNATURE' | 'UNAUTHORIZED_ROLE' | 'BLOCKCHAIN_HASH_MISMATCH' | 'NETWORK_INTERRUPTION';
  target_asset: string;
  timestamp: string;
  status: 'DETECTED' | 'BLOCKED' | 'CONTAINED';
  original_hash: string;
  tampered_hash: string;
  detected_at_layer: 'EDGE_GATEWAY' | 'AI_ENGINE' | 'SMART_CONTRACT' | 'BLOCKCHAIN_CONSENSUS';
  evidence: string;
  action_taken: string;
}

export interface SectorConfiguration {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  primary_asset_type: string;
  allowed_roles: string[];
  telemetry_thresholds: {
    max_temperature: number;
    max_vibration: number;
    max_gas_ppm: number;
  };
  sample_workflow_policy: string;
  sample_scenario: string;
  smart_contract_rule: string;
}

export interface DiagnosticItemResult {
  subsystem: string;
  component: string;
  status: 'PASS' | 'FAIL' | 'DEGRADED' | 'NOT_CONNECTED' | 'NOT_CONFIGURED' | 'SIMULATED';
  evidence: string;
  details: string;
  latencyMs?: number;
  dataQuality?: DataQuality;
}

export interface SystemDiagnosticSummary {
  timestamp: string;
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  totalTests: number;
  passedTests: number;
  hardwareConnectedCount: number;
  items: DiagnosticItemResult[];
}

export interface CapabilityMatrixItem {
  feature: string;
  subsystem: string;
  status: 'LIVE' | 'SIMULATION' | 'CALCULATED' | 'NOT_CONNECTED' | 'RESEARCH';
  dataSource: DataSourceBadge;
  tested: boolean;
  evidence: string;
}
