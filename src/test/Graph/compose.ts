import * as assert from 'assert'
import { boot } from '../../boot'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import _specs from '../../system/_specs'
import { ID_EMPTY, ID_IDENTITY } from '../spec/id'
import { system } from '../util/system'

const UNIT_ID_EMTPY = 'UNIT_ID_EMTPY'
const UNIT_ID_IDENTITY = 'UNIT_ID_IDENTITY'

const composition0 = new Graph<{ number: number }, { sum: number }>({}, {}, system)

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

const empty = composition0.refUnit(UNIT_ID_EMTPY)
const identity = composition0.refUnit(UNIT_ID_IDENTITY)

assert.equal(composition0.getUnitCount(), 2)

composition0.moveUnitInto(
  UNIT_ID_EMTPY,
  UNIT_ID_IDENTITY,
  UNIT_ID_IDENTITY,
  { input: new Set(), output: new Set() },
  new Set(),
  {
    input: {
      a: {
        pinId: 'a',
        subPinId: '0',
      },
    },
    output: {
      a: {
        pinId: 'a',
        subPinId: '0',
      },
    },
  },
  null,
  []
)

assert.equal(composition0.getUnitCount(), 1)

assert.equal(empty.getInputCount(), 1)
assert.equal(empty.getOutputCount(), 1)

assert(empty.hasInputNamed('a'))
assert(empty.hasOutputNamed('a'))
