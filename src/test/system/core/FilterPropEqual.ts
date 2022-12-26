import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { system } from '../../util/system'

const spec = require('../../../system/core/array/FilterPropEqual/spec.json')
const FilterPropEqual = fromSpec(spec, _specs)

const filterPropEqual = new FilterPropEqual(system)

false && watchUnitAndLog(filterPropEqual)
false && watchGraphAndLog(filterPropEqual)

filterPropEqual.play()

filterPropEqual.push('a', [])
filterPropEqual.push('key', 'a')
filterPropEqual.push('value', 0)
assert.deepEqual(filterPropEqual.take('b'), [])
assert.deepEqual(filterPropEqual.peakInput('a'), undefined)
assert.deepEqual(filterPropEqual.peakInput('key'), undefined)
assert.deepEqual(filterPropEqual.peakInput('value'), undefined)

filterPropEqual.push('a', [{ a: 0 }])
filterPropEqual.push('key', 'a')
filterPropEqual.push('value', 0)
assert.deepEqual(filterPropEqual.take('b'), [{ a: 0 }])
assert.deepEqual(filterPropEqual.peakInput('a'), undefined)
assert.deepEqual(filterPropEqual.peakInput('key'), undefined)
assert.deepEqual(filterPropEqual.peakInput('value'), undefined)

filterPropEqual.push('a', [{ a: 1 }])
filterPropEqual.push('key', 'a')
filterPropEqual.push('value', 0)
assert.deepEqual(filterPropEqual.take('b'), [])
assert.deepEqual(filterPropEqual.peakInput('a'), undefined)
assert.deepEqual(filterPropEqual.peakInput('key'), undefined)
assert.deepEqual(filterPropEqual.peakInput('value'), undefined)

filterPropEqual.push('a', [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
filterPropEqual.push('key', 'a')
filterPropEqual.push('value', 0)
assert.deepEqual(filterPropEqual.take('b'), [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
assert.deepEqual(filterPropEqual.peakInput('a'), undefined)
assert.deepEqual(filterPropEqual.peakInput('key'), undefined)
assert.deepEqual(filterPropEqual.peakInput('value'), undefined)

filterPropEqual.push('a', [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
filterPropEqual.push('key', 'a')
filterPropEqual.push('value', 0)
assert.deepEqual(filterPropEqual.takeInput('a'), [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
assert.deepEqual(filterPropEqual.peakOutput('b'), undefined)
assert.deepEqual(filterPropEqual.peakInput('a'), undefined)
assert.deepEqual(filterPropEqual.peakInput('key'), 'a')
assert.deepEqual(filterPropEqual.peakInput('value'), 0)

filterPropEqual.push('a', [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
assert.deepEqual(filterPropEqual.peakOutput('b'), [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
filterPropEqual.push('key', 'b')
assert.deepEqual(filterPropEqual.peakOutput('b'), [])
filterPropEqual.push('value', 1)
assert.deepEqual(filterPropEqual.peak('b'), [{ a: 0, b: 1 }])
filterPropEqual.push('key', 'c')
assert.notEqual(filterPropEqual.getErr(), null)
assert.deepEqual(filterPropEqual.peakInput('a'), [
  { a: 0, b: 1 },
  { a: 0, b: 2 },
])
assert.deepEqual(filterPropEqual.peakInput('key'), 'c')
assert.deepEqual(filterPropEqual.peakInput('value'), 1)
