# UBIP-X Physical Hardware Integration & Pinout Guide
> **SIH 2026 Problem Statement PS ID: 26211**

---

## 1. Supported Edge Microcontrollers & Hardware Specs

| Component | Model / IC | Interface | Pinout (ESP32-S3) | Function in UBIP-X |
| :--- | :--- | :--- | :--- | :--- |
| **Edge Compute Node** | ESP32 / ESP32-S3 Dual-Core | UART / WiFi / BLE | Default GPIOs | On-chip SHA-256 canonical hashing & ECDSA signing |
| **RFID / NFC Reader** | RC522 (NXP MFRC522) | SPI | SS: 5, RST: 22, MOSI: 23, MISO: 19, SCK: 18 | High-security physical asset UID identification |
| **Thermal Sensor** | DHT22 / DS18B20 | 1-Wire Digital | GPIO 4 | Real-time ambient / component thermal monitoring |
| **Kinematic Vibration**| MPU-6050 (6-DOF IMU) | I2C | SDA: 21, SCL: 22 | High-frequency harmonic oscillation & shock detection |
| **Gas / Air Sensor** | MQ-135 / BME680 | Analog ADC | ADC1_CH0 (GPIO 36) | Hazardous gas / volatile emission monitoring |
| **Edge Gateway Node** | Raspberry Pi 4 / 5 (Linux) | USB Serial / MQTT | USB0 / Ethernet | Offline store-and-forward queue & WebSocket gateway |

---

## 2. Real vs Simulated Execution Modes

UBIP-X operates in **two concurrent modes**:

### Mode A: Real Physical Hardware
- Flash `edge/esp32/firmware_sample.ino` onto an ESP32 or ESP32-S3 via Arduino IDE or PlatformIO.
- Connect RC522 and sensors to the specified GPIO pins.
- The ESP32 formats physical events into the strict canonical schema defined in `edge/schemas/eventSchema.json`, computes the on-chip SHA-256 hash, signs it with its hardware key, and streams it via Serial or MQTT over TLS.
- `edge/raspberry-pi/gateway.py` ingests the packet, validates the schema, buffers in local SQLite if offline, and syncs with the UBIP-X server.

### Mode B: Deterministic Hardware Simulator
- Built-in simulation suite generating continuous realistic telemetry (temperature, vibration, gas, battery, GPS zone) matching the exact canonical hardware schema.
- Includes 1-click test triggers for **Normal**, **Anomaly**, **Tamper**, **Invalid Signature**, and **Network Blackout** to ensure a flawless SIH demonstration even without physical wiring connected.
