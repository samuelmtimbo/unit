import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import Throw from '../../system/f/control/Throw'
import { ID_THROW } from '../spec/id'

const composition0 = new Graph<{ message: string }, {}>()

const throwId0 = 'throw0'
const throwId1 = 'throw1'

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.addUnit(
  {
    path: ID_THROW,
    catchErr: false,
    input: {},
    output: {},
  },
  throwId0
)

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
  { name: 'message', pin: { 0: { unitId: throwId0, pinId: 'message' } } },
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

const composition1 = new Graph<{ message: string }, {}>()
composition1.play()

false && watchUnitAndLog(composition1)
false && watchGraphAndLog(composition1)

composition1.addUnit(
  {
    path: ID_THROW,
    catchErr: false,
    input: { message: { data: '"honolulu"' } },
    output: {},
  },
  throwId0
)
assert.equal(composition1.takeErr(), 'honolulu')

composition1.removeUnit(throwId0)
assert.equal(composition1.takeErr(), null)

const composition2 = new Graph<{ message: string }, {}>()
composition2.play()

false && watchUnitAndLog(composition2)
false && watchGraphAndLog(composition2)

composition2.addUnit(
  {
    path: ID_THROW,
    catchErr: false,
    input: { message: { data: '"bang!"' } },
    output: {},
  },
  throwId0
)
composition2.addUnit(
  {
    path: ID_THROW,
    catchErr: false,
    input: { message: { data: '"baboom"' } },
    output: {},
  },
  throwId1
)
assert.equal(composition2.getErr(), 'bang!')
composition2.removeUnit(throwId0)
assert.equal(composition2.getErr(), 'baboom')
composition2.removeUnit(throwId1)
assert.equal(composition2.getErr(), null)

const composition3 = new Graph<{ message: string }, {}>()
composition3.play()

false && watchUnitAndLog(composition3)
false && watchGraphAndLog(composition3)

composition3.addUnit(
  {
    path: ID_THROW,
    catchErr: false,
    input: { message: { data: '"badumtz"' } },
    output: {},
  },
  throwId0
)

assert.equal(composition3.getErr(), 'badumtz')

const composition4 = new Graph<{ message: string }, {}>()
composition4.play()

const throwUnit = new Throw()
throwUnit.pushInput('message', 'mameleco')

composition4.addUnit({ path: ID_THROW }, 'throw', throwUnit)

assert.equal(composition4.getErr(), 'mameleco')
