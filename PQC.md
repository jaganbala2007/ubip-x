# UBIP-X Post-Quantum Cryptography (PQC) & FIPS Standardization
> **SIH 2026 Problem Statement PS ID: 26211**

---

## 1. Post-Quantum Cryptographic Migration

UBIP-X includes live in-process benchmarking comparing standardized NIST Post-Quantum Algorithms against legacy classical algorithms:

| Algorithm | Type | Standard | Public Key | Private Key | Sig / Cipher | Security Level |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ML-KEM-768** | Key Encapsulation (Lattice) | NIST FIPS 203 | 1,184 Bytes | 2,400 Bytes | 1,088 Bytes | Level 3 (AES-192 eq) |
| **ML-DSA-65** | Digital Signature (Lattice) | NIST FIPS 204 | 1,952 Bytes | 4,032 Bytes | 3,309 Bytes | Level 3 (EUF-CMA) |
| **RSA-2048** | Classical Asymmetric | PKCS #1 | 294 Bytes | 1,218 Bytes | 256 Bytes | Broken by Shor's |
| **ECDSA-secp256k1**| Classical Elliptic Curve | SECG | 65 Bytes | 32 Bytes | ~72 Bytes | Broken by Shor's |

---

## 2. PQC Benchmark Methodology

- Measurements are generated locally in real time on the host CPU using Node.js Crypto / Lattice polynomials.
- Timing metrics (KeyGen, Sign/Encap, Verify/Decap) represent actual local compute costs.
- The platform demonstrates that while lattice keys and signatures are larger in byte size, modern edge gateways (Raspberry Pi 4/5) can execute ML-KEM and ML-DSA within sub-millisecond envelopes, making post-quantum migration feasible for industrial physical assets.
