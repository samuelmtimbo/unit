// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

library U {
    struct Heap {
        string[] strings;
        int128[] numbers; // numbers are shifted <<63
        Data[] objects;
    }

    function expandStrings(U.Heap memory heap, uint32 extra)
        internal
        pure
        returns (uint32 prevLen)
    {
        prevLen = uint32(heap.strings.length);
        string[] memory expanded = new string[](prevLen + extra);
        for (uint32 i = 0; i < prevLen; i++) {
            expanded[i] = heap.strings[i];
        }
        heap.strings = expanded;
    }

    function expandNumbers(U.Heap memory heap, uint32 extra)
        internal
        pure
        returns (uint32 prevLen)
    {
        prevLen = uint32(heap.numbers.length);
        int128[] memory expanded = new int128[](prevLen + extra);
        for (uint32 i = 0; i < prevLen; i++) {
            expanded[i] = heap.numbers[i];
        }
        heap.numbers = expanded;
    }

    function expandObjects(U.Heap memory heap, uint32 extra)
        internal
        pure
        returns (uint32 prevLen)
    {
        prevLen = uint32(heap.objects.length);
        U.Data[] memory expanded = new U.Data[](prevLen + extra);
        for (uint32 i = 0; i < prevLen; i++) {
            expanded[i] = heap.objects[i];
        }
        heap.objects = expanded;
    }

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

    function getString(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (string memory)
    {
        require(value.type_ == DataType.String, 'Type must be string');
        return heap.strings[value.location[0]];
    }

    function nitString(U.Heap memory heap, string memory value)
        internal
        pure
        returns (U.Data memory)
    {
        uint32 prevLen = expandStrings(heap, 1);
        uint32[] memory location = new uint32[](1);
        heap.strings[prevLen] = value;
        location[0] = prevLen;
        return U.Data({ type_: DataType.String, location: location });
    }

    function getNumber(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (int128)
    {
        require(value.type_ == DataType.Number, 'Type must be number');
        return heap.numbers[value.location[0]];
    }

    function nitNumber(U.Heap memory heap, int128 value)
        internal
        pure
        returns (U.Data memory)
    {
        uint32 prevLen = expandNumbers(heap, 1);
        uint32[] memory location = new uint32[](1);
        heap.numbers[prevLen] = value;
        location[0] = prevLen;
        return U.Data({ type_: DataType.Number, location: location });
    }

    // now this one might be (expensive). consider implementing one that calls a function for each element instead.
    function getArray(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (Data[] memory array)
    {
        require(value.type_ == DataType.Array, 'Type must be array');
        array = new Data[](value.location.length);
        for (uint32 i = 0; i < array.length; i++) {
            array[i] = heap.objects[value.location[i]];
        }
        return array;
    }

    function nitArray(U.Heap memory heap, U.Data[] memory array)
        internal
        pure
        returns (U.Data memory)
    {
        uint32 prevLen = expandObjects(heap, uint32(array.length));
        uint32[] memory location = new uint32[](array.length);
        for (uint32 i = 0; i < array.length; i++) {
            uint32 heapIdx = prevLen + i;
            heap.objects[heapIdx] = array[i];
            location[i] = heapIdx;
        }
        return U.Data({ type_: DataType.Array, location: location });
    }

    // same as above.
    function getObject(U.Heap memory heap, U.Data memory value)
        internal
        pure
        returns (string[] memory keys, Data[] memory values)
    {
        require(value.type_ == DataType.Object, 'Type must be object');
        keys = new string[](value.location.length / 2);
        values = new Data[](value.location.length / 2);
        for (uint32 i = 0; i < keys.length; i++) {
            keys[i] = heap.strings[value.location[2 * i]];
            values[i] = heap.objects[value.location[2 * i + 1]];
        }
        return (keys, values);
    }

    function niObject(
        U.Heap memory heap,
        string[] memory keys,
        U.Data[] memory values
    ) internal pure returns (U.Data memory) {
        require(
            keys.length == values.length,
            'Object must have same number of keys and values'
        );
        uint32 prevStrsLen = expandStrings(heap, uint32(keys.length));
        uint32 prevObjsLen = expandObjects(heap, uint32(values.length));
        uint32[] memory location = new uint32[](2 * keys.length);
        for (uint32 i = 0; i < keys.length; i++) {
            uint32 keyIdx = prevStrsLen + i;
            uint32 valueIdx = prevObjsLen + i;
            heap.strings[keyIdx] = keys[i];
            heap.objects[valueIdx] = values[i];
            location[2 * i] = keyIdx;
            location[2 * i + 1] = valueIdx;
        }
        return U.Data({ type_: DataType.Object, location: location });
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
    function create() external returns (Unit);
}

contract Add is Unit {
    function take(
        U.Heap memory heap,
        U.Data memory input,
        OutputHandler done
    ) external {
        U.Data[] memory inputs = U.getArray(heap, input);
        int128 a = U.getNumber(heap, inputs[0]);
        int128 b = U.getNumber(heap, inputs[1]);

        U.Data memory result = U.nitNumber(heap, a + b);
        done.take(heap, result);
    }
}

contract AddFactory is UnitFactory {
    function create() external returns (Unit) {
        return new Add();
    }
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

    function get(string memory name) public returns (Unit) {
        return units[name].create();
    }
}
