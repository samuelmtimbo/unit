import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types/GraphSpec'
import { system } from '../../util/system'

const spec =
  require('../../../system/core/common/HasLength/spec.json') as GraphSpec

const HasLength = fromSpec<
  { a: number[]; b: number },
  { true: number[]; false: number[] }
>(spec, _specs)

const hasLength = new HasLength(system)

false && watchUnitAndLog(hasLength)
false && watchGraphAndLog(hasLength)

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
