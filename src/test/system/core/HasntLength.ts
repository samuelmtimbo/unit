import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'
const spec =
  require('../../../system/core/common/HasntLength/spec.json') as GraphSpec

const HasntLength = fromSpec<{ a: number[]; b: number }, { a: number[] }>(
  spec,
  globalThis.__specs
)

const hasntLength = new HasntLength()

false && watchUnitAndLog(hasntLength)
false && watchGraphAndLog(hasntLength)

// do not forget to play
hasntLength.play()

hasntLength.push('a', [])
hasntLength.push('b', 1)
assert.deepEqual(hasntLength.take('a'), [])

hasntLength.push('a', [])
hasntLength.push('b', 0)
assert.deepEqual(hasntLength.take('a'), undefined)

hasntLength.push('a', [1, 2, 3])
hasntLength.push('b', 2)
assert.deepEqual(hasntLength.take('a'), [1, 2, 3])

hasntLength.push('a', [1, 2, 3])
hasntLength.push('b', 3)
assert.deepEqual(hasntLength.take('a'), undefined)
