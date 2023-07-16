import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  await deploy('DestinationNFT', {
    from: deployer,
    gasLimit: 4000000,
    log: true,
    args: [],
  });
};

export default func;
func.tags = ['DestinationNFT'];