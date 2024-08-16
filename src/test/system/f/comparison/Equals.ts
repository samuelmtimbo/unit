import * as assert from 'assert'
import Equals from '../../../../system/f/comparison/Equals'
import { system } from '../../../util/system'

const equals = new Equals(system)

equals.play()

equals.push('a', 0)
equals.push('b', 0)
assert.equal(equals.take('a = b'), true)

equals.push('a', 1)
equals.push('b', 0)
assert.equal(equals.take('a = b'), false)

equals.push('a', 0)
equals.push('b', '0')
assert.equal(equals.take('a = b'), false)

equals.push('a', 'foo')
equals.push('b', 'foo')
assert.equal(equals.take('a = b'), true)

equals.push('a', 1)
equals.push('b', 1)
assert.equal(equals.take('a = b'), true)

equals.push('a', /a/g)
equals.push('b', new RegExp('a', 'g'))
assert.equal(equals.take('a = b'), true)

equals.push('a', { a: 'foo', b: 'bar' })
equals.push('b', { a: 'foo', b: 'bar' })
assert.equal(equals.take('a = b'), true)

equals.push('a', [])
equals.push('b', [])
assert.equal(equals.take('a = b'), true)

equals.push('a', [1, 2, 3])
equals.push('b', [1, 2, 3])
assert.equal(equals.take('a = b'), true)

equals.push('a', [{ a: 1 }])
equals.push('b', [{ a: 1 }])
assert.equal(equals.take('a = b'), true)
