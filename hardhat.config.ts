import 'dotenv/config'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const RPC_URL_SRC = process.env.RPC_URL_SRC
const RPC_URL_DEST = process.env.RPC_URL_DEST
const PRODUCTION_MNEMONIC = `${process.env.TESTNET_MNEMONIC}`.replace(/_/g, ' ');

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL_SRC ?? "",
        blockNumber: 30784049
      },
    },
    source: {
      url: RPC_URL_SRC,
      chainId: 137,
      accounts: {
        mnemonic: PRODUCTION_MNEMONIC,
        initialIndex: 0,
        count: 10,
      },
    },
    destination: {
      url: RPC_URL_DEST,
      chainId: 43114,
      accounts: {
        mnemonic: PRODUCTION_MNEMONIC,
        initialIndex: 0,
        count: 10,
      },
    }
  },
  etherscan: {
    apiKey: {
      polygon: process.env.ETHERSCAN_POLYGON ?? "",
      avalanche: process.env.ETHERSCAN_AVALANCHE ?? "",
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    protocolOwner: {
      default: 1,
    },
  },
};

export default config;
