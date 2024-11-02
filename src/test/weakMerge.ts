import { assert } from '../util/assert'
import { weakMerge } from '../weakMerge'

assert.deepEqual(weakMerge({ a: 1, b: 2 }, { b: 3, c: 4 }), {
  a: 1,
  b: 3,
  c: 4,
})
