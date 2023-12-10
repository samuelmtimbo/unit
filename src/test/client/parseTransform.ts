import { parseTransform } from '../../client/parseTransform'
import assert from '../../util/assert'

assert.deepEqual(
  parseTransform('translateX(10px)', 100, 100),
  [10, 0, 1, 1, 0, 0, 0]
)
assert.deepEqual(
  parseTransform('translate(10px, 15px) scale(2) rotate(90deg)', 100, 100),
  [10, 15, 2, 2, 0, 0, 90]
)
