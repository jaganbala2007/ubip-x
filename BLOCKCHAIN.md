# UBIP-X Blockchain Architecture & Smart Contract Reference
> **SIH 2026 Problem Statement PS ID: 26211**

---

## 1. Smart Contract Suite (Solidity 0.8.20)

UBIP-X deploys 6 core smart contracts on a local Hardhat ledger:

1. **`AssetRegistry.sol`**:
   - Manages physical asset registration (`registerAsset`), operational state transitions (`updateAssetState`), and emergency containment holds (`toggleHold`).
2. **`ProvenanceRegistry.sol`**:
   - Immutable parent-chained ledger storing canonical SHA-256 telemetry hashes, event IDs, signatures, and timestamps.
3. **`UBIPToken.sol` (ERC-20)**:
   - Fixed-supply local testnet utility token.
   - Rewards consensus validators with **+15 UBIP** per verified telemetry block.
   - Acts as verification service credits (not a speculative cryptocurrency).
4. **`UBIPAssetNFT.sol` (ERC-721)**:
   - Verifiable Digital Asset Passport token minted for each physical asset.
   - Binds on-chain ownership to hardware RFID tag and IPFS metadata URI.
5. **`MaintenanceWorkflow.sol`**:
   - Role-governed multi-party maintenance order request, review, approval, and emergency integrity hold triggers.
6. **`AccessControl.sol`**:
   - Standardized role-based access control (`ADMIN_ROLE`, `VALIDATOR_ROLE`, `OPERATOR_ROLE`, `AUDITOR_ROLE`).

---

## 2. Provenance Hash Chaining Algorithm

Each physical telemetry event is committed with a link to the previous hash for that specific asset:
```
Genesis Hash: SHA256(Asset_Genesis_Data)
Event 1: Hash_1 = SHA256(EVT-001 | ASSET-001 | Telemetry_1 | Genesis_Hash)
Event 2: Hash_2 = SHA256(EVT-002 | ASSET-001 | Telemetry_2 | Hash_1)
...
Event N: Hash_N = SHA256(EVT-N   | ASSET-001 | Telemetry_N | Hash_N-1)
```

If any past telemetry value is altered in off-chain databases, the entire downstream hash chain breaks, causing immediate consensus rejection.
