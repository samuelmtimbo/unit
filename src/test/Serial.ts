import * as assert from 'assert'
import { watchUnitAndLog } from '../debug'
import { Pin } from '../Pin'
import Serial from '../Serial'
import { system } from './util/system'

const serial0 = new Serial(system)

serial0.play()

false && watchUnitAndLog(serial0)

serial0.push('a', 1)
assert.equal(serial0.peakInput('a'), 1)

serial0.addOutput('a', new Pin())
assert.equal(serial0.takeOutput('a'), 1)
assert.equal(serial0.takeOutput('a'), undefined)
assert.equal(serial0.takeInput('a'), undefined)

serial0.addOutput('b', new Pin())
serial0.push('a', 1)
assert.equal(serial0.peakInput('a'), 1)
assert.equal(serial0.peakOutput('a'), 1)
assert.equal(serial0.peakOutput('b'), undefined)
assert.equal(serial0.takeOutput('a'), 1)
assert.equal(serial0.takeOutput('b'), 1)
assert.equal(serial0.takeInput('a'), undefined)

serial0.push('a', 2)
assert.equal(serial0.peakInput('a'), 2)
assert.equal(serial0.peakOutput('a'), 2)
assert.equal(serial0.peakOutput('b'), undefined)
assert.equal(serial0.takeInput('a'), 2)
assert.equal(serial0.peakOutput('a'), undefined)
assert.equal(serial0.peakOutput('b'), undefined)

serial0.addOutput('c', new Pin())
serial0.push('a', 3)
assert.equal(serial0.peakInput('a'), 3)
assert.equal(serial0.peakOutput('a'), 3)
assert.equal(serial0.peakOutput('b'), undefined)
assert.equal(serial0.peakOutput('c'), undefined)
assert.equal(serial0.takeOutput('a'), 3)
assert.equal(serial0.takeOutput('b'), 3)
serial0.push('a', 4)
assert.equal(serial0.peakInput('a'), 4)
assert.equal(serial0.peakOutput('a'), 4)
assert.equal(serial0.peakOutput('b'), undefined)
assert.equal(serial0.peakOutput('c'), undefined)
assert.equal(serial0.takeOutput('a'), 4)
assert.equal(serial0.takeOutput('b'), 4)
assert.equal(serial0.takeOutput('c'), 4)
