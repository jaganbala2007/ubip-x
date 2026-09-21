// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title UBIPToken
 * @dev ERC-20 compliant utility token for UBIP-X verification credits and validator rewards.
 * Purpose: Local testnet utility layer (not for public speculation).
 */
contract UBIPToken is UBIPAccessControl {
    string public constant name = "UBIP Utility Token";
    string public constant symbol = "UBIP";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event ValidatorRewardMinted(address indexed validator, uint256 amount, string eventId);

    constructor(uint256 initialSupply) {
        _mint(msg.sender, initialSupply * 10 ** decimals);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function mintValidatorReward(address validator, uint256 amount, string memory eventId) external onlyRole(VALIDATOR_ROLE) {
        _mint(validator, amount);
        emit ValidatorRewardMinted(validator, amount, eventId);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "UBIPToken: Transfer to zero address");
        require(balanceOf[msg.sender] >= value, "UBIPToken: Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(spender != address(0), "UBIPToken: Approve to zero address");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(from != address(0) && to != address(0), "UBIPToken: Invalid address");
        require(balanceOf[from] >= value, "UBIPToken: Insufficient balance");
        require(allowance[from][msg.sender] >= value, "UBIPToken: Insufficient allowance");
        
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}
