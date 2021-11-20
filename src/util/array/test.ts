import assert from '../assert'
import { matchAll } from './index'

assert.deepEqual(
  matchAll([], [], () => true),
  []
)
assert.deepEqual(
  matchAll([0], [], () => true),
  []
)
assert.deepEqual(
  matchAll([0], [0], () => true),
  [[0, 0]]
)
assert.deepEqual(
  matchAll([0], [0, 1], () => true),
  [
    [0, 0],
    [0, 1],
  ]
)
assert.deepEqual(
  matchAll([0, 1], [0, 1], () => true),
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]
)
assert.deepEqual(
  matchAll([0, 1], [0, 1], (ai, bi) => ai * bi > 0),
  [[1, 1]]
)
