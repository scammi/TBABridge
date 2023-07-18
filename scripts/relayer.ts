import { ethers, network } from "hardhat";
import { ERC721GatewayDestination, ERC721GatewaySource, SourceNFT } from "../typechain-types";
import { getSigners } from "./utils";

const main = async () => {
  const { sourceSigner, destinationSigner } = getSigners();

  // In the same script is hard to get different network signers for the gotten contracts.
  // There needs to be a way to describe 
  // const contract = await ethers.getContract(contractName, chainId)
  // That would require modifications on the ether js library, or the hardhat deploy.

  const sourceNFT: SourceNFT = await ethers.getContractAt('SourceNFT', '0xb9814b579Bd96D445f15309d2fC0da5D3fF7A68a',sourceSigner)
  const gatewaySource:ERC721GatewaySource = await ethers.getContractAt('ERC721GatewaySource', '0x2E2e3E6AF5cB6A54B55F326546757Ec2C8412c39',sourceSigner)
  const gatewayDestination: ERC721GatewayDestination = await ethers.getContractAt('ERC721GatewayDestination', '0x5C98371Bd0eda3E76C1167AE63fBBba09feFca9a', destinationSigner)

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