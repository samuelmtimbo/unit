import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { system } from '../../util/system'

const spec = require('../../../system/core/common/LoopIncrement/spec.json')

const LoopIncrement = fromSpec(spec, _specs)

const loopIncrement = new LoopIncrement(system)

false && watchUnitAndLog(loopIncrement)
false && watchGraphAndLog(loopIncrement)
false && watchTreeAndLog(loopIncrement)

loopIncrement.play()

// infinite loop
// loopIncrement.setInputConstant('test', true)
// loopIncrement.setOutputIgnored('local', true)
// loopIncrement.setOutputIgnored('current', true)
// loopIncrement.push('test', true)
// loopIncrement.push('init', 0)
