// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './IMother.sol';
import './Heap.sol';
import './Unit.sol';

interface UnitFactory {
    function create(
        IMother mother,
        Heap heap,
        function(uint32, U.Datum memory) external outHndl,
        function(uint32) external consIn
    ) external returns (Unit);
}
