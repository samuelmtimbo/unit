// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './UnitFactory.sol';

interface IMother {
    struct RegisteredUnit {
        address author;
        UnitFactory factory;
    }

    function register(string memory name, UnitFactory ufac) external;

    function get(string memory name)
        external
        view
        returns (RegisteredUnit memory);
}
