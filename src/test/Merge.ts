import * as assert from 'assert'
import Merge from '../Class/Merge'
import { Pin } from '../Pin'
import { watchUnitAndLog } from '../debug'
import { system } from './util/system'

const merge0 = new Merge(system)

merge0.play()

false && watchUnitAndLog(merge0)

merge0.addInput('a', new Pin())

merge0.push('a', 1)
assert.equal(merge0.peakInput('a'), 1)

merge0.addOutput('a', new Pin())

assert.equal(merge0.takeOutput('a'), 1)

merge0.addInput('b', new Pin())
merge0.addInput('c', new Pin())

merge0.push('a', 1)
merge0.push('b', 2)
merge0.push('c', 3)
assert.equal(merge0.peakInput('a'), undefined)
assert.equal(merge0.peakInput('b'), undefined)
assert.equal(merge0.peakInput('c'), 3)
assert.equal(merge0.peakOutput('a'), 3)
merge0.addOutput('b', new Pin())
assert.equal(merge0.peakOutput('b'), 3)
assert.equal(merge0.take('a'), 3)
assert.equal(merge0.take('b'), 3)
assert.equal(merge0.peakInput('a'), undefined)
assert.equal(merge0.peakInput('b'), undefined)
assert.equal(merge0.peakInput('c'), undefined)

merge0.push('a', 1)
assert.equal(merge0.take('a'), 1)
assert.equal(merge0.take('b'), 1)
assert.equal(merge0.peakInput('a'), undefined)
assert.equal(merge0.peakInput('b'), undefined)
assert.equal(merge0.peakInput('c'), undefined)
assert.equal(merge0.peakOutput('a'), undefined)
assert.equal(merge0.peakOutput('b'), undefined)

merge0.push('a', 1)
assert.equal(merge0.peakOutput('a'), 1)
assert.equal(merge0.peakOutput('b'), 1)
merge0.push('b', 2)
assert.equal(merge0.peakOutput('a'), 2)
assert.equal(merge0.peakOutput('b'), 2)
assert.equal(merge0.take('a'), 2)
assert.equal(merge0.take('b'), 2)
assert.equal(merge0.peakInput('a'), undefined)
assert.equal(merge0.peakInput('b'), undefined)

// merge0.push('a', 3)
// assert.equal(merge0.take('a'), 3)
// merge0.removeOutput('b')
// assert.equal(merge0.peakInput('a'), undefined)
// assert.equal(merge0.peakInput('b'), undefined)

merge0.addInput('d', new Pin({ data: 10 }))
assert.equal(merge0.take('a'), 10)
assert.equal(merge0.peakInput('a'), undefined)
assert.equal(merge0.peakInput('b'), undefined)
assert.equal(merge0.peakInput('c'), undefined)

merge0.push('d', 20)
assert.equal(merge0.peakOutput('a'), 20)
merge0.removeInput('d', false)
assert.equal(merge0.peakOutput('a'), 20)

const merge1 = new Merge(system)

merge1.play()

false && watchUnitAndLog(merge1)

merge1.addInput('a', new Pin())
merge1.addInput('b', new Pin())
merge1.addOutput('a', new Pin())

merge1.push('a', 0)
assert.equal(merge1.peakInput('a'), 0)
assert.equal(merge1.peakInput('b'), undefined)
assert.equal(merge1.peakOutput('a'), 0)
merge1.removeInput('a', false)
assert.equal(merge1.peakOutput('a'), 0)

const merge2 = new Merge(system)

merge2.play()

false && watchUnitAndLog(merge2)

merge2.addInput('a', new Pin())
merge2.addInput('b', new Pin())
merge2.addOutput('a', new Pin())
merge2.addOutput('b', new Pin())

merge2.push('a', 0)

merge2.pushOutput('a', 1)

assert.equal(merge2.peakInput('a'), 0)
assert.equal(merge2.peakOutput('a'), 1)

merge2.pushOutput('b', 2)

assert.equal(merge2.peakInput('a'), undefined)
assert.equal(merge2.peakOutput('a'), 1)
assert.equal(merge2.peakOutput('b'), 2)

merge2.push('b', 0)

assert.equal(merge2.peakInput('a'), undefined)
assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), 0)
assert.equal(merge2.peakOutput('b'), 0)

merge2.pushOutput('a', 1)

assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), 1)
assert.equal(merge2.peakOutput('b'), 0)

merge2.takeOutput('a')

assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), undefined)
assert.equal(merge2.peakOutput('b'), 0)

merge2.pushOutput('a', 1)

assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), 1)
assert.equal(merge2.peakOutput('b'), 0)

merge2.takeOutput('a')

assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), undefined)
assert.equal(merge2.peakOutput('b'), 0)

merge2.push('b', 0)

assert.equal(merge2.peakInput('a'), undefined)
assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), 0)
assert.equal(merge2.peakOutput('b'), 0)

merge2.pushOutput('a', 1)

assert.equal(merge2.peakInput('b'), 0)
assert.equal(merge2.peakOutput('a'), 1)
assert.equal(merge2.peakOutput('b'), 0)

merge2.takeInput('b')

assert.equal(merge2.peakInput('b'), undefined)
assert.equal(merge2.peakOutput('a'), 1)
assert.equal(merge2.peakOutput('b'), undefined)
