// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

library U {
    enum DataType {
        String,
        Number,
        Array,
        Object
    }

    // this struct is NOT ANYMORE insanely expensive
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
        int128[] numbers; // numbers are shifted <<63
        Data[] objects;
    }

    function nitString(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (string memory)
    {
        assert(value.type_ == DataType.String);
        return heap.strings[value.location[0]];
    }

    function nitNumber(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (int128)
    {
        assert(value.type_ == DataType.Number);
        return heap.numbers[value.location[0]];
    }

    // now this one might be (expensive). consider implementing one that calls a function for each element instead.
    function nitArray(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (Data[] memory array)
    {
        assert(value.type_ == DataType.Array);
        array = new Data[](value.location.length);
        for (uint32 i = 0; i < array.length; i++) {
            array[i] = heap.objects[value.location[i]];
        }
        return array;
    }

    // same as above.
    function nitObject(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (string[] memory keys, Data[] memory values)
    {
        assert(value.type_ == DataType.Object);
        keys = new string[](value.location.length / 2);
        values = new Data[](value.location.length / 2);
        for (uint32 i = 0; i < keys.length; i++) {
            keys[i] = heap.strings[value.location[2 * i]];
            values[i] = heap.objects[value.location[2 * i + 1]];
        }
        return (keys, values);
    }
}

interface OutputHandler {
    function take(U.Heap memory heap, U.Data memory result) external;
}

interface Unit {
    function take(
        U.Heap memory heap,
        U.Data memory input,
        OutputHandler output
    ) external;
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
