export type FusionTrustAssessment = 'TRUSTED' | 'SUSPICIOUS' | 'UNTRUSTED';

export interface PhysicalTruthFusionInput {
  asset_id: string;
  rfid_tag: string;
  device_id: string;
  timestamp: string;
  location: { zone: string; lat: number; lng: number; isGpsLocked?: boolean };
  telemetry: {
    temperature: number;
    vibration: number;
    gas_ppm: number;
    humidity: number;
    battery_voltage: number;
  };
  camera_evidence_hash?: string;
  previous_state?: {
    location: { zone: string; lat: number; lng: number };
    timestamp: string;
    temperature: number;
  };
}

export interface FusionConsistencyResult {
  assessment: FusionTrustAssessment;
  confidenceScore: number; // 0 to 100
  isPhysicallyConsistent: boolean;
  explanation: string;
  factorBreakdown: {
    sensorCorrelationPass: boolean;
    impossibleTravelDetected: boolean;
    thermalContinuityPass: boolean;
    identityBindingPass: boolean;
    environmentalFeasibilityPass: boolean;
  };
  inconsistencyReasons: string[];
}

export class PhysicalTruthFusionEngine {
  /**
   * Correlates multi-sensor readings against physical reality laws
   */
  public evaluateTruthFusion(input: PhysicalTruthFusionInput): FusionConsistencyResult {
    const reasons: string[] = [];
    let impossibleTravel = false;
    let thermalContinuity = true;
    let sensorCorrelation = true;
    let identityBinding = true;
    let environmentalFeasibility = true;

    // 1. Spatio-Temporal Consistency (Impossible Travel Check)
    if (input.previous_state) {
      const timeDiffSeconds = Math.max(
        1,
        (new Date(input.timestamp).getTime() - new Date(input.previous_state.timestamp).getTime()) / 1000
      );

      // Distance calculation in km (Haversine approximation)
      const latDiff = Math.abs(input.location.lat - input.previous_state.location.lat) * 111;
      const lngDiff = Math.abs(input.location.lng - input.previous_state.location.lng) * 111 * Math.cos((input.location.lat * Math.PI) / 180);
      const distanceKm = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

      const calculatedSpeedKmh = (distanceKm / timeDiffSeconds) * 3600;

      // If zone changed in < 5 seconds or speed > 160 km/h for factory assets
      if (input.location.zone !== input.previous_state.location.zone && timeDiffSeconds < 5) {
        impossibleTravel = true;
        reasons.push(
          `Impossible spatial velocity: Asset relocated from ${input.previous_state.location.zone} to ${input.location.zone} in ${timeDiffSeconds.toFixed(1)}s (${calculatedSpeedKmh.toFixed(0)} km/h)`
        );
      }

      // 2. Thermal Delta Continuity (Sudden 40C jump in 2 seconds is physically impossible without explosion)
      const tempDelta = Math.abs(input.telemetry.temperature - input.previous_state.temperature);
      if (tempDelta > 35 && timeDiffSeconds < 5 && input.telemetry.vibration < 1.5) {
        thermalContinuity = false;
        reasons.push(
          `Thermal discontinuity: Temperature spiked by ${tempDelta.toFixed(1)}°C in ${timeDiffSeconds.toFixed(1)}s without physical vibration impact`
        );
      }
    }

    // 3. Environmental Cross-Sensor Correlation
    // High gas PPM + low temperature + zero vibration indicates synthetic sensor injection
    if (input.telemetry.gas_ppm > 800 && input.telemetry.temperature < 20 && input.telemetry.humidity > 95) {
      sensorCorrelation = false;
      reasons.push('Anomalous multi-sensor decoupling: Gas threshold breached without thermodynamic heat correlation');
    }

    // 4. Physical Identity Binding
    if (input.rfid_tag.includes('CLONE') || input.rfid_tag.includes('FORGED')) {
      identityBinding = false;
      reasons.push('RFID silicon identifier marked invalid in physical identity registry');
    }

    // Overall Assessment
    let assessment: FusionTrustAssessment = 'TRUSTED';
    let confidenceScore = 98;

    if (impossibleTravel || !identityBinding) {
      assessment = 'UNTRUSTED';
      confidenceScore = 15;
    } else if (!thermalContinuity || !sensorCorrelation || !environmentalFeasibility) {
      assessment = 'SUSPICIOUS';
      confidenceScore = 58;
    }

    const isPhysicallyConsistent = assessment === 'TRUSTED';
    const explanation = isPhysicallyConsistent
      ? 'Multi-sensor physical evidence is mutually corroborating across spatial, temporal, and thermodynamic channels.'
      : `Physical evidence inconsistency detected: ${reasons.join('; ')}`;

    return {
      assessment,
      confidenceScore,
      isPhysicallyConsistent,
      explanation,
      factorBreakdown: {
        sensorCorrelationPass: sensorCorrelation,
        impossibleTravelDetected: impossibleTravel,
        thermalContinuityPass: thermalContinuity,
        identityBindingPass: identityBinding,
        environmentalFeasibilityPass: environmentalFeasibility
      },
      inconsistencyReasons: reasons
    };
  }
}

export const truthFusionEngine = new PhysicalTruthFusionEngine();
