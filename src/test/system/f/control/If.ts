import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Filter from '../../../../system/f/control/If'

const filter = new Filter()

filter.play()

false && watchUnitAndLog(filter)

filter.push('a', 0)
filter.push('b', true)
assert.equal(filter.take('a if b'), 0)

filter.push('a', 0)
filter.push('b', false)
assert.equal(filter.take('a if b'), undefined)

filter.push('a', true)
filter.push('b', true)
assert.equal(filter.take('a if b'), true)
