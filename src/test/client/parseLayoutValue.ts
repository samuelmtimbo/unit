import { parseLayoutValue } from '../../client/parseLayoutValue'
import * as assert from '../../util/assert'

assert.deepEqual(parseLayoutValue('6px'), [6, 0])
assert.deepEqual(parseLayoutValue('100%'), [0, 100])
assert.deepEqual(parseLayoutValue('calc(100%-6px)'), [-6, 100])
assert.deepEqual(parseLayoutValue('calc(100% - 6px)'), [-6, 100])
assert.deepEqual(parseLayoutValue('calc(50% - 6px)'), [-6, 50])
assert.deepEqual(parseLayoutValue('calc(50% +- 6px)'), [-6, 50])
assert.deepEqual(parseLayoutValue('calc(50% + 2.4px)'), [2.4, 50])
assert.deepEqual(parseLayoutValue('calc(50% + - 2.4px)'), [-2.4, 50])
