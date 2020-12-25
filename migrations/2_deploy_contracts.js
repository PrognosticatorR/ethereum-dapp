const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  // Deploy DaiToken
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // Deploy DappToken
  await deployer.deploy(DappToken);
  const daapToken = await DappToken.deployed();

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, daapToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer fund to tokenFarm
  await daapToken.transfer(tokenFarm.address, "1000000000000000000000000");

  // Transfer 100 mock DAI to invester
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
