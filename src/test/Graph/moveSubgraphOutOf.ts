import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_EMPTY, ID_IDENTITY, ID_RANDOM_COLOR_DIV } from '../../system/_ids'
import { system } from '../util/system'
import { uuid } from '../../util/id'

const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'
const UNIT_ID_IDENTITY_1 = 'identity1'
const UNIT_ID_DIV = 'div'
const UNIT_ID_DIV_0 = 'div0'

const UNIT_ID_RANDOM_COLOR_DIV = 'randomcolordiv'

const spec0 = system.newSpec({})

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec0,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.addUnitSpec(UNIT_ID_RANDOM_COLOR_DIV, {
  unit: { id: ID_RANDOM_COLOR_DIV },
})

composition0.moveSubgraphOutOf(
  UNIT_ID_RANDOM_COLOR_DIV,
  uuid(),
  {
    merge: [],
    link: [],
    unit: ['div'],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {
      ['div']: 'div',
    },
    plug: {},
  },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition0.getUnitCount(), 2)

const spec1 = system.newSpec({
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
})

const composition1 = new Graph<{ number: number }, { sum: number }>(
  spec1,
  {},
  system
)

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.moveSubgraphInto(
  UNIT_ID_EMTPY,
  uuid(),
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
            mergeId: null,
            oppositePinId: null,
          },
        },
      },
    },
    unit: {
      [UNIT_ID_IDENTITY_0]: UNIT_ID_IDENTITY_0,
    },
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY_0]: {
      input: {
        a: {
          pinId: 'a',
          subPinId: '0',
          mergeId: '0',
          merge: { [UNIT_ID_IDENTITY]: { output: { a: true } } },
        },
      },
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

assert.equal(composition1.getUnitCount(), 2)
assert.equal(composition1.getMergeCount(), 1)
assert.deepEqual(composition1.getMergeSpec('0'), {
  [UNIT_ID_EMTPY]: {
    input: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY]: {
    output: {
      a: true,
    },
  },
})

composition1.moveSubgraphOutOf(
  UNIT_ID_EMTPY,
  uuid(),
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
            mergeId: null,
            oppositePinId: null,
          },
        },
      },
    },
    unit: {
      [UNIT_ID_IDENTITY_0]: UNIT_ID_IDENTITY_0,
    },
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY_0]: {
      input: {
        a: {
          pinId: 'a',
          subPinId: '0',
          mergeId: '0',
          merge: { [UNIT_ID_IDENTITY]: { output: { a: true } } },
        },
      },
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

assert.equal(composition1.getUnitCount(), 3)
assert.equal(composition1.getMergeCount(), 1)

assert.deepEqual(composition1.getMergeSpec('0'), {
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
})

const spec2 = system.newSpec({
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
})

const composition2 = new Graph<{ number: number }, { sum: number }>(
  spec2,
  {},
  system
)

false && watchUnitAndLog(composition2)
false && watchGraphAndLog(composition2)

composition2.moveSubgraphInto(
  UNIT_ID_EMTPY,
  uuid(),
  {
    merge: [],
    link: [{ unitId: UNIT_ID_IDENTITY, type: 'input', pinId: 'a' }],
    unit: [],
    plug: [],
  },
  {
    merge: {},
    link: {
      [UNIT_ID_IDENTITY]: {
        input: {
          a: {
            mergeId: '1',
            oppositePinId: 'a',
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
    plug: {},
  },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition2.getUnitCount(), 3)
assert.equal(composition2.getMergeCount(), 2)
assert.deepEqual(composition2.getMergeSpec('1'), {
  [UNIT_ID_EMTPY]: {
    output: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY]: {
    input: {
      a: true,
    },
  },
})

composition2.moveSubgraphOutOf(
  UNIT_ID_EMTPY,
  uuid(),
  {
    merge: [],
    link: [{ unitId: UNIT_ID_IDENTITY, type: 'input', pinId: 'a' }],
    unit: [],
    plug: [],
  },
  {
    merge: {},
    link: {
      [UNIT_ID_IDENTITY]: {
        input: {
          a: {
            mergeId: '1',
            oppositePinId: 'a',
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
    plug: {},
  },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition2.getUnitCount(), 3)
assert.equal(composition2.getMergeCount(), 1)

const spec3 = system.newSpec({
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
})

const composition3 = new Graph<{ number: number }, { sum: number }>(
  spec3,
  {},
  system
)

false && watchUnitAndLog(composition3)
false && watchGraphAndLog(composition3)

composition3.moveSubgraphInto(
  UNIT_ID_EMTPY,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {},
  {
    '0': {
      input: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
      output: {
        mergeId: '3',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition3.getUnitCount(), 3)
assert.equal(composition3.getMergeCount(), 2)
assert.deepEqual(composition3.getMergeSpec('2'), {
  [UNIT_ID_EMTPY]: {
    input: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY]: {
    output: {
      a: true,
    },
  },
})
assert.deepEqual(composition3.getMergeSpec('3'), {
  [UNIT_ID_EMTPY]: {
    output: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY_0]: {
    input: {
      a: true,
    },
  },
})

const empty4 = composition3.getGraph(UNIT_ID_EMTPY)

assert.deepEqual(empty4.getMergeSpec('0'), {})
assert.deepEqual(empty4.getPlugSpec('input', 'a', '0'), {
  mergeId: '0',
})
assert.deepEqual(empty4.getPlugSpec('output', 'a', '0'), {
  mergeId: '0',
})

composition3.moveSubgraphOutOf(
  UNIT_ID_EMTPY,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {},
  {
    '0': {
      input: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
      output: {
        mergeId: '3',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition3.getUnitCount(), 3)
assert.equal(composition3.getMergeCount(), 1)
assert.deepEqual(composition3.getMergeSpec('0'), {
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
})

const spec4 = system.newSpec({
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
})

const composition4 = new Graph<{ number: number }, { sum: number }>(
  spec4,
  {},
  system
)

false && watchUnitAndLog(composition4)
false && watchGraphAndLog(composition4)

composition4.moveSubgraphInto(
  UNIT_ID_EMTPY,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {},
  {
    '0': {
      input: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
      output: {
        mergeId: '3',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition4.getUnitCount(), 3)
assert.equal(composition4.getMergeCount(), 2)
assert.deepEqual(composition4.getMergeSpec('2'), {
  [UNIT_ID_EMTPY]: {
    input: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY]: {
    output: {
      a: true,
    },
  },
})
assert.deepEqual(composition4.getMergeSpec('3'), {
  [UNIT_ID_EMTPY]: {
    output: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY_0]: {
    input: {
      a: true,
    },
  },
})

const empty3 = composition4.getGraph(UNIT_ID_EMTPY)

assert.deepEqual(empty3.getMergeSpec('0'), {})
assert.deepEqual(empty3.getPlugSpec('input', 'a', '0'), {
  mergeId: '0',
})
assert.deepEqual(empty3.getPlugSpec('output', 'a', '0'), {
  mergeId: '0',
})

composition4.moveSubgraphOutOf(
  UNIT_ID_EMTPY,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {},
  {
    '0': {
      input: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
      output: {
        mergeId: '3',
        pinId: 'a',
        subPinSpec: {
          mergeId: '0',
        },
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {}
)

assert.equal(composition4.getUnitCount(), 3)
assert.equal(composition4.getMergeCount(), 1)
assert.deepEqual(composition4.getMergeSpec('0'), {
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
})

const spec5 = system.newSpec({
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
})

const composition5 = new Graph<{ number: number }, { sum: number }>(
  spec5,
  {},
  system
)

false && watchUnitAndLog(composition5)
false && watchGraphAndLog(composition5)

composition5.moveSubgraphInto(
  UNIT_ID_EMTPY,
  uuid(),
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
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a0', subPinId: '0', mergeId: '0' } },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a0', subPinId: '0', mergeId: '0' } },
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

assert.equal(composition5.getUnitCount(), 1)
assert.equal(composition5.getMergeCount(), 1)

assert.deepEqual(composition5.getPlugSpec('input', 'a', '0'), {
  unitId: 'empty',
  pinId: 'a',
})

const empty5 = composition5.getGraph(UNIT_ID_EMTPY)

composition5.moveSubgraphOutOf(
  UNIT_ID_EMTPY,
  uuid(),
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
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a', subPinId: '0' } },
      output: { a: { pinId: 'a0', subPinId: '0', mergeId: '0' } },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: { a: { pinId: 'a0', subPinId: '0', mergeId: '0' } },
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
assert.equal(composition5.getMergeCount(), 1)
assert.deepEqual(composition5.getMergeSpec('0'), {
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
})
assert.deepEqual(composition5.getPlugSpec('input', 'a', '0'), {
  unitId: 'identity',
  pinId: 'a',
})
