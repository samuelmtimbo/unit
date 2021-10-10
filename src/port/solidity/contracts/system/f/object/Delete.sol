// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import './Object.sol';
import '../../../Functional.sol';
import '../../../UnitFactory.sol';

contract Delete is Functional(1, 2, 0) {
    function f(U.Datum[] storage inputs) internal override {
        Object target = Object(U.asAddress(heap, inputs[0]));
        string memory key = U.asString(heap, inputs[1]);
        target.delete_(key);
    }
}

contract DeleteFactory is UnitFactory {
    function create(
        IMother,
        Heap heap,
        function(uint32, U.Datum memory) external outH,
        function(uint32) external consIn
    ) external returns (Unit) {
        return new Delete().init(heap, outH, consIn);
    }
}
