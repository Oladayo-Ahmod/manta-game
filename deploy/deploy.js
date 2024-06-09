module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const token = await deploy('ArcadeGameToken', {
      from: deployer,
      args: [],
      log: true,
    });
    await deploy('ArcadeGame', {
        from: deployer,
        args: [token.address,deployer],
        log: true,
      });
  };
  module.exports.tags = ['ArcadeGame'];