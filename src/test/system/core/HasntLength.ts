import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { pod, system } from '../../util/system'
const spec =
  require('../../../system/core/common/HasntLength/spec.json') as GraphSpec

const HasntLength = fromSpec<{ a: number[]; b: number }, { a: number[] }>(
  spec,
  _specs
)

const hasntLength = new HasntLength(system, pod)

false && watchUnitAndLog(hasntLength)
false && watchGraphAndLog(hasntLength)

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
