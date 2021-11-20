import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_ADD } from '../spec/id'
import { system } from '../util/system'

const composition0 = new Graph<{ number: number }, { sum: number }>(
  {},
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const addId = '0'

composition0.addUnit(
  {
    id: ID_ADD,
    input: {
      b: {
        data: 0,
      },
    },
    output: {},
  },
  addId
)

composition0.play()

const addUnit = composition0.refUnit(addId)

assert.equal(addUnit.peakInput('b'), 0)

composition0.setUnitInputConstant(addId, 'a', true)
composition0.setUnitInputConstant(addId, 'b', true)

assert.equal(addUnit.peakInput('a'), undefined)

composition0.setUnitInputData(addId, 'a', 1)

assert.equal(addUnit.peakInput('a'), 1)
assert.equal(addUnit.take('a + b'), 1)

composition0.setUnitInputData(addId, 'b', 2)

assert.equal(addUnit.take('a + b'), 3)

composition0.setUnitInputData(addId, 'a', 4)

assert.equal(addUnit.take('a + b'), 6)

composition0.setUnitInputData(addId, 'a', 5)

assert.equal(addUnit.take('a + b'), 7)

const composition1 = new Graph<{ number: number }, { sum: number }>({}, {}, system)

composition1.addUnit(
  {
    id: ID_ADD,
    input: {
      a: {
        data: 1,
        constant: true,
      },
      b: {
        data: 2,
        constant: true,
      },
    },
    output: {},
  },
  addId
)

composition1.play()

assert.equal(composition1.refUnit(addId).take('a + b'), 3)

composition1.setUnitInputData(addId, 'a', 9)

assert.equal(composition1.refUnit(addId).getOutput('a + b').take(), 11)
