const { assert } = require('chai');
const Web3 = require('web3');
const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');
require('chai')
    .use(require('chai-as-promised'))
    .should();

const web3 = new Web3();
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken;
    let dappToken;
    let tokenFarm;

    before(async () => {
        //load contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        //Transfer ALl dapp tokens to tokenFarm
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        //Transfer tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner });
    });

    describe('Mocha DAI DEPLOYMENT', async () => {
        it('has a name', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        });
    });

    describe('DAPP TOKEN DEPLOYMENT', async () => {
        it('has a name', async () => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        });
    });

    describe('TOKEN FARM DEPLOYMENT', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'Token farm');
        });

        it('Contract has tokens', async () => {
            const balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'));
        });
    });

    describe('Farming Token', async () => {
        it('Rewards investors for staking mDai tokens.', async () => {
            let result;

            result = await daiToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens('100'),
                'Investor Mock Dai Balance is correct before staking'
            );

            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'), { from: investor });

            result = await daiToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens('0'),
                'Investor Mock Dai Balance is correct before staking'
            );

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(
                result.toString(),
                tokens('100'),
                'Investor Mock Dai Balance is correct before staking'
            );

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(
                result.toString(),
                tokens('100'),
                'Investor Mock Dai Balance is correct before staking'
            );

            result = await tokenFarm.isStaking(investor);
            assert.equal(
                result.toString(),
                'true',
                'Investor Mock Dai Balance is correct before staking'
            );

            await tokenFarm.issueTokens({ from: owner });

            result = await dappToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens('100'),
                'Investor Mock Dai Balance is correct before staking'
            );

            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            await tokenFarm.unStakeTokens({ from: investor });

            result = await daiToken.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens('100'),
                'Investor Mock Dai Balance is correct after unStaking'
            );

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(
                result.toString(),
                tokens('0'),
                'Investor Mock Dai Balance is correct after unStaking'
            );

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(
                result.toString(),
                tokens('0'),
                'Investor Mock Dai Balance is correct after unStaking'
            );

            result = await tokenFarm.isStaking(investor);
            assert.equal(
                result.toString(),
                'false',
                'Investor Mock Dai Balance is correct after unStaking'
            );
        });
    });
});
