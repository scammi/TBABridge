import { ethers, network } from "hardhat"
import { ERC721GatewaySource, SourceNFT } from "../typechain-types"

const tokenId = 3; // The NFT token to be bridge.
const destinationMintAddress = '0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A';

const grantNFTApprovalToSourceGateway = async (tokenId: number) => {
  const sourceNFT = await ethers.getContract<SourceNFT>('SourceNFT')
  const sourceGateway = await ethers.getContract<ERC721GatewaySource>('ERC721GatewaySource')

  const approveTx = await sourceNFT.approve(
    await sourceGateway.getAddress(),
    tokenId,
  )

  console.log(`Gateway approved usage of NFT ${tokenId}`)
  await approveTx.wait()
}

const enterTheGateway = async (tokenId: number) => {
  const chainId = network.config.chainId ?? 137
  const sourceGateway = await ethers.getContract<ERC721GatewaySource>('ERC721GatewaySource')
  const anyCallTx = await sourceGateway.Swapout(
    String(tokenId),
    destinationMintAddress,
    chainId,
  )

  console.log('Entering the void .... ')
  const swapoutReceipt = await anyCallTx.wait()

  console.log('Locked token at hash > ', swapoutReceipt?.hash)
}

try {
  (async () => {
    await grantNFTApprovalToSourceGateway(tokenId)
    await enterTheGateway(tokenId)

    console.log(`Success.`)
    process.exitCode = 0
  })()

} catch (err) {
  console.error(err.message)
  process.exitCode = 1
}