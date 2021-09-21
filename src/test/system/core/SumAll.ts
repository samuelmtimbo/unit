import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/array/SumAll/spec.json')
const SumAll = fromSpec<{ any: any }, { bit: number }>(spec, globalThis.__specs)

const sumAll = new SumAll()

false && watchUnitAndLog(sumAll)
false && watchGraphAndLog(sumAll)

// do not forget to play
sumAll.play()

sumAll.push('a', [])
assert.deepEqual(sumAll.take('sum'), 0)
assert.deepEqual(sumAll.take('sum'), undefined)
assert.deepEqual(sumAll.peakInput('a'), undefined)

sumAll.push('a', [1])
assert.deepEqual(sumAll.take('sum'), 1)
assert.deepEqual(sumAll.take('sum'), undefined)
assert.deepEqual(sumAll.peakInput('a'), undefined)

sumAll.push('a', [1, 2])
assert.deepEqual(sumAll.take('sum'), 3)
assert.deepEqual(sumAll.take('sum'), undefined)
assert.deepEqual(sumAll.peakInput('a'), undefined)

sumAll.push('a', [1, 2])
assert.deepEqual(sumAll.peak('sum'), 3)
sumAll.push('a', [1, 2, 3])
assert.deepEqual(sumAll.peak('sum'), 6)
sumAll.push('a', [1, 2, 3, 4])
assert.deepEqual(sumAll.take('sum'), 10)
assert.deepEqual(sumAll.take('sum'), undefined)
assert.deepEqual(sumAll.peakInput('a'), undefined)

sumAll.setInputConstant('a', true)
sumAll.push('a', [1, 2, 3, 4])
assert.deepEqual(sumAll.take('sum'), 10)
assert.deepEqual(sumAll.take('sum'), 10)
assert.deepEqual(sumAll.take('sum'), 10)
