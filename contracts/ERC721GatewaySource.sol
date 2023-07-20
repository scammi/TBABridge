// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "./utils/Administrable.sol"; 
import "./interfaces/IERC721.sol";
/**
 * @dev Required interface of an ERC721 compliant contract.
 */

abstract contract ERC721Gateway is Administrable {
    address public token;
    uint256 public swapoutSeq;
    mapping(uint256 => address) internal peer;

    constructor (address token_) {
        setAdmin(msg.sender);
        token = token_;
    }

    event SetPeers(uint256[] chainIDs, address[] peers);

    function setPeers(uint256[] memory chainIDs, address[] memory  peers) public onlyAdmin {
        for (uint i = 0; i < chainIDs.length; i++) {
            peer[chainIDs[i]] = peers[i];
            emit SetPeers(chainIDs, peers);
        }
    }

    function getPeer(uint256 foreignChainID) external view returns (address) {
        return peer[foreignChainID];
    }
}


contract ERC721GatewaySource is ERC721Gateway {
    constructor (address token) ERC721Gateway(token) {}

    event SwapOut(uint256 tokenId, address sender, address receiver, uint256 toChainID);

    error SwapOutFailed();

    function Swapout(
        uint256 tokenId,
        address receiver,
        uint256 destChainID
    )
        external
        payable
        returns (uint256)
    {
        (bool sucesfulSwapout, ) = _swapout(tokenId);

        // Lock TBA
        // Is there a way to grant controll to the tba onto the bridge token ?

        if (!sucesfulSwapout) revert SwapOutFailed();

        swapoutSeq++;

        emit SwapOut(tokenId, msg.sender, receiver, destChainID);
        return swapoutSeq;
    }

    function _swapout(uint256 tokenId) internal virtual returns (bool, bytes memory) {
        try IERC721(token).transferFrom(msg.sender, address(this), tokenId) {
            return (true, "");
        } catch {
            return (false, "");
        }
    }
}