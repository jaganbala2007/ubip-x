# UBIP-X Cybersecurity Architecture & SOC Attack Mitigation Guide
> **SIH 2026 Problem Statement PS ID: 26211**

---

## 1. Zero-Trust Physical Evidence Architecture

UBIP-X enforces defense-in-depth across the physical-to-digital lifecycle:

1. **Hardware Integrity Attestation**:
   - Device keys stored in ESP32 eFuse silicon.
   - Physical RFID chips read via SPI with cryptographic serial number binding.
2. **Canonical Serialization & Hash Verification**:
   - All ingested sensor JSON is strictly ordered into canonical delimiters before computing SHA-256.
   - Any off-chain database modification immediately breaks the comparison `H_incoming == SHA256(canonical_payload)`.
3. **Automated Smart Contract Quarantine**:
   - On hash mismatch or invalid ECDSA signature, the backend dispatches an automated `toggleHold(asset_id, true)` transaction to `AssetRegistry.sol` and `MaintenanceWorkflow.sol`.
   - The asset's ERC-721 Digital Passport is frozen from transfers.
4. **Post-Quantum Cryptography (PQC)**:
   - Module lattice-based signatures (`ML-DSA-65`) and key encapsulation (`ML-KEM-768`) protect long-term physical asset records against quantum adversaries.
5. **Zero-Knowledge Proofs (ZKP)**:
   - Maintenance operators verify Tier-3 security clearances cryptographically without exposing employee IDs, personal names, or biometrics.

---

## 2. Attack Simulation & Response Matrix

| Attack Vector | Simulated Action | Detection Mechanism | Automated Response |
| :--- | :--- | :--- | :--- |
| **Data Tampering** | Off-chain temperature altered 42.2°C -> 82.2°C | Canonical SHA-256 hash recalculation mismatch | Smart contract HOLD, 3D twin turns RED, SOC alert logged |
| **Signature Forgery** | Telemetry signed with rogue private key | ECDSA / PQC signature verification failure | Packet dropped at edge gateway, sender DID blacklisted |
| **Replay Attack** | Old telemetry packet resent | Monotonically increasing sequence number check | Dropped as duplicate sequence number |
| **Communication Blackout** | Network link severed | WebSocket heartbeat timeout | Local store-and-forward SQLite buffer active |
