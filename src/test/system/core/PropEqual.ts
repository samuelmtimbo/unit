import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/relation/PropEqual/spec.json')
const PropEqual = fromSpec(spec, globalThis.__specs)

const propEqual = new PropEqual()

false && watchUnitAndLog(propEqual)
false && watchGraphAndLog(propEqual)

// do not forget to play
propEqual.play()

propEqual.push('value', 0)
propEqual.push('key', 'a')
propEqual.push('obj', { a: 1 })
assert.deepEqual(propEqual.take('equal'), false)
