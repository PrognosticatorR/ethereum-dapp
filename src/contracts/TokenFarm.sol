pragma solidity ^0.5.0;

import './DaiToken.sol';
import './DappToken.sol';

contract TokenFarm{
    string public name ='devesh token farm';
    DaiToken public daiToken;
    DappToken public dappToken; 
    constructor(DappToken _dappToken,DaiToken _daiToken)public {
        dappToken = _dappToken;
        daiToken=_daiToken;
    }

}