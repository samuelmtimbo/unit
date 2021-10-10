// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './U.sol';

contract Heap {
    string[] strings;
    int128[] numbers; // numbers are shifted <<63
    address[] addresses;
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

    function newAddress(address value) public returns (uint32 addr) {
        addresses.push(value);
        addr = uint32(addresses.length - 1);
    }

    function getAddress(uint32 addr) public view returns (address) {
        return addresses[addr];
    }

    function setAddress(uint32 addr, address value) public {
        addresses[addr] = value;
    }

    function newObject(U.Datum memory value) public returns (uint32 addr) {
        objects.push(value);
        addr = uint32(objects.length - 1);
    }

    function getObject(uint32 addr) public view returns (U.Datum memory) {
        return objects[addr];
    }
}
