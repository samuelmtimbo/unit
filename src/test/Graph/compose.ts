import * as assert from 'assert'

import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import _specs from '../../system/_specs'
import { EMPTY, IDENTITY, RANDOM_NATURAL_LTE } from '../spec/id'

globalThis.__specs = _specs

const UNIT_ID_EMTPY = 'UNIT_ID_EMTPY'
const UNIT_ID_IDENTITY = 'UNIT_ID_IDENTITY'
const UNIT_ID_RANDOM_NUMBER_LTE = 'UNIT_ID_RANDOM_NUMBER_LTE'

const composition0 = new Graph<{ number: number }, { sum: number }>()

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnit(
  {
    path: EMPTY,
  },
  UNIT_ID_EMTPY
)
composition0.addUnit(
  {
    path: IDENTITY,
  },
  UNIT_ID_IDENTITY
)

const empty = composition0.refUnit(UNIT_ID_EMTPY)
const identity = composition0.refUnit(UNIT_ID_IDENTITY)

assert.equal(composition0.getUnitCount(), 2)

composition0.moveUnitInto(UNIT_ID_EMTPY, UNIT_ID_IDENTITY, UNIT_ID_IDENTITY)

assert.equal(composition0.getUnitCount(), 1)

assert.equal(empty.getInputCount(), 1)
assert.equal(empty.getOutputCount(), 1)

assert(empty.hasInputNamed('a'))
assert(empty.hasOutputNamed('a'))

const composition1 = new Graph<{ number: number }, { sum: number }>()

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.play()

composition1.addUnit(
  {
    path: RANDOM_NATURAL_LTE,
  },
  UNIT_ID_RANDOM_NUMBER_LTE
)

const randomNaturalLTE = composition1.refUnit(UNIT_ID_RANDOM_NUMBER_LTE)

assert.equal(composition1.getUnitCount(), 1)

composition1.explodeUnit(UNIT_ID_RANDOM_NUMBER_LTE, {}, {})

assert.equal(composition1.getUnitCount(), 2)
