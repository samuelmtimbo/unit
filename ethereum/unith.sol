// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

contract Heap {
    string[] strings;
    int128[] numbers; // numbers are shifted <<63
    U.Data[] objects;

    function newString(string memory value) public returns (uint32 addr) {
        strings.push(value);
        addr = uint32(strings.length - 1);
    }

    function getString(uint32 addr) public view returns (string memory) {
        return strings[addr];
    }

    function setString(uint32 addr, string memory value) public {
        strings[addr] = value;
    }

    function newNumber(int128 value) public returns (uint32 addr) {
        numbers.push(value);
        addr = uint32(numbers.length - 1);
    }

    function getNumber(uint32 addr) public view returns (int128) {
        return numbers[addr];
    }

    function setNumber(uint32 addr, int128 value) public {
        numbers[addr] = value;
    }

    function newObject(U.Data memory value) public returns (uint32 addr) {
        objects.push(value);
        addr = uint32(objects.length - 1);
    }

    function getObject(uint32 addr) public view returns (U.Data memory) {
        return objects[addr];
    }
}

library U {
    enum DataType {
        Null,
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

    function asString(Heap heap, Data memory value)
        public
        view
        returns (string memory)
    {
        require(value.type_ == DataType.String, 'Type must be string');
        return heap.getString(value.location[0]);
    }

    function nitString(Heap heap, string memory value)
        internal
        returns (U.Data memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newString(value);
        return U.Data(DataType.String, location);
    }

    function asNumber(Heap heap, U.Data memory value)
        internal
        view
        returns (int128)
    {
        require(value.type_ == DataType.Number, 'Type must be number');
        return heap.getNumber(value.location[0]);
    }

    function nitNumber(Heap heap, int128 value)
        internal
        returns (U.Data memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newNumber(value);
        return U.Data(DataType.Number, location);
    }

    // now this one might be (expensive). consider implementing one that calls a function for each element instead.
    function asArray(Heap heap, U.Data memory value)
        internal
        view
        returns (Data[] memory array)
    {
        require(value.type_ == DataType.Array, 'Type must be array');
        array = new Data[](value.location.length);
        for (uint32 i = 0; i < array.length; i++) {
            array[i] = heap.getObject(value.location[i]);
        }
    }

    function nitArray(Heap heap, U.Data[] memory array)
        internal
        returns (U.Data memory)
    {
        uint32[] memory location = new uint32[](array.length);
        for (uint32 i = 0; i < array.length; i++) {
            location[i] = heap.newObject(array[i]);
        }
        return U.Data(DataType.Array, location);
    }

    // same as above.
    function asObject(Heap heap, U.Data memory value)
        internal
        view
        returns (string[] memory keys, Data[] memory values)
    {
        require(value.type_ == DataType.Object, 'Type must be object');
        keys = new string[](value.location.length / 2);
        values = new Data[](value.location.length / 2);
        for (uint32 i = 0; i < keys.length; i++) {
            keys[i] = heap.getString(value.location[2 * i]);
            values[i] = heap.getObject(value.location[2 * i + 1]);
        }
        return (keys, values);
    }

    function nitObject(
        Heap heap,
        string[] memory keys,
        U.Data[] memory values
    ) internal returns (U.Data memory) {
        require(
            keys.length == values.length,
            'Object must have same number of keys and values'
        );
        uint32[] memory location = new uint32[](2 * keys.length);
        for (uint32 i = 0; i < keys.length; i++) {
            location[2 * i] = heap.newString(keys[i]);
            location[2 * i + 1] = heap.newObject(values[i]);
        }
        return U.Data(DataType.Object, location);
    }
}

interface DataHandler {
    function take(uint32 idx, U.Data memory value) external;
}

abstract contract Unit is DataHandler {
    Heap private heap;
    DataHandler private outputHandler;

    U.Data[] private inputs;

    constructor(uint32 _inputCount) {
        inputs = new U.Data[](_inputCount);
    }

    function init(Heap _heap, DataHandler _outputHandler)
        external
        virtual
        returns (Unit self)
    {
        assert(address(heap) == address(0));
        heap = _heap;
        outputHandler = _outputHandler;
        return this;
    }

    function take(uint32 idx, U.Data memory input) external {
        inputs[idx] = input;
        for (uint32 i = 0; i < inputs.length; i++) {
            if (inputs[idx].type_ == U.DataType.Null) {
                return;
            }
        }
        run(inputs);
        inputs = new U.Data[](inputs.length);
    }

    function run(U.Data[] storage inputs) internal virtual;

    function out(uint32 idx, U.Data memory value) internal {
        outputHandler.take(idx, value);
    }

    function asString(U.Data memory value)
        internal
        view
        returns (string memory)
    {
        return U.asString(heap, value);
    }

    function nitString(string memory value) internal returns (U.Data memory) {
        return U.nitString(heap, value);
    }

    function asNumber(U.Data memory value) internal view returns (int128) {
        return U.asNumber(heap, value);
    }

    function nitNumber(int128 value) internal returns (U.Data memory) {
        return U.nitNumber(heap, value);
    }

    function asArray(U.Data memory value)
        internal
        view
        returns (U.Data[] memory)
    {
        return U.asArray(heap, value);
    }

    function nitArray(U.Data[] memory array) internal returns (U.Data memory) {
        return U.nitArray(heap, array);
    }

    function asObject(U.Data memory value)
        internal
        view
        returns (string[] memory keys, U.Data[] memory values)
    {
        return U.asObject(heap, value);
    }

    function nitObject(string[] memory keys, U.Data[] memory values)
        internal
        returns (U.Data memory)
    {
        return U.nitObject(heap, keys, values);
    }
}

interface UnitFactory {
    function create(Heap heap, DataHandler handler) external returns (Unit);
}

contract Add is Unit(2) {
    function run(U.Data[] storage inputs) internal override {
        int128 a = asNumber(inputs[0]);
        int128 b = asNumber(inputs[1]);

        U.Data memory result = nitNumber(a + b);
        out(0, result);
    }
}

contract AddFactory is UnitFactory {
    function create(Heap heap, DataHandler handler) external returns (Unit) {
        return new Add().init(heap, handler);
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

    function get(
        string memory name,
        Heap heap,
        DataHandler handler
    ) public returns (Unit) {
        return units[name].create(heap, handler);
    }
}
