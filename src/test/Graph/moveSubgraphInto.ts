import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog } from '../../debug'
import { ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { pod, system } from '../util/system'

const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'
const UNIT_ID_IDENTITY_1 = 'identity1'

const composition0 = new Graph<{ number: number }, { sum: number }>(
  {
    units: {
      [UNIT_ID_EMTPY]: {
        id: ID_EMPTY,
      },
      [UNIT_ID_IDENTITY]: {
        id: ID_IDENTITY,
      },
      [UNIT_ID_IDENTITY_0]: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      0: {
        [UNIT_ID_IDENTITY]: {
          output: {
            a: true,
          },
        },
        [UNIT_ID_IDENTITY_0]: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  system,
  pod
)

// true && watchUnitAndLog(composition0)
true && watchGraphAndLog(composition0)

composition0.play()

const empty0 = composition0.refUnit(UNIT_ID_EMTPY) as Graph

composition0.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [],
    plug: [],
  },
  { merge: {}, link: {}, unit: {} },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition0.getUnitCount(), 3)
assert.equal(composition0.getMergeCount(), 1)

assert.equal(empty0.getUnitCount(), 0)
assert.equal(empty0.getInputCount(), 0)
assert.equal(empty0.getOutputCount(), 0)

const composition1 = new Graph<{ number: number }, { sum: number }>(
  {
    units: {
      [UNIT_ID_EMTPY]: {
        id: ID_EMPTY,
      },
      [UNIT_ID_IDENTITY]: {
        id: ID_IDENTITY,
      },
      [UNIT_ID_IDENTITY_0]: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      0: {
        [UNIT_ID_IDENTITY]: {
          output: {
            a: true,
          },
        },
        [UNIT_ID_IDENTITY_0]: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  system,
  pod
)

// true && watchUnitAndLog(composition1)
true && watchGraphAndLog(composition1)

composition1.play()

const empty1 = composition1.refUnit(UNIT_ID_EMTPY) as Graph

composition1.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: ['0'],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: {},
    },
    [UNIT_ID_IDENTITY_0]: {
      input: {},
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition1.getUnitCount(), 1)
assert.equal(composition1.getMergeCount(), 0)

assert.equal(empty1.getUnitCount(), 2)
assert.equal(empty1.getInputCount(), 1)
assert.equal(empty1.getOutputCount(), 1)

assert(empty1.hasInputNamed('a'))
assert(empty1.hasOutputNamed('a'))

const composition2 = new Graph<{ number: number }, { sum: number }>(
  {
    units: {
      [UNIT_ID_EMTPY]: {
        id: ID_EMPTY,
      },
      [UNIT_ID_IDENTITY]: {
        id: ID_IDENTITY,
      },
      [UNIT_ID_IDENTITY_0]: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      0: {
        [UNIT_ID_IDENTITY]: {
          output: {
            a: true,
          },
        },
        [UNIT_ID_IDENTITY_0]: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  system,
  pod
)

// true && watchUnitAndLog(composition2)
true && watchGraphAndLog(composition2)

composition2.play()

const empty2 = composition2.refUnit(UNIT_ID_EMTPY) as Graph

composition2.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a0', subPinId: '0' } },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a0', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition2.getUnitCount(), 1)
assert.equal(composition2.getMergeCount(), 1)

assert.equal(empty2.getUnitCount(), 2)
assert.equal(empty2.getInputCount(), 2)
assert.equal(empty2.getOutputCount(), 2)

const composition3 = new Graph<{ number: number }, { sum: number }>(
  {
    units: {
      [UNIT_ID_EMTPY]: {
        id: ID_EMPTY,
      },
      [UNIT_ID_IDENTITY]: {
        id: ID_IDENTITY,
      },
      [UNIT_ID_IDENTITY_0]: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      0: {
        [UNIT_ID_IDENTITY]: {
          output: {
            a: true,
          },
        },
        [UNIT_ID_IDENTITY_0]: {
          input: {
            a: true,
          },
        },
      },
    },
    inputs: {
      a: {
        plug: {
          0: {
            unitId: UNIT_ID_IDENTITY,
            pinId: 'a',
          },
        },
      },
    },
  },
  {},
  system,
  pod
)

// true && watchUnitAndLog(composition3)
true && watchGraphAndLog(composition3)

composition3.play()

const empty3 = composition3.refUnit(UNIT_ID_EMTPY) as Graph

composition3.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a0', subPinId: '0' } },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a0', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition3.getUnitCount(), 1)
assert.equal(composition3.getMergeCount(), 1)

assert.equal(empty3.getUnitCount(), 2)
assert.equal(empty3.getInputCount(), 2)
assert.equal(empty3.getOutputCount(), 2)

assert.deepEqual(composition3.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_EMTPY,
      pinId: 'a',
    },
  },
})

const composition4 = new Graph<{ number: number }, { sum: number }>(
  {
    units: {
      [UNIT_ID_EMTPY]: {
        id: ID_EMPTY,
      },
      [UNIT_ID_IDENTITY]: {
        id: ID_IDENTITY,
      },
    },
    merges: {},
    inputs: {
      a: {
        plug: {
          0: {
            unitId: UNIT_ID_IDENTITY,
            pinId: 'a',
          },
        },
      },
    },
  },
  {},
  system,
  pod
)

// true && watchUnitAndLog(composition4)
true && watchGraphAndLog(composition4)

composition4.play()

const empty4 = composition4.refUnit(UNIT_ID_EMTPY) as Graph

composition4.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [
      { unitId: UNIT_ID_IDENTITY, type: 'input', pinId: 'a' },
      { unitId: UNIT_ID_IDENTITY, type: 'output', pinId: 'a' },
    ],
    unit: [UNIT_ID_IDENTITY],
    plug: [{ type: 'input', pinId: 'a', subPinId: '0' }],
  },
  {
    merge: {},
    link: {
      [UNIT_ID_IDENTITY]: {
        input: {
          a: {
            mergeId: null,
            oppositePinId: null,
          },
        },
        output: {
          a: {
            mergeId: null,
            oppositePinId: null,
          },
        },
      },
    },
    unit: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {
      a: {
        0: {
          unitId: UNIT_ID_IDENTITY,
          pinId: 'a',
        },
      },
    },
    output: {},
  },
  {},
  {}
)

assert.equal(composition4.getUnitCount(), 1)
assert.equal(composition4.getMergeCount(), 0)

assert.equal(empty4.getUnitCount(), 1)
assert.equal(empty4.getInputCount(), 1)
assert.equal(empty4.getOutputCount(), 0)

assert.deepEqual(empty4.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY,
      pinId: 'a',
    },
  },
})

const composition5 = new Graph<{ number: number }, { sum: number }>(
  {
    units: {
      [UNIT_ID_EMTPY]: {
        id: ID_EMPTY,
      },
      [UNIT_ID_IDENTITY]: {
        id: ID_IDENTITY,
      },
      [UNIT_ID_IDENTITY_0]: {
        id: ID_IDENTITY,
      },
      [UNIT_ID_IDENTITY_1]: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      0: {
        [UNIT_ID_IDENTITY]: {
          output: {
            a: true,
          },
        },
        [UNIT_ID_IDENTITY_0]: {
          input: {
            a: true,
          },
        },
      },
      1: {
        [UNIT_ID_IDENTITY_0]: {
          output: {
            a: true,
          },
        },
        [UNIT_ID_IDENTITY_1]: {
          input: {
            a: true,
          },
        },
      },
    },
    inputs: {},
  },
  {},
  system,
  pod
)

// true && watchUnitAndLog(composition5)
true && watchGraphAndLog(composition5)

composition5.play()

const empty5 = composition5.refUnit(UNIT_ID_EMTPY) as Graph

composition5.moveSubgraphInto(
  UNIT_ID_EMTPY,
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {
      [UNIT_ID_IDENTITY_0]: {
        input: {
          a: {
            mergeId: '0',
            oppositePinId: 'a',
          },
        },
        output: {
          a: {
            mergeId: '1',
            oppositePinId: 'a',
          },
        },
      },
    },
    unit: {},
  },
  {
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition5.getUnitCount(), 3)
assert.equal(composition5.getMergeCount(), 2)

assert.equal(empty5.getUnitCount(), 1)
assert.equal(empty5.getInputCount(), 1)
assert.equal(empty5.getOutputCount(), 1)

assert.deepEqual(empty5.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})
