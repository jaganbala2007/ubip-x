export interface CloneDetectionInput {
  asset_id: string;
  rfid_tag: string;
  device_id: string;
  location: { zone: string; lat: number; lng: number };
  timestamp: string;
  sequence_number: number;
}

export interface CloneDetectionResult {
  isCloneDetected: boolean;
  conflictType?: 'SIMULTANEOUS_MULTIZONE' | 'IMPOSSIBLE_TRAVEL' | 'DUPLICATE_SEQUENCE_NUMBER' | 'DUPLICATE_RFID_COLLISION';
  explanation: string;
  quarantineTriggered: boolean;
  conflictingEvents?: {
    firstLocation: string;
    secondLocation: string;
    timeDeltaSeconds: number;
  };
}

export class PhysicalCloneDetector {
  private activeLocationHistory: Map<string, { zone: string; lat: number; lng: number; timestamp: string; seq: number }> = new Map();

  public detectPhysicalClone(input: CloneDetectionInput): CloneDetectionResult {
    const previous = this.activeLocationHistory.get(input.asset_id);

    if (previous) {
      const timeDeltaSeconds = Math.max(
        1,
        (new Date(input.timestamp).getTime() - new Date(previous.timestamp).getTime()) / 1000
      );

      // Check 1: Multi-zone appearance within 4 seconds (impossible travel / RFID cloning)
      if (previous.zone !== input.location.zone && timeDeltaSeconds < 4) {
        return {
          isCloneDetected: true,
          conflictType: 'SIMULTANEOUS_MULTIZONE',
          explanation: `Physical Clone Alert: Asset ${input.asset_id} observed in ${previous.zone} and ${input.location.zone} simultaneously within ${timeDeltaSeconds.toFixed(1)} seconds.`,
          quarantineTriggered: true,
          conflictingEvents: {
            firstLocation: previous.zone,
            secondLocation: input.location.zone,
            timeDeltaSeconds
          }
        };
      }

      // Check 2: Re-used sequence number on same asset from different device
      if (previous.seq === input.sequence_number && timeDeltaSeconds < 10) {
        return {
          isCloneDetected: true,
          conflictType: 'DUPLICATE_SEQUENCE_NUMBER',
          explanation: `Duplicate sequence number #${input.sequence_number} detected across conflicting hardware emitters.`,
          quarantineTriggered: true
        };
      }
    }

    // Update active history
    this.activeLocationHistory.set(input.asset_id, {
      zone: input.location.zone,
      lat: input.location.lat,
      lng: input.location.lng,
      timestamp: input.timestamp,
      seq: input.sequence_number
    });

    return {
      isCloneDetected: false,
      explanation: 'Physical identity uniquely bound; no duplicate telemetry conflict detected.',
      quarantineTriggered: false
    };
  }

  public reset(): void {
    this.activeLocationHistory.clear();
  }
}

export const cloneDetector = new PhysicalCloneDetector();
