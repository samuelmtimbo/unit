import * as assert from 'assert'
import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { system } from '../../util/system'

const spec = require('../../../system/core/array/ForEach/spec.json')
const ForEach = fromSpec(spec, _specs)

const forEach = new ForEach(system)

false && watchUnitAndLog(forEach)
false && watchGraphAndLog(forEach)
false && watchTreeAndLog(forEach)

forEach.play()

forEach.setOutputIgnored('a', true)
forEach.setOutputIgnored('i', true)

// forEach.push('a', [])
// assert.equal(forEach.take('test'), false)
// assert.equal(forEach.take('a[i]'), undefined)
// assert.equal(forEach.peakInput('a'), undefined)

forEach.push('a', [0])
assert.equal(forEach.take('test'), true)
assert.equal(forEach.take('a[i]'), 0)
assert.equal(forEach.take('test'), false)
assert.equal(forEach.take('a[i]'), undefined)
assert.equal(forEach.peakInput('a'), undefined)

// forEach.push('a', [0, 1, 2])
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 0)
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 1)
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 2)
// assert.equal(forEach.take('test'), false)
// assert.equal(forEach.take('a[i]'), undefined)
// assert.equal(forEach.peakInput('a'), undefined)

// forEach.push('a', [0, 1, 2])
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 0)
// assert.deepEqual(forEach.takeInput('a'), [0, 1, 2])
// assert.equal(forEach.take('test'), undefined)
// assert.equal(forEach.take('a[i]'), undefined)
// forEach.push('a', [0, 1, 2])
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 0)
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 1)
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 2)
// assert.equal(forEach.take('test'), false)
// assert.equal(forEach.take('a[i]'), undefined)
// assert.equal(forEach.peakInput('a'), undefined)

// forEach.push('a', [0, 1])
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 0)
// forEach.push('a', [0, 1, 2])
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 0)
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 1)
// assert.equal(forEach.take('test'), true)
// assert.equal(forEach.take('a[i]'), 2)
// assert.equal(forEach.take('test'), false)
// assert.equal(forEach.take('a[i]'), undefined)
// assert.equal(forEach.peakInput('a'), undefined)

// forEach.setOutputIgnored('test', true)
// forEach.setInputConstant('a', true)
// forEach.push('a', [0, 1, 2, 3])
// assert.equal(forEach.take('a[i]'), 0)
// assert.equal(forEach.take('a[i]'), 1)
// assert.equal(forEach.take('a[i]'), 2)
// assert.equal(forEach.take('a[i]'), 3)
// assert.equal(forEach.take('a[i]'), 0)
// assert.equal(forEach.take('a[i]'), 1)
// assert.equal(forEach.take('a[i]'), 2)
// assert.equal(forEach.take('a[i]'), 3)
// assert.equal(forEach.take('a[i]'), 0)
// assert.equal(forEach.take('a[i]'), 1)
// assert.equal(forEach.take('a[i]'), 2)
// assert.equal(forEach.take('a[i]'), 3)
