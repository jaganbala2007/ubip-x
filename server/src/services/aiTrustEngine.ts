import { TelemetryData, TrustState } from '../types.js';

export interface AnomalyAnalysisResult {
  isAnomaly: boolean;
  anomalyScore: number; // 0.0 to 1.0
  severity: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  reasons: string[];
  zScores: {
    temperature: number;
    vibration: number;
    gas_ppm: number;
  };
  snnSpikeCount: number;
}

export interface TrustAssessmentResult {
  trustScore: number; // 0.0 to 100.0
  trustState: TrustState;
  dimensions: {
    identityIntegrity: number;      // 0-100
    dataIntegrity: number;          // 0-100
    sensorConsistency: number;      // 0-100
    provenanceCompleteness: number; // 0-100
    policyCompliance: number;       // 0-100
    cryptographicVerification: number; // 0-100
  };
  reasons: string[];
}

export class AITrustEngine {
  // Rolling baseline statistics for ASSET-001 (default industrial rotor)
  private baseline = {
    temperature: { mean: 42.0, std: 2.5, ewma: 42.0 },
    vibration: { mean: 0.22, std: 0.04, ewma: 0.22 },
    gas_ppm: { mean: 110.0, std: 12.0, ewma: 110.0 }
  };

  private alpha = 0.2; // EWMA decay factor

  /**
   * Multi-sensor statistical baseline & EWMA anomaly detection
   */
  public analyzeTelemetry(telemetry: TelemetryData, sectorThresholds?: { max_temperature: number; max_vibration: number; max_gas_ppm: number }): AnomalyAnalysisResult {
    // 1. Calculate Z-scores
    const zTemp = Math.abs(telemetry.temperature - this.baseline.temperature.mean) / this.baseline.temperature.std;
    const zVib = Math.abs(telemetry.vibration - this.baseline.vibration.mean) / this.baseline.vibration.std;
    const zGas = Math.abs(telemetry.gas_ppm - this.baseline.gas_ppm.mean) / this.baseline.gas_ppm.std;

    // 2. Update EWMA
    this.baseline.temperature.ewma = this.alpha * telemetry.temperature + (1 - this.alpha) * this.baseline.temperature.ewma;
    this.baseline.vibration.ewma = this.alpha * telemetry.vibration + (1 - this.alpha) * this.baseline.vibration.ewma;
    this.baseline.gas_ppm.ewma = this.alpha * telemetry.gas_ppm + (1 - this.alpha) * this.baseline.gas_ppm.ewma;

    const reasons: string[] = [];
    const factors: string[] = [];
    let anomalyScore = 0;

    // Evaluate Vibration
    if (zVib > 3.0 || telemetry.vibration > (sectorThresholds?.max_vibration || 1.5)) {
      const ratio = (telemetry.vibration / this.baseline.vibration.mean).toFixed(1);
      factors.push(`Vibration anomaly (Z-score: ${zVib.toFixed(2)})`);
      reasons.push(`Vibration surged to ${telemetry.vibration.toFixed(2)} G (${ratio}x normal operating baseline of ${this.baseline.vibration.mean} G)`);
      anomalyScore += 0.45;
    }

    // Evaluate Temperature
    if (zTemp > 3.0 || telemetry.temperature > (sectorThresholds?.max_temperature || 65.0)) {
      factors.push(`Thermal surge (Z-score: ${zTemp.toFixed(2)})`);
      reasons.push(`Temperature reached ${telemetry.temperature.toFixed(1)}°C (threshold: ${sectorThresholds?.max_temperature || 65.0}°C)`);
      anomalyScore += 0.35;
    }

    // Evaluate Gas PPM
    if (zGas > 3.0 || telemetry.gas_ppm > (sectorThresholds?.max_gas_ppm || 400)) {
      factors.push(`Gas emission spike (Z-score: ${zGas.toFixed(2)})`);
      reasons.push(`Atmospheric gas sensor detected ${telemetry.gas_ppm} PPM volatile buildup`);
      anomalyScore += 0.20;
    }

    // 3. SNN Spike Encoding Simulation
    // In biological / neuromorphic SNNs, sudden sensor delta triggers a burst of action potentials
    const deltaVib = Math.abs(telemetry.vibration - this.baseline.vibration.ewma);
    const snnSpikeCount = Math.min(100, Math.floor(deltaVib * 80 + (zTemp > 2 ? 20 : 0)));

    let severity: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'NORMAL';
    if (anomalyScore >= 0.7) severity = 'CRITICAL';
    else if (anomalyScore >= 0.4) severity = 'HIGH';
    else if (anomalyScore >= 0.2) severity = 'MEDIUM';
    else if (anomalyScore > 0) severity = 'LOW';

    return {
      isAnomaly: anomalyScore >= 0.35,
      anomalyScore: Math.min(1.0, anomalyScore),
      severity,
      factors,
      reasons: reasons.length > 0 ? reasons : ['All telemetry metrics operate strictly within standard 3-sigma boundaries.'],
      zScores: {
        temperature: Number(zTemp.toFixed(2)),
        vibration: Number(zVib.toFixed(2)),
        gas_ppm: Number(zGas.toFixed(2))
      },
      snnSpikeCount
    };
  }

  /**
   * Explainable Multi-Dimensional Trust Assessment
   */
  public evaluateTrust(
    anomaly: AnomalyAnalysisResult,
    isSignatureValid: boolean,
    isHashValid: boolean,
    isDidActive: boolean,
    isProvenanceChained: boolean,
    isPolicyCompliant: boolean
  ): TrustAssessmentResult {
    const dimensions = {
      identityIntegrity: isDidActive ? 100 : 0,
      dataIntegrity: isHashValid ? 100 : 0,
      sensorConsistency: Math.round((1 - anomaly.anomalyScore) * 100),
      provenanceCompleteness: isProvenanceChained ? 100 : 40,
      policyCompliance: isPolicyCompliant ? 100 : 20,
      cryptographicVerification: isSignatureValid ? 100 : 0
    };

    // Weighted composite trust score
    const compositeScore = (
      dimensions.identityIntegrity * 0.15 +
      dimensions.dataIntegrity * 0.25 +
      dimensions.cryptographicVerification * 0.20 +
      dimensions.sensorConsistency * 0.20 +
      dimensions.provenanceCompleteness * 0.10 +
      dimensions.policyCompliance * 0.10
    );

    const reasons: string[] = [];
    if (!isHashValid) reasons.push('CRITICAL: Canonical payload hash mismatch detected (Tamper Violation)');
    if (!isSignatureValid) reasons.push('SECURITY: Cryptographic signature failed mathematical verification');
    if (!isDidActive) reasons.push('IDENTITY: Device DID credentials revoked or unknown');
    if (anomaly.isAnomaly) reasons.push(...anomaly.reasons);
    if (!isPolicyCompliant) reasons.push('POLICY: Operating parameters exceed sector compliance bounds');

    let trustState: TrustState = 'VERIFIED';
    if (!isHashValid || !isSignatureValid || !isDidActive) {
      trustState = 'BLOCKED';
    } else if (compositeScore < 50 || anomaly.severity === 'CRITICAL') {
      trustState = 'SUSPICIOUS';
    } else if (compositeScore < 85 || anomaly.severity === 'HIGH' || anomaly.severity === 'MEDIUM') {
      trustState = 'CAUTION';
    }

    return {
      trustScore: Number(compositeScore.toFixed(1)),
      trustState,
      dimensions,
      reasons: reasons.length > 0 ? reasons : ['Verified authentic origin, unbroken cryptographic chain, normal sensor baselines.']
    };
  }
}

export const aiTrustEngine = new AITrustEngine();
