import assert from 'assert'
import f from '../../../system/core/array/SplitAt/f'

assert.deepEqual(f({ a: [0, 1, 2], i: 1 }), { first: [0], second: [1, 2] })
