// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './Unit.sol';

abstract contract Functional is Unit {
    U.Datum[] private inputs;
    uint32 private consumablesStartIdx;

    bool[] private outPendingConsume;

    constructor(
        uint32 unconsumableInputs, // always the first inputs
        uint32 totalInputs,
        uint32 outputs
    ) {
        assert(unconsumableInputs <= totalInputs);

        for (uint32 i = 0; i < totalInputs; i++) {
            inputs.push(U.Datum(U.DType.Null, new uint32[](0)));
        }
        for (uint32 i = 0; i < outputs; i++) {
            outPendingConsume.push(false);
        }
        consumablesStartIdx = unconsumableInputs;
    }

    function input(uint32 idx, U.Datum memory datum) external override {
        require(idx >= 0 && idx < inputs.length, 'Unknown input');
        inputs[idx] = datum;
        tryGenOutput();
    }

    function output(uint32 idx, U.Datum memory datum) internal override {
        outPendingConsume[idx] = true;
        super.output(idx, datum);
    }

    function outputConsumed(uint32 idx) external override {
        outPendingConsume[idx];
        tryGenOutput();
    }

    function tryGenOutput() private {
        if (hasOutputPending()) return;

        U.Datum[] memory memInputs = inputs;
        uint256 inCount = memInputs.length;
        for (uint32 i = 0; i < inCount; i++) {
            if (memInputs[i].type_ == U.DType.Null) {
                return;
            }
        }
        for (uint32 i = consumablesStartIdx; i < inCount; i++) {
            inputs[i] = U.Datum(U.DType.Null, new uint32[](0));
        }
        f(memInputs);
        for (uint32 i = consumablesStartIdx; i < inCount; i++) {
            consumeInput(i);
        }
    }

    function hasOutputPending() private view returns (bool) {
        uint256 outCount = outPendingConsume.length;
        for (uint32 i = 0; i < outCount; i++) {
            if (outPendingConsume[i]) {
                return true;
            }
        }
        return false;
    }

    function f(U.Datum[] memory inputs) internal virtual;
}
