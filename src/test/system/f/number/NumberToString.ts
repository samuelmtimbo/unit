import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import NumberToString from '../../../../system/f/number/NumberToString'

const numberToString = new NumberToString()

numberToString.play()

false && watchUnitAndLog(numberToString)

numberToString.push('n', 0)
numberToString.push('radix', 10)
assert.equal(numberToString.take('str'), '0')

numberToString.push('n', 15)
numberToString.push('radix', 16)
assert.equal(numberToString.take('str'), 'f')

numberToString.removeInput('radix')
numberToString.push('n', 42)
assert.equal(numberToString.take('str'), '42')
