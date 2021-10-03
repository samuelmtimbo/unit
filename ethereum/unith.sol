// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

library U {
    enum DataType {
        String,
        Number,
        Array,
        Object
    }

    // this struct is insanely expensive
    struct Data {
        DataType type_;
        // location is polymorphic depending on type above:
        // - string: single-length array pointing to `strings` array in heap
        // - number: same, pointing to `numbers` array in heap
        // - array: list of indexes pointing to the `objects` array in heap
        // - object: list of alternating indexes to `strings` and `objects` arrays in heap
        uint32[] location;
    }

    struct Heap {
        string[] strings;
        uint128[] numbers; // numbers are shifted <<64
        Data[] objects;
    }
}

interface OutputHandler {
    function take(U.Data memory result) external;
}

interface Unit {
    function take(U.Data memory input, OutputHandler output) external;
}

interface UnitFactory {
    function create() external view returns (Unit);
}

contract Mothership {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    mapping(string => UnitFactory) public units;

    function register(string memory name, UnitFactory ufac) public {
        require(
            msg.sender == owner,
            'Only owner can register units (for now).'
        );
        require(address(units[name]) == address(0), 'Unit already exists.');

        units[name] = ufac;
    }

    function get(string memory name) public view returns (Unit) {
        return units[name].create();
    }
}
