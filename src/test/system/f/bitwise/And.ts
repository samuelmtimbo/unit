import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import And from '../../../../system/f/bitwise/And'

const and = new And()

and.play()

false && watchUnitAndLog(and)

and.push('b', 0)
and.push('a', 1)

assert.equal(and.take('a & b'), 0)

and.push('a', 1)
and.push('b', 1)

assert.equal(and.take('a & b'), 1)
