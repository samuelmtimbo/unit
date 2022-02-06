import * as assert from 'assert'
import {
  addMerge,
  addMerges,
  addPinToMerge,
  coverInputSet,
  coverOutputSet,
  exposeInputSet,
  exposeOutputSet,
  mergeMerges,
  removeMerge,
  removePinFromMerge,
  removeUnit,
  removeUnitMerges,
  removeUnitPinData,
  setMetadata,
  setPinSetFunctional,
  setPinSetName,
  setUnitInputConstant,
  setUnitMetadata,
  setUnitOutputIgnored,
  setUnitPinData,
} from '../../../spec/reducers/spec'
import { getMergePinCount } from '../../../spec/util'

assert.deepEqual(
  {
    name: '?',
    units: {
      qweer: {
        id: 'system/f/Identity',
      },
    },
    merges: {},
    inputs: {
      dfgte: {
        name: 'foo',
        pin: { '0': { unitId: 'qweer', pinId: 'tfgre' } },
      },
    },
    outputs: {},
    metadata: {
      icon: null,
      description: '',
    },
  },
  exposeInputSet(
    {
      id: 'dfgte',
      input: { name: 'foo', pin: { '0': { unitId: 'qweer', pinId: 'tfgre' } } },
    },
    {
      name: '?',
      units: {
        qweer: {
          id: 'system/f/Identity',
        },
      },
      merges: {},
      inputs: {},
      outputs: {},
      metadata: {
        icon: null,
        description: '',
      },
    }
  )
)

assert.deepEqual(
  {
    name: '?',
    units: {
      qweer: {
        id: 'system/f/Identity',
      },
    },
    merges: {},
    inputs: {},
    outputs: {},
    metadata: {
      icon: null,
      description: '',
    },
  },
  coverInputSet(
    { id: 'frtdk' },
    {
      name: '?',
      units: {
        qweer: {
          id: 'system/f/Identity',
        },
      },
      merges: {},
      inputs: {
        frtdk: { pin: { 0: { pinId: 'bar', unitId: 'qweer' } }, name: 'foo' },
      },
      outputs: {},
      metadata: {
        icon: null,
        description: '',
      },
    }
  )
)

assert.deepEqual(
  {
    name: '?',
    units: {
      qweer: {
        id: 'system/f/Identity',
      },
    },
    merges: {},
    inputs: {
      asdrw: { pin: { 0: { pinId: 'foo', unitId: 'qweer' } }, name: 'zaz' },
    },
    outputs: {},
    metadata: {
      icon: null,
      description: '',
    },
  },
  setPinSetName(
    { type: 'input', id: 'asdrw', name: 'zaz' },
    {
      name: '?',
      units: {
        qweer: {
          id: 'system/f/Identity',
        },
      },
      merges: {},
      inputs: {
        asdrw: { pin: { 0: { pinId: 'foo', unitId: 'qweer' } }, name: 'bar' },
      },
      outputs: {},
      metadata: {
        icon: null,
        description: '',
      },
    }
  )
)

assert.deepEqual(
  {
    name: '?',
    units: {
      qweer: {
        id: 'system/f/Identity',
      },
    },
    merges: {},
    inputs: {},
    outputs: {
      llkfd: { pin: { 0: { unitId: 'qwert', pinId: 'bar' } }, name: 'foo' },
    },
    metadata: {
      icon: null,
      description: '',
    },
  },
  exposeOutputSet(
    {
      id: 'llkfd',
      output: { pin: { 0: { unitId: 'qwert', pinId: 'bar' } }, name: 'foo' },
    },
    {
      name: '?',
      units: {
        qweer: {
          id: 'system/f/Identity',
        },
      },
      merges: {},
      inputs: {},
      outputs: {},
      metadata: {
        icon: null,
        description: '',
      },
    }
  )
)

assert.deepEqual(
  {
    name: '?',
    units: {
      qwert: {
        id: 'system/f/Identity',
      },
    },
    merges: {},
    inputs: {},
    outputs: {},
    metadata: {
      icon: null,
      description: '',
    },
  },
  coverOutputSet(
    { id: 'oriur' },
    {
      name: '?',
      units: {
        qwert: {
          id: 'system/f/Identity',
        },
      },
      merges: {},
      inputs: {},
      outputs: {
        oriur: { pin: { 0: { pinId: 'oriur', unitId: 'qwert' } }, name: 'foo' },
      },
      metadata: {
        icon: null,
        description: '',
      },
    }
  )
)

assert.deepEqual(
  {
    name: '?',
    units: {},
    merges: {},
    inputs: {},
    outputs: {
      gghdb: {
        pin: { 0: { pinId: 'foo', unitId: '0' } },
        name: 'zaz',
        functional: true,
      },
    },
    metadata: {
      icon: null,
      description: '',
    },
  },
  setPinSetFunctional(
    { type: 'output', pinId: 'gghdb', functional: true },
    {
      name: '?',
      units: {},
      merges: {},
      inputs: {},
      outputs: {
        gghdb: {
          pin: { 0: { pinId: 'foo', unitId: '0' } },
          name: 'zaz',
        },
      },
      metadata: {
        icon: null,
        description: '',
      },
    }
  )
)

assert.equal(
  getMergePinCount({
    if0: { input: { a: true }, output: { b: true } },
    if1: { input: { a: true } },
  }),
  3
)

assert.equal(
  getMergePinCount({
    if0: { input: { a: true } },
  }),
  1
)

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { unitId: 'if0', pinId: 'b' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  removeUnit(
    { id: 'not' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  )
)

// setUnitMetadata

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If', metadata: { rename: 'if true' } },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: { not: { output: { '!a': true } }, if1: { input: { b: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: 'branch', description: '' },
  },
  setUnitMetadata(
    { id: 'if0', path: ['rename'], value: 'if true' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: 'branch', description: '' },
    }
  ),
  'setUnitMetadata'
)

// setMetadata

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: { not: { output: { '!a': true } }, if1: { input: { b: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: 'branch', description: '' },
  },
  setMetadata(
    { path: ['metadata', 'icon'], value: 'branch' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '' },
    }
  ),
  'setMetadata'
)

// setUnitPinData

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If', input: { a: { data: 1 } } },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: { not: { output: { '!a': true } }, if1: { input: { b: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  setUnitPinData(
    { unitId: 'if0', type: 'input', pinId: 'a', data: 1 },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'setUnitPinData'
)

// removeUnitPinData

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If', input: { a: {} } },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: { not: { output: { '!a': true } }, if1: { input: { b: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  removeUnitPinData(
    { unitId: 'if0', type: 'input', pinId: 'a' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If', input: { a: { data: 1 } } },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'removeUnitPinData'
)

// setUnitInputConstant

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If', input: { a: { constant: true } } },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: { not: { output: { '!a': true } }, if1: { input: { b: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  setUnitInputConstant(
    { unitId: 'if0', pinId: 'a', constant: true },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'setUnitInputConstant'
)

// setUnitOutputIgnored

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If', output: { a: { ignored: true } } },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: { not: { output: { '!a': true } }, if1: { input: { b: true } } },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  setUnitOutputIgnored(
    { unitId: 'if0', pinId: 'a', ignored: true },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'setUnitOutputIgnored'
)

// addMerge

assert.deepEqual(
  {
    name: 'if a ≤ b',
    units: {
      lessthanequal: { id: 'system/f/comparisson/LessThanEqual' },
      greaterthan: { id: 'system/f/comparisson/GreaterThan' },
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
    },
    merges: {
      ttcas: {
        lessthanequal: { input: { b: true } },
        greaterthan: { input: { b: true } },
      },
      uzzat: {
        lessthanequal: { input: { a: true } },
        greaterthan: { input: { a: true } },
      },
    },
    inputs: {
      a: {
        name: 'a',
        pin: { 0: { mergeId: 'uzzat' } },
      },
    },
    outputs: {},
    metadata: { icon: null, description: '...' },
  },
  addMerge(
    {
      id: 'uzzat',
      merge: {
        lessthanequal: { input: { a: true } },
        greaterthan: { input: { a: true } },
      },
    },
    {
      name: 'if a ≤ b',
      units: {
        lessthanequal: { id: 'system/f/comparisson/LessThanEqual' },
        greaterthan: { id: 'system/f/comparisson/GreaterThan' },
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
      },
      merges: {
        ttcas: {
          lessthanequal: { input: { b: true } },
          greaterthan: { input: { b: true } },
        },
      },
      inputs: {
        a: {
          name: 'a',
          pin: {
            0: {
              unitId: 'lessthanequal',
              pinId: 'a',
            },
          },
        },
      },
      outputs: {},
      metadata: { icon: null, description: '...' },
    }
  ),
  'addMerge'
)

// addMerges

assert.deepEqual(
  {
    name: 'if else a ≤ b',
    units: {
      lessthanequal: { id: 'system/f/comparisson/LessThanEqual' },
      greaterthan: { id: 'system/f/comparisson/GreaterThan' },
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
    },
    merges: {
      myikn: {
        greaterthan: { input: { b: true } },
        lessthanequal: { input: { b: true } },
      },
      vuhxu: {
        greaterthan: { input: { a: true } },
        lessthanequal: { input: { a: true } },
        if1: { input: { a: true } },
        if0: { input: { a: true } },
      },
      snnit: {
        greaterthan: { output: { 'a > b': true } },
        if0: { input: { b: true } },
      },
      wahsl: {
        lessthanequal: { output: { 'a ≤ b': true } },
        if1: { input: { b: true } },
      },
    },
    inputs: {
      smtzy: { name: 'a', pin: { 0: { mergeId: 'vuhxu' } } },
      ajuwn: { name: 'b', pin: { 0: { mergeId: 'myikn' } } },
    },
    outputs: {
      gmmch: {
        name: 'a ≤ b ? a',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
      rewmg: {
        name: 'a > b ? a',
        pin: { 0: { unitId: 'if0', pinId: 'aifb' } },
      },
    },
    metadata: {
      icon: 'filter',
      description: 'forward `a` depending on `a ≤ b`',
    },
  },
  addMerges(
    {
      merges: {
        vuhxu: {
          if0: { input: { a: true } },
        },
        snnit: {
          greaterthan: { output: { 'a > b': true } },
          if0: { input: { b: true } },
        },
      },
    },
    {
      name: 'if else a ≤ b',
      units: {
        lessthanequal: { id: 'system/f/comparisson/LessThanEqual' },
        greaterthan: { id: 'system/f/comparisson/GreaterThan' },
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
      },
      merges: {
        myikn: {
          greaterthan: { input: { b: true } },
          lessthanequal: { input: { b: true } },
        },
        vuhxu: {
          greaterthan: { input: { a: true } },
          lessthanequal: { input: { a: true } },
          if1: { input: { a: true } },
        },
        wahsl: {
          lessthanequal: { output: { 'a ≤ b': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        smtzy: { name: 'a', pin: { 0: { mergeId: 'vuhxu' } } },
        ajuwn: { name: 'b', pin: { 0: { mergeId: 'myikn' } } },
      },
      outputs: {
        gmmch: {
          name: 'a ≤ b ? a',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
        rewmg: {
          name: 'a > b ? a',
          pin: { 0: { unitId: 'if0', pinId: 'aifb' } },
        },
      },
      metadata: {
        icon: 'filter',
        description: 'forward `a` depending on `a ≤ b`',
      },
    }
  ),
  'addMerges'
)

// removePinFromMerge

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: { if1: { input: { a: true } } },
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: {
        not: { output: { '!a': true } },
        if1: { input: { b: true } },
      },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  removePinFromMerge(
    { id: 'merge0', unitId: 'if0', type: 'input', pinId: 'a' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'removePinFromMerge'
)

// removePinFromMerge

assert.deepEqual(
  {
    name: 'range',
    units: {
      lte: { id: 'system/f/comparisson/LessThan' },
      increment: { id: 'core/common/Increment' },
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
      id0: { id: 'system/f/control/Identity' },
    },
    merges: {
      merge0: {
        increment: { output: { 'a + 1': true } },
        lte: { input: { a: true } },
      },
      merge1: {
        if0: { output: { aifb: true } },
        increment: { input: { a: true } },
      },
      merge2: {
        lte: { output: { 'a < b': true } },
        if0: { input: { b: true } },
        if1: { input: { b: true } },
      },
      merge3: {
        id0: { output: { a: true } },
        if1: { input: { a: true } },
        lte: { input: { b: true } },
      },
      merge4: {
        if1: { output: { aifb: true } },
        id0: { input: { a: true } },
      },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge3' } } },
    },
    outputs: { i: { name: 'i', pin: { 0: { mergeId: 'merge1' } } } },
    metadata: { icon: 'sort-numeric-down', description: '...' },
  },
  removePinFromMerge(
    { id: 'merge0', unitId: 'if0', type: 'input', pinId: 'a' },
    {
      name: 'range',
      units: {
        lte: { id: 'system/f/comparisson/LessThan' },
        increment: { id: 'core/common/Increment' },
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        id0: { id: 'system/f/control/Identity' },
      },
      merges: {
        merge0: {
          increment: { output: { 'a + 1': true } },
          if0: { input: { a: true } },
          lte: { input: { a: true } },
        },
        merge1: {
          if0: { output: { aifb: true } },
          increment: { input: { a: true } },
        },
        merge2: {
          lte: { output: { 'a < b': true } },
          if0: { input: { b: true } },
          if1: { input: { b: true } },
        },
        merge3: {
          id0: { output: { a: true } },
          if1: { input: { a: true } },
          lte: { input: { b: true } },
        },
        merge4: {
          if1: { output: { aifb: true } },
          id0: { input: { a: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge3' } } },
      },
      outputs: { i: { name: 'i', pin: { 0: { mergeId: 'merge1' } } } },
      metadata: { icon: 'sort-numeric-down', description: '...' },
    }
  ),
  'removePinFromMerge'
)

// removeMerge

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
      merge2: {
        not: { output: { '!a': true } },
        if1: { input: { b: true } },
      },
    },
    inputs: {
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  removeMerge(
    { id: 'merge0' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'removeMerge'
)

// removeUnitMerges

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge2: {
        not: { output: { '!a': true } },
        if1: { input: { b: true } },
      },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { unitId: 'if1', pinId: 'a' } } },
      b: { name: 'b', pin: { 0: { unitId: 'not', pinId: 'a' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  removeUnitMerges(
    { id: 'if0' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'removeUnitMerges'
)

// mergeMerges

assert.deepEqual(
  {
    name: 'if else',
    units: {
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
      not: { id: 'system/f/logic/Not' },
    },
    merges: {
      merge0: {
        if0: { input: { a: true, b: true } },
        if1: { input: { a: true } },
        not: { input: { a: true } },
      },
      merge2: {
        not: { output: { '!a': true } },
        if1: { input: { b: true } },
      },
    },
    inputs: {
      a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
      b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
    },
    outputs: {
      aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
      'a if not b': {
        name: 'a if not b',
        pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
      },
    },
    metadata: { icon: null, description: '...' },
  },
  mergeMerges(
    { a: 'merge0', b: 'merge1' },
    {
      name: 'if else',
      units: {
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
        not: { id: 'system/f/logic/Not' },
      },
      merges: {
        merge0: { if0: { input: { a: true } }, if1: { input: { a: true } } },
        merge1: { if0: { input: { b: true } }, not: { input: { a: true } } },
        merge2: {
          not: { output: { '!a': true } },
          if1: { input: { b: true } },
        },
      },
      inputs: {
        a: { name: 'a', pin: { 0: { mergeId: 'merge0' } } },
        b: { name: 'b', pin: { 0: { mergeId: 'merge1' } } },
      },
      outputs: {
        aifb: { name: 'aifb', pin: { 0: { unitId: 'if0', pinId: 'aifb' } } },
        'a if not b': {
          name: 'a if not b',
          pin: { 0: { unitId: 'if1', pinId: 'aifb' } },
        },
      },
      metadata: { icon: null, description: '...' },
    }
  ),
  'mergeMerges'
)

// addPinToMerge

assert.deepEqual(
  {
    name: 'if a ≤ b',
    units: {
      lessthanequal: { id: 'system/f/comparisson/LessThanEqual' },
      greaterthan: { id: 'system/f/comparisson/GreaterThan' },
      if0: { id: 'system/f/control/If' },
      if1: { id: 'system/f/control/If' },
    },
    merges: {
      ttcas: {
        lessthanequal: { input: { b: true } },
        greaterthan: { input: { b: true } },
      },
      uzzat: {
        lessthanequal: { input: { a: true } },
        greaterthan: { input: { a: true } },
        if0: { input: { a: true } },
      },
    },
    inputs: {},
    outputs: {},
    metadata: { icon: null, description: '...' },
  },
  addPinToMerge(
    { id: 'uzzat', unitId: 'if0', type: 'input', pinId: 'a' },
    {
      name: 'if a ≤ b',
      units: {
        lessthanequal: { id: 'system/f/comparisson/LessThanEqual' },
        greaterthan: { id: 'system/f/comparisson/GreaterThan' },
        if0: { id: 'system/f/control/If' },
        if1: { id: 'system/f/control/If' },
      },
      merges: {
        ttcas: {
          lessthanequal: { input: { b: true } },
          greaterthan: { input: { b: true } },
        },
        uzzat: {
          lessthanequal: { input: { a: true } },
          greaterthan: { input: { a: true } },
        },
      },
      inputs: {},
      outputs: {},
      metadata: { icon: null, description: '...' },
    }
  ),
  'addPinToMerge'
)
