import crypto from 'crypto';
import {
  PhysicalAsset,
  PhysicalTelemetryEvent,
  IdentityCredential,
  BlockchainBlock,
  BlockchainTransaction,
  TokenBalance,
  AssetPassportNFT,
  OrchestratorIncidentTrace,
  AttackSimulation,
  SectorConfiguration
} from './types.js';

export class UBIPDatabase {
  public assets: Map<string, PhysicalAsset> = new Map();
  public events: PhysicalTelemetryEvent[] = [];
  public identities: Map<string, IdentityCredential> = new Map();
  public blocks: BlockchainBlock[] = [];
  public transactions: BlockchainTransaction[] = [];
  public tokenBalances: Map<string, TokenBalance> = new Map();
  public nfts: Map<number, AssetPassportNFT> = new Map();
  public incidents: OrchestratorIncidentTrace[] = [];
  public attackLogs: AttackSimulation[] = [];
  public activeSector: string = 'supply_chain';
  public isNetworkOnline: boolean = true;
  public offlineQueue: PhysicalTelemetryEvent[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Initial Identities
    const cred1: IdentityCredential = {
      did: 'did:ubip:org:0x71C...4A9',
      entity_type: 'ORGANIZATION',
      name: 'Apex Precision Dynamics (ORG-A)',
      organization: 'ORG-A',
      role: 'Manufacturer',
      public_key: '0x04bfca...819a',
      issued_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 365).toISOString(),
      status: 'ACTIVE',
      signature: '0x3a91f...e18b'
    };

    const cred2: IdentityCredential = {
      did: 'did:ubip:dev:ESP32-001',
      entity_type: 'DEVICE',
      name: 'Turbine Edge Sensor Unit #1',
      organization: 'ORG-A',
      role: 'SensorEdgeNode',
      public_key: '0x03d98c...201e',
      issued_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 365).toISOString(),
      status: 'ACTIVE',
      signature: '0x992fa...11c2'
    };

    const cred3: IdentityCredential = {
      did: 'did:ubip:val:0x892...FF1',
      entity_type: 'VALIDATOR',
      name: 'AICTE Regional Consensus Node #4',
      organization: 'AICTE Consensus',
      role: 'Validator',
      public_key: '0x0281ba...887f',
      issued_at: new Date(Date.now() - 86400000 * 60).toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 365).toISOString(),
      status: 'ACTIVE',
      signature: '0x17bfa...cc91'
    };

    this.identities.set(cred1.did, cred1);
    this.identities.set(cred2.did, cred2);
    this.identities.set(cred3.did, cred3);

    // 2. Initial Physical Assets
    const genesisHash = crypto.createHash('sha256').update('GENESIS_ASSET_001').digest('hex');
    
    const asset1: PhysicalAsset = {
      asset_id: 'ASSET-001',
      name: 'High-Pressure Turbine Rotor Blade #A9',
      rfid_tag: 'UBIP-ASSET-001',
      node_device_id: 'ESP32-001',
      organization: 'ORG-A',
      sector: 'supply_chain',
      state: 'ACTIVE',
      trust_state: 'VERIFIED',
      trust_score: 98.4,
      condition_rating: 96,
      latest_telemetry: {
        temperature: 42.4,
        vibration: 0.21,
        gas_ppm: 112,
        humidity: 48.5,
        battery_voltage: 3.95,
        location: { zone: 'ZONE-A (Precision Forge)', lat: 28.6139, lng: 77.2090 }
      },
      latest_hash: genesisHash,
      is_held: false,
      nft_token_id: 1,
      registered_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      last_updated_at: new Date().toISOString(),
      maintenance_count: 2
    };

    const asset2: PhysicalAsset = {
      asset_id: 'ASSET-002',
      name: 'Cryogenic mRNA Vaccine Container #V4',
      rfid_tag: 'UBIP-ASSET-002',
      node_device_id: 'ESP32-002',
      organization: 'ORG-B',
      sector: 'healthcare',
      state: 'ACTIVE',
      trust_state: 'VERIFIED',
      trust_score: 99.1,
      condition_rating: 98,
      latest_telemetry: {
        temperature: -78.2,
        vibration: 0.05,
        gas_ppm: 40,
        humidity: 12.0,
        battery_voltage: 4.10,
        location: { zone: 'COLD-HUB-03', lat: 19.0760, lng: 72.8777 }
      },
      latest_hash: crypto.createHash('sha256').update('GENESIS_ASSET_002').digest('hex'),
      is_held: false,
      nft_token_id: 2,
      registered_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      last_updated_at: new Date().toISOString(),
      maintenance_count: 0
    };

    const asset3: PhysicalAsset = {
      asset_id: 'ASSET-003',
      name: 'Grid Substation Step-Up Transformer #T12',
      rfid_tag: 'UBIP-ASSET-003',
      node_device_id: 'PI-001',
      organization: 'ORG-C',
      sector: 'energy',
      state: 'WARNING',
      trust_state: 'CAUTION',
      trust_score: 76.5,
      condition_rating: 82,
      latest_telemetry: {
        temperature: 68.8,
        vibration: 1.42,
        gas_ppm: 290,
        humidity: 62.1,
        battery_voltage: 12.4,
        location: { zone: 'SUBSTATION-EAST-4', lat: 12.9716, lng: 77.5946 }
      },
      latest_hash: crypto.createHash('sha256').update('GENESIS_ASSET_003').digest('hex'),
      is_held: false,
      nft_token_id: 3,
      registered_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      last_updated_at: new Date().toISOString(),
      maintenance_count: 5
    };

    this.assets.set(asset1.asset_id, asset1);
    this.assets.set(asset2.asset_id, asset2);
    this.assets.set(asset3.asset_id, asset3);

    // 3. Initial NFT Passports
    this.nfts.set(1, {
      token_id: 1,
      asset_id: 'ASSET-001',
      rfid_tag: 'UBIP-ASSET-001',
      owner_address: '0x71C...4A9',
      organization: 'ORG-A',
      sector: 'supply_chain',
      manufacturer: 'Apex Precision Dynamics',
      minted_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      condition: 'EXCELLENT',
      provenance_hash: genesisHash,
      is_held: false,
      history_events_count: 42,
      metadata_uri: 'ipfs://QmUbipPassportAsset001Hash'
    });

    this.nfts.set(2, {
      token_id: 2,
      asset_id: 'ASSET-002',
      rfid_tag: 'UBIP-ASSET-002',
      owner_address: '0x99A...1B4',
      organization: 'ORG-B',
      sector: 'healthcare',
      manufacturer: 'BioPharma ColdLogistics',
      minted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      condition: 'PRISTINE',
      provenance_hash: asset2.latest_hash,
      is_held: false,
      history_events_count: 89,
      metadata_uri: 'ipfs://QmUbipPassportAsset002Hash'
    });

    // 4. Initial Token Balances
    this.tokenBalances.set('0x71C...4A9', {
      address: '0x71C...4A9',
      owner_name: 'Apex Dynamics Treasury',
      role: 'Asset Owner',
      balance: 14500,
      reward_history: [
        { event_id: 'EVT-000010', amount: 50, timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), reason: 'Initial Passport Stake' }
      ]
    });

    this.tokenBalances.set('0x892...FF1', {
      address: '0x892...FF1',
      owner_name: 'AICTE Consensus Validator #4',
      role: 'Validator Node',
      balance: 2840,
      reward_history: [
        { event_id: 'EVT-000021', amount: 15, timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), reason: 'Physical Telemetry Verification Reward' },
        { event_id: 'EVT-000022', amount: 15, timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), reason: 'ZKP Credential Validation Reward' }
      ]
    });

    // 5. Initial Genesis Block & Transactions
    const genBlock: BlockchainBlock = {
      block_number: 104820,
      block_hash: '0x8f3c7a912e5d4b0f19a823c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
      prev_block_hash: '0x7e2b6a801d4c3a0e08f712b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      transactions: [
        {
          tx_hash: '0x4d8a1e2f3b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
          block_number: 104820,
          contract_address: '0xAssetRegistry0000000000000000000000001',
          method_called: 'registerAsset(ASSET-001)',
          from: '0x71C...4A9',
          to: '0xAssetRegistry0000000000000000000000001',
          asset_id: 'ASSET-001',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          status: 'SUCCESS',
          gas_used: 48200
        }
      ],
      validator: '0x892...FF1'
    };
    this.blocks.push(genBlock);
    this.transactions.push(genBlock.transactions[0]);
  }
}

export const db = new UBIPDatabase();
