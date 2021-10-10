// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './Heap.sol';

abstract contract Unit {
    Heap internal heap;

    function(uint32) external private consumeInputCallback;
    function(uint32, U.Datum memory) external private outputCallback;

    function init(
        Heap _heap,
        function(uint32, U.Datum memory) external _outH,
        function(uint32) external _consIn
    ) public virtual returns (Unit self) {
        assert(address(heap) == address(0));
        heap = _heap;
        consumeInputCallback = _consIn;
        outputCallback = _outH;
        return this;
    }

    function input(uint32 idx, U.Datum memory datum) external virtual;

    function consumeInput(uint32 idx) internal virtual {
        consumeInputCallback(idx);
    }

    function output(uint32 idx, U.Datum memory datum) internal virtual {
        outputCallback(idx, datum);
    }

    function outputConsumed(uint32 idx) external virtual {}
}
