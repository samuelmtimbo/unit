import assert from 'assert'
import Add from '../../../../system/f/arithmetic/Add'
import { system } from '../../../util/system'

const add = new Add(system)

add.play()

add.push('a', 1)
add.push('b', 2)
assert.equal(add.peakInput('a'), 1)
assert.equal(add.peakInput('b'), 2)
assert.equal(add.take('a + b'), 3)

add.push('a', 3)
add.push('b', 4)
assert.equal(add.peakInput('a'), 3)
assert.equal(add.peakInput('b'), 4)
assert.equal(add.take('a + b'), 7)

add.setInputConstant('b', true)
add.push('b', 1)
add.push('a', 1)
assert.equal(add.take('a + b'), 2)
add.push('a', 5)
assert.equal(add.take('a + b'), 6)

add.setInputConstant('a', true)
add.push('a', 99)
assert.equal(add.peakInput('a'), 99)
assert.equal(add.peakInput('b'), 1)
assert.equal(add.take('a + b'), 100)
assert.equal(add.take('a + b'), 100)

// infinite loop
// add.setInputConstant('a', true)
// add.setInputConstant('b', true)
// add.setOutputIgnored('a + b', true)
// add.push('a', 1)
// add.push('b', 2)
