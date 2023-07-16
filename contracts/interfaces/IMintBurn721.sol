// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

interface IMintBurn721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function mint(address account, uint256 tokenId, string memory uri) external;
    function burn(uint256 tokenId) external;
}