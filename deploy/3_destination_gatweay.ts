import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DestinationNFT } from '../typechain-types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, execute } = deployments;

  const destinationNFT = await ethers.getContract<DestinationNFT>('DestinationNFT');

  const destinationGateway = await deploy('ERC721GatewayDestination', {
    from: deployer,
    gasLimit: 4000000,
    log: true,
    args: [await destinationNFT.getAddress()],
  });

  await execute(
    'DestinationNFT',
    {from: deployer, log: true},
    'transferOwnership',
    destinationGateway.address
  );
};

export default func;
func.tags = ['dst_gateway'];