const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(cb) {
    try {
        let tokenFarm = await TokenFarm.deployed();
        await tokenFarm.issueTokens();
        console.log('Tokens issued!');
        cb();
    } catch (error) {
        console.error(error);
    }
};
