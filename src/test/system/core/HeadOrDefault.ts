import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/array/HeadOrDefault/spec.json') as GraphSpec
const HeadOrDefault = fromSpec(spec, globalThis.__specs)

const headOrDefault = new HeadOrDefault()

false && watchUnitAndLog(headOrDefault)
false && watchGraphAndLog(headOrDefault)

// do not forget to play
headOrDefault.play()

headOrDefault.push('a', [])
headOrDefault.push('default', 1000)
assert.deepEqual(headOrDefault.peakInput('a'), [])
assert.deepEqual(headOrDefault.peakInput('default'), 1000)
assert.deepEqual(headOrDefault.take('a'), [])
assert.deepEqual(headOrDefault.take('head'), 1000)
assert.deepEqual(headOrDefault.take('empty'), true)
assert.deepEqual(headOrDefault.peakInput('a'), undefined)
assert.deepEqual(headOrDefault.peakInput('default'), undefined)
