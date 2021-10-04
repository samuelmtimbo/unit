// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20;

contract Heap {
    string[] strings;
    int128[] numbers; // numbers are shifted <<63
    U.Datum[] objects;

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

    function newObject(U.Datum memory value) public returns (uint32 addr) {
        objects.push(value);
        addr = uint32(objects.length - 1);
    }

    function getObject(uint32 addr) public view returns (U.Datum memory) {
        return objects[addr];
    }
}

library U {
    enum DType {
        Null,
        String,
        Number,
        Array,
        Object
    }

    // this struct is NOT ANYMORE insanely expensive
    struct Datum {
        DType type_;
        // location is polymorphic depending on type above:
        // - string: single-length array pointing to `strings` array in heap
        // - number: same, pointing to `numbers` array in heap
        // - array: list of indexes pointing to the `objects` array in heap
        // - object: list of alternating indexes to `strings` and `objects` arrays in heap
        uint32[] location;
    }

    function asString(Heap heap, Datum memory value)
        public
        view
        returns (string memory)
    {
        require(value.type_ == DType.String, 'Type must be string');
        return heap.getString(value.location[0]);
    }

    function nitString(Heap heap, string memory value)
        internal
        returns (U.Datum memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newString(value);
        return U.Datum(DType.String, location);
    }

    function asNumber(Heap heap, U.Datum memory value)
        internal
        view
        returns (int128)
    {
        require(value.type_ == DType.Number, 'Type must be number');
        return heap.getNumber(value.location[0]);
    }

    function nitNumber(Heap heap, int128 value)
        internal
        returns (U.Datum memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newNumber(value);
        return U.Datum(DType.Number, location);
    }

    // now this one might be (expensive). consider implementing one that calls a function for each element instead.
    function asArray(Heap heap, U.Datum memory value)
        internal
        view
        returns (Datum[] memory array)
    {
        require(value.type_ == DType.Array, 'Type must be array');
        array = new Datum[](value.location.length);
        for (uint32 i = 0; i < array.length; i++) {
            array[i] = heap.getObject(value.location[i]);
        }
    }

    function nitArray(Heap heap, U.Datum[] memory array)
        internal
        returns (U.Datum memory)
    {
        uint32[] memory location = new uint32[](array.length);
        for (uint32 i = 0; i < array.length; i++) {
            location[i] = heap.newObject(array[i]);
        }
        return U.Datum(DType.Array, location);
    }

    // same as above.
    function asObject(Heap heap, U.Datum memory value)
        internal
        view
        returns (string[] memory keys, Datum[] memory values)
    {
        require(value.type_ == DType.Object, 'Type must be object');
        keys = new string[](value.location.length / 2);
        values = new Datum[](value.location.length / 2);
        for (uint32 i = 0; i < keys.length; i++) {
            keys[i] = heap.getString(value.location[2 * i]);
            values[i] = heap.getObject(value.location[2 * i + 1]);
        }
        return (keys, values);
    }

    function nitObject(
        Heap heap,
        string[] memory keys,
        U.Datum[] memory values
    ) internal returns (U.Datum memory) {
        require(
            keys.length == values.length,
            'Object must have same number of keys and values'
        );
        uint32[] memory location = new uint32[](2 * keys.length);
        for (uint32 i = 0; i < keys.length; i++) {
            location[2 * i] = heap.newString(keys[i]);
            location[2 * i + 1] = heap.newObject(values[i]);
        }
        return U.Datum(DType.Object, location);
    }
}

abstract contract Unit {
    Heap private heap;

    U.Datum[] private inputs;

    constructor(uint32 _inputCount) {
        inputs = new U.Datum[](_inputCount);
    }

    function init(Heap _heap, function(uint32, U.Datum memory) external _outH)
        external
        virtual
        returns (Unit self)
    {
        assert(address(heap) == address(0));
        heap = _heap;
        out = _outH;
        return this;
    }

    function take(uint32 idx, U.Datum memory input) external {
        inputs[idx] = input;
        for (uint32 i = 0; i < inputs.length; i++) {
            if (inputs[idx].type_ == U.DType.Null) {
                return;
            }
        }
        run(inputs);
        inputs = new U.Datum[](inputs.length);
    }

    function run(U.Datum[] storage inputs) internal virtual;

    function(uint32, U.Datum memory) external out;

    function asString(U.Datum memory value)
        internal
        view
        returns (string memory)
    {
        return U.asString(heap, value);
    }

    function nitString(string memory value) internal returns (U.Datum memory) {
        return U.nitString(heap, value);
    }

    function asNumber(U.Datum memory value) internal view returns (int128) {
        return U.asNumber(heap, value);
    }

    function nitNumber(int128 value) internal returns (U.Datum memory) {
        return U.nitNumber(heap, value);
    }

    function asArray(U.Datum memory value)
        internal
        view
        returns (U.Datum[] memory)
    {
        return U.asArray(heap, value);
    }

    function nitArray(U.Datum[] memory array)
        internal
        returns (U.Datum memory)
    {
        return U.nitArray(heap, array);
    }

    function asObject(U.Datum memory value)
        internal
        view
        returns (string[] memory keys, U.Datum[] memory values)
    {
        return U.asObject(heap, value);
    }

    function nitObject(string[] memory keys, U.Datum[] memory values)
        internal
        returns (U.Datum memory)
    {
        return U.nitObject(heap, keys, values);
    }
}

interface UnitFactory {
    function create(Heap heap, function(uint32, U.Datum memory) external outH)
        external
        returns (Unit);
}

contract Add is Unit(2) {
    function run(U.Datum[] storage inputs) internal override {
        int128 a = asNumber(inputs[0]);
        int128 b = asNumber(inputs[1]);

        U.Datum memory aplusb = nitNumber(a + b);
        out(0, aplusb);
    }
}

contract AddFactory is UnitFactory {
    function create(Heap heap, function(uint32, U.Datum memory) external outH)
        external
        returns (Unit)
    {
        return new Add().init(heap, outH);
    }
}

contract Multiply is Unit(2) {
    function run(U.Datum[] storage inputs) internal override {
        int128 a = asNumber(inputs[0]);
        int128 b = asNumber(inputs[1]);

        U.Datum memory axb = nitNumber(a * b);
        out(0, axb);
    }
}

contract MultiplyFactory is UnitFactory {
    function create(Heap heap, function(uint32, U.Datum memory) external outH)
        external
        returns (Unit)
    {
        return new Multiply().init(heap, outH);
    }
}

contract Mothership {
    address public owner;

    function init() public {
        owner = msg.sender;
        register('add', new AddFactory());
        register('multiply', new MultiplyFactory());
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
        function(uint32, U.Datum memory) external handler
    ) public returns (Unit) {
        return units[name].create(heap, handler);
    }
}

contract Graph420 is Heap {
    Unit add1;
    Unit multiply1;

    U.Datum output;

    constructor() {
        Mothership mother = new Mothership(); // this should actually come from dereferencing a well-known deployed mothership.
        mother.init(); // and this should actually be a constructor. but we have to make it a function for testing, because solidity

        add1 = mother.get('add', this, this.pin1);
        multiply1 = mother.get('multiply', this, this.pin2);

        init();
    }

    // this could/should be only in the constructor, but created the init helper to restart/debug easily
    function init() public {
        add1.take(1, U.nitNumber(this, 1));
    }

    // aka pin0
    function feed(int128 value) public returns (bool, int128) {
        U.Datum memory Datum = U.nitNumber(this, value);
        add1.take(0, Datum);
        multiply1.take(0, Datum);

        if (output.type_ == U.DType.Null) {
            return (false, -1);
        }

        int128 result = U.asNumber(this, output);
        output = U.Datum(U.DType.Null, new uint32[](0));
        return (true, result);
    }

    function pin1(uint32 idx, U.Datum memory value) external {
        if (idx == 0) {
            multiply1.take(1, value);
        }
    }

    function pin2(uint32 idx, U.Datum memory value) external {
        if (idx == 0) {
            output = value;
        }
    }
}
