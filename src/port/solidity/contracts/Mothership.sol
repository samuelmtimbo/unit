// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './IMother.sol';

contract Mothership is IMother {
    address public owner;

    mapping(string => RegisteredUnit) public units;

    constructor() {
        owner = msg.sender;
    }

    function register(string memory name, UnitFactory ufac) public {
        require(tx.origin == owner, 'Only owner can register units (for now).');
        require(units[name].author == address(0), 'Unit already exists.');

        units[name] = RegisteredUnit(msg.sender, ufac);
    }

    function get(string memory name)
        external
        view
        returns (RegisteredUnit memory)
    {
        RegisteredUnit storage unit = units[name];
        if (unit.author == address(0)) {
            revert(strConcat('Unit not found: ', name));
        }
        return unit;
    }

    function strConcat(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }
}
