import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import Throw from '../../system/f/control/Throw'
import { ID_THROW } from '../../system/_ids'
import { system } from '../util/system'

const spec = system.newSpec({})

const composition0 = new Graph<{ message: string }, {}>(spec, {}, system)

const throwId0 = 'throw0'
const throwId1 = 'throw1'

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.addUnitSpec(throwId0, {
  unit: { id: ID_THROW, input: {}, output: {} },
})

composition0.play()

const throw0 = composition0.refUnit(throwId0)

assert.equal(composition0.getErr(), null)

throw0.push('message', 'kaboom!')
assert.equal(composition0.getErr(), 'kaboom!')
assert.equal(composition0.takeErr(), 'kaboom!')

// err should go away after reset
composition0.reset()
assert.equal(composition0.getErr(), null)

composition0.exposeInputSet(
  { name: 'message', plug: { 0: { unitId: throwId0, pinId: 'message' } } },
  'message'
)

// test err backpressure
composition0.push('message', 'xablèau')
assert.equal(composition0.peakInput('message'), 'xablèau')
assert.equal(composition0.takeErr(), 'xablèau')

composition0.push('message', 'kpop')
assert.equal(composition0.peakInput('message'), 'kpop')
assert.equal(composition0.takeErr(), 'kpop')
assert.equal(composition0.takeErr(), null)

const spec1 = system.newSpec({})

const composition1 = new Graph<{ message: string }, {}>(spec1, {}, system)
composition1.play()

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.addUnitSpec(throwId0, {
  unit: {
    id: ID_THROW,
    input: { message: { data: '"honolulu"' } },
    output: {},
  },
})
assert.equal(composition1.takeErr(), 'honolulu')

composition1.removeUnit(throwId0)
assert.equal(composition1.takeErr(), null)

const spec2 = system.newSpec({})

const composition2 = new Graph<{ message: string }, {}>(spec2, {}, system)
composition2.play()

false && watchUnitAndLog(composition2)
false && watchGraphAndLog(composition2)

composition2.addUnitSpec(throwId0, {
  unit: { id: ID_THROW, input: { message: { data: '"bang!"' } }, output: {} },
})
composition2.addUnitSpec(throwId1, {
  unit: {
    id: ID_THROW,
    input: { message: { data: '"baboom"' } },
    output: {},
  },
})
assert.equal(composition2.getErr(), 'bang!')
composition2.removeUnit(throwId0)
assert.equal(composition2.getErr(), 'baboom')
composition2.removeUnit(throwId1)
assert.equal(composition2.getErr(), null)

const spec3 = system.newSpec({})

const composition3 = new Graph<{ message: string }, {}>(spec3, {}, system)
composition3.play()

false && watchUnitAndLog(composition3)
false && watchGraphAndLog(composition3)

composition3.addUnitSpec(throwId0, {
  unit: {
    id: ID_THROW,
    input: { message: { data: '"badumtz"' } },
    output: {},
  },
})

assert.equal(composition3.getErr(), 'badumtz')

const spec4 = system.newSpec({})

const composition4 = new Graph<{ message: string }, {}>(spec4, {}, system)
composition4.play()

const throwUnit = new Throw(system)
throwUnit.pushInput('message', 'mameleco')

composition4.addUnit('throw', throwUnit)

assert.equal(composition4.getErr(), 'mameleco')
