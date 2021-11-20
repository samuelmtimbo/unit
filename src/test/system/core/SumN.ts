import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'

const spec = require('../../../system/core/common/SumN/spec.json') as GraphSpec

const SumN = fromSpec<{ a: number; n: number }, { sum: number }>(
  spec,
  _specs
)

import { system } from '../../util/system'

const sumN = new SumN(system)

false && watchUnitAndLog(sumN)
false && watchGraphAndLog(sumN)
false && watchGraphAndLog(sumN.refUnit('sumnfrom') as Graph)


sumN.play()

sumN.push('n', 2)
sumN.push('a', 5)
sumN.push('a', 6)
assert.equal(sumN.take('sum'), 11)
assert.equal(sumN.take('sum'), undefined)
