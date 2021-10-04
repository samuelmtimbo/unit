import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'
const spec =
  require('../../../system/core/common/HasLength/spec.json') as GraphSpec

const HasLength = fromSpec<
  { a: number[]; b: number },
  { true: number[]; false: number[] }
>(spec, globalThis.__specs)

const hasLength = new HasLength()

false && watchUnitAndLog(hasLength)
false && watchGraphAndLog(hasLength)

// do not forget to play
hasLength.play()

hasLength.push('a', [])
hasLength.push('b', 0)
assert.deepEqual(hasLength.take('true'), [])
assert.deepEqual(hasLength.take('true'), undefined)
assert.deepEqual(hasLength.take('false'), undefined)

hasLength.push('a', [1, 2, 3])
hasLength.push('b', 3)
assert.deepEqual(hasLength.take('true'), [1, 2, 3])
assert.deepEqual(hasLength.take('false'), undefined)
