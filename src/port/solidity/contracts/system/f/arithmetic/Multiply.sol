// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

import '../../../Functional.sol';
import '../../../UnitFactory.sol';

contract Multiply is Functional(0, 2, 1) {
    function f(U.Datum[] storage inputs) internal override {
        int128 a = U.asNumber(heap, inputs[0]);
        int128 b = U.asNumber(heap, inputs[1]);

        // TODO: If we actually want decimal numbers, we'll need something
        // smarter on this multiplication here like (a << N * b << N) >> N + BA * b@#43% 3#$% 3^ $%&568*7 ab2$^ 8*ef**
        U.Datum memory axb = U.nitNumber(heap, a * b);
        output(0, axb);
    }
}

contract MultiplyFactory is UnitFactory {
    function create(
        IMother,
        Heap heap,
        function(uint32, U.Datum memory) external outH,
        function(uint32) external consIn
    ) external returns (Unit) {
        return new Multiply().init(heap, outH, consIn);
    }
}
