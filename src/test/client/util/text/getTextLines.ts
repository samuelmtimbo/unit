import assert from '../../../../util/assert'
import { getTextLines } from '../../../../util/text/getTextLines'

assert.deepEqual(getTextLines('', 12), [])
assert.deepEqual(getTextLines('identity', 12), ['identity'])
assert.deepEqual(getTextLines('find last index from or default', 12), [
  'find last ',
  'index from ',
  'or default',
])
assert.deepEqual(getTextLines('012345678900012345678900', 12), [
  '012345678900',
  '012345678900',
])
assert.deepEqual(getTextLines('012345678901234567890123456789', 12), [
  '012345678901',
  '234567890123',
  '456789',
])
assert.deepEqual(getTextLines('0123456789010123456789 0', 12), [
  '012345678901',
  '0123456789 0',
])
assert.deepEqual(getTextLines('012345678900 012345678900', 12), [
  '012345678900',
  ' 01234567890',
  '0',
])
assert.deepEqual(getTextLines('0 0123456789000123456789', 12), [
  '0 ',
  '012345678900',
  '0123456789',
])
assert.deepEqual(getTextLines('not logged in', 18), ['not logged in'])
assert.deepEqual(getTextLines('012345678901234567890123 456789', 12), [
  '012345678901',
  '234567890123',
  ' 456789',
])
assert.deepEqual(getTextLines('012345 01234', 12), ['012345 01234'])
assert.deepEqual(getTextLines('012345 012345', 12), ['012345 ', '012345'])
assert.deepEqual(getTextLines('012345678901 ', 12), ['012345678901', ' '])
