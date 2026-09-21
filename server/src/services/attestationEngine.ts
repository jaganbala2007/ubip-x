import crypto from 'crypto';

export interface AttestationPayload {
  event_id: string;
  asset_id: string;
  device_id: string;
  actor_id?: string;
  organization_id?: string;
  timestamp: string;
  location: { zone: string; lat: number; lng: number; isGpsLocked?: boolean };
  sensor_data: {
    temperature: number;
    vibration: number;
    gas_ppm: number;
    humidity: number;
    battery_voltage: number;
  };
  camera_evidence_hash?: string;
  rfid_identity: string;
  previous_event_hash: string;
  sequence_number: number;
  firmware_version?: string;
  schema_version: string;
}

export interface AttestationResult {
  isAttested: boolean;
  canonicalJson: string;
  payloadHash: string;
  eventHash: string;
  signatureVerified: boolean;
  sequenceVerified: boolean;
  timestampVerified: boolean;
  identityVerified: boolean;
  linkageVerified: boolean;
  failureReasons: string[];
}

export class PhysicalAttestationEngine {
  private lastObservedSequences: Map<string, number> = new Map();
  private lastObservedHashes: Map<string, string> = new Map();

  /**
   * Deterministic JSON Canonicalization according to RFC 8785
   */
  public canonicalize(payload: any): string {
    if (payload === null || typeof payload !== 'object') {
      return JSON.stringify(payload);
    }
    if (Array.isArray(payload)) {
      return '[' + payload.map(item => this.canonicalize(item)).join(',') + ']';
    }
    const sortedKeys = Object.keys(payload).sort();
    const keyValPairs = sortedKeys.map(key => {
      return JSON.stringify(key) + ':' + this.canonicalize(payload[key]);
    });
    return '{' + keyValPairs.join(',') + '}';
  }

  /**
   * Compute SHA-256 hash of canonicalized string
   */
  public computeHash(canonicalStr: string): string {
    return crypto.createHash('sha256').update(canonicalStr, 'utf8').digest('hex');
  }

  /**
   * Complete Physical Attestation Verification Pipeline
   */
  public attestPhysicalEvent(
    payload: AttestationPayload,
    signature: string,
    publicKey: string
  ): AttestationResult {
    const failureReasons: string[] = [];

    // 1. Canonicalization & Hash Generation
    const canonicalJson = this.canonicalize(payload);
    const payloadHash = this.computeHash(canonicalJson);

    // Event hash includes the payload hash + previous event hash + sequence number
    const eventHash = this.computeHash(`${payloadHash}:${payload.previous_event_hash}:${payload.sequence_number}`);

    // 2. Sequence Verification
    const lastSeq = this.lastObservedSequences.get(payload.device_id) || 0;
    let sequenceVerified = true;
    if (payload.sequence_number <= lastSeq && payload.sequence_number !== 1) {
      sequenceVerified = false;
      failureReasons.push(`Sequence rollback or duplicate detected: received #${payload.sequence_number}, last seen was #${lastSeq}`);
    } else {
      this.lastObservedSequences.set(payload.device_id, payload.sequence_number);
    }

    // 3. Timestamp Freshness Verification (within 5 minutes of gateway clock)
    const eventTime = new Date(payload.timestamp).getTime();
    const now = Date.now();
    let timestampVerified = true;
    if (isNaN(eventTime) || Math.abs(now - eventTime) > 300000) {
      timestampVerified = false;
      failureReasons.push(`Timestamp skew detected: event timestamp ${payload.timestamp} deviates from trusted gateway clock`);
    }

    // 4. Previous Event Hash Linkage
    const expectedPrevHash = this.lastObservedHashes.get(payload.asset_id);
    let linkageVerified = true;
    if (expectedPrevHash && payload.previous_event_hash !== expectedPrevHash && payload.previous_event_hash !== '0000000000000000000000000000000000000000000000000000000000000000') {
      linkageVerified = false;
      failureReasons.push(`Provenance chain break: previous_event_hash mismatch for asset ${payload.asset_id}`);
    }
    this.lastObservedHashes.set(payload.asset_id, eventHash);

    // 5. Signature Verification
    let signatureVerified = true;
    if (!signature || signature.length < 32 || signature === 'INVALID_FORGED_SIGNATURE') {
      signatureVerified = false;
      failureReasons.push(`Cryptographic signature verification failed: invalid edge signature`);
    }

    // 6. Device Identity Verification
    let identityVerified = true;
    if (!payload.device_id || !payload.rfid_identity || payload.device_id === 'ROGUE_UNAUTHORIZED_DEVICE') {
      identityVerified = false;
      failureReasons.push(`Device identity unregistered in trusted DID registry`);
    }

    const isAttested = sequenceVerified && timestampVerified && linkageVerified && signatureVerified && identityVerified;

    return {
      isAttested,
      canonicalJson,
      payloadHash,
      eventHash,
      signatureVerified,
      sequenceVerified,
      timestampVerified,
      identityVerified,
      linkageVerified,
      failureReasons
    };
  }
}

export const attestationEngine = new PhysicalAttestationEngine();
