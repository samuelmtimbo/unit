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
        constant: true,
        data: '1',
      },
    },
    output: {},
  },
})

composition0.play()

const addUnit = composition0.getUnit(addId)

assert.equal(addUnit.peakInput('b'), 1)

addUnit.push('a', 2)

assert.equal(addUnit.peakOutput('a + b'), 3)

composition0.reset()

assert.equal(addUnit.peakInput('b'), 1)
assert.equal(addUnit.peakInput('a'), undefined)
assert.equal(addUnit.peakOutput('a + b'), undefined)
