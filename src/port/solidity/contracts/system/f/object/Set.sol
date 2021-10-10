// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import './Object.sol';
import '../../../Functional.sol';
import '../../../UnitFactory.sol';

contract Set is Functional(1, 3, 0) {
    function f(U.Datum[] storage inputs) internal override {
        Object target = Object(U.asAddress(heap, inputs[0]));
        string memory key = U.asString(heap, inputs[1]);
        U.Datum memory value = inputs[2];
        target.set(key, value);
    }
}

contract SetFactory is UnitFactory {
    function create(
        IMother,
        Heap heap,
        function(uint32, U.Datum memory) external outH,
        function(uint32) external consIn
    ) external returns (Unit) {
        return new Set().init(heap, outH, consIn);
    }
}
