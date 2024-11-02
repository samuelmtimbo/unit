import { assert } from '../../../../util/assert'
import { getDivTextSize } from '../../../../util/text/getDivTextSize'

assert.deepEqual(getDivTextSize('', 12, 12), {
  width: 0,
  height: 12,
})
assert.deepEqual(getDivTextSize('identity', 12, 12), {
  width: 48,
  height: 12,
})
assert.deepEqual(getDivTextSize('a  ', 12, 12), {
  width: 18,
  height: 12,
})
assert.deepEqual(getDivTextSize('  a  ', 12, 12), {
  width: 30,
  height: 12,
})
assert.deepEqual(getDivTextSize('find last index from or default', 12, 12), {
  width: 60,
  height: 36,
})
assert.deepEqual(getDivTextSize('012345678900012345678900', 12, 12), {
  width: 72,
  height: 24,
})
assert.deepEqual(getDivTextSize('012345678901234567890123456789', 12, 12), {
  width: 72,
  height: 36,
})
assert.deepEqual(getDivTextSize('not logged in', 12, 18), {
  width: 78,
  height: 12,
})
assert.deepEqual(getDivTextSize('012345678901 ', 12, 12), {
  width: 72,
  height: 12,
})
assert.deepEqual(getDivTextSize('alphabet letter index ', 12, 18), {
  width: 90,
  height: 24,
})
