import { ethers } from "hardhat";

export const getSigners = () => {
  const sourceProvider = new ethers.JsonRpcProvider(process.env.RPC_URL_SRC)
  const sourceWallet = ethers.HDNodeWallet.fromPhrase(process.env.PRODUCTION_MNEMONIC ?? '');
  const destinationProvider = new ethers.JsonRpcProvider(process.env.RPC_URL_DEST)
  const destinationWallet = ethers.HDNodeWallet.fromPhrase(process.env.PRODUCTION_MNEMONIC ?? '');
  const sourceSigner = sourceWallet.connect(sourceProvider)
  const destinationSigner = destinationWallet.connect(destinationProvider)

  return {
    sourceSigner,
    destinationSigner
  }
}
