import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/array/HeadOrDefault/spec.json') as GraphSpec

const HeadOrDefault = fromSpec(spec, _specs)

import { system } from '../../util/system'

const headOrDefault = new HeadOrDefault(system)

false && watchUnitAndLog(headOrDefault)
false && watchGraphAndLog(headOrDefault)


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
