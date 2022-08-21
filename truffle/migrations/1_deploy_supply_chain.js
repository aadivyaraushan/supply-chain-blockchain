const contract = artifacts.require('SupplyChain');

module.exports = function (deployer) {
  deployer.deploy(contract);
};
