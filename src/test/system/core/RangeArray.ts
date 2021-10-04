import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/array/RangeArray/spec.json')
const RangeArray = fromSpec<{ any: any }, { bit: number }>(
  spec,
  globalThis.__specs
)

const rangeArray = new RangeArray()

false && watchUnitAndLog(rangeArray)
false && watchGraphAndLog(rangeArray)

// do not forget to play
rangeArray.play()

rangeArray.push('n', 0)
assert.deepEqual(rangeArray.take('a'), [])
assert.deepEqual(rangeArray.take('a'), undefined)
assert.deepEqual(rangeArray.peakInput('n'), undefined)

rangeArray.push('n', 1)
assert.deepEqual(rangeArray.take('a'), [0])
assert.deepEqual(rangeArray.take('a'), undefined)
assert.deepEqual(rangeArray.peakInput('n'), undefined)

rangeArray.push('n', 6)
assert.deepEqual(rangeArray.take('a'), [0, 1, 2, 3, 4, 5])
assert.deepEqual(rangeArray.take('a'), undefined)
assert.deepEqual(rangeArray.peakInput('n'), undefined)

rangeArray.push('n', 3)
assert.deepEqual(rangeArray.peak('a'), [0, 1, 2])
rangeArray.push('n', 2)
assert.deepEqual(rangeArray.peak('a'), [0, 1])
rangeArray.push('n', 1)
assert.deepEqual(rangeArray.take('a'), [0])
assert.deepEqual(rangeArray.take('a'), undefined)
assert.deepEqual(rangeArray.peakInput('n'), undefined)

rangeArray.setInputConstant('n', true)
rangeArray.push('n', 3)
assert.deepEqual(rangeArray.take('a'), [0, 1, 2])
assert.deepEqual(rangeArray.take('a'), [0, 1, 2])
assert.deepEqual(rangeArray.take('a'), [0, 1, 2])
assert.deepEqual(rangeArray.take('a'), [0, 1, 2])
assert.deepEqual(rangeArray.take('a'), [0, 1, 2])
assert.deepEqual(rangeArray.take('a'), [0, 1, 2])

rangeArray.setInputConstant('n', true)
rangeArray.push('n', 4)
assert.deepEqual(rangeArray.take('a'), [0, 1, 2, 3])
assert.deepEqual(rangeArray.take('a'), [0, 1, 2, 3])
// assert.deepEqual(rangeArray.take('a'), [0, 1, 2, 3])
