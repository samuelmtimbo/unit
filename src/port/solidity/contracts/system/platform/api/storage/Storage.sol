// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import '../../../f/object/Object.sol';
import '../../../../Unit.sol';
import '../../../../UnitFactory.sol';

contract Storage is Unit, Object {
    mapping(string => U.Datum) public data;

    function input(uint32, U.Datum memory) external pure override {
        revert('Fake units cannot receive input');
    }

    function get(string memory name) external view returns (U.Datum memory) {
        return data[name];
    }

    function set(string memory name, U.Datum memory value) external {
        data[name] = value;
    }

    function delete_(string memory name) external {
        delete data[name];
    }
}

contract StorageFactory is UnitFactory {
    function create(
        IMother,
        Heap heap,
        function(uint32, U.Datum memory) external outH,
        function(uint32) external consIn
    ) external returns (Unit) {
        return new Storage().init(heap, outH, consIn);
    }
}
