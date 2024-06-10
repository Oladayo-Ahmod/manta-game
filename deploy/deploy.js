module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy the ERC20 token
  const token = await deploy('ArcadeGameToken', {
      from: deployer,
      args: [deployer],
      log: true,
  });

  // Define initial airdrop amount (e.g., 100 tokens)
  const initialAirdropAmount = ethers.utils.parseUnits("100", 18);

  // Deploy the ArcadeGame contract with the token address and initial airdrop amount
  const arcadeGame = await deploy('ArcadeGame', {
      from: deployer,
      args: [token.address, deployer, initialAirdropAmount],
      log: true,
  });

  // Get the ArcadeGame contract instance
  const arcadeGameContract = await ethers.getContractAt("ArcadeGame", arcadeGame.address);

  // Mint tokens to the ArcadeGame contract to cover the airdrops
  const tokenContract = await ethers.getContractAt("ArcadeGameToken", token.address);
  await tokenContract.mint(arcadeGame.address, ethers.utils.parseUnits("10000", 18));

  console.log(`ArcadeGameToken deployed at ${token.address}`);
  console.log(`ArcadeGame deployed at ${arcadeGame.address}`);
};

module.exports.tags = ['ArcadeGame'];
