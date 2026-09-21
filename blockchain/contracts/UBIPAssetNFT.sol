// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title UBIPAssetNFT
 * @dev ERC-721 compatible Digital Asset Passport linking physical identity (RFID/Sensor) to on-chain identity.
 */
contract UBIPAssetNFT is UBIPAccessControl {
    string public constant name = "UBIP Digital Asset Passport";
    string public constant symbol = "UBIP-NFT";

    struct AssetPassport {
        string assetId;
        string rfidTag;
        string manufacturer;
        string sector;
        string metadataUri;
        bytes32 genesisProvenanceHash;
        uint256 createdAt;
        bool isHeld;
    }

    uint256 public nextTokenId = 1;
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => AssetPassport) public passports;
    mapping(string => uint256) public assetIdToTokenId;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event PassportMinted(uint256 indexed tokenId, string assetId, string rfidTag, address indexed owner);
    event PassportHoldStatusChanged(uint256 indexed tokenId, string assetId, bool isHeld, string reason);

    function mintPassport(
        address to,
        string memory assetId,
        string memory rfidTag,
        string memory manufacturer,
        string memory sector,
        string memory metadataUri,
        bytes32 genesisProvenanceHash
    ) external onlyRole(OPERATOR_ROLE) returns (uint256) {
        require(to != address(0), "UBIPAssetNFT: Mint to zero address");
        require(assetIdToTokenId[assetId] == 0, "UBIPAssetNFT: Asset already minted");

        uint256 tokenId = nextTokenId++;
        ownerOf[tokenId] = to;
        balanceOf[to] += 1;

        passports[tokenId] = AssetPassport({
            assetId: assetId,
            rfidTag: rfidTag,
            manufacturer: manufacturer,
            sector: sector,
            metadataUri: metadataUri,
            genesisProvenanceHash: genesisProvenanceHash,
            createdAt: block.timestamp,
            isHeld: false
        });

        assetIdToTokenId[assetId] = tokenId;

        emit Transfer(address(0), to, tokenId);
        emit PassportMinted(tokenId, assetId, rfidTag, to);

        return tokenId;
    }

    function setHoldStatus(uint256 tokenId, bool isHeld, string memory reason) external onlyRole(VALIDATOR_ROLE) {
        require(ownerOf[tokenId] != address(0), "UBIPAssetNFT: Token does not exist");
        passports[tokenId].isHeld = isHeld;
        emit PassportHoldStatusChanged(tokenId, passports[tokenId].assetId, isHeld, reason);
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        require(ownerOf[tokenId] == from, "UBIPAssetNFT: Not owner");
        require(to != address(0), "UBIPAssetNFT: Transfer to zero address");
        require(!passports[tokenId].isHeld, "UBIPAssetNFT: Asset passport is on policy HOLD");
        require(msg.sender == from || hasRole(ADMIN_ROLE, msg.sender), "UBIPAssetNFT: Unauthorized transfer");

        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        ownerOf[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function getPassport(uint256 tokenId) external view returns (AssetPassport memory) {
        require(ownerOf[tokenId] != address(0), "UBIPAssetNFT: Token does not exist");
        return passports[tokenId];
    }
}
