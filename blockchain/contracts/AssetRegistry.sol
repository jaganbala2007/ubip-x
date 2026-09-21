// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title AssetRegistry
 * @dev Tracks physical asset identities, node associations, and operational state transitions.
 */
contract AssetRegistry is UBIPAccessControl {
    enum AssetState { UNREGISTERED, ACTIVE, WARNING, ANOMALY, TAMPERED, ON_HOLD, DECOMMISSIONED }

    struct PhysicalAsset {
        string assetId;
        string rfidTag;
        string nodeDeviceId;
        string organization;
        string sector;
        AssetState state;
        bytes32 latestTelemetryHash;
        uint256 registeredAt;
        uint256 lastUpdatedAt;
        bool isHeld;
    }

    mapping(string => PhysicalAsset) public assets;
    string[] public registeredAssetIds;

    event AssetRegistered(string indexed assetId, string rfidTag, string organization, string sector);
    event AssetStateUpdated(string indexed assetId, AssetState newState, bytes32 telemetryHash);
    event AssetHoldToggled(string indexed assetId, bool isHeld, string reason);

    function registerAsset(
        string memory assetId,
        string memory rfidTag,
        string memory nodeDeviceId,
        string memory organization,
        string memory sector
    ) external onlyRole(OPERATOR_ROLE) {
        require(assets[assetId].state == AssetState.UNREGISTERED, "AssetRegistry: Asset already registered");

        assets[assetId] = PhysicalAsset({
            assetId: assetId,
            rfidTag: rfidTag,
            nodeDeviceId: nodeDeviceId,
            organization: organization,
            sector: sector,
            state: AssetState.ACTIVE,
            latestTelemetryHash: bytes32(0),
            registeredAt: block.timestamp,
            lastUpdatedAt: block.timestamp,
            isHeld: false
        });

        registeredAssetIds.push(assetId);
        emit AssetRegistered(assetId, rfidTag, organization, sector);
    }

    function updateAssetState(
        string memory assetId,
        AssetState newState,
        bytes32 telemetryHash
    ) external onlyRole(VALIDATOR_ROLE) {
        require(assets[assetId].state != AssetState.UNREGISTERED, "AssetRegistry: Asset not registered");
        
        assets[assetId].state = newState;
        assets[assetId].latestTelemetryHash = telemetryHash;
        assets[assetId].lastUpdatedAt = block.timestamp;

        emit AssetStateUpdated(assetId, newState, telemetryHash);
    }

    function toggleHold(string memory assetId, bool isHeld, string memory reason) external onlyRole(VALIDATOR_ROLE) {
        require(assets[assetId].state != AssetState.UNREGISTERED, "AssetRegistry: Asset not registered");
        assets[assetId].isHeld = isHeld;
        if (isHeld) {
            assets[assetId].state = AssetState.ON_HOLD;
        }
        emit AssetHoldToggled(assetId, isHeld, reason);
    }

    function getAsset(string memory assetId) external view returns (PhysicalAsset memory) {
        return assets[assetId];
    }

    function getAllAssetIds() external view returns (string[] memory) {
        return registeredAssetIds;
    }
}
