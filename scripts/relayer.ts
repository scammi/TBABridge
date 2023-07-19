import { ethers, network } from "hardhat";
import { ERC721GatewayDestination, ERC721GatewaySource, SourceNFT } from "../typechain-types";
import { getSigners } from "./utils";

const main = async () => {
  const { sourceSigner, destinationSigner } = getSigners();

  const SOURCE_NFT_ADDRESS = '0xb9814b579Bd96D445f15309d2fC0da5D3fF7A68a'
  const GATEWAY_SOURCE_ADDRESS = '0x2E2e3E6AF5cB6A54B55F326546757Ec2C8412c39'
  const GATEWAY_DESTINATION_SOURCE =  '0x5C98371Bd0eda3E76C1167AE63fBBba09feFca9a'

  const sourceNFT: SourceNFT = await ethers.getContractAt('SourceNFT', SOURCE_NFT_ADDRESS,sourceSigner)

  const gatewaySource:ERC721GatewaySource = await ethers.getContractAt('ERC721GatewaySource', GATEWAY_SOURCE_ADDRESS, sourceSigner)

  const gatewayDestination: ERC721GatewayDestination = await ethers.getContractAt(
    'ERC721GatewayDestination',
    GATEWAY_DESTINATION_SOURCE,
    destinationSigner
  )

  // Listen to the SwapOut event on Polygon
  gatewaySource.on(gatewaySource.getEvent('SwapOut'), (tokenId, sender, receiver, toChainID) => {
    bridgeToDestination({ tokenId, receiver })

    console.log('SwapOut event caught:', tokenId, sender, receiver )
  });

  console.log('- Listening for events on Polygon chain...')

  // Function to call on the Avax chain and save event data to an object
  const bridgeToDestination = async ({ tokenId, receiver }) => {
    const originalUri = await sourceNFT.tokenURI(tokenId);

    console.log('- Bridging..')
    const mintTx = await gatewayDestination.Swapin(tokenId, receiver, originalUri, { gasLimit: 6000000  });

    const receipt = await mintTx.wait();
    console.log('- Bridged at hash > ', receipt?.hash);
  }
};


main();