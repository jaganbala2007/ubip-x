# UBIP-X Verification & Testing Suite
> **SIH 2026 Problem Statement PS ID: 26211**

---

## 1. Test Suite Summary

UBIP-X includes a comprehensive unit and integration test suite verified with Vitest:

```bash
# Run server test suite
cd server
npm test
```

### Verified Test Cases:
1. **Deterministic Canonical Hashing**: Proves SHA-256 canonical hash invariance across identical telemetry structures.
2. **Multi-Sensor Anomaly Detection**: Proves EWMA baseline tracking and 3-sigma Z-score thermal/vibration anomaly alerting.
3. **PQC Cryptographic Benchmarks**: Proves execution of NIST FIPS 203 (ML-KEM-768) and FIPS 204 (ML-DSA-65).
4. **Zero-Knowledge Proofs (ZKP)**: Proves verification of Schnorr/Groth16 clearance proofs without identity disclosure.
5. **DNA Base Archival Simulation**: Proves 100% loss-less reconstruction of provenance records encoded into A/C/G/T nucleotide strings.
6. **Federated Learning Aggregation**: Proves multi-node FedAvg gradient aggregation across ORG-A, ORG-B, and ORG-C with Differential Privacy.
7. **Multi-Sector Pluggable Core**: Proves all 9 sector adapter configurations load and validate cleanly.
