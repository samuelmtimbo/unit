import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Length from '../../../../system/f/array/Length'

const length = new Length()

false && watchUnitAndLog(length)

length.push('a', [])
assert.equal(length.take('length'), 0)

length.push('a', [1])
length.push('a', [1, 2])
assert.equal(length.take('length'), 2)
