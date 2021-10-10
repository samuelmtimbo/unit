// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './U.sol';

contract DataHolder {
    U.Datum[] public data;

    constructor(uint32 length) {
        for (uint32 i = 0; i < length; i++) {
            data.push(U.Null());
        }
    }

    function get(uint32 idx) external view returns (U.Datum memory) {
        return data[idx];
    }

    function set(uint32 idx, U.Datum memory value) external {
        data[idx] = value;
    }

    function delete_(uint32 idx) external {
        data[idx] = U.Null();
    }
}
