import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/common/LoopForever/spec.json')
const LoopForever = fromSpec(spec, globalThis.__specs)

const loopForever = new LoopForever() as Graph

false && watchUnitAndLog(loopForever)
false && watchGraphAndLog(loopForever)

loopForever.play()

loopForever.push('init', 0)
assert.equal(loopForever.take('current'), 0)
assert.equal(loopForever.take('current'), undefined)
assert.equal(loopForever.peakInput('init'), 0)
loopForever.push('next', 1)
assert.equal(loopForever.peakInput('next'), undefined)
assert.equal(loopForever.take('current'), 1)
assert.equal(loopForever.take('current'), undefined)

loopForever.push('init', 0)
assert.equal(loopForever.take('current'), 0)
assert.equal(loopForever.take('current'), undefined)

loopForever.push('init', 0)
assert.equal(loopForever.peak('current'), 0)
loopForever.push('next', 1)
assert.equal(loopForever.peak('current'), 0)
assert.equal(loopForever.peakInput('next'), undefined)
loopForever.push('next', 2)
assert.equal(loopForever.peak('current'), 0)
assert.equal(loopForever.peakInput('next'), 2)
assert.equal(loopForever.take('current'), 0)
assert.equal(loopForever.take('current'), 1)
assert.equal(loopForever.take('current'), 2)
assert.equal(loopForever.take('current'), undefined)
