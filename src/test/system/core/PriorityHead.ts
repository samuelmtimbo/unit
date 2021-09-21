import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/common/PriorityHead/spec.json')
const PriorityHead = fromSpec(spec, globalThis.__specs)

const priorityHead = new PriorityHead()

false && watchUnitAndLog(priorityHead)
false && watchGraphAndLog(priorityHead)

// do not forget to play
priorityHead.play()

priorityHead.push('a', [])
priorityHead.push('b', [])
assert.deepEqual(priorityHead.peakInput('a'), [])
assert.deepEqual(priorityHead.peakInput('b'), [])
assert.deepEqual(priorityHead.take('a'), [])
assert.deepEqual(priorityHead.take('b'), [])
assert.deepEqual(priorityHead.take('head'), 1000)
assert.deepEqual(priorityHead.peakInput('a'), undefined)
assert.deepEqual(priorityHead.peakInput('b'), undefined)

priorityHead.push('a', [0])
priorityHead.push('b', [1])
assert.deepEqual(priorityHead.peakInput('a'), [0])
assert.deepEqual(priorityHead.peakInput('b'), [1])
assert.deepEqual(priorityHead.take('a'), [])
assert.deepEqual(priorityHead.take('b'), [1])
assert.deepEqual(priorityHead.take('head'), 0)
assert.deepEqual(priorityHead.peakInput('a'), undefined)
assert.deepEqual(priorityHead.peakInput('b'), undefined)

priorityHead.push('a', [-1])
priorityHead.push('b', [-2])
assert.deepEqual(priorityHead.peakInput('a'), [-1])
assert.deepEqual(priorityHead.peakInput('b'), [-2])
assert.deepEqual(priorityHead.take('a'), [-1])
assert.deepEqual(priorityHead.take('b'), [])
assert.deepEqual(priorityHead.take('head'), -2)
assert.deepEqual(priorityHead.peakInput('a'), undefined)
assert.deepEqual(priorityHead.peakInput('b'), undefined)

priorityHead.push('a', [-1])
priorityHead.push('b', [-3, -2])
assert.deepEqual(priorityHead.peakInput('a'), [-1])
assert.deepEqual(priorityHead.peakInput('b'), [-3, -2])
assert.deepEqual(priorityHead.take('a'), [-1])
assert.deepEqual(priorityHead.take('b'), [-2])
assert.deepEqual(priorityHead.take('head'), -3)
assert.deepEqual(priorityHead.peakInput('a'), undefined)
assert.deepEqual(priorityHead.peakInput('b'), undefined)
