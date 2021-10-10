// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './IMother.sol';
import './Heap.sol';
import './DataHolder.sol';

import 'hardhat/console.sol';

contract Graph_graph_420_entry {
    Heap private heap = new Heap();

    Graph_graph_420 public graph;
    DataHolder public input = new DataHolder(3);
    DataHolder public output = new DataHolder(1);

    constructor(address motherAddr) {
        require(motherAddr != address(0), 'Lost from mother');
        graph = new Graph_graph_420(IMother(motherAddr));
        graph.init(heap, output.set, input.delete_);
    }

    // Inputs
    function input_a(int128 value) external {
        U.Datum memory datum = U.nitNumber(heap, value);
        input.set(0, datum);
        graph.input(0, datum);
    }

    function input_data(int128 value) external {
        U.Datum memory datum = U.nitNumber(heap, value);
        input.set(1, datum);
        graph.input(1, datum);
    }

    function input_name(string memory value) external {
        U.Datum memory datum = U.nitString(heap, value);
        input.set(2, datum);
        graph.input(2, datum);
    }

    // Outputs
    function peekOutput_a_$_b() public view returns (bool ok, int128 value) {
        U.Datum memory datum = output.get(0);
        if (datum.type_ == U.DType.Null) {
            return (false, int128(0)); // TODO: make this work for non-number types
        }
        return (true, U.asNumber(heap, datum));
    }

    function popOutput_a_$_b() external returns (bool ok, int128 value) {
        (ok, value) = peekOutput_a_$_b();
        output.set(0, U.Datum(U.DType.Null, new uint32[](0)));
        graph.outputConsumed(0);
    }
}

contract Graph_graph_420 is Unit {
    IMother private mother;

    Unit public a_set;
    Unit public add;
    Unit public get;
    Unit public localstorage;
    Unit public multiply;

    constructor(IMother _mother) {
        mother = _mother;
    }

    function init(
        Heap _heap,
        function(uint32, U.Datum memory) external _outH,
        function(uint32) external consIn
    ) public override returns (Unit self) {
        self = this;
        super.init(_heap, _outH, consIn);

        // Fetch units from mother
        a_set = newUnit('set', this.outHandler_a_set, this.inConsumed_a_set);
        add = newUnit('add', this.outHandler_add, this.inConsumed_add);
        get = newUnit('get', this.outHandler_get, this.inConsumed_get);
        localstorage = newUnit(
            'storage',
            this.outHandler_localstorage,
            this.inConsumed_localstorage
        );
        multiply = newUnit(
            'multiply',
            this.outHandler_multiply,
            this.inConsumed_multiply
        );

        // Units sent as self references
        merge_0(U.nitAddress(heap, address(localstorage)));

        // TODO: Figure out how to set static data embedded in the graphs here.
    }

    function newUnit(
        string memory unit,
        function(uint32, U.Datum memory) external outHandler,
        function(uint32) external consIn
    ) internal returns (Unit) {
        UnitFactory factory = mother.get(unit).factory;
        return factory.create(mother, heap, outHandler, consIn);
    }

    function input(uint32 idx, U.Datum memory datum) external override {
        if (idx == 0) {
            // pin 0
            merge_3(datum);
        } else if (idx == 1) {
            // pin 0
            a_set.input(2, datum);
        } else if (idx == 2) {
            // pin 0
            merge_1(datum);
        }
    }

    function outputConsumed(uint32 idx) external override {
        if (idx == 0) {
            multiply.outputConsumed(0);
        }
    }

    // Output Handlers
    function outHandler_a_set(uint32 idx, U.Datum memory datum) external {}

    function inConsumed_a_set(uint32 idx) external {
        if (idx == 0) {
            consumed_merge_0(0);
        } else if (idx == 1) {
            consumed_merge_1(0);
        } else if (idx == 2) {
            consumeInput(1);
        }
    }

    function outHandler_add(uint32 idx, U.Datum memory datum) external {
        if (idx == 0) {
            merge_4(datum);
        }
    }

    function inConsumed_add(uint32 idx) external {
        if (idx == 0) {
            consumed_merge_3(0);
        } else if (idx == 1) {
            consumed_merge_2(0);
        }
    }

    function outHandler_get(uint32 idx, U.Datum memory datum) external {
        if (idx == 0) {
            merge_2(datum);
        }
    }

    function inConsumed_get(uint32 idx) external {
        if (idx == 0) {
            consumed_merge_0(1);
        } else if (idx == 1) {
            consumed_merge_1(1);
        }
    }

    function outHandler_localstorage(uint32 idx, U.Datum memory datum)
        external
    {}

    function inConsumed_localstorage(uint32 idx) external {}

    function outHandler_multiply(uint32 idx, U.Datum memory datum) external {
        if (idx == 0) {
            // graph output pin 0
            output(0, datum);
        }
    }

    function inConsumed_multiply(uint32 idx) external {
        if (idx == 0) {
            consumed_merge_3(1);
        } else if (idx == 1) {
            consumed_merge_4(0);
        }
    }

    // Merges
    bool[2] merge_0_consumed;

    function merge_0(U.Datum memory datum) internal {
        merge_0_consumed = [false, false];
        a_set.input(0, datum);
        get.input(0, datum);
    }

    function consumed_merge_0(uint32 idx) internal {
        merge_0_consumed[idx] = true;
        if (merge_0_consumed[0] && merge_0_consumed[1]) {
            merge_0_consumed = [false, false];
            // nothing to do here, _self is not consumable
        }
    }

    bool[2] merge_1_consumed;

    function merge_1(U.Datum memory datum) internal {
        merge_1_consumed = [false, false];
        a_set.input(1, datum);
        get.input(1, datum);
    }

    function consumed_merge_1(uint32 idx) internal {
        merge_1_consumed[idx] = true;
        if (merge_1_consumed[0] && merge_1_consumed[1]) {
            merge_1_consumed = [false, false];
            consumeInput(2);
        }
    }

    bool[1] merge_2_consumed;

    function merge_2(U.Datum memory datum) internal {
        merge_2_consumed = [false];
        add.input(1, datum);
    }

    function consumed_merge_2(uint32 idx) internal {
        merge_2_consumed[idx] = true;
        if (merge_2_consumed[0]) {
            merge_2_consumed = [false];
            get.outputConsumed(0);
        }
    }

    bool[2] merge_3_consumed;

    function merge_3(U.Datum memory datum) internal {
        merge_3_consumed = [false, false];
        add.input(0, datum);
        multiply.input(0, datum);
    }

    function consumed_merge_3(uint32 idx) internal {
        merge_3_consumed[idx] = true;
        if (merge_3_consumed[0] && merge_3_consumed[1]) {
            merge_3_consumed = [false, false];
            consumeInput(0);
        }
    }

    bool[1] merge_4_consumed;

    function merge_4(U.Datum memory datum) internal {
        multiply.input(1, datum);
    }

    function consumed_merge_4(uint32 idx) internal {
        merge_4_consumed[idx] = true;
        if (merge_4_consumed[0]) {
            merge_4_consumed = [false];
            add.outputConsumed(0);
        }
    }
}

contract Graph_graph_420_Factory is UnitFactory {
    function create(
        IMother mother,
        Heap heap,
        function(uint32, U.Datum memory) external outH,
        function(uint32) external consIn
    ) external returns (Unit) {
        return new Graph_graph_420(mother).init(heap, outH, consIn);
    }
}
