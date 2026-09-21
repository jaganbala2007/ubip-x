# Contributing to UBIP-X 🛡️

Thank you for exploring **UBIP-X (Universal Blockchain Intelligence & Physical Trust Platform)**, developed for **Smart India Hackathon 2026** (Problem Statement ID: **26211**).

This document outlines our repository structure, development workflow, and guidelines for testing, submitting enhancements, and validating hardware/software modules.

---

## 🏛️ Repository Architecture

UBIP-X follows a multi-tier modular architecture designed for high scalability, real-time edge processing, and decentralized verification:

```
├── blockchain/          # Solidity Smart Contracts (Hardhat / Ethereum / EVM)
│   └── contracts/       # AssetRegistry, ProvenanceRegistry, MaintenanceWorkflow, Tokens
├── edge/                # Physical hardware edge drivers and telemetry schemas
│   ├── esp32/           # ESP32-S3 firmware, UART / MQTT drivers, SHA-256 canonical hashing
│   ├── raspberry-pi/    # Edge broker & local telemetry sync daemon
│   └── schemas/         # Telemetry packet validation & serialization specs
├── server/              # Backend Engine (Node.js + Express + TypeScript)
│   └── src/             # Multi-Agent Orchestrator, AI Anomaly Engine, PQC Benchmarks, ZKP
├── client/              # Frontend Dashboard (React 18 + Vite + TailwindCSS + Three.js)
│   └── src/             # Digital Twin View, Live Assets, SecOps Center, 9 Sector Views
└── docs/                # Comprehensive architectural and SIH jury reference manuals
```

---

## 🚀 Development Setup & Testing

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30 or higher

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/jaganbala2007/ubip-x.git
cd ubip-x

# Install root, client, and server dependencies
npm install
npm --prefix server install
npm --prefix client install

# Start both backend and frontend concurrently
npm run dev
```

### 3. Running Automated Test Suites
```bash
# Execute unit & integration test suites
npm test
```

---

## 🔍 Hackathon Jury & Evaluator Walkthrough

For SIH evaluators wishing to test live flows:
- **Interactive SIH 20-Step Demo**: Navigate to `/sih-demo` in the web application for an automated end-to-end evaluation scenario.
- **Judge Command Mode**: Navigate to `/judge-mode` for a unified 1-screen executive proof matrix showcasing on-chain hashes, PQC metrics, AI anomaly detection, and hardware failover.
- **Hardware Integration Manual**: Refer to [`HARDWARE_INTEGRATION.md`](./HARDWARE_INTEGRATION.md) for pinout diagrams, UART baud rates, and ESP32 flash instructions.

---

## 📜 Code of Conduct & Standards

1. **Deterministic Execution**: All cryptographic hashes and telemetry encodings must follow canonical JSON sorting (`canonicalize()`) to ensure identical hashes across heterogeneous edge runtimes.
2. **Post-Quantum Compliance**: Any new cryptographic primitives should follow NIST FIPS 203 (`ML-KEM-768`) and FIPS 204 (`ML-DSA-65`) standards.
3. **Commit Conventions**: Use conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).

---

## ⚖️ License
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
