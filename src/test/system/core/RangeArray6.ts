import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/common/RangeArray6/spec.json')
const RangeArray6 = fromSpec<{ any: any }, { bit: number }>(
  spec,
  globalThis.__specs
)

const rangeArray6 = new RangeArray6()

false && watchUnitAndLog(rangeArray6)
false && watchGraphAndLog(rangeArray6)

// do not forget to play
rangeArray6.play()

assert.deepEqual(rangeArray6.take('a'), [0, 1, 2, 3, 4, 5])
assert.deepEqual(rangeArray6.take('a'), [0, 1, 2, 3, 4, 5])
