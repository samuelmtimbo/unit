import * as assert from 'assert'
import Append from '../../../../system/f/array/Append'

const append = new Append()

append.play()

append.push('a', [])
append.push('b', 0)
assert.deepEqual(append.take('a'), [0])

append.push('a', [1])
append.push('b', 2)
assert.deepEqual(append.take('a'), [1, 2])
