import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphClass, GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/common/CompareLTE/spec.json') as GraphSpec
const CompareLessThanEqual = fromSpec(spec, globalThis.__specs) as GraphClass

const compareLTE = new CompareLessThanEqual()

false && watchUnitAndLog(compareLTE)
false && watchGraphAndLog(compareLTE)

// do not forget to play
compareLTE.play()

compareLTE.push('a', 1)
compareLTE.push('b', 3)
assert.equal(compareLTE.take('a ≤ b'), true)
assert.equal(compareLTE.take('a > b'), false)

compareLTE.push('a', 3)
compareLTE.push('b', 3)
assert.equal(compareLTE.take('a ≤ b'), true)
assert.equal(compareLTE.take('a > b'), false)

compareLTE.push('a', 3)
compareLTE.push('b', 2)
assert.equal(compareLTE.take('a ≤ b'), false)
assert.equal(compareLTE.take('a > b'), true)
