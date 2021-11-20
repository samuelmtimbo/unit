import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import ToUpperCase from '../../../../system/f/string/Length'

const length = new ToUpperCase()

length.play()

false && watchUnitAndLog(length)

length.push('a', 'bar')

assert.equal(length.take('length'), 3)

length.push('a', '')

assert.equal(length.take('length'), 0)
