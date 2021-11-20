import * as assert from 'assert'
import { UNTITLED } from '../../constant/STRING'
import { TreeNodeType } from '../../spec/parser'
import {
  getGraphTypeMap,
  getGraphTypeMapByPath,
  getSpecTypeInterfaceByPath,
  moreSpecific,
  _getGraphTypeMapByPath,
  _getSpecTypeInterfaceByPath,
} from '../../spec/type'
import __specs from '../../system/_specs'
import {
  ID_ARRAY_BUILDER_FROM,
  ID_ARRAY_CONCAT_3,
  ID_ARRAY_SWAP,
  ID_HEAD_OR_DEFAULT,
  ID_INCREMENT,
  ID_LAST_INDEX,
  ID_LOOP_INCREMENT,
  ID_MERGE_AB,
  ID_MERGE_SORT,
  ID_N_ARRAY_BUILDER,
  ID_N_ARRAY_BUILDER_FROM,
  ID_ONE,
  ID_PICK_LESSER,
  ID_PRIORITY_HEAD,
  ID_PRIORITY_MERGE,
  ID_PRIORITY_MERGE_FROM,
  ID_RANDOM_BIT,
  ID_RANDOM_BIT_ARRAY,
  ID_RANDOM_BIT_MATRIX,
  ID_RANDOM_NATURAL_LTE,
  ID_RANGE_ARRAY,
  ID_SHUFFLE_TO_REC,
  ID_SINGLE,
  ID_STRING_CONCAT_3,
  ID_TAG,
  ID_WAIT_ALL_2,
} from './id'

assert.equal(moreSpecific('<A>', '<B>'), '<A>')
assert.equal(moreSpecific('<B>', '<A>'), '<A>')
assert.equal(moreSpecific('<A>', '<B>[]'), '<B>[]')
assert.equal(moreSpecific('<A>', 'number'), 'number')
assert.equal(moreSpecific('<A>[]', 'number[]'), 'number[]')
assert.equal(moreSpecific('number', 'any'), 'number')
assert.equal(moreSpecific('<A>', 'any'), '<A>')

assert.deepEqual(getGraphTypeMapByPath(ID_SINGLE, __specs), {
  append: { input: { a: '<A>[]', b: '<A>' }, output: { a: '<A>[]' } },
})
assert.deepEqual(getSpecTypeInterfaceByPath(ID_SINGLE, __specs), {
  input: { a: '<A>' },
  output: { '[a]': '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_TAG, __specs), {
  input: { k: 'number|string', v: 'any' },
  output: { kv: 'object' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_WAIT_ALL_2, __specs), {
  input: { a: '<A>', b: '<B>' },
  output: { a: '<A>', b: '<B>' },
})

assert.deepEqual(getGraphTypeMapByPath(ID_MERGE_AB, __specs), {
  deepmerge: {
    input: { a: 'object', b: 'object' },
    output: { ab: 'object' },
  },
  tag0: { input: { k: 'number|string', v: 'any' }, output: { kv: 'object' } },
  tag1: { input: { k: 'number|string', v: 'any' }, output: { kv: 'object' } },
})
assert.deepEqual(getSpecTypeInterfaceByPath(ID_MERGE_AB, __specs), {
  input: { a: 'any', b: 'any' },
  output: { ab: 'object' },
})
// TODO
// assert.deepEqual(getSpecTypeInterfaceByPath(MERGE_AB, __specs), {
//   input: { a: '<A>', b: '<B>' },
//   output: { ab: '<A>&<B>' },
// })

assert.deepEqual(getGraphTypeMapByPath(ID_ONE, __specs), {
  identity: { input: { a: 'number' }, output: { a: 'number' } },
})
assert.deepEqual(getSpecTypeInterfaceByPath(ID_ONE, __specs), {
  input: {},
  output: { 1: 'number' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_INCREMENT, __specs), {
  input: { a: 'number' },
  output: { 'a + 1': 'number' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_LAST_INDEX, __specs), {
  input: { a: '<A>[]' },
  output: { last: 'number' },
})

const cache = {}
assert.deepEqual(
  getSpecTypeInterfaceByPath(ID_LOOP_INCREMENT, __specs, cache),
  {
    input: { init: 'number', test: 'boolean' },
    output: { local: 'number', current: 'number', final: 'number' },
  }
)
// console.log(cache)

assert.deepEqual(getSpecTypeInterfaceByPath(ID_STRING_CONCAT_3, __specs), {
  input: { a: 'string', b: 'string', c: 'string' },
  output: { abc: 'string' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_ARRAY_CONCAT_3, __specs), {
  input: { a: '<A>[]', b: '<A>[]', c: '<A>[]' },
  output: { abc: '<A>[]' },
})

assert.deepEqual(getGraphTypeMapByPath(ID_ARRAY_SWAP, __specs), {
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
assert.deepEqual(getSpecTypeInterfaceByPath(ID_ARRAY_SWAP, __specs), {
  input: { a: '<A>[]', i: 'number', j: 'number' },
  output: { a: '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_RANDOM_NATURAL_LTE, __specs), {
  input: { max: 'number' },
  output: { i: 'number' },
})

assert.deepEqual(getGraphTypeMapByPath(ID_SHUFFLE_TO_REC, __specs), {
  greaterthan: {
    input: { a: 'number', b: 'number' },
    output: { 'a > b': 'boolean' },
  },
  randomnaturallte: {
    input: { max: 'number' },
    output: { i: 'number' },
  },
  if: {
    input: { a: 'number', b: 'boolean' },
    output: { 'a if b': 'number' },
  },
  swap: {
    input: { a: '<A>[]', i: 'number', j: 'number' },
    output: { a: '<A>[]' },
  },
  decrement: {
    input: { a: 'number' },
    output: { 'a - 1': 'number' },
  },
  shuffletorec: {
    input: { a: '<A>[]', to: 'number' },
    output: { a: '<A>[]' },
  },
  ifelse: {
    input: {
      a: '<A>[]',
      b: 'boolean',
    },
    output: {
      if: '<A>[]',
      else: '<A>[]',
    },
  },
})
assert.deepEqual(getSpecTypeInterfaceByPath(ID_SHUFFLE_TO_REC, __specs), {
  input: { a: '<A>[]', to: 'number' },
  output: { a: '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_RANDOM_BIT, __specs), {
  input: { any: 'any' },
  output: { bit: 'number' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_ARRAY_BUILDER_FROM, __specs), {
  input: { init: '<A>[]', a: '<A>', test: 'boolean' },
  output: {
    acc: '<A>[]',
    'a[]': '<A>[]',
    local: '<A>[]',
  },
})

assert.deepEqual(_getSpecTypeInterfaceByPath(ID_ARRAY_BUILDER_FROM, __specs), {
  input: {
    a: {
      value: '<A>',
      type: 2,
      children: [],
    },
    test: {
      value: 'boolean',
      type: 12,
      children: [],
    },
    init: {
      value: '<A>[]',
      type: 5,
      children: [
        {
          value: '<A>',
          type: 2,
          children: [],
        },
      ],
    },
  },
  output: {
    acc: {
      value: '<A>[]',
      type: 5,
      children: [
        {
          value: '<A>',
          type: 2,
          children: [],
        },
      ],
    },
    'a[]': {
      value: '<A>[]',
      type: 5,
      children: [
        {
          value: '<A>',
          type: 2,
          children: [],
        },
      ],
    },
    local: {
      value: '<A>[]',
      type: 5,
      children: [
        {
          value: '<A>',
          type: 2,
          children: [],
        },
      ],
    },
  },
})

assert.deepEqual(_getGraphTypeMapByPath(ID_N_ARRAY_BUILDER_FROM, __specs), {
  lengthlessthan: {
    input: {
      a: {
        value: '<A>[]',
        type: 5,
        children: [{ value: '<A>', type: 2, children: [] }],
      },
      b: { value: 'number', type: 11, children: [] },
    },
    output: { true: { value: 'boolean', type: 12, children: [] } },
  },
  arraybuilderfrom: {
    input: {
      a: { value: '<A>', type: 2, children: [] },
      test: { value: 'boolean', type: 12, children: [] },
      init: {
        value: '<A>[]',
        type: 5,
        children: [{ value: '<A>', type: 2, children: [] }],
      },
    },
    output: {
      acc: {
        value: '<A>[]',
        type: 5,
        children: [{ value: '<A>', type: 2, children: [] }],
      },
      'a[]': {
        value: '<A>[]',
        type: 5,
        children: [{ value: '<A>', type: 2, children: [] }],
      },
      local: {
        value: '<A>[]',
        type: 5,
        children: [{ value: '<A>', type: 2, children: [] }],
      },
    },
  },
  looprepeat: {
    input: {
      init: { value: 'number', type: 11, children: [] },
      test: { value: 'boolean', type: 12, children: [] },
    },
    output: {
      local: { value: 'number', type: 11, children: [] },
      current: { value: 'number', type: 11, children: [] },
      final: { value: 'number', type: 11, children: [] },
    },
  },
})

assert.deepEqual(_getGraphTypeMapByPath(ID_N_ARRAY_BUILDER, __specs), {
  buildarrayfrom: {
    input: {
      n: { value: 'number', type: TreeNodeType.Number, children: [] },
      from: {
        value: '<A>[]',
        type: TreeNodeType.ArrayExpression,
        children: [{ value: '<A>', type: TreeNodeType.Generic, children: [] }],
      },
      a: { value: '<A>', type: TreeNodeType.Generic, children: [] },
    },
    output: {
      'a[]': {
        value: '<A>[]',
        type: TreeNodeType.ArrayExpression,
        children: [{ value: '<A>', type: TreeNodeType.Generic, children: [] }],
      },
    },
  },
})

assert.deepEqual(getGraphTypeMapByPath(ID_N_ARRAY_BUILDER, __specs), {
  buildarrayfrom: {
    input: { n: 'number', from: '<A>[]', a: '<A>' },
    output: { 'a[]': '<A>[]' },
  },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_N_ARRAY_BUILDER_FROM, __specs), {
  input: { n: 'number', from: '<A>[]', a: '<A>' },
  output: { 'a[]': '<A>[]' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_RANDOM_BIT_ARRAY, __specs), {
  input: { n: 'number' },
  output: { a: 'number[]' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_RANDOM_BIT_MATRIX, __specs), {
  input: { n: 'number' },
  output: { a: 'number[][]' },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_RANGE_ARRAY, __specs), {
  input: { n: 'number' },
  output: { a: 'number[]' },
})

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
        cmktdoc: {
          id: { output: { a: true } },
          id0: { input: { a: true } },
        },
      },
      inputs: {},
      outputs: {},
      metadata: { icon: null, description: '' },
    },
    __specs
  ),
  {
    id: {
      input: { a: '<A>' },
      output: { a: '<A>' },
    },
    id0: {
      input: { a: '<A>' },
      output: { a: '<A>' },
    },
    id1: { input: { a: '<A>' }, output: { a: '<A>' } },
  }
)

assert.deepEqual(getSpecTypeInterfaceByPath(ID_PICK_LESSER, __specs), {
  input: { a: 'number', b: 'number' },
  output: {
    'a < b': 'boolean',
    lesser: 'number',
  },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_HEAD_OR_DEFAULT, __specs), {
  input: { a: '<A>[]', default: '<A>' },
  output: {
    a: '<A>[]',
    head: '<A>',
    empty: 'boolean',
  },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_PRIORITY_HEAD, __specs), {
  input: { a: 'number[]', b: 'number[]' },
  output: {
    head: 'number',
    a: 'number[]',
    b: 'number[]',
  },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_PRIORITY_MERGE_FROM, __specs), {
  input: { a: 'number[]', b: 'number[]', from: 'number[]' },
  output: {
    ab: 'number[]',
  },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_PRIORITY_MERGE, __specs), {
  input: { a: 'number[]', b: 'number[]' },
  output: {
    ab: 'number[]',
  },
})

assert.deepEqual(getSpecTypeInterfaceByPath(ID_MERGE_SORT, __specs), {
  input: { a: 'number[]' },
  output: {
    a: 'number[]',
  },
})

// TODO
// assert.deepEqual(getGraphTypeMapByPath(PROP_PATH, __specs), {
//   if: {
//     input: {
//       a: 'string[]',
//       b: 'boolean',
//     },
//     output: {
//       'a if b': 'string[]',
//     },
//   },
//   ifelse: {
//     input: {
//       a: 'object',
//       b: 'boolean',
//     },
//     output: {
//       if: 'object',
//       else: 'object',
//     },
//   },
//   lengthgt: {
//     input: {
//       a: 'string[]',
//       b: 'number',
//     },
//     output: {
//       true: 'boolean',
//     },
//   },
//   head: {
//     input: {
//       a: 'string[]',
//     },
//     output: {
//       a: 'string[]',
//       head: 'string',
//     },
//   },
//   prop: {
//     input: {
//       obj: 'object',
//       key: 'string',
//     },
//     output: {
//       value: 'any',
//     },
//   },
//   proppath: {
//     input: {
//       path: 'string[]',
//       obj: 'object',
//     },
//     output: {
//       result: 'any',
//     },
//   },
// })

// TODO
// assert.deepEqual(getSpecTypeInterfaceByPath(PROP_PATH, __specs), {
//   input: { obj: 'object', path: '(number|string)[]' },
//   output: { result: 'any' },
// })

// TODO
// assert.deepEqual(getSpecTypeInterfaceByPath(LOOP_2, __specs), {
//   input: {
//     inita: '<A>',
//     initb: '<B>',
//     "next a": '<A>',
//     "next b": '<B>',
//     test: 'boolean',
//   },
//   output: { locala: '<A>', localb: '<B>', currenta: '<A>', currentb: '<B>' },
// })
