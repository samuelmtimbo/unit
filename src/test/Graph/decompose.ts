import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_RANDOM_COLOR_DIV, ID_RANDOM_NATURAL_LTE } from '../../system/_ids'
import { pod, system } from '../util/system'

const UNIT_ID_RANDOM_COLOR_DIV = 'randomcolordiv'

const composition0 = new Graph<{ number: number }, { sum: number }>(
  {},
  {},
  system,
  pod
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const UNIT_ID_RANDOM_NUMBER_LTE = 'randomnumberlte'

composition0.addUnit(
  {
    unit: { id: ID_RANDOM_COLOR_DIV },
  },
  UNIT_ID_RANDOM_COLOR_DIV
)

composition0.explodeUnit(UNIT_ID_RANDOM_COLOR_DIV, {}, {})

const composition1 = new Graph<{ number: number }, { sum: number }>(
  {},
  {},
  system,
  pod
)

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.play()

composition1.addUnit(
  {
    unit: { id: ID_RANDOM_NATURAL_LTE },
  },
  UNIT_ID_RANDOM_NUMBER_LTE
)

const randomNaturalLTE = composition1.refUnit(UNIT_ID_RANDOM_NUMBER_LTE)

assert.equal(composition1.getUnitCount(), 1)

composition1.explodeUnit(UNIT_ID_RANDOM_NUMBER_LTE, {}, {})

assert.equal(composition1.getUnitCount(), 2)
