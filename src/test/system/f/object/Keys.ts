import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Keys from '../../../../system/f/object/Keys'

const keys = new Keys()

false && watchUnitAndLog(keys)

keys.push('obj', {})
assert.deepEqual(keys.take('keys'), [])

keys.push('obj', { foo: 0, bar: 1 })
assert.deepEqual(keys.take('keys'), ['foo', 'bar'])
