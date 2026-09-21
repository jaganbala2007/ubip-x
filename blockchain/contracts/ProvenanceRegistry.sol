// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title ProvenanceRegistry
 * @dev Immutable cryptographically-linked ledger of physical telemetry hashes and state proofs.
 * OFF-CHAIN: Raw sensor values, high-res waveforms, AI logs
 * ON-CHAIN: Canonical SHA-256 hash, event ID, asset ID, signature, previous hash
 */
contract ProvenanceRegistry is UBIPAccessControl {
    struct ProvenanceRecord {
        string eventId;
        string assetId;
        string nodeId;
        bytes32 canonicalHash;
        bytes32 previousHash;
        string signature;
        string trustState;
        uint256 timestamp;
        address validator;
    }

    ProvenanceRecord[] public records;
    mapping(string => bytes32) public latestAssetHash;
    mapping(string => uint256[]) public assetRecordIndices;

    event ProvenanceRecorded(
        uint256 indexed recordIndex,
        string indexed assetId,
        string eventId,
        bytes32 canonicalHash,
        bytes32 previousHash,
        string trustState,
        address validator
    );

    function recordProvenance(
        string memory eventId,
        string memory assetId,
        string memory nodeId,
        bytes32 canonicalHash,
        string memory signature,
        string memory trustState
    ) external onlyRole(VALIDATOR_ROLE) returns (uint256) {
        bytes32 prevHash = latestAssetHash[assetId];

        ProvenanceRecord memory rec = ProvenanceRecord({
            eventId: eventId,
            assetId: assetId,
            nodeId: nodeId,
            canonicalHash: canonicalHash,
            previousHash: prevHash,
            signature: signature,
            trustState: trustState,
            timestamp: block.timestamp,
            validator: msg.sender
        });

        records.push(rec);
        uint256 recordIndex = records.length - 1;

        latestAssetHash[assetId] = canonicalHash;
        assetRecordIndices[assetId].push(recordIndex);

        emit ProvenanceRecorded(recordIndex, assetId, eventId, canonicalHash, prevHash, trustState, msg.sender);
        return recordIndex;
    }

    function getRecordCount() external view returns (uint256) {
        return records.length;
    }

    function getAssetRecordIndices(string memory assetId) external view returns (uint256[] memory) {
        return assetRecordIndices[assetId];
    }
}
