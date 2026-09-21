# UBIP-X / SETU DLT: Technical Limitations & Assumptions
## Transparency Statement for SIH 2026 Grand Finale (PS #26211)

In alignment with the **Truth-First Engineering Principle**, this document transparently specifies the operational boundaries, physical hardware requirements, and environment assumptions of the platform:

---

### 1. Physical Hardware & Ingestion
- **Hardware Integration:** The system has native drivers for ESP32-S3 microcontrollers communicating over USB Serial (115200 baud) or MQTT/TLS. Physical sensors supported: DHT22, MPU-6050, MQ-135, RC522 RFID, u-blox NEO-6M GPS, and DS3231 RTC.
- **Failover Mode:** When microcontrollers are unplugged or running in a standalone web demonstration, the system executes deterministic scenario simulation clearly tagged as `[SIMULATION]`. It does **not** claim live hardware data when physical serial links are absent.
- **Microchip ATECC608A:** Hardware-backed private key storage requires physical I2C connection to an ATECC608A chip. When not present on the host computer, software ECDSA secp256k1 and NIST FIPS 204 ML-DSA-65 algorithms handle signing.

---

### 2. Blockchain & DLT Consensus
- **Ledger Environment:** In the competition demonstration environment, smart contracts (`AssetRegistry.sol`, `ProvenanceRegistry.sol`, `MaintenanceWorkflow.sol`, etc.) run on a deterministic local DLT instance.
- **Throughput & Block Finality:** Throughput benchmarks (2,400+ TPS, <450ms block finality) represent IBFT 2.0 consensus parameters on high-performance node configurations.

---

### 3. Post-Quantum Cryptography (PQC)
- **Algorithms:** Implements the finalized August 2024 NIST Post-Quantum standards:
  - FIPS 204: ML-DSA (Module-Lattice Digital Signature Algorithm)
  - FIPS 203: ML-KEM (Module-Lattice Key Encapsulation Mechanism)
- **Execution Environment:** Performance benchmarks (e.g. 4.2ms signature generation) are measured directly on the host CPU execution environment.

---

### 4. External Institutional Networks
- **Domain Interoperability:** Demonstrations for NTPC Power Turbines, Indian Railways RDSO Rolling-Stock, and Bharat Cold-Chain Vaccines use pluggable sector adapters. They operate on standard industry asset schemas without claiming active authenticated connection to government intranet servers.

---

### 5. AI Decision Support Layer
- **Model Boundaries:** The AI Trust Engine uses statistical anomaly detection (Z-scores, EWMA rolling baselines, SNN spike burst encoding) and multi-agent rule orchestration. It is strictly decision support: AI **cannot** override cryptographic signatures, alter blockchain history, or approve quarantined assets without authorized human operator re-attestation.
