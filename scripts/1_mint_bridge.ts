import { ethers, network } from "hardhat";
import { ERC721GatewaySource, IRegistry, SourceNFT } from "../typechain-types";

const mintSourceNFT = async () => {
  const sourceNFT = await ethers.getContract<SourceNFT>('SourceNFT')
  const { deployer } = await ethers.getNamedSigners() 
  const destinationMintAddress = deployer.address

  const mintSourceNft = await sourceNFT.mint(
    destinationMintAddress, "abc",
  )
  const mintReceipt = await mintSourceNft.wait()
  const mintSourceNftId = parseInt(mintReceipt?.logs[0].topics[3] ?? '0');

  console.log("- Minted token ID > ", mintSourceNftId)
  console.log('- Transaction mint at hash >', mintReceipt?.hash)

  return mintSourceNftId
}

const createAccount = async (tokenId: number) => {
  const chainId = network.config.chainId ?? 137;
  const accountImplementationAddress = '0x2d25602551487c3f3354dd80d76d54383a243358'
  const registrySourceAddress = '0x02101dfB77FDE026414827Fdc604ddAF224F0921'

  const { deployer } = await ethers.getNamedSigners();
  const sourceNFT = await ethers.getContract<SourceNFT>('SourceNFT')
  const registrySource: IRegistry = await ethers.getContractAt("IRegistry", registrySourceAddress, deployer)

  const sourceTokenAddress = await sourceNFT.getAddress();
  const createAccountTrx = await registrySource.createAccount(
    accountImplementationAddress,
    chainId,
    sourceTokenAddress,
    tokenId,
    0,
    '0x',
  )
  const createAccountReceipt = await createAccountTrx.wait()
  console.log("- Account created at hash > ", createAccountReceipt?.hash)

  const accountCreated = await registrySource.account(
    registrySourceAddress,
    chainId,
    sourceTokenAddress,
    tokenId,
    0,
  )

  console.log('- New account > ', accountCreated)
  return accountCreated
}

const grantNFTApprovalToSourceGateway = async (tokenId: number) => {
  const sourceNFT = await ethers.getContract<SourceNFT>('SourceNFT')
  const sourceGateway = await ethers.getContract<ERC721GatewaySource>('ERC721GatewaySource')

  const approveTx = await sourceNFT.approve(
    await sourceGateway.getAddress(),
    tokenId,
  )

  console.log(`- Gateway approved usage of NFT ${tokenId}`)
  await approveTx.wait()
}

const foundAccount = async(account: string) => {
  const etherAmount = ethers.parseEther('1');

  // Create the transaction object
  const transaction = {
    to: account,
    value: etherAmount,
  };

  // Send the transaction
  console.log('- Founding account...');
  const { deployer } = await ethers.getNamedSigners();
  const txResponse = await deployer.sendTransaction(transaction);
  console.log('- Account founded at >', txResponse.hash);
}

const enterTheGateway = async (tokenId: number) => {
  const destinationMintAddress = '0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A'
  const sourceGateway = await ethers.getContract<ERC721GatewaySource>('ERC721GatewaySource')

  const anyCallTx = await sourceGateway.Swapout(
    String(tokenId),
    destinationMintAddress,
    network.config.chainId ?? 137,
  )

  console.log('- Entering the void .... ')
  const swapoutReceipt = await anyCallTx.wait()

  console.log('- Locked token at hash > ', swapoutReceipt?.hash)
}

try {
  (async () => {
    const mintedId = await mintSourceNFT()
    const createdAccount = await createAccount(mintedId)
    await foundAccount(createdAccount);
    await grantNFTApprovalToSourceGateway(mintedId)
    await enterTheGateway(mintedId)
  
    console.log(`Success.`)
    process.exitCode = 0
  })()

} catch(err: any) {
  console.error(err.message)
  process.exitCode = 1
}
