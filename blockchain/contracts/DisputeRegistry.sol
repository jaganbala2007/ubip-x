// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title DisputeRegistry
 * @dev On-chain dispute filing, evidence hash anchoring, and multi-party arbitration
 * @custom:project UBIP-X | Smart India Hackathon 2026 (PS ID 26211)
 */
contract DisputeRegistry is AccessControl {
    enum DisputeStatus { FILED, EVIDENCE_FROZEN, RESOLVED, REVERTED }
    enum DisputeVerdict { UPHELD_ORIGINAL, OVERTURNED_FRAUD, COMPROMISED_QUARANTINE }

    struct Dispute {
        string disputeId;
        string assetId;
        string eventId;
        string filedByOrg;
        string challengerOrg;
        string reason;
        DisputeStatus status;
        DisputeVerdict verdict;
        bytes32 frozenEvidenceHash;
        uint256 filedAt;
        uint256 resolvedAt;
        string policyAction;
    }

    mapping(string => Dispute) public disputes;
    string[] public allDisputeIds;

    event DisputeFiled(string indexed disputeId, string indexed assetId, string filedByOrg, string challengerOrg);
    event EvidenceFrozen(string indexed disputeId, bytes32 evidenceHash);
    event DisputeResolved(string indexed disputeId, DisputeVerdict verdict, string policyAction);

    function fileDispute(
        string memory _disputeId,
        string memory _assetId,
        string memory _eventId,
        string memory _filedByOrg,
        string memory _challengerOrg,
        string memory _reason,
        bytes32 _evidenceHash
    ) external onlyRole(ADMIN_ROLE) {
        require(disputes[_disputeId].filedAt == 0, "Dispute ID already exists");

        disputes[_disputeId] = Dispute({
            disputeId: _disputeId,
            assetId: _assetId,
            eventId: _eventId,
            filedByOrg: _filedByOrg,
            challengerOrg: _challengerOrg,
            reason: _reason,
            status: DisputeStatus.EVIDENCE_FROZEN,
            verdict: DisputeVerdict.UPHELD_ORIGINAL,
            frozenEvidenceHash: _evidenceHash,
            filedAt: block.timestamp,
            resolvedAt: 0,
            policyAction: ""
        });

        allDisputeIds.push(_disputeId);
        emit DisputeFiled(_disputeId, _assetId, _filedByOrg, _challengerOrg);
        emit EvidenceFrozen(_disputeId, _evidenceHash);
    }

    function resolveDispute(
        string memory _disputeId,
        DisputeVerdict _verdict,
        string memory _policyAction
    ) external onlyRole(ADMIN_ROLE) {
        Dispute storage d = disputes[_disputeId];
        require(d.filedAt > 0, "Dispute does not exist");
        require(d.status != DisputeStatus.RESOLVED, "Dispute already resolved");

        d.status = DisputeStatus.RESOLVED;
        d.verdict = _verdict;
        d.resolvedAt = block.timestamp;
        d.policyAction = _policyAction;

        emit DisputeResolved(_disputeId, _verdict, _policyAction);
    }

    function getDispute(string memory _disputeId) external view returns (Dispute memory) {
        return disputes[_disputeId];
    }

    function getDisputeCount() external view returns (uint256) {
        return allDisputeIds.length;
    }
}
