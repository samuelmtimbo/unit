// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './Heap.sol';

library U {
    enum DType {
        Null,
        String,
        Number,
        Address,
        Array,
        Object
    }

    // this struct is NOT ANYMORE insanely expensive
    struct Datum {
        DType type_;
        // location is polymorphic depending on type above:
        // - string: single-length array pointing to `strings` array in heap
        // - number: same, pointing to `numbers` array in heap
        // - address: `addresses` array in heap
        // - array: list of indexes pointing to the `objects` array in heap
        // - object: list of alternating indexes to `strings` and `objects` arrays in heap
        uint32[] location;
    }

    function Null() internal pure returns (Datum memory) {
        return U.Datum(U.DType.Null, new uint32[](0));
    }

    function asString(Heap heap, Datum memory value)
        internal
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

    function asAddress(Heap heap, U.Datum memory value)
        internal
        view
        returns (address)
    {
        require(value.type_ == DType.Address, 'Type must be address');
        return heap.getAddress(value.location[0]);
    }

    function nitAddress(Heap heap, address value)
        internal
        returns (U.Datum memory)
    {
        uint32[] memory location = new uint32[](1);
        location[0] = heap.newAddress(value);
        return U.Datum(DType.Address, location);
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
