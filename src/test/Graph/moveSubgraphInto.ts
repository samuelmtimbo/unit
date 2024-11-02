import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_DIV, ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { uuid } from '../../util/id'
import { system } from '../util/system'

const UNIT_ID_EMPTY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'
const UNIT_ID_IDENTITY_1 = 'identity1'
const UNIT_ID_DIV = 'div'
const UNIT_ID_DIV_0 = 'div0'

const spec0 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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

const composition0 = new Graph(spec0, {}, system)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

const empty0 = composition0.getUnit(UNIT_ID_EMPTY) as Graph

composition0.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: [],
    link: [],
    unit: [],
    plug: [],
  },
  { merge: {}, link: {}, unit: {}, plug: {} },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition0.getUnitCount(), 3)
assert.equal(composition0.getMergeCount(), 1)

assert.equal(empty0.getUnitCount(), 0)
assert.equal(empty0.getInputCount(), 0)
assert.equal(empty0.getOutputCount(), 0)

const spec1 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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

const composition1 = new Graph(spec1, {}, system)

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.play()

const empty1 = composition1.getUnit(UNIT_ID_EMPTY) as Graph

composition1.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
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
    plug: {},
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
  {},
  {},
  {}
)

assert.equal(composition1.getUnitCount(), 1)
assert.equal(composition1.getMergeCount(), 0)

assert.equal(empty1.getUnitCount(), 2)
assert.equal(empty1.getMergeCount(), 1)
assert.equal(empty1.getInputCount(), 1)
assert.equal(empty1.getOutputCount(), 1)

assert(empty1.hasInputNamed('a'))
assert(empty1.hasOutputNamed('a'))

assert.deepEqual(empty1.getExposedInputSpec('a'), {
  plug: {
    '0': {
      unitId: UNIT_ID_IDENTITY,
      pinId: 'a',
    },
  },
  ref: false,
})
assert.deepEqual(empty1.getExposedOutputSpec('a'), {
  plug: {
    '0': {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})
assert.deepEqual(empty1.getMergeSpec('0'), {
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

empty1.push('a', 0)

assert.equal(empty1.peakInput('a'), 0)
assert.equal(empty1.takeOutput('a'), 0)

const spec2 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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

const composition2 = new Graph(spec2, {}, system)

false && watchUnitAndLog(composition2)
false && watchGraphAndLog(composition2)

composition2.play()

const empty2 = composition2.getUnit(UNIT_ID_EMPTY) as Graph

composition2.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
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
  {},
  {},
  {}
)

assert.equal(composition2.getUnitCount(), 1)
assert.equal(composition2.getMergeCount(), 1)

assert.equal(empty2.getUnitCount(), 2)
assert.equal(empty2.getInputCount(), 2)
assert.equal(empty2.getOutputCount(), 2)

const spec3 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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

const composition3 = new Graph(spec3, {}, system)

false && watchUnitAndLog(composition3)
false && watchGraphAndLog(composition3)

composition3.play()

const empty3 = composition3.getUnit(UNIT_ID_EMPTY) as Graph

composition3.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
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
  {},
  {},
  {}
)

assert.equal(composition3.getUnitCount(), 1)
assert.equal(composition3.getMergeCount(), 1)

assert.equal(empty3.getUnitCount(), 2)
assert.equal(empty3.getInputCount(), 2)
assert.equal(empty3.getOutputCount(), 2)

assert.deepEqual(composition3.getMergeSpec('0'), {
  [UNIT_ID_EMPTY]: {
    input: {
      a0: true,
    },
    output: {
      a0: true,
    },
  },
})

assert.deepEqual(composition3.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_EMPTY,
      pinId: 'a',
    },
  },
})

const spec4 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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
      ref: false,
    },
  },
})

const composition4 = new Graph(spec4, {}, system)

false && watchUnitAndLog(composition4)
false && watchGraphAndLog(composition4)

composition4.play()

const empty4 = composition4.getUnit(UNIT_ID_EMPTY) as Graph

composition4.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
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
    plug: {},
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
  {},
  {},
  {}
)

assert.equal(composition4.getUnitCount(), 1)
assert.equal(composition4.getMergeCount(), 0)

assert.equal(empty4.getUnitCount(), 1)
assert.equal(empty4.getInputCount(), 1)
assert.equal(empty4.getOutputCount(), 0)

assert.deepEqual(empty4.getExposedPinSpec('input', 'a'), {
  defaultIgnored: undefined,
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY,
      pinId: 'a',
    },
  },
  ref: false,
})

const spec5 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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
})

const composition5 = new Graph(spec5, {}, system)

false && watchUnitAndLog(composition5)
false && watchGraphAndLog(composition5)

composition5.play()

const empty5 = composition5.getUnit(UNIT_ID_EMPTY) as Graph

composition5.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY_0]: {
      input: {
        a: {
          pinId: 'a',
          subPinId: '0',
          mergeId: '0',
          merge: {
            [UNIT_ID_IDENTITY_1]: {
              output: {
                a: true,
              },
            },
          },
        },
      },
      output: {
        a: {
          pinId: 'a',
          subPinId: '0',
          mergeId: '1',
          merge: {
            [UNIT_ID_IDENTITY]: {
              input: {
                a: true,
              },
            },
          },
        },
      },
    },
  },
  {},
  {
    input: {},
    output: {},
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition5.getUnitCount(), 3)
assert.equal(composition5.getMergeCount(), 2)
assert.deepEqual(composition5.getMergeSpec('0'), {
  [UNIT_ID_IDENTITY_1]: {
    output: {
      a: true,
    },
  },
  [UNIT_ID_EMPTY]: {
    input: {
      a: true,
    },
  },
})
assert.deepEqual(composition5.getMergeSpec('1'), {
  [UNIT_ID_IDENTITY]: {
    input: {
      a: true,
    },
  },
  [UNIT_ID_EMPTY]: {
    output: {
      a: true,
    },
  },
})

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

const spec6 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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
})

const composition6 = new Graph(spec6, {}, system)

false && watchUnitAndLog(composition6)
false && watchGraphAndLog(composition6)

composition6.play()

const empty6 = composition6.getUnit(UNIT_ID_EMPTY) as Graph

composition6.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: ['0', '1'],
    link: [],
    unit: [UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {
      '0': '0',
      '1': '1',
    },
    link: {},
    unit: {
      [UNIT_ID_IDENTITY_0]: UNIT_ID_IDENTITY_0,
    },
    plug: {},
  },
  {},
  {
    '0': {
      input: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {
          unitId: UNIT_ID_IDENTITY_0,
          pinId: 'a',
        },
      },
      output: {
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
    },
    1: {
      input: {
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
      output: {
        mergeId: '3',
        pinId: 'a',
        subPinSpec: {
          unitId: UNIT_ID_IDENTITY_0,
          pinId: 'a',
        },
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition6.getUnitCount(), 3)
assert.equal(composition6.getMergeCount(), 2)

assert.equal(empty6.getUnitCount(), 1)
assert.equal(empty6.getInputCount(), 1)
assert.equal(empty6.getOutputCount(), 1)
assert.equal(empty6.getOutputCount(), 1)

assert.deepEqual(empty6.getExposedPinSpec('input', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})
assert.deepEqual(empty6.getExposedPinSpec('output', 'a'), {
  plug: {
    0: {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})

composition6.setUnitInputData(UNIT_ID_IDENTITY, 'a', 1)

const spec7 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_DIV]: {
      id: ID_DIV,
    },
    [UNIT_ID_DIV_0]: {
      id: ID_DIV,
    },
  },
  merges: {},
  component: {
    subComponents: {
      [UNIT_ID_DIV]: {
        children: [UNIT_ID_DIV_0],
      },
      [UNIT_ID_DIV_0]: {},
    },
    children: [UNIT_ID_DIV],
  },
})

const composition7 = new Graph(spec7, {}, system)

false && watchUnitAndLog(composition7)
false && watchGraphAndLog(composition7)

composition7.play()

const empty7 = composition7.getUnit(UNIT_ID_EMPTY) as Graph

composition7.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: ['0', '1'],
    link: [],
    unit: [UNIT_ID_DIV, UNIT_ID_DIV_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {
      [UNIT_ID_DIV]: UNIT_ID_DIV,
      [UNIT_ID_DIV_0]: UNIT_ID_DIV_0,
    },
    plug: {},
  },
  {},
  {},
  {
    input: {},
    output: {},
  },
  {
    [UNIT_ID_DIV_0]: UNIT_ID_DIV,
  },
  {
    [UNIT_ID_DIV]: [UNIT_ID_DIV_0],
  },
  {},
  {}
)

assert.equal(composition7.getUnitCount(), 1)

assert.deepEqual(composition7.getComponentSpec(), {
  children: [],
  subComponents: {},
})

assert.equal(empty7.getUnitCount(), 2)

assert.deepEqual(empty7.getComponentSpec(), {
  subComponents: {
    [UNIT_ID_DIV]: {
      children: [UNIT_ID_DIV_0],
      childSlot: {
        [UNIT_ID_DIV_0]: 'default',
      },
    },
    [UNIT_ID_DIV_0]: {
      children: [],
    },
  },
  children: [UNIT_ID_DIV],
})

const spec8 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
      input: {
        a: {
          data: 'null',
        },
      },
    },
    [UNIT_ID_IDENTITY_0]: {
      id: ID_IDENTITY,
    },
  },
})

const composition8 = new Graph(spec8, {}, system)

false && watchUnitAndLog(composition8)
false && watchGraphAndLog(composition8)

composition8.play()

const empty8 = composition8.getUnit(UNIT_ID_EMPTY) as Graph

composition8.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: [],
    link: [{ unitId: UNIT_ID_IDENTITY, type: 'output', pinId: 'a' }],
    unit: [],
    plug: [],
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
            mergeId: '0',
            oppositePinId: 'a',
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
  {},
  {},
  {}
)

assert.equal(composition8.getUnitCount(), 3)

assert.equal(empty8.getUnitCount(), 0)

assert.deepEqual(empty8.getExposedInputSpec('a'), {
  plug: {
    '0': {},
  },
  ref: false,
})

assert.deepEqual(empty8.getPinData('input', 'a'), null)
assert.deepEqual(empty8.getPlug('input', 'a', '0').peak(), null)

const spec9 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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

const composition9 = new Graph(spec9, {}, system)

false && watchUnitAndLog(composition9)
false && watchGraphAndLog(composition9)

composition9.play()

const empty9 = composition9.getUnit(UNIT_ID_EMPTY) as Graph

composition9.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [UNIT_ID_IDENTITY_0],
    plug: [],
  },
  {
    merge: {},
    link: {},
    unit: {
      [UNIT_ID_IDENTITY_0]: UNIT_ID_IDENTITY_0,
    },
    plug: {},
  },
  {},
  {
    0: {
      input: {
        mergeId: '0',
        pinId: 'a',
        subPinSpec: { unitId: UNIT_ID_IDENTITY_0, pinId: 'a' },
      },
      output: {
        mergeId: null,
        pinId: null,
        subPinSpec: null,
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition9.getUnitCount(), 2)
assert.equal(composition9.getMergeCount(), 1)

assert.equal(empty9.getUnitCount(), 1)

assert.deepEqual(empty9.getExposedInputSpec('a'), {
  plug: {
    '0': {
      unitId: UNIT_ID_IDENTITY_0,
      pinId: 'a',
    },
  },
  ref: false,
})

assert.deepEqual(empty9.getMergeCount(), 0)

const spec10 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
})

const composition10 = new Graph(spec10, {}, system)

false && watchUnitAndLog(composition10)
false && watchGraphAndLog(composition10)

composition10.play()

const empty10 = composition10.getUnit(UNIT_ID_EMPTY) as Graph

composition10.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
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
        mergeId: '1',
        pinId: 'a',
        subPinSpec: {},
      },
      output: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {},
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition10.getUnitCount(), 3)
assert.equal(composition10.getMergeCount(), 2)

assert.deepEqual(composition10.getExposedInputSpec('a'), {
  plug: {
    '0': {
      mergeId: '1',
    },
  },
})

assert.equal(empty10.getUnitCount(), 0)

assert.deepEqual(empty10.getExposedInputSpec('a'), {
  plug: {
    '0': {
      mergeId: '0',
    },
  },
  ref: false,
})

assert.deepEqual(empty10.getMergeCount(), 1)

const spec11 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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
        input: {
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
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
})

const composition11 = new Graph(spec11, {}, system)

false && watchUnitAndLog(composition11)
false && watchGraphAndLog(composition11)

composition11.play()

const empty11 = composition11.getUnit(UNIT_ID_EMPTY) as Graph

composition11.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
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
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
      output: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {},
      },
    },
  },
  {
    input: {},
    output: {},
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition11.getUnitCount(), 3)
assert.equal(composition11.getMergeCount(), 1)

assert.deepEqual(composition11.getMergeSpec('2'), {
  [UNIT_ID_IDENTITY]: {
    input: {
      a: true,
    },
  },
  [UNIT_ID_IDENTITY_0]: {
    input: {
      a: true,
    },
  },
  [UNIT_ID_EMPTY]: {
    output: {
      a: true,
    },
  },
})

assert.deepEqual(composition11.getExposedOutputSpec('a'), {
  plug: {
    '0': {
      mergeId: '2',
    },
  },
})

assert.equal(empty11.getUnitCount(), 0)
assert.deepEqual(empty11.getMergeCount(), 0)

const spec12 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
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
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
})

const composition12 = new Graph(spec12, {}, system)

false && watchUnitAndLog(composition12)
false && watchGraphAndLog(composition12)

composition12.play()

const empty12 = composition12.getUnit(UNIT_ID_EMPTY) as Graph

composition12.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [UNIT_ID_IDENTITY, UNIT_ID_IDENTITY_0],
    plug: [
      { type: 'input', pinId: 'a', subPinId: '0' },
      { type: 'output', pinId: 'a', subPinId: '0' },
    ],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {
    [UNIT_ID_IDENTITY]: {
      input: { a: { pinId: 'a0', subPinId: '0' } },
      output: {},
    },
    [UNIT_ID_IDENTITY_0]: {
      input: {},
      output: { a: { pinId: 'a0', subPinId: '0' } },
    },
  },
  {
    '0': {
      input: {
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
      output: {
        mergeId: null,
        pinId: null,
        subPinSpec: {},
      },
    },
  },
  {
    input: {
      a: {
        0: {
          mergeId: '0',
        },
      },
    },
    output: {
      a: {
        0: {
          mergeId: '0',
        },
      },
    },
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition12.getUnitCount(), 1)
assert.equal(composition12.getMergeCount(), 0)

assert.equal(empty12.getUnitCount(), 2)
assert.deepEqual(empty12.getMergeCount(), 1)

assert.deepEqual(empty12.getInputCount(), 2)
assert.deepEqual(empty12.getOutputCount(), 2)

assert.deepEqual(empty12.getExposedInputSpec('a'), {
  plug: {
    '0': {
      mergeId: '0',
    },
  },
  ref: false,
  defaultIgnored: undefined,
})
assert.deepStrictEqual(empty12.getExposedOutputSpec('a'), {
  plug: {
    '0': {
      mergeId: '0',
    },
  },
  ref: false,
  defaultIgnored: undefined,
})

const spec13 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
      id: ID_EMPTY,
    },
  },
  merges: {
    0: {},
  },
  inputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
})

const composition13 = new Graph(spec13, {}, system)

false && watchUnitAndLog(composition13)
false && watchGraphAndLog(composition13)

composition13.play()

const empty13 = composition13.getUnit(UNIT_ID_EMPTY) as Graph

composition13.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: ['0'],
    link: [],
    unit: [],
    plug: [
      { type: 'input', pinId: 'a', subPinId: '0' },
      { type: 'output', pinId: 'a', subPinId: '0' },
    ],
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
        mergeId: '1',
        pinId: 'a',
        subPinSpec: {},
      },
      output: {
        mergeId: '2',
        pinId: 'a',
        subPinSpec: {},
      },
    },
  },
  {
    input: {
      a: {
        0: {
          mergeId: '0',
        },
      },
    },
    output: {
      a: {
        0: {
          mergeId: '0',
        },
      },
    },
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition13.getUnitCount(), 1)
assert.equal(composition13.getMergeCount(), 0)

assert.equal(empty13.getUnitCount(), 0)
assert.deepEqual(empty13.getMergeCount(), 1)

assert.deepEqual(empty13.getInputCount(), 1)
assert.deepEqual(empty13.getOutputCount(), 1)

assert.deepEqual(empty13.getExposedInputSpec('a'), {
  plug: {
    '0': {
      mergeId: '0',
    },
  },
})
assert.deepEqual(empty13.getExposedOutputSpec('a'), {
  plug: {
    '0': {
      mergeId: '0',
    },
  },
})

const spec14 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
      id: ID_EMPTY,
    },
  },
  merges: {},
  inputs: {
    a: {
      plug: {
        '0': {},
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {},
      },
    },
  },
})

const composition14 = new Graph(spec14, {}, system)

false && watchUnitAndLog(composition14)
false && watchGraphAndLog(composition14)

composition14.play()

composition14.setPinData('input', 'a', 1)

const empty14 = composition14.getUnit(UNIT_ID_EMPTY) as Graph

composition14.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: [],
    link: [],
    unit: [],
    plug: [
      { type: 'input', pinId: 'a', subPinId: '0' },
      { type: 'output', pinId: 'a', subPinId: '0' },
    ],
  },
  {
    merge: {},
    link: {},
    unit: {},
    plug: {},
  },
  {},
  {},
  {
    input: {
      a: {
        0: {},
      },
    },
    output: {
      a: {
        0: {},
      },
    },
  },
  {},
  {},
  {},
  {}
)

assert.equal(composition14.getUnitCount(), 1)
assert.equal(composition14.getMergeCount(), 0)

assert.deepEqual(empty14.getUnitCount(), 0)
assert.deepEqual(empty14.getMergeCount(), 0)
assert.deepEqual(empty14.getInputCount(), 1)
assert.deepEqual(empty14.getOutputCount(), 1)
assert.deepEqual(empty14.getExposedInputSpec('a'), {
  plug: {
    '0': {},
  },
  ref: false,
  defaultIgnored: undefined,
})
assert.deepEqual(empty14.getExposedOutputSpec('a'), {
  plug: {
    '0': {},
  },
  ref: false,
  defaultIgnored: undefined,
})
assert.deepEqual(empty14.getInput('a').peak(), 1)

const spec15 = system.newSpec({
  units: {
    [UNIT_ID_EMPTY]: {
      id: ID_EMPTY,
    },
    [UNIT_ID_IDENTITY]: {
      id: ID_IDENTITY,
      input: {
        a: {
          constant: true,
        },
      },
    },
  },
  merges: {},
  inputs: {},
  outputs: {},
})

const composition15 = new Graph(spec15, {}, system)

false && watchUnitAndLog(composition15)
false && watchGraphAndLog(composition15)

composition15.play()

const empty15 = composition15.getUnit(UNIT_ID_EMPTY) as Graph

composition15.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: [],
    link: [],
    unit: [UNIT_ID_IDENTITY],
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
      output: { a: { pinId: 'a', subPinId: '0' } },
    },
  },
  {},
  {},
  {},
  {},
  {},
  {}
)

assert.deepEqual(empty15.getInputCount(), 1)

assert(empty15.getInput('a').constant())

composition15.moveSubgraphInto(
  UNIT_ID_EMPTY,
  null,
  null,
  uuid(),
  {
    merge: [],
    link: [{ unitId: UNIT_ID_EMPTY, type: 'input', pinId: 'a' }],
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
  {},
  {},
  {},
  {},
  {},
  {}
)

assert.equal(composition15.getUnitCount(), 1)
assert.equal(composition15.getMergeCount(), 0)

assert.deepEqual(empty15.getInputCount(), 0)

assert(empty15.getUnit(UNIT_ID_IDENTITY).getInput('a').constant())
