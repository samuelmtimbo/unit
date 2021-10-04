import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import NumberToString from '../../../../system/f/number/NumberToString'

const toString = new NumberToString()

false && watchUnitAndLog(toString)

toString.push('n', 0)
toString.push('radix', 10)
assert.equal(toString.take('str'), '0')

toString.push('n', 15)
toString.push('radix', 16)
assert.equal(toString.take('str'), 'f')

toString.removeInput('radix')
toString.push('n', 42)
assert.equal(toString.take('str'), '42')
