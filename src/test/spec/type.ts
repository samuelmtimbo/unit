import * as assert from 'assert'
import { UNTITLED } from '../../constant/STRING'
import { TreeNodeType } from '../../spec/parser'
import {
  _getGraphTypeMapById,
  _getSpecTypeInterfaceById,
  getGraphTypeMap,
  getGraphTypeMapById,
  getSpecTypeInterfaceById,
  mostSpecific,
} from '../../spec/type'
import {
  ID_ARRAY_BUILDER_FROM,
  ID_CONCAT_3_0,
  ID_CONSTANT_ONE,
  ID_HEAD_OR_DEFAULT,
  ID_INCREMENT,
  ID_LAST_INDEX,
  ID_LOOP_INCREMENT,
  ID_MERGE_AB,
  ID_N_ARRAY_BUILDER,
  ID_N_ARRAY_BUILDER_FROM,
  ID_PICK_LESSER,
  ID_RANDOM_BIT,
  ID_RANDOM_BIT_ARRAY,
  ID_RANDOM_BIT_MATRIX,
  ID_RANDOM_NATURAL_LTE,
  ID_RANGE_ARRAY,
  ID_SINGLE,
  ID_SWAP,
  ID_TAG,
  ID_WAIT_ALL_2,
} from '../../system/_ids'
import _specs from '../../system/_specs'

assert.equal(mostSpecific('<A>', '<B>'), '<A>')
assert.equal(mostSpecific('<B>', '<A>'), '<A>')
assert.equal(mostSpecific('<A>', '<B>[]'), '<B>[]')
assert.equal(mostSpecific('<A>', 'number'), 'number')
assert.equal(mostSpecific('<A>[]', 'number[]'), 'number[]')
assert.equal(mostSpecific('number', 'any'), 'number')
assert.equal(mostSpecific('<A>', 'any'), '<A>')
assert.equal(mostSpecific('`U`', '`EE`'), '`U`')

assert.deepEqual(getGraphTypeMapById(ID_SINGLE, _specs), {
  append: { input: { a: '<A>[]', b: '<A>' }, output: { a: '<A>[]' } },
})
assert.deepEqual(getSpecTypeInterfaceById(ID_SINGLE, _specs), {
  input: { a: '<A>' },
  output: { '[a]': '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_TAG, _specs), {
  input: { k: 'string', v: 'any' },
  output: { kv: 'object' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_WAIT_ALL_2, _specs), {
  input: { a: '<A>', b: '<B>' },
  output: { a: '<A>', b: '<B>' },
})

assert.deepEqual(getGraphTypeMapById(ID_MERGE_AB, _specs), {
  deepmerge: {
    input: { a: 'object', b: 'object' },
    output: { ab: 'object' },
  },
  tag0: { input: { k: 'string', v: 'any' }, output: { kv: 'object' } },
  tag1: { input: { k: 'string', v: 'any' }, output: { kv: 'object' } },
})
assert.deepEqual(getSpecTypeInterfaceById(ID_MERGE_AB, _specs), {
  input: { a: 'any', b: 'any' },
  output: { ab: 'object' },
})

assert.deepEqual(getGraphTypeMapById(ID_CONSTANT_ONE, _specs), {
  identity: { input: { a: 'number' }, output: { a: 'number' } },
})
assert.deepEqual(getSpecTypeInterfaceById(ID_CONSTANT_ONE, _specs), {
  input: {},
  output: { 1: 'number' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_INCREMENT, _specs), {
  input: { a: 'number' },
  output: { 'a + 1': 'number' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_LAST_INDEX, _specs), {
  input: { a: '<A>[]' },
  output: { last: 'number' },
})

const cache = {}
assert.deepEqual(getSpecTypeInterfaceById(ID_LOOP_INCREMENT, _specs, cache), {
  input: { init: 'number', test: 'boolean' },
  output: { local: 'number', current: 'number', final: 'number' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_CONCAT_3_0, _specs), {
  input: { a: 'string', b: 'string', c: 'string' },
  output: { abc: 'string' },
})

// assert.deepEqual(getSpecTypeInterfaceById(ID_CONCAT_3, _specs), {
//   input: { a: '<A>[]', b: '<A>[]', c: '<A>[]' },
//   output: { abc: '<A>[]' },
// })

assert.deepEqual(getGraphTypeMapById(ID_SWAP, _specs), {
  set0: {
    input: { a: '<A>[]', v: '<A>', i: 'number' },
    output: { a: '<A>[]' },
  },
  set1: {
    input: { a: '<A>[]', v: '<A>', i: 'number' },
    output: { a: '<A>[]' },
  },
  at0: { input: { a: '<A>[]', i: 'number' }, output: { 'a[i]': '<A>' } },
  at1: { input: { a: '<A>[]', i: 'number' }, output: { 'a[i]': '<A>' } },
})
assert.deepEqual(getSpecTypeInterfaceById(ID_SWAP, _specs), {
  input: { a: '<A>[]', i: 'number', j: 'number' },
  output: { a: '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_RANDOM_NATURAL_LTE, _specs), {
  input: { max: 'number' },
  output: { i: 'number' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_RANDOM_BIT, _specs), {
  input: { any: 'any' },
  output: { bit: 'number' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_ARRAY_BUILDER_FROM, _specs), {
  input: { init: '<A>[]', a: '<A>', test: 'boolean' },
  output: {
    acc: '<A>[]',
    'a[]': '<A>[]',
    local: '<A>[]',
  },
})

assert.deepEqual(_getSpecTypeInterfaceById(ID_ARRAY_BUILDER_FROM, _specs), {
  input: {
    a: {
      value: '<A>',
      type: 'generic',
      children: [],
    },
    test: {
      value: 'boolean',
      type: 'boolean',
      children: [],
    },
    init: {
      value: '<A>[]',
      type: 'array expression',
      children: [
        {
          value: '<A>',
          type: 'generic',
          children: [],
        },
      ],
    },
  },
  output: {
    acc: {
      value: '<A>[]',
      type: 'array expression',
      children: [
        {
          value: '<A>',
          type: 'generic',
          children: [],
        },
      ],
    },
    'a[]': {
      value: '<A>[]',
      type: 'array expression',
      children: [
        {
          value: '<A>',
          type: 'generic',
          children: [],
        },
      ],
    },
    local: {
      value: '<A>[]',
      type: 'array expression',
      children: [
        {
          value: '<A>',
          type: 'generic',
          children: [],
        },
      ],
    },
  },
})

assert.deepEqual(_getGraphTypeMapById(ID_N_ARRAY_BUILDER_FROM, _specs), {
  lengthlessthan: {
    input: {
      a: {
        value: '<A>[]',
        type: 'array expression',
        children: [{ value: '<A>', type: 'generic', children: [] }],
      },
      b: { value: 'number', type: 'number', children: [] },
    },
    output: { test: { value: 'boolean', type: 'boolean', children: [] } },
  },
  arraybuilderfrom: {
    input: {
      a: { value: '<A>', type: 'generic', children: [] },
      test: { value: 'boolean', type: 'boolean', children: [] },
      init: {
        value: '<A>[]',
        type: 'array expression',
        children: [{ value: '<A>', type: 'generic', children: [] }],
      },
    },
    output: {
      acc: {
        value: '<A>[]',
        type: 'array expression',
        children: [{ value: '<A>', type: 'generic', children: [] }],
      },
      'a[]': {
        value: '<A>[]',
        type: 'array expression',
        children: [{ value: '<A>', type: 'generic', children: [] }],
      },
      local: {
        value: '<A>[]',
        type: 'array expression',
        children: [{ value: '<A>', type: 'generic', children: [] }],
      },
    },
  },
  looprepeat: {
    input: {
      init: { value: 'number', type: 'number', children: [] },
      test: { value: 'boolean', type: 'boolean', children: [] },
    },
    output: {
      local: { value: 'number', type: 'number', children: [] },
      current: { value: 'number', type: 'number', children: [] },
      final: { value: 'number', type: 'number', children: [] },
    },
  },
})

assert.deepEqual(_getGraphTypeMapById(ID_N_ARRAY_BUILDER, _specs), {
  buildarrayfrom: {
    input: {
      a: { value: '<A>', type: TreeNodeType.Generic, children: [] },
      from: {
        value: '<A>[]',
        type: TreeNodeType.ArrayExpression,
        children: [{ value: '<A>', type: TreeNodeType.Generic, children: [] }],
      },
      n: { value: 'number', type: TreeNodeType.Number, children: [] },
    },
    output: {
      'a[]': {
        value: '<A>[]',
        type: TreeNodeType.ArrayExpression,
        children: [{ value: '<A>', type: TreeNodeType.Generic, children: [] }],
      },
      test: { value: 'boolean', type: TreeNodeType.Boolean, children: [] },
      acc: {
        value: '<A>[]',
        type: TreeNodeType.ArrayExpression,
        children: [{ value: '<A>', type: TreeNodeType.Generic, children: [] }],
      },
    },
  },
})

assert.deepEqual(getGraphTypeMapById(ID_N_ARRAY_BUILDER, _specs), {
  buildarrayfrom: {
    input: { n: 'number', from: '<A>[]', a: '<A>' },
    output: { 'a[]': '<A>[]', test: 'boolean', acc: '<A>[]' },
  },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_N_ARRAY_BUILDER_FROM, _specs), {
  input: { n: 'number', from: '<A>[]', a: '<A>' },
  output: { 'a[]': '<A>[]', test: 'boolean', acc: '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_RANDOM_BIT_ARRAY, _specs), {
  input: { n: 'number' },
  output: { a: 'number[]' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_RANDOM_BIT_MATRIX, _specs), {
  input: { n: 'number' },
  output: { a: 'number[][]' },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_RANGE_ARRAY, _specs), {
  input: { n: 'number' },
  output: { a: 'number[]' },
})

assert.deepEqual(
  getGraphTypeMap(
    {
      name: UNTITLED,
      units: {
        state: { id: 'c899b675-c3c4-428e-b548-b228305c0302' },
      },
      merges: {},
      inputs: {},
      outputs: {},
      metadata: { icon: null, description: '' },
    },
    _specs
  ),
  {
    state: {
      input: { init: '<A>', done: 'any' },
      output: { data: '`V<A>`' },
    },
  }
)

assert.deepEqual(
  getGraphTypeMap(
    {
      name: UNTITLED,
      units: {
        id: { id: '260d774e-bc89-4027-aa92-cb1985fb312b' },
        id0: { id: '260d774e-bc89-4027-aa92-cb1985fb312b' },
        id1: { id: '260d774e-bc89-4027-aa92-cb1985fb312b' },
      },
      merges: {
        0: {
          id: { output: { a: true } },
          id0: { input: { a: true } },
        },
      },
      inputs: {},
      outputs: {},
      metadata: { icon: null, description: '' },
    },
    _specs
  ),
  {
    id: {
      input: {
        a: '<A>',
      },
      output: {
        a: '<A>',
      },
    },
    id0: {
      input: {
        a: '<A>',
      },
      output: {
        a: '<A>',
      },
    },
    id1: {
      input: {
        a: '<B>',
      },
      output: {
        a: '<B>',
      },
    },
  }
)

assert.deepEqual(getSpecTypeInterfaceById(ID_PICK_LESSER, _specs), {
  input: { a: 'number', b: 'number' },
  output: {
    'a < b': 'boolean',
    lesser: 'number',
  },
})

assert.deepEqual(getSpecTypeInterfaceById(ID_HEAD_OR_DEFAULT, _specs), {
  input: { a: '<A>[]', default: '<A>' },
  output: {
    a: '<A>[]',
    head: '<A>',
    empty: 'boolean',
  },
})
