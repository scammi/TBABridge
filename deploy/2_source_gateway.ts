import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const sourceNFT = await ethers.getContract('SourceNFT');

    await deploy('ERC721GatewaySource', {
      from: deployer,
      gasLimit: 4000000,
      log: true,
      args: [await sourceNFT.getAddress()],
    });
};

export default func;
func.tags = ['src_gateway'];