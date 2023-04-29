import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_RANDOM_COLOR_DIV, ID_RANDOM_NATURAL_LTE } from '../../system/_ids'
import { ID_EMPTY, ID_IDENTITY } from '../spec/id'
import { system } from '../util/system'

const UNIT_ID_RANDOM_COLOR_DIV = 'randomcolordiv'
const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'
const UNIT_ID_IDENTITY_1 = 'identity1'
const UNIT_ID_DIV = 'div'
const UNIT_ID_DIV_0 = 'div0'

const spec = system.newSpec({})

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const UNIT_ID_RANDOM_NUMBER_LTE = 'randomnumberlte'

composition0.addUnitSpec(UNIT_ID_RANDOM_COLOR_DIV, {
  unit: { id: ID_RANDOM_COLOR_DIV },
})

composition0.explodeUnit(UNIT_ID_RANDOM_COLOR_DIV, {}, {}, false)
composition0.removeUnit(UNIT_ID_RANDOM_COLOR_DIV)

assert.equal(composition0.getUnitCount(), 3)
assert.equal(composition0.getInputCount(), 1)
assert.equal(composition0.getOutputCount(), 0)

const spec0 = system.newSpec({})

const composition1 = new Graph<{ number: number }, { sum: number }>(
  spec0,
  {},
  system
)

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.play()

composition1.addUnitSpec(UNIT_ID_RANDOM_NUMBER_LTE, {
  unit: { id: ID_RANDOM_NATURAL_LTE },
})

const randomNaturalLTE = composition1.refUnit(UNIT_ID_RANDOM_NUMBER_LTE)

assert.equal(composition1.getUnitCount(), 1)

composition1.explodeUnit(UNIT_ID_RANDOM_NUMBER_LTE, {}, {})
composition1.removeUnit(UNIT_ID_RANDOM_NUMBER_LTE)

assert.equal(composition1.getUnitCount(), 2)

const spec6 = system.newSpec({
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
})

const composition6 = new Graph<{ number: number }, { sum: number }>(
  spec6,
  {},
  system
)

false && watchUnitAndLog(composition6)
false && watchGraphAndLog(composition6)

composition6.play()
