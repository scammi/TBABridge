// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./utils/Administrable.sol"; 
import "./interfaces/IMintBurn721.sol";

contract ERC721GatewayDestination is Administrable {
    address public token;
    constructor (address token_) {
        setAdmin(msg.sender);
        token = token_;
    }

    function Swapin(uint256 tokenId, address receiver, string memory uri ) onlyAdmin public returns (bool) {
        try IMintBurn721(token).mint(receiver, tokenId, uri) {
            return true;
        } catch {
            return false;
        }
    }
}