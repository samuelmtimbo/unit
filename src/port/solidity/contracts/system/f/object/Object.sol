// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import '../../../U.sol';

interface Object {
    function get(string memory name) external view returns (U.Datum memory);

    function set(string memory name, U.Datum memory value) external;

    function delete_(string memory name) external;
}
