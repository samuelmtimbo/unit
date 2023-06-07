import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types/GraphSpec'
import { system } from '../../util/system'
// import Lever from '../../../unit/system/core/common/Lever/Class'

const spec = require('../../../system/core/common/Lever/spec.json') as GraphSpec

const Lever = fromSpec<{ a: any; b: any; c: boolean }, { a: any }>(spec, _specs)

const lever = new Lever(system)

false && watchUnitAndLog(lever)
false && watchGraphAndLog(lever)

lever.play()

lever.push('a', 1)
lever.push('c', true)
assert.equal(lever.take('a'), 1)
assert.equal(lever.take('a'), undefined)
assert.equal(lever.peakInput('a'), undefined)
assert.equal(lever.peakInput('c'), undefined)

lever.push('a', 1)
lever.push('b', 2)
lever.push('c', false)
assert.equal(lever.take('a'), 2)
assert.equal(lever.peakInput('a'), 1)

lever.setInputConstant('c', true)
lever.push('c', false)
lever.push('a', 3)
lever.push('b', 4)
assert.equal(lever.take('a'), 4)
lever.push('b', 5)
assert.equal(lever.take('a'), 5)
assert.equal(lever.peakInput('a'), 3)
assert.equal(lever.peakInput('b'), undefined)
assert.equal(lever.peakInput('c'), false)
