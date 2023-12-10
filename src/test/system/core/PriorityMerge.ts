import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromBundle } from '../../../spec/fromBundle'
import _specs from '../../../system/_specs'
import { BundleSpec } from '../../../types/BundleSpec'
import { system } from '../../util/system'

const bundle = require('./PriorityMerge.json') as BundleSpec

const PriorityMerge = fromBundle<
  { a: number[]; b: number[] },
  { ab: number[] }
>(bundle, _specs, {})

const priorityMerge = new PriorityMerge(system)

false && watchUnitAndLog(priorityMerge)
false && watchGraphAndLog(priorityMerge)
false && watchGraphAndLog(priorityMerge.getUnit('prioritymergefrom') as Graph)

priorityMerge.play()

priorityMerge.push('a', [])
priorityMerge.push('b', [])
assert.deepEqual(priorityMerge.take('ab'), [])
assert.deepEqual(priorityMerge.take('ab'), undefined)
assert.deepEqual(priorityMerge.peakInput('a'), undefined)
assert.deepEqual(priorityMerge.peakInput('b'), undefined)

priorityMerge.push('a', [1, 2, 4])
priorityMerge.push('b', [3, 5])
assert.deepEqual(priorityMerge.take('ab'), [1, 2, 3, 4, 5])
assert.deepEqual(priorityMerge.take('ab'), undefined)
assert.deepEqual(priorityMerge.peakInput('a'), undefined)
assert.deepEqual(priorityMerge.peakInput('b'), undefined)

priorityMerge.push('a', [0])
priorityMerge.push('b', [1])
assert.deepEqual(priorityMerge.take('ab'), [0, 1])
assert.deepEqual(priorityMerge.take('ab'), undefined)
assert.deepEqual(priorityMerge.peakInput('a'), undefined)
assert.deepEqual(priorityMerge.peakInput('b'), undefined)

priorityMerge.push('a', [])
priorityMerge.push('b', [])
assert.deepEqual(priorityMerge.peak('ab'), [])
priorityMerge.push('a', [0])
assert.deepEqual(priorityMerge.take('ab'), [0])
assert.deepEqual(priorityMerge.peakInput('a'), undefined)
assert.deepEqual(priorityMerge.peakInput('b'), undefined)

priorityMerge.push('a', [1, 2])
priorityMerge.push('b', [3])
assert.deepEqual(priorityMerge.peak('ab'), [1, 2, 3])
assert.deepEqual(priorityMerge.peakInput('a'), [1, 2])
assert.deepEqual(priorityMerge.peakInput('b'), [3])
priorityMerge.push('a', [1])
assert.deepEqual(priorityMerge.peak('ab'), [1, 3])
assert.deepEqual(priorityMerge.peakInput('a'), [1])
assert.deepEqual(priorityMerge.peakInput('b'), [3])
assert.deepEqual(priorityMerge.take('ab'), [1, 3])
assert.deepEqual(priorityMerge.peakInput('a'), undefined)
assert.deepEqual(priorityMerge.peakInput('b'), undefined)

priorityMerge.push('a', [1, 2, 4])
priorityMerge.push('b', [3, 5])
assert.deepEqual(priorityMerge.peak('ab'), [1, 2, 3, 4, 5])
priorityMerge.push('b', [0, 3])
assert.deepEqual(priorityMerge.peak('ab'), [0, 1, 2, 3, 4])
priorityMerge.push('a', [1, 2])
assert.deepEqual(priorityMerge.take('ab'), [0, 1, 2, 3])
assert.deepEqual(priorityMerge.take('ab'), undefined)

priorityMerge.push('a', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
priorityMerge.push('b', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
assert.deepEqual(
  priorityMerge.take('ab'),
  [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
)
