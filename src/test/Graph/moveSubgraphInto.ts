import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog } from '../../debug'
import { ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { pod, system } from '../util/system'

const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'

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
  },
  { merge: {}, link: {}, unit: {} },
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
  {},
  {}
)

assert.equal(composition2.getUnitCount(), 1)
assert.equal(composition2.getMergeCount(), 1)

assert.equal(empty2.getUnitCount(), 2)
assert.equal(empty2.getInputCount(), 2)
assert.equal(empty2.getOutputCount(), 2)
