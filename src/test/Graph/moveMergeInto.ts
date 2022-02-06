import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { pod, system } from '../util/system'

const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'

const composition0 = new Graph<{ number: number }, { sum: number }>(
  {},
  {},
  system,
  pod
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnit(
  {
    id: ID_EMPTY,
  },
  UNIT_ID_EMTPY
)
composition0.addUnit(
  {
    id: ID_IDENTITY,
  },
  UNIT_ID_IDENTITY
)
composition0.addUnit(
  {
    id: ID_IDENTITY,
  },
  UNIT_ID_IDENTITY_0
)

const empty = composition0.refUnit(UNIT_ID_EMTPY)
const identity = composition0.refUnit(UNIT_ID_IDENTITY)
const identity0 = composition0.refUnit(UNIT_ID_IDENTITY_0)

assert.equal(composition0.getUnitCount(), 3)

composition0.addMerge(
  {
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
  '0'
)

composition0.moveMergeInto(UNIT_ID_EMTPY, '0', '0', '1', {
  [UNIT_ID_IDENTITY]: {
    output: {
      a: {
        pinId: 'a',
        subPinId: '0',
      },
    },
    input: {},
  },
  [UNIT_ID_IDENTITY_0]: {
    output: {},
    input: {
      a: {
        pinId: 'a',
        subPinId: '0',
      },
    },
  },
})

assert.equal(composition0.getUnitCount(), 3)
assert.equal(composition0.getMergeCount(), 2)

assert.equal(empty.getInputCount(), 1)
assert.equal(empty.getOutputCount(), 1)

assert(empty.hasInputNamed('a'))
assert(empty.hasOutputNamed('a'))
