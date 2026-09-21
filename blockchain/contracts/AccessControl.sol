// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UBIPAccessControl
 * @dev Role-based access control for UBIP-X Physical-to-Digital Trust Infrastructure
 */
contract UBIPAccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    mapping(bytes32 => mapping(address => bool)) private _roles;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "UBIPAccessControl: Unauthorized sender role");
        _;
    }

    constructor() {
        _roles[ADMIN_ROLE][msg.sender] = true;
        _roles[VALIDATOR_ROLE][msg.sender] = true;
        _roles[OPERATOR_ROLE][msg.sender] = true;
        _roles[AUDITOR_ROLE][msg.sender] = true;
        emit RoleGranted(ADMIN_ROLE, msg.sender, msg.sender);
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function grantRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        require(!_roles[role][account], "UBIPAccessControl: Account already possesses role");
        _roles[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        require(_roles[role][account], "UBIPAccessControl: Account does not possess role");
        _roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }
}
