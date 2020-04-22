pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Project is ERC20 {
    constructor(uint256 initialSupply) ERC20("Test Merge Token Coolos ", "TMTC") public {
        _mint(msg.sender, initialSupply);
    }
}
