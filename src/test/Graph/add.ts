import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_ADD } from '../../system/_ids'
import { system } from '../util/system'

const spec0 = system.emptySpec()

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec0,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const addId = '0'

composition0.addUnitSpec(addId, {
  unit: {
    id: ID_ADD,
    input: {
      b: {
        data: '0',
      },
    },
    output: {},
  },
})

composition0.play()

const addUnit = composition0.getUnit(addId)

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

const spec1 = system.emptySpec()

const composition1 = new Graph<{ number: number }, { sum: number }>(
  spec1,
  {},
  system
)

composition1.addUnitSpec(addId, {
  unit: {
    id: ID_ADD,
    input: {
      a: {
        data: '1',
        constant: true,
      },
      b: {
        data: '2',
        constant: true,
      },
    },
    output: {},
  },
})

composition1.play()

assert.equal(composition1.getUnit(addId).take('a + b'), 3)

composition1.setUnitInputData(addId, 'a', 9)

assert.equal(composition1.getUnit(addId).getOutput('a + b').take(), 11)
