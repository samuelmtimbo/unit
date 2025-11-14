import assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import ToUpperCase from '../../../../system/f/string/Length'
import { system } from '../../../util/system'

const length = new ToUpperCase(system)

length.play()

false && watchUnitAndLog(length)

length.push('a', 'bar')

assert.equal(length.take('length'), 3)

length.push('a', '')

assert.equal(length.take('length'), 0)
