# UBIP-X REST API Specification & OpenAPI Reference
> **SIH 2026 Problem Statement PS ID: 26211**

---

## Base URL
`http://localhost:5000/api` | WebSocket: `ws://localhost:5000/ws`

---

## Endpoints

### 1. Physical Assets & Telemetry
- `GET /api/assets`: List all registered physical assets and states.
- `GET /api/assets/:id`: Retrieve single asset specifications and telemetry.
- `POST /api/assets`: Register a new physical asset (Asset ID, RFID, Node ID, Sector).
- `GET /api/events`: Retrieve live and historical ingested physical events.
- `POST /api/telemetry`: Ingest raw physical telemetry packet with canonical hash and signature.
- `POST /api/telemetry/scenario`: 1-click trigger scenario (`NORMAL`, `WARNING`, `ANOMALY`, `TAMPER`, `NETWORK_LOSS`, `NETWORK_RECOVERY`).

### 2. Identity & Blockchain
- `GET /api/identity`: W3C DID credentials registry.
- `GET /api/blockchain/blocks`: Paginated list of mined consensus blocks.
- `GET /api/blockchain/transactions`: Provenance transactions and gas audits.
- `POST /api/blockchain/hold`: Trigger or release smart contract emergency policy hold.

### 3. Tokens & NFTs
- `GET /api/tokens`: UBIP ERC-20 token supply, validator rewards, and balances.
- `GET /api/nfts`: ERC-721 Digital Asset Passports.

### 4. AI & Multi-Agent Orchestration
- `GET /api/ai/orchestrator`: 7-Agent reasoning traces and incident decisions.
- `POST /api/copilot/ask`: Operator Copilot Q&A grounded in database records.

### 5. Research & Labs
- `GET /api/pqc/benchmark`: Live ML-KEM-768 & ML-DSA-65 post-quantum benchmarks.
- `GET /api/quantum/circuit`: Quantum Bell state and Grover search circuit vectors.
- `POST /api/zkp/verify`: Zero-Knowledge Proof credential verifier.
- `POST /api/dna/encode`: DNA nucleotide base archival encoder.
- `POST /api/federated/round`: Cross-organization FedAvg model aggregation round.

### 6. Sectors & Offline Operation
- `GET /api/sectors`: Retrieve configurations for all 9 sectors.
- `POST /api/sectors/active`: Change active sector.
- `GET /api/offline/status`: Current offline queue buffer depth.
- `POST /api/offline/toggle`: Toggle network uplink online/offline.
