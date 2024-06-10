module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const initialAirdropAmount = ethers.utils.parseUnits("1000", 18);
    const token = await deploy('ArcadeGameToken', {
      from: deployer,
      args: [],
      log: true,
    });
    await deploy('ArcadeGame', {
        from: deployer,
        args: [token.address,deployer,initialAirdropAmount],
        log: true,
      });
  };
  module.exports.tags = ['ArcadeGame'];