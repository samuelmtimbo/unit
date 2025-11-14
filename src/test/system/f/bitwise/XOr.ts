import assert from 'assert'
import XOr from '../../../../system/f/bitwise/XOr'
import { system } from '../../../util/system'

const xor = new XOr(system)

xor.play()

xor.push('b', 0)
xor.push('a', 1)
assert.equal(xor.take('a ^ b'), 1)

xor.push('a', 1)
xor.push('b', 1)

assert.equal(xor.take('a ^ b'), 0)
