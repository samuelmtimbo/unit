import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { system } from '../../util/system'
const spec =
  require('../../../system/core/common/LengthEquals/spec.json') as GraphSpec

const LengthEquals = fromSpec<{ a: number[]; b: number }, { equals: boolean }>(
  spec,
  _specs
)

const lengthEquals = new LengthEquals(system)

false && watchUnitAndLog(lengthEquals)
false && watchGraphAndLog(lengthEquals)

lengthEquals.play()

lengthEquals.push('a', [])
lengthEquals.push('b', 0)
assert.equal(lengthEquals.take('equals'), true)
assert.equal(lengthEquals.take('equals'), undefined)
assert.equal(lengthEquals.peakInput('a'), undefined)
assert.equal(lengthEquals.peakInput('b'), undefined)

lengthEquals.push('a', [0, 1, 2])
lengthEquals.push('b', 2)
assert.equal(lengthEquals.take('equals'), false)
assert.equal(lengthEquals.take('equals'), undefined)
assert.equal(lengthEquals.peakInput('a'), undefined)
assert.equal(lengthEquals.peakInput('b'), undefined)

lengthEquals.push('a', [0, 1, 2])
lengthEquals.push('b', 3)
assert.equal(lengthEquals.take('equals'), true)
assert.equal(lengthEquals.take('equals'), undefined)
assert.equal(lengthEquals.peakInput('a'), undefined)
assert.equal(lengthEquals.peakInput('b'), undefined)

lengthEquals.push('a', [0, 1, 2])
lengthEquals.push('b', 3)
lengthEquals.push('b', 4)
assert.equal(lengthEquals.take('equals'), false)
assert.equal(lengthEquals.take('equals'), undefined)
assert.equal(lengthEquals.peakInput('a'), undefined)
assert.equal(lengthEquals.peakInput('b'), undefined)
