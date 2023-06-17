import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { countEvent } from '../../util'
import { system } from '../../util/system'

const spec = require('../../../system/core/array/AppendIf/spec.json')

const AppendIf = fromSpec(spec, _specs)

const appendIf = new AppendIf(system)

const dataCounter = countEvent(appendIf.getOutput('a'), 'data')
const dropCounter = countEvent(appendIf.getOutput('a'), 'drop')

false && watchTreeAndLog(appendIf)

false && watchUnitAndLog(appendIf)
false && watchGraphAndLog(appendIf)
false && watchGraphAndLog(appendIf.getUnit('pick') as Graph)

appendIf.play()

appendIf.push('a', [])
appendIf.push('b', 0)
appendIf.push('test', false)
assert.deepEqual(appendIf.peakInput('a'), [])
assert.deepEqual(appendIf.peakInput('b'), 0)
assert.deepEqual(appendIf.peakInput('test'), false)
assert.deepEqual(appendIf.take('a'), [])
assert.deepEqual(appendIf.peakInput('a'), undefined)
assert.deepEqual(appendIf.peakInput('b'), undefined)
assert.deepEqual(appendIf.peakInput('test'), undefined)

appendIf.push('a', [])
appendIf.push('b', 0)
appendIf.push('test', true)
assert.deepEqual(appendIf.peakInput('a'), [])
assert.deepEqual(appendIf.peakInput('b'), 0)
assert.deepEqual(appendIf.peakInput('test'), true)
assert.deepEqual(appendIf.take('a'), [0])
assert.deepEqual(appendIf.peakInput('a'), undefined)
assert.deepEqual(appendIf.peakInput('b'), undefined)
assert.deepEqual(appendIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
appendIf.push('a', [])
appendIf.push('b', 0)
appendIf.push('test', true)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.peak('a'), [0])
appendIf.push('test', false)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.take('a'), [])
assert.deepEqual(appendIf.peakInput('a'), undefined)
assert.deepEqual(appendIf.peakInput('b'), undefined)
assert.deepEqual(appendIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
appendIf.push('a', [])
appendIf.push('b', 0)
appendIf.push('test', false)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.peak('a'), [])
appendIf.push('test', true)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.peak('a'), [0])
appendIf.push('test', false)
assert.equal(dataCounter.count, 3)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.take('a'), [])
assert.deepEqual(appendIf.peakInput('a'), undefined)
assert.deepEqual(appendIf.peakInput('b'), undefined)
assert.deepEqual(appendIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
appendIf.push('a', [])
appendIf.push('b', 0)
appendIf.push('test', true)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.peak('a'), [0])
appendIf.push('test', false)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.peak('a'), [])
appendIf.push('test', true)
assert.equal(dataCounter.count, 3)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.take('a'), [0])
assert.deepEqual(appendIf.peakInput('a'), undefined)
assert.deepEqual(appendIf.peakInput('b'), undefined)
assert.deepEqual(appendIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
appendIf.push('test', true)
appendIf.push('b', 0)
appendIf.push('a', [])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.peak('a'), [0])
appendIf.push('test', false)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(appendIf.take('a'), [])
