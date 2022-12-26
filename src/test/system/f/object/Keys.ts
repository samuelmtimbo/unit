import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Keys from '../../../../system/f/object/Keys'
import { system } from '../../../util/system'

const keys = new Keys(system)

keys.play()

false && watchUnitAndLog(keys)

keys.push('obj', {})
assert.deepEqual(keys.take('keys'), [])

keys.push('obj', { foo: 0, bar: 1 })
assert.deepEqual(keys.take('keys'), ['foo', 'bar'])
