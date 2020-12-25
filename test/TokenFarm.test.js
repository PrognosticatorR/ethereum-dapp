const Web3 = require("web3");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");
require("chai")
  .use(require("chai-as-promised"))
  .should();

const web3 = new Web3();
function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken;
  let dappToken;
  let tokenFarm;

  before(async () => {
    //load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //Transfer ALl dapp tokens to tokenFarm
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    //Transfer tokens to invester
    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Mocha DAI Deploymant", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });
  describe("DAPP TOKEN Deploymant", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });
  describe("TOKEN FARM Deploymant", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "devesh token farm");
    });

    it("Contract has tokens", async () => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });
});
