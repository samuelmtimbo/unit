// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import '../../../Functional.sol';
import '../../../UnitFactory.sol';

contract Add is Functional(0, 2, 1) {
    function f(U.Datum[] storage inputs) internal override {
        int128 a = U.asNumber(heap, inputs[0]);
        int128 b = U.asNumber(heap, inputs[1]);

        U.Datum memory aplusb = U.nitNumber(heap, a + b);
        output(0, aplusb);
    }
}

contract AddFactory is UnitFactory {
    function create(
        IMother,
        Heap heap,
        function(uint32, U.Datum memory) external outH,
        function(uint32) external consIn
    ) external returns (Unit) {
        return new Add().init(heap, outH, consIn);
    }
}
