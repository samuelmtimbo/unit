import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { system } from '../../util/system'

const spec = require('../../../system/core/common/RangeArray6/spec.json')
const RangeArray6 = fromSpec<{}, { a: number[] }>(spec, _specs, {})

const rangeArray6 = new RangeArray6(system)

false && watchUnitAndLog(rangeArray6)
false && watchGraphAndLog(rangeArray6)

rangeArray6.play()

assert.deepEqual(rangeArray6.take('a'), [0, 1, 2, 3, 4, 5])
assert.deepEqual(rangeArray6.take('a'), [0, 1, 2, 3, 4, 5])
