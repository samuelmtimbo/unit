import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import At from '../../../../system/f/array/At'

const at = new At()

at.play()

false && watchUnitAndLog(at)

at.push('a', [0])
at.push('i', 0)
assert.deepEqual(at.take('a[i]'), 0)

at.push('a', [0, 1])
at.push('i', 1)
assert.deepEqual(at.take('a[i]'), 1)

at.push('a', [])
at.push('i', 0)
assert.notEqual(at.takeErr(), null)

at.push('a', [])
at.push('i', -1)
assert.notEqual(at.takeErr(), null)
