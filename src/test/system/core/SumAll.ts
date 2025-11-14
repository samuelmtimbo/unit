import assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { system } from '../../util/system'

const spec = require('../../../system/core/array/SumAll/spec.json')

const SumAll = fromSpec<{ a: any }, { sum: number }>(spec, _specs, {})

const sumAll = new SumAll(system)

false && watchUnitAndLog(sumAll)
false && watchGraphAndLog(sumAll)

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
