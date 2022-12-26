import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { system } from '../../util/system'

const spec =
  require('../../../system/core/common/TrueOrFalse/spec.json') as GraphSpec
const TrueOrFalse = fromSpec<
  { a: boolean },
  { 'a = true': boolean; 'a = false': boolean }
>(spec, _specs)

const trueOrFalse = new TrueOrFalse(system)

false && watchUnitAndLog(trueOrFalse)
false && watchGraphAndLog(trueOrFalse)

trueOrFalse.play()

trueOrFalse.push('a', true)

assert.equal(trueOrFalse.take('a = true'), true)
assert.equal(trueOrFalse.take('a = false'), undefined)

trueOrFalse.push('a', false)

assert.equal(trueOrFalse.take('a = true'), undefined)
assert.equal(trueOrFalse.take('a = false'), true)

export default null
