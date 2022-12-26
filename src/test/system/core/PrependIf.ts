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

const spec = require('../../../system/core/array/PrependIf/spec.json')
const PrependIf = fromSpec(spec, _specs)

const prependIf = new PrependIf(system)

const dataCounter = countEvent(prependIf.getOutput('a'), 'data')
const dropCounter = countEvent(prependIf.getOutput('a'), 'drop')

false && watchUnitAndLog(prependIf)
false && watchGraphAndLog(prependIf)
false && watchGraphAndLog(prependIf.refUnit('pick') as Graph)
false && watchTreeAndLog(prependIf)

prependIf.play()

prependIf.push('a', [])
prependIf.push('b', 0)
prependIf.push('test', false)
assert.deepEqual(prependIf.peakInput('a'), [])
assert.deepEqual(prependIf.peakInput('b'), 0)
assert.deepEqual(prependIf.peakInput('test'), false)
assert.deepEqual(prependIf.take('a'), [])
assert.deepEqual(prependIf.peakInput('a'), undefined)
assert.deepEqual(prependIf.peakInput('b'), undefined)
assert.deepEqual(prependIf.peakInput('test'), undefined)

prependIf.push('a', [])
prependIf.push('b', 0)
prependIf.push('test', true)
assert.deepEqual(prependIf.peakInput('a'), [])
assert.deepEqual(prependIf.peakInput('b'), 0)
assert.deepEqual(prependIf.peakInput('test'), true)
assert.deepEqual(prependIf.take('a'), [0])
assert.deepEqual(prependIf.peakInput('a'), undefined)
assert.deepEqual(prependIf.peakInput('b'), undefined)
assert.deepEqual(prependIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
prependIf.push('a', [])
prependIf.push('b', 0)
prependIf.push('test', false)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.peak('a'), [])
prependIf.push('test', true)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.peak('a'), [0])
prependIf.push('test', false)
assert.equal(dataCounter.count, 3)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.take('a'), [])
assert.deepEqual(prependIf.peakInput('a'), undefined)
assert.deepEqual(prependIf.peakInput('b'), undefined)
assert.deepEqual(prependIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
prependIf.push('a', [])
prependIf.push('b', 0)
prependIf.push('test', true)
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.peak('a'), [0])
prependIf.push('test', false)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.peak('a'), [])
prependIf.push('test', true)
assert.equal(dataCounter.count, 3)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.take('a'), [0])
assert.deepEqual(prependIf.peakInput('a'), undefined)
assert.deepEqual(prependIf.peakInput('b'), undefined)
assert.deepEqual(prependIf.peakInput('test'), undefined)

dataCounter.reset()
dropCounter.reset()
prependIf.push('test', true)
prependIf.push('b', 0)
prependIf.push('a', [])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.peak('a'), [0])
prependIf.push('test', false)
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
assert.deepEqual(prependIf.take('a'), [])
