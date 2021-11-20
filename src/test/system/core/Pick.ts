import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { countEvent } from '../../util'

const spec = require('../../../system/core/control/Pick/spec.json')

const Pick = fromSpec<{ a: any; b: any; c: boolean }, { a: any }>(
  spec,
  globalThis.__specs
)

const pick = new Pick()

false && watchUnitAndLog(pick)
false && watchGraphAndLog(pick)

const dataCounter = countEvent(pick.getOutput('a'), 'data')
const dropCounter = countEvent(pick.getOutput('a'), 'drop')

// do not forget to play
pick.play()

pick.push('a', 1)
pick.push('b', 2)
pick.push('c', true)
assert.equal(pick.take('a'), 1)
assert.equal(pick.peakInput('a'), undefined)
assert.equal(pick.peakInput('b'), undefined)
assert.equal(pick.peakInput('c'), undefined)

pick.push('a', 1)
pick.push('b', 2)
pick.push('c', false)
assert.equal(pick.take('a'), 2)
assert.equal(pick.peakInput('a'), undefined)
assert.equal(pick.peakInput('b'), undefined)
assert.equal(pick.peakInput('c'), undefined)

dataCounter.reset()
dropCounter.reset()
pick.push('a', 1)
pick.push('b', 2)
pick.push('c', false)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.equal(pick.peakOutput('a'), 2)
pick.push('c', true)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.equal(pick.takeOutput('a'), 1)

dataCounter.reset()
dropCounter.reset()
pick.push('a', 1)
pick.push('b', 2)
pick.push('c', true)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.equal(pick.peakOutput('a'), 1)
pick.push('c', false)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.equal(pick.takeOutput('a'), 2)
