export type TrustNodeType =
  | 'PERSON'
  | 'ORGANIZATION'
  | 'ASSET'
  | 'DEVICE'
  | 'SENSOR'
  | 'CREDENTIAL'
  | 'EVENT'
  | 'AI_DECISION'
  | 'BLOCKCHAIN_TX'
  | 'POLICY'
  | 'EVIDENCE';

export type TrustEdgeType =
  | 'OWNS'
  | 'OPERATES'
  | 'AUTHENTICATES'
  | 'GENERATED'
  | 'LOCATED_AT'
  | 'MEASURED'
  | 'VERIFIED_BY'
  | 'SIGNED_BY'
  | 'RECORDED_IN'
  | 'AUTHORIZED_BY'
  | 'DISPUTED_BY'
  | 'REVOKED'
  | 'RECOVERED';

export interface TrustGraphNode {
  id: string;
  label: string;
  type: TrustNodeType;
  state: 'NORMAL' | 'WARNING' | 'ALERT' | 'REVOKED';
  metadata: Record<string, any>;
}

export interface TrustGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: TrustEdgeType;
  label: string;
  timestamp: string;
}

export class TrustGraphService {
  private nodes: Map<string, TrustGraphNode> = new Map();
  private edges: Map<string, TrustGraphEdge> = new Map();

  constructor() {
    this.seedDefaultGraph();
  }

  private seedDefaultGraph() {
    // 1. Entities
    this.addNode({ id: 'org:aicte', label: 'AICTE Apex Org', type: 'ORGANIZATION', state: 'NORMAL', metadata: { did: 'did:ubip:org:aicte-01' } });
    this.addNode({ id: 'person:capt-sen', label: 'Capt. Vikram Sen', type: 'PERSON', state: 'NORMAL', metadata: { did: 'did:ubip:person:op-7749', role: 'Chief Architect' } });
    this.addNode({ id: 'cred:tech-cert', label: 'Technician VC-2.0', type: 'CREDENTIAL', state: 'NORMAL', metadata: { status: 'ACTIVE', clearance: 'Tier-3' } });

    // 2. Physical Asset & Hardware
    this.addNode({ id: 'asset:turbine-01', label: 'ASSET-001 (Turbine)', type: 'ASSET', state: 'NORMAL', metadata: { rfid: 'UBIP-ASSET-001', sector: 'ENERGY' } });
    this.addNode({ id: 'device:esp32-01', label: 'ESP32-S3 Node #01', type: 'DEVICE', state: 'NORMAL', metadata: { enclave: 'ATECC608A', hw_backed: true } });
    this.addNode({ id: 'sensor:dht22', label: 'DHT22 Thermal Sensor', type: 'SENSOR', state: 'NORMAL', metadata: { reading: '42.4°C' } });
    this.addNode({ id: 'sensor:mpu6050', label: 'MPU6050 IMU', type: 'SENSOR', state: 'NORMAL', metadata: { vibration: '0.21g' } });

    // 3. Evidence & Events
    this.addNode({ id: 'evidence:camera-snap', label: 'Inspection Photo Hash', type: 'EVIDENCE', state: 'NORMAL', metadata: { hash: '0x8f3c71a9e201b46a' } });
    this.addNode({ id: 'event:evt-001', label: 'Telemetry Event #1048', type: 'EVENT', state: 'NORMAL', metadata: { hash: '0x9482fba01948ef11', canonical: true } });

    // 4. AI, Policy & Blockchain
    this.addNode({ id: 'ai:ewma-zscore', label: 'AI Trust Engine (EWMA)', type: 'AI_DECISION', state: 'NORMAL', metadata: { score: 98.4, verdict: 'VERIFIED' } });
    this.addNode({ id: 'policy:sec-hold', label: 'Security Policy Engine', type: 'POLICY', state: 'NORMAL', metadata: { rule: 'AutoQuarantineOn3Sigma' } });
    this.addNode({ id: 'tx:blk-1489240', label: 'Block #1489240 (Hardhat)', type: 'BLOCKCHAIN_TX', state: 'NORMAL', metadata: { tx: '0x71a9e201b46ae884' } });

    // Edges
    this.addEdge('org:aicte', 'person:capt-sen', 'OPERATES', 'Employs Chief Architect');
    this.addEdge('org:aicte', 'cred:tech-cert', 'AUTHENTICATES', 'Issued W3C Credential');
    this.addEdge('cred:tech-cert', 'person:capt-sen', 'AUTHORIZED_BY', 'Authorizes Maintenance');
    this.addEdge('person:capt-sen', 'asset:turbine-01', 'OWNS', 'Operates Asset');
    this.addEdge('device:esp32-01', 'asset:turbine-01', 'LOCATED_AT', 'Mounted on Housing');
    this.addEdge('sensor:dht22', 'device:esp32-01', 'MEASURED', 'Thermal Channel');
    this.addEdge('sensor:mpu6050', 'device:esp32-01', 'MEASURED', 'Vibration Channel');
    this.addEdge('device:esp32-01', 'event:evt-001', 'GENERATED', 'Signed on-chip');
    this.addEdge('evidence:camera-snap', 'event:evt-001', 'VERIFIED_BY', 'Visual Hash Reference');
    this.addEdge('event:evt-001', 'ai:ewma-zscore', 'VERIFIED_BY', 'Evaluated Consistency');
    this.addEdge('ai:ewma-zscore', 'policy:sec-hold', 'AUTHORIZED_BY', 'Passed Rule Validation');
    this.addEdge('policy:sec-hold', 'tx:blk-1489240', 'RECORDED_IN', 'Committed to Ledger');
  }

  public addNode(node: TrustGraphNode) {
    this.nodes.set(node.id, node);
  }

  public addEdge(source: string, target: string, relationship: TrustEdgeType, label: string) {
    const id = `${source}->${target}:${relationship}`;
    this.edges.set(id, {
      id,
      source,
      target,
      relationship,
      label,
      timestamp: new Date().toISOString()
    });
  }

  public getGraphData(): { nodes: TrustGraphNode[]; edges: TrustGraphEdge[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values())
    };
  }

  public updateNodeState(id: string, state: TrustGraphNode['state']) {
    const node = this.nodes.get(id);
    if (node) {
      node.state = state;
      this.nodes.set(id, node);
    }
  }
}

export const trustGraphService = new TrustGraphService();
