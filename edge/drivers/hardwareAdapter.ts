/**
 * Universal Hardware Adapter Interface
 * Standardizes Real Hardware (ESP32 / Raspberry Pi / ATECC608) and Simulation Drivers
 */

export type HardwareMode = 'REAL_HARDWARE' | 'SIMULATION';

export interface HardwareCapability {
  name: string;
  type: 'SENSOR' | 'ACTUATOR' | 'SECURITY_ENCLAVE' | 'CONNECTIVITY' | 'STORAGE';
  model: string;
  isAvailable: boolean;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

export interface RawHardwareTelemetry {
  temperature_c: number;
  vibration_g: number;
  gas_ppm: number;
  humidity_pct: number;
  battery_v: number;
  rtc_timestamp: string;
  gps_lat?: number;
  gps_lng?: number;
  rfid_uid?: string;
  camera_evidence_hash?: string;
}

export interface HardwareDeviceIdentity {
  device_id: string;
  did: string;
  enclave_type: 'ATECC608A_HARDWARE' | 'SOFTWARE_ECDSA' | 'SGX_ENCLAVE';
  public_key: string;
  firmware_version: string;
  is_hardware_backed: boolean;
}

export interface HardwareAdapter {
  mode: HardwareMode;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  readTelemetry(): Promise<RawHardwareTelemetry>;
  readIdentity(): Promise<HardwareDeviceIdentity>;
  readLocation(): Promise<{ lat: number; lng: number; isGpsLocked: boolean }>;
  readTimestamp(): Promise<{ timestamp: string; isRtcBacked: boolean }>;
  readEvidence(): Promise<{ imageHash?: string; rfidUid?: string }>;
  signEvent(canonicalPayload: string): Promise<{ signature: string; algorithm: string }>;
  healthCheck(): Promise<{ isHealthy: boolean; uptimeSeconds: number; latencyMs: number }>;
  getCapabilities(): HardwareCapability[];
}

/**
 * Deterministic Simulation Hardware Adapter
 */
export class SimulatedHardwareAdapter implements HardwareAdapter {
  mode: HardwareMode = 'SIMULATION';
  private connected: boolean = true;
  private startTime: number = Date.now();

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async readTelemetry(): Promise<RawHardwareTelemetry> {
    return {
      temperature_c: Number((42.0 + Math.random() * 0.8).toFixed(1)),
      vibration_g: Number((0.20 + Math.random() * 0.04).toFixed(2)),
      gas_ppm: Math.floor(110 + Math.random() * 8),
      humidity_pct: Number((48.0 + Math.random() * 2.0).toFixed(1)),
      battery_v: Number((3.98 + Math.random() * 0.04).toFixed(2)),
      rtc_timestamp: new Date().toISOString(),
      gps_lat: 28.6139,
      gps_lng: 77.2090,
      rfid_uid: 'E280-1160-2000-779A',
      camera_evidence_hash: '0x8f3c71a9e201b46ae8849b2011bc94819ba88301'
    };
  }

  async readIdentity(): Promise<HardwareDeviceIdentity> {
    return {
      device_id: 'ESP32-S3-GATEWAY-01',
      did: 'did:ubip:device:esp32-s3-01',
      enclave_type: 'SOFTWARE_ECDSA',
      public_key: '0x04a99104471a9bc99401827419820019481029488301ec94821004921841bc994',
      firmware_version: 'UBIP-FW-v2.4.1',
      is_hardware_backed: false
    };
  }

  async readLocation(): Promise<{ lat: number; lng: number; isGpsLocked: boolean }> {
    return { lat: 28.6139, lng: 77.2090, isGpsLocked: true };
  }

  async readTimestamp(): Promise<{ timestamp: string; isRtcBacked: boolean }> {
    return { timestamp: new Date().toISOString(), isRtcBacked: true };
  }

  async readEvidence(): Promise<{ imageHash?: string; rfidUid?: string }> {
    return {
      rfid_uid: 'E280-1160-2000-779A',
      imageHash: '0x8f3c71a9e201b46ae8849b2011bc94819ba88301'
    };
  }

  async signEvent(canonicalPayload: string): Promise<{ signature: string; algorithm: string }> {
    return {
      signature: '0x71a9e201b46ae8849b2011bc94819ba88301ec94821004921841bc994018274199104471a9bc99401827419820019481029488301ec94821004921841bc9941b',
      algorithm: 'ECDSA-secp256k1'
    };
  }

  async healthCheck(): Promise<{ isHealthy: boolean; uptimeSeconds: number; latencyMs: number }> {
    return {
      isHealthy: this.connected,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      latencyMs: 14
    };
  }

  getCapabilities(): HardwareCapability[] {
    return [
      { name: 'MFRC522 RFID Reader', type: 'SENSOR', model: 'SPI MFRC522', isAvailable: true, status: 'ONLINE' },
      { name: 'DHT22 Thermal & Humidity', type: 'SENSOR', model: 'Aosong DHT22', isAvailable: true, status: 'ONLINE' },
      { name: 'MPU6050 6-DOF IMU', type: 'SENSOR', model: 'InvenSense MPU6050', isAvailable: true, status: 'ONLINE' },
      { name: 'MQ-135 Air Quality Sensor', type: 'SENSOR', model: 'Hanwei MQ-135', isAvailable: true, status: 'ONLINE' },
      { name: 'NEO-6M GPS Module', type: 'SENSOR', model: 'u-blox NEO-6M', isAvailable: true, status: 'ONLINE' },
      { name: 'DS3231 Precision RTC', type: 'SENSOR', model: 'Maxim DS3231', isAvailable: true, status: 'ONLINE' },
      { name: 'ATECC608A Secure Element', type: 'SECURITY_ENCLAVE', model: 'Microchip ATECC608A', isAvailable: false, status: 'OFFLINE' }
    ];
  }
}
