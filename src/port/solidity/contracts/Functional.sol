// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './Unit.sol';

abstract contract Functional is Unit {
    U.Datum[] private inputs;
    uint32 private consumablesStartIdx;

    bool mayGenOutput = true;

    constructor(
        uint32 unconsumableInputs, // always the first inputs
        uint32 totalInputs,
        uint32 outputs
    ) {
        // TODO: Implement support for multi-output functionals
        assert(outputs <= 1);
        assert(unconsumableInputs <= totalInputs);

        for (uint32 i = 0; i < totalInputs; i++) {
            inputs.push(U.Datum(U.DType.Null, new uint32[](0)));
        }
        consumablesStartIdx = unconsumableInputs;
    }

    function input(uint32 idx, U.Datum memory datum) external override {
        require(idx >= 0 && idx < inputs.length, 'Unknown input');
        inputs[idx] = datum;
        tryGenOutput();
    }

    function outputConsumed(uint32) external override {
        mayGenOutput = true;
        tryGenOutput();
    }

    function tryGenOutput() internal {
        if (!mayGenOutput) {
            return;
        }
        for (uint32 i = 0; i < inputs.length; i++) {
            if (inputs[i].type_ == U.DType.Null) {
                return;
            }
        }
        mayGenOutput = false;
        f(inputs);
        for (uint32 i = consumablesStartIdx; i < inputs.length; i++) {
            inputs[i] = U.Datum(U.DType.Null, new uint32[](0));
            consumeInput(i);
        }
    }

    function f(U.Datum[] storage inputs) internal virtual;
}
