import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { pod, system } from '../../util/system'

const spec =
  require('../../../system/core/array/Multiply/spec.json') as GraphSpec
const ArrayMultiply = fromSpec(spec, _specs)

const arrayMultiply = new ArrayMultiply(system, pod) as Graph

0 && watchUnitAndLog(arrayMultiply)
0 && watchGraphAndLog(arrayMultiply)
0 && watchTreeAndLog(arrayMultiply)

arrayMultiply.play()

arrayMultiply.push('a', [])
arrayMultiply.push('b', [])
assert.deepEqual(arrayMultiply.take('ab'), [])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)

arrayMultiply.push('a', [1])
arrayMultiply.push('b', [2])
assert.deepEqual(arrayMultiply.take('ab'), [2])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)

arrayMultiply.push('a', [1, 2])
arrayMultiply.push('b', [1, 2])
assert.deepEqual(arrayMultiply.take('ab'), [1, 4])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)

arrayMultiply.push('a', [1, 2])
arrayMultiply.push('b', [1, 2])
assert.deepEqual(arrayMultiply.peak('ab'), [1, 4])
arrayMultiply.push('b', [3, 4])
assert.deepEqual(arrayMultiply.take('ab'), [3, 8])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)
