import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'
const spec =
  require('../../../system/core/common/LengthLessThanOr/spec.json') as GraphSpec

const LengthLTOr = fromSpec<{ a: number[]; b: number }, { equals: boolean }>(
  spec,
  globalThis.__specs
)

const lengthLTOr = new LengthLTOr()

false && watchUnitAndLog(lengthLTOr)
false && watchGraphAndLog(lengthLTOr)

// do not forget to play
lengthLTOr.play()

lengthLTOr.reset()
lengthLTOr.push('a', [1, 2, 3])
lengthLTOr.push('b', 3)
assert.equal(lengthLTOr.take('true'), false)
assert.equal(lengthLTOr.take('false'), true)

lengthLTOr.push('a', [1, 2, 3])
lengthLTOr.push('b', 3)
assert.equal(lengthLTOr.take('true'), false)
assert.equal(lengthLTOr.take('false'), true)

lengthLTOr.push('a', [1, 2])
lengthLTOr.push('b', 3)
assert.equal(lengthLTOr.take('true'), true)
assert.equal(lengthLTOr.take('false'), false)
