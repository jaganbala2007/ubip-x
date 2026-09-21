// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title MaintenanceWorkflow
 * @dev Smart contract policy engine governing asset maintenance requests, multi-party approvals, and tamper containment holds.
 */
contract MaintenanceWorkflow is UBIPAccessControl {
    enum WorkflowStatus { PENDING, APPROVED, REJECTED, EXECUTED, HELD_INTEGRITY_VIOLATION }

    struct MaintenanceOrder {
        uint256 orderId;
        string assetId;
        string requester;
        string description;
        string proposedAction;
        WorkflowStatus status;
        bytes32 evidenceHash;
        uint256 requestedAt;
        uint256 resolvedAt;
        address approvedBy;
    }

    uint256 public nextOrderId = 1001;
    mapping(uint256 => MaintenanceOrder) public orders;
    mapping(string => uint256[]) public assetOrders;

    event MaintenanceRequested(uint256 indexed orderId, string indexed assetId, string requester, string description);
    event MaintenanceResolved(uint256 indexed orderId, string indexed assetId, WorkflowStatus status, address indexed resolver);
    event EmergencyHoldTriggered(uint256 indexed orderId, string indexed assetId, string reason);

    function requestMaintenance(
        string memory assetId,
        string memory requester,
        string memory description,
        string memory proposedAction,
        bytes32 evidenceHash
    ) external onlyRole(OPERATOR_ROLE) returns (uint256) {
        uint256 orderId = nextOrderId++;

        orders[orderId] = MaintenanceOrder({
            orderId: orderId,
            assetId: assetId,
            requester: requester,
            description: description,
            proposedAction: proposedAction,
            status: WorkflowStatus.PENDING,
            evidenceHash: evidenceHash,
            requestedAt: block.timestamp,
            resolvedAt: 0,
            approvedBy: address(0)
        });

        assetOrders[assetId].push(orderId);
        emit MaintenanceRequested(orderId, assetId, requester, description);
        return orderId;
    }

    function resolveMaintenance(uint256 orderId, bool approve) external onlyRole(ADMIN_ROLE) {
        require(orders[orderId].status == WorkflowStatus.PENDING, "MaintenanceWorkflow: Order not pending");

        orders[orderId].status = approve ? WorkflowStatus.APPROVED : WorkflowStatus.REJECTED;
        orders[orderId].resolvedAt = block.timestamp;
        orders[orderId].approvedBy = msg.sender;

        emit MaintenanceResolved(orderId, orders[orderId].assetId, orders[orderId].status, msg.sender);
    }

    function triggerEmergencyHold(uint256 orderId, string memory reason) external onlyRole(VALIDATOR_ROLE) {
        require(orders[orderId].orderId != 0, "MaintenanceWorkflow: Order does not exist");
        orders[orderId].status = WorkflowStatus.HELD_INTEGRITY_VIOLATION;
        orders[orderId].resolvedAt = block.timestamp;

        emit EmergencyHoldTriggered(orderId, orders[orderId].assetId, reason);
    }

    function getAssetOrders(string memory assetId) external view returns (uint256[] memory) {
        return assetOrders[assetId];
    }
}
