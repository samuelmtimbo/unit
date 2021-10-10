let _load_solc_js_promise: Promise<any>

export async function loadSolCJS(): Promise<any> {
  if (!_load_solc_js_promise) {
    _load_solc_js_promise = (async () => {
      const { href } = location

      const _href = href.replace('/_worker-solc.js', '')

      const SOLCJS_URL = `${_href}3rd/solc-js/soljson-loader.js`

      // @ts-ignore
      await self.importScripts(SOLCJS_URL)

      // @ts-ignore
      const { loadSolc } = self

      return loadSolc()
    })()
  }

  return _load_solc_js_promise
}

loadSolCJS()

const BUNDLE = {
  'DataHolder.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './U.sol';\n\ncontract DataHolder {\n    U.Datum[] public data;\n\n    constructor(uint32 length) {\n        for (uint32 i = 0; i < length; i++) {\n            data.push(U.Datum(U.DType.Null, new uint32[](0)));\n        }\n    }\n\n    function get(uint32 idx) external view returns (U.Datum memory) {\n        return data[idx];\n    }\n\n    function set(uint32 idx, U.Datum memory value) external {\n        data[idx] = value;\n    }\n}\n",
  },
  'Functional.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './Unit.sol';\n\nabstract contract Functional is Unit {\n    U.Datum[] private inputs;\n\n    constructor(uint32 _inputCount) {\n        for (uint32 i = 0; i < _inputCount; i++) {\n            inputs.push(U.Datum(U.DType.Null, new uint32[](0)));\n        }\n    }\n\n    function input(uint32 idx, U.Datum memory datum) external override {\n        inputs[idx] = datum;\n        for (uint32 i = 0; i < inputs.length; i++) {\n            if (inputs[i].type_ == U.DType.Null) {\n                return;\n            }\n        }\n        f(inputs, output);\n        for (uint32 i = 0; i < inputs.length; i++) {\n            inputs[i] = U.Datum(U.DType.Null, new uint32[](0));\n        }\n    }\n\n    function f(\n        U.Datum[] storage inputs,\n        function(uint32, U.Datum memory) external output\n    ) internal virtual;\n}\n",
  },
  'Graph420.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './IMother.sol';\nimport './Heap.sol';\nimport './DataHolder.sol';\n\ncontract Graph_graph_420_entry {\n    Heap private heap = new Heap();\n\n    Graph_graph_420 public graph;\n    DataHolder public output = new DataHolder(1);\n\n    constructor(address motherAddr) {\n        require(motherAddr != address(0), 'Lost from mother');\n        graph = new Graph_graph_420(IMother(motherAddr));\n        graph.init(heap, output.set);\n    }\n\n    // Inputs\n    function input_a(int128 value) external {\n        U.Datum memory datum = U.nitNumber(heap, value);\n        graph.input(0, datum);\n    }\n\n    function input_data(int128 value) external {\n        U.Datum memory datum = U.nitNumber(heap, value);\n        graph.input(1, datum);\n    }\n\n    function input_name(string memory value) external {\n        U.Datum memory datum = U.nitString(heap, value);\n        graph.input(2, datum);\n    }\n\n    // Outputs\n    function peekOutput_a_$_b() public view returns (bool ok, int128 value) {\n        U.Datum memory datum = output.get(0);\n        if (datum.type_ == U.DType.Null) {\n            return (false, int128(0)); // TODO: make this work for non-number types\n        }\n        return (true, U.asNumber(heap, datum));\n    }\n\n    function popOutput_a_$_b() external returns (bool ok, int128 value) {\n        (ok, value) = peekOutput_a_$_b();\n        output.set(0, U.Datum(U.DType.Null, new uint32[](0)));\n    }\n}\n\ncontract Graph_graph_420 is Unit {\n    IMother private mother;\n\n    Unit public a_set;\n    Unit public add;\n    Unit public get;\n    Unit public localstorage;\n    Unit public multiply;\n\n    constructor(IMother _mother) {\n        mother = _mother;\n    }\n\n    function init(Heap _heap, function(uint32, U.Datum memory) external _outH)\n        public\n        override\n        returns (Unit self)\n    {\n        self = this;\n        super.init(_heap, _outH);\n\n        // Fetch units from mother\n        a_set = newUnit('set', this.outHandler_a_set);\n        add = newUnit('add', this.outHandler_add);\n        get = newUnit('get', this.outHandler_get);\n        localstorage = newUnit('storage', this.outHandler_localstorage);\n        multiply = newUnit('multiply', this.outHandler_multiply);\n\n        // Units sent as self references\n        merge_0(U.nitAddress(heap, address(localstorage)));\n\n        // TODO: Figure out how to set static data embedded in the graphs here.\n    }\n\n    function newUnit(\n        string memory unit,\n        function(uint32, U.Datum memory) external outHandler\n    ) internal returns (Unit) {\n        return mother.get(unit).factory.create(mother, heap, outHandler);\n    }\n\n    function input(uint32 idx, U.Datum memory datum) external override {\n        if (idx == 0) {\n            // pin 0\n            merge_3(datum);\n        } else if (idx == 1) {\n            // pin 0\n            a_set.input(2, datum);\n        } else if (idx == 2) {\n            // pin 0\n            merge_1(datum);\n        }\n    }\n\n    // Output Handlers\n    function outHandler_a_set(uint32 idx, U.Datum memory datum) external {}\n\n    function outHandler_add(uint32 idx, U.Datum memory datum) external {\n        if (idx == 0) {\n            merge_4(datum);\n        }\n    }\n\n    function outHandler_get(uint32 idx, U.Datum memory datum) external {\n        if (idx == 0) {\n            merge_2(datum);\n        }\n    }\n\n    function outHandler_localstorage(uint32 idx, U.Datum memory datum)\n        external\n    {}\n\n    function outHandler_multiply(uint32 idx, U.Datum memory datum) external {\n        if (idx == 0) {\n            // graph output pin 0\n            output(0, datum);\n        }\n    }\n\n    // Merges\n    function merge_0(U.Datum memory datum) internal {\n        a_set.input(0, datum);\n        get.input(0, datum);\n    }\n\n    function merge_1(U.Datum memory datum) internal {\n        a_set.input(1, datum);\n        get.input(1, datum);\n    }\n\n    function merge_2(U.Datum memory datum) internal {\n        add.input(1, datum);\n    }\n\n    function merge_3(U.Datum memory datum) internal {\n        add.input(0, datum);\n        multiply.input(0, datum);\n    }\n\n    function merge_4(U.Datum memory datum) internal {\n        multiply.input(1, datum);\n    }\n}\n\ncontract Graph_graph_420_Factory is UnitFactory {\n    function create(\n        IMother mother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Graph_graph_420(mother).init(heap, outH);\n    }\n}\n",
  },
  'Heap.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './U.sol';\n\ncontract Heap {\n    string[] strings;\n    int128[] numbers; // numbers are shifted <<63\n    address[] addresses;\n    U.Datum[] objects;\n\n    function newString(string memory value) public returns (uint32 addr) {\n        strings.push(value);\n        addr = uint32(strings.length - 1);\n    }\n\n    function getString(uint32 addr) public view returns (string memory) {\n        return strings[addr];\n    }\n\n    function setString(uint32 addr, string memory value) public {\n        strings[addr] = value;\n    }\n\n    function newNumber(int128 value) public returns (uint32 addr) {\n        numbers.push(value);\n        addr = uint32(numbers.length - 1);\n    }\n\n    function getNumber(uint32 addr) public view returns (int128) {\n        return numbers[addr];\n    }\n\n    function setNumber(uint32 addr, int128 value) public {\n        numbers[addr] = value;\n    }\n\n    function newAddress(address value) public returns (uint32 addr) {\n        addresses.push(value);\n        addr = uint32(addresses.length - 1);\n    }\n\n    function getAddress(uint32 addr) public view returns (address) {\n        return addresses[addr];\n    }\n\n    function setAddress(uint32 addr, address value) public {\n        addresses[addr] = value;\n    }\n\n    function newObject(U.Datum memory value) public returns (uint32 addr) {\n        objects.push(value);\n        addr = uint32(objects.length - 1);\n    }\n\n    function getObject(uint32 addr) public view returns (U.Datum memory) {\n        return objects[addr];\n    }\n}\n",
  },
  'IMother.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './UnitFactory.sol';\n\ninterface IMother {\n    struct RegisteredUnit {\n        address author;\n        UnitFactory factory;\n    }\n\n    function register(string memory name, UnitFactory ufac) external;\n\n    function get(string memory name)\n        external\n        view\n        returns (RegisteredUnit memory);\n}\n",
  },
  'Mothership.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './IMother.sol';\n\ncontract Mothership is IMother {\n    address public owner;\n\n    mapping(string => RegisteredUnit) public units;\n\n    constructor() {\n        owner = msg.sender;\n    }\n\n    function register(string memory name, UnitFactory ufac) public {\n        require(tx.origin == owner, 'Only owner can register units (for now).');\n        require(units[name].author == address(0), 'Unit already exists.');\n\n        units[name] = RegisteredUnit(msg.sender, ufac);\n    }\n\n    function get(string memory name)\n        external\n        view\n        returns (RegisteredUnit memory)\n    {\n        RegisteredUnit storage unit = units[name];\n        if (unit.author == address(0)) {\n            revert(strConcat('Unit not found: ', name));\n        }\n        return unit;\n    }\n\n    function strConcat(string memory a, string memory b)\n        internal\n        pure\n        returns (string memory)\n    {\n        return string(abi.encodePacked(a, b));\n    }\n}\n",
  },
  'POCParty.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20;\n\ncontract Party {\n    address payable public host;\n    string public name;\n    uint256 public maxAttendees;\n    uint256 public baseEntranceFee;\n    uint256 public maxInvitesPerAttendee;\n\n    constructor(\n        string memory _name,\n        uint256 _maxAttendees,\n        uint256 _baseEntranceFee,\n        uint256 _maxInvitesPerAttendee\n    ) {\n        host = payable(msg.sender);\n        name = _name;\n        maxAttendees = _maxAttendees;\n        baseEntranceFee = _baseEntranceFee;\n        maxInvitesPerAttendee = _maxInvitesPerAttendee;\n\n        isInvited[host] = true;\n    }\n\n    uint32 public attendees = 1;\n    mapping(address => bool) public isInvited;\n\n    mapping(address => address[]) _inviteChain;\n\n    function invite(address invitee) public payable {\n        require(isInvited[msg.sender], 'Sender must have been invited.');\n        require(attendees < maxAttendees, 'Party full!');\n        require(\n            _inviteChain[msg.sender].length < maxInvitesPerAttendee,\n            'Invites already used.'\n        );\n        require(!isInvited[invitee], 'Invitee has already been invited.');\n\n        uint256 cost = inviteCost();\n        require(msg.value >= cost, 'Must pay for invite.');\n\n        isInvited[invitee] = true;\n        _inviteChain[msg.sender].push(invitee);\n        attendees++;\n\n        if (msg.value > cost) {\n            // send tip to host\n            host.transfer(msg.value - cost);\n        }\n\n        emit Invited(msg.sender, invitee);\n    }\n\n    function inviteCost() public view returns (uint256) {\n        return baseEntranceFee << uint256(_inviteChain[msg.sender].length);\n    }\n\n    event Invited(address indexed sender, address indexed invitee);\n}\n",
  },
  'system/f/arithmetic/Add.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport '../../../Functional.sol';\nimport '../../../UnitFactory.sol';\n\ncontract Add is Functional(2) {\n    function f(\n        U.Datum[] storage inputs,\n        function(uint32, U.Datum memory) external output\n    ) internal override {\n        int128 a = U.asNumber(heap, inputs[0]);\n        int128 b = U.asNumber(heap, inputs[1]);\n\n        U.Datum memory aplusb = U.nitNumber(heap, a + b);\n        output(0, aplusb);\n    }\n}\n\ncontract AddFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Add().init(heap, outH);\n    }\n}\n",
  },
  'system/f/arithmetic/Multiply.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport '../../../Functional.sol';\nimport '../../../UnitFactory.sol';\n\ncontract Multiply is Functional(2) {\n    function f(\n        U.Datum[] storage inputs,\n        function(uint32, U.Datum memory) external output\n    ) internal override {\n        int128 a = U.asNumber(heap, inputs[0]);\n        int128 b = U.asNumber(heap, inputs[1]);\n\n        // TODO: If we actually want decimal numbers, we'll need something\n        // smarter on this multiplication here like (a << N * b << N) >> N + BA * b@#43% 3#$% 3^ $%&568*7 ab2$^ 8*ef**\n        U.Datum memory axb = U.nitNumber(heap, a * b);\n        output(0, axb);\n    }\n}\n\ncontract MultiplyFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Multiply().init(heap, outH);\n    }\n}\n",
  },
  'system/f/arithmetic/Subtract.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport '../../../Functional.sol';\nimport '../../../UnitFactory.sol';\n\ncontract Subtract is Functional(2) {\n    function f(\n        U.Datum[] storage inputs,\n        function(uint32, U.Datum memory) external output\n    ) internal override {\n        int128 a = U.asNumber(heap, inputs[0]);\n        int128 b = U.asNumber(heap, inputs[1]);\n\n        U.Datum memory axb = U.nitNumber(heap, a - b);\n        output(0, axb);\n    }\n}\n\ncontract SubtractFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Subtract().init(heap, outH);\n    }\n}\n",
  },
  'system/f/object/Delete.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport './Object.sol';\nimport '../../../Unit.sol';\nimport '../../../UnitFactory.sol';\n\ncontract Delete is Unit {\n    Object internal target;\n\n    function input(uint32 idx, U.Datum memory datum) external override {\n        if (idx == 0) {\n            target = Object(U.asAddress(heap, datum));\n        } else if (idx == 1) {\n            require(\n                address(target) != address(0),\n                'target must have been initialized'\n            );\n            string memory key = U.asString(heap, datum);\n            U.Datum memory value = target.get(key);\n            target.delete_(key);\n            output(0, value);\n        } else {\n            revert('Unknown input');\n        }\n    }\n}\n\ncontract DeleteFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Delete().init(heap, outH);\n    }\n}\n",
  },
  'system/f/object/Get.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport './Object.sol';\nimport '../../../Unit.sol';\nimport '../../../UnitFactory.sol';\n\ncontract Get is Unit {\n    Object internal target;\n\n    function input(uint32 idx, U.Datum memory datum) external override {\n        if (idx == 0) {\n            target = Object(U.asAddress(heap, datum));\n        } else if (idx == 1) {\n            require(\n                address(target) != address(0),\n                'target must have been initialized'\n            );\n            string memory key = U.asString(heap, datum);\n            U.Datum memory value = target.get(key);\n            output(0, value);\n        } else {\n            revert('Unknown input');\n        }\n    }\n}\n\ncontract GetFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Get().init(heap, outH);\n    }\n}\n",
  },
  'system/f/object/Object.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport '../../../U.sol';\n\ninterface Object {\n    function get(string memory name) external view returns (U.Datum memory);\n\n    function set(string memory name, U.Datum memory value) external;\n\n    function delete_(string memory name) external;\n}\n",
  },
  'system/f/object/Set.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport './Object.sol';\nimport '../../../Unit.sol';\nimport '../../../UnitFactory.sol';\n\ncontract Set is Unit {\n    Object internal target;\n    string internal key;\n    U.Datum internal value;\n\n    function input(uint32 idx, U.Datum memory datum) external override {\n        if (idx == 0) {\n            target = Object(U.asAddress(heap, datum));\n        } else if (idx == 1) {\n            key = U.asString(heap, datum);\n        } else if (idx == 2) {\n            value = datum;\n        } else {\n            revert('Unknown input');\n        }\n        if (bytes(key).length != 0 && value.type_ != U.DType.Null) {\n            require(\n                address(target) != address(0),\n                'target must have been initialized'\n            );\n            target.set(key, value);\n            key = '';\n            value = U.Datum(U.DType.Null, new uint32[](0));\n        }\n    }\n}\n\ncontract SetFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Set().init(heap, outH);\n    }\n}\n",
  },
  'system/platform/api/storage/Storage.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.8.9;\n\nimport '../../../f/object/Object.sol';\nimport '../../../../Unit.sol';\nimport '../../../../UnitFactory.sol';\n\ncontract Storage is Unit, Object {\n    Object internal target;\n\n    mapping(string => U.Datum) public data;\n\n    function input(uint32, U.Datum memory) external pure override {\n        revert('Fake units do not receive input');\n    }\n\n    function get(string memory name) external view returns (U.Datum memory) {\n        return data[name];\n    }\n\n    function set(string memory name, U.Datum memory value) external {\n        data[name] = value;\n    }\n\n    function delete_(string memory name) external {\n        delete data[name];\n    }\n}\n\ncontract StorageFactory is UnitFactory {\n    function create(\n        IMother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit) {\n        return new Storage().init(heap, outH);\n    }\n}\n",
  },
  'U.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './Heap.sol';\n\nlibrary U {\n    enum DType {\n        Null,\n        String,\n        Number,\n        Address,\n        Array,\n        Object\n    }\n\n    // this struct is NOT ANYMORE insanely expensive\n    struct Datum {\n        DType type_;\n        // location is polymorphic depending on type above:\n        // - string: single-length array pointing to `strings` array in heap\n        // - number: same, pointing to `numbers` array in heap\n        // - address: `addresses` array in heap\n        // - array: list of indexes pointing to the `objects` array in heap\n        // - object: list of alternating indexes to `strings` and `objects` arrays in heap\n        uint32[] location;\n    }\n\n    function asString(Heap heap, Datum memory value)\n        internal\n        view\n        returns (string memory)\n    {\n        require(value.type_ == DType.String, 'Type must be string');\n        return heap.getString(value.location[0]);\n    }\n\n    function nitString(Heap heap, string memory value)\n        internal\n        returns (U.Datum memory)\n    {\n        uint32[] memory location = new uint32[](1);\n        location[0] = heap.newString(value);\n        return U.Datum(DType.String, location);\n    }\n\n    function asNumber(Heap heap, U.Datum memory value)\n        internal\n        view\n        returns (int128)\n    {\n        require(value.type_ == DType.Number, 'Type must be number');\n        return heap.getNumber(value.location[0]);\n    }\n\n    function nitNumber(Heap heap, int128 value)\n        internal\n        returns (U.Datum memory)\n    {\n        uint32[] memory location = new uint32[](1);\n        location[0] = heap.newNumber(value);\n        return U.Datum(DType.Number, location);\n    }\n\n    function asAddress(Heap heap, U.Datum memory value)\n        internal\n        view\n        returns (address)\n    {\n        require(value.type_ == DType.Address, 'Type must be address');\n        return heap.getAddress(value.location[0]);\n    }\n\n    function nitAddress(Heap heap, address value)\n        internal\n        returns (U.Datum memory)\n    {\n        uint32[] memory location = new uint32[](1);\n        location[0] = heap.newAddress(value);\n        return U.Datum(DType.Address, location);\n    }\n\n    // now this one might be (expensive). consider implementing one that calls a function for each element instead.\n    function asArray(Heap heap, U.Datum memory value)\n        internal\n        view\n        returns (Datum[] memory array)\n    {\n        require(value.type_ == DType.Array, 'Type must be array');\n        array = new Datum[](value.location.length);\n        for (uint32 i = 0; i < array.length; i++) {\n            array[i] = heap.getObject(value.location[i]);\n        }\n    }\n\n    function nitArray(Heap heap, U.Datum[] memory array)\n        internal\n        returns (U.Datum memory)\n    {\n        uint32[] memory location = new uint32[](array.length);\n        for (uint32 i = 0; i < array.length; i++) {\n            location[i] = heap.newObject(array[i]);\n        }\n        return U.Datum(DType.Array, location);\n    }\n\n    // same as above.\n    function asObject(Heap heap, U.Datum memory value)\n        internal\n        view\n        returns (string[] memory keys, Datum[] memory values)\n    {\n        require(value.type_ == DType.Object, 'Type must be object');\n        keys = new string[](value.location.length / 2);\n        values = new Datum[](value.location.length / 2);\n        for (uint32 i = 0; i < keys.length; i++) {\n            keys[i] = heap.getString(value.location[2 * i]);\n            values[i] = heap.getObject(value.location[2 * i + 1]);\n        }\n        return (keys, values);\n    }\n\n    function nitObject(\n        Heap heap,\n        string[] memory keys,\n        U.Datum[] memory values\n    ) internal returns (U.Datum memory) {\n        require(\n            keys.length == values.length,\n            'Object must have same number of keys and values'\n        );\n        uint32[] memory location = new uint32[](2 * keys.length);\n        for (uint32 i = 0; i < keys.length; i++) {\n            location[2 * i] = heap.newString(keys[i]);\n            location[2 * i + 1] = heap.newObject(values[i]);\n        }\n        return U.Datum(DType.Object, location);\n    }\n}\n",
  },
  'Unit.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './Heap.sol';\n\nabstract contract Unit {\n    Heap internal heap;\n\n    function init(Heap _heap, function(uint32, U.Datum memory) external _outH)\n        public\n        virtual\n        returns (Unit self)\n    {\n        assert(address(heap) == address(0));\n        heap = _heap;\n        output = _outH;\n        return this;\n    }\n\n    function input(uint32 idx, U.Datum memory datum) external virtual;\n\n    function(uint32, U.Datum memory) external output;\n}\n",
  },
  'UnitFactory.sol': {
    contents:
      "// SPDX-License-Identifier: UNLICENSED\npragma solidity >=0.4.20 >=0.8.9;\n\nimport './IMother.sol';\nimport './Heap.sol';\nimport './Unit.sol';\n\ninterface UnitFactory {\n    function create(\n        IMother mother,\n        Heap heap,\n        function(uint32, U.Datum memory) external outH\n    ) external returns (Unit);\n}\n",
  },
}

onmessage = async (event) => {
  const { data } = event

  const { callId, content } = data

  const solc = await loadSolCJS()

  const input = {
    language: 'Solidity',
    sources: {
      'test.sol': {
        content,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  }

  try {
    const result = {
      binary: {},
      abi: {},
    }

    const json = JSON.stringify(input)

    const compiled_json = solc.compile(json, {
      import: (path: string) => {
        console.log(path)

        return BUNDLE[path]
      },
    })

    const output = JSON.parse(compiled_json)

    const { errors = [] } = output

    const _errors = errors.filter((e) => e.severity === 'error')

    if (_errors.length > 0 || !output.contracts) {
      const first_error = _errors[0]
      const message =
        (first_error && first_error.message) || 'could not compile'
      throw new Error(message)
    }

    const test_contract = output.contracts['test.sol']
    for (var contractName in test_contract) {
      result.binary[contractName] =
        test_contract[contractName].evm.bytecode.object
      result.abi[contractName] = test_contract[contractName].abi
    }

    postMessage({ callId, result, err: null }, null, [])
  } catch (err) {
    postMessage({ callId, result: null, err: err.message }, null, [])
  }
}
