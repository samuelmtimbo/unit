import { Graph } from '../../../Class/Graph'
import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/common/LoopIncrement/spec.json')
const LoopIncrement = fromSpec(spec, globalThis.__specs)

const loopIncrement = new LoopIncrement() as Graph

false && watchUnitAndLog(loopIncrement)
false && watchGraphAndLog(loopIncrement)
false && watchTreeAndLog(loopIncrement)

// do not forget to play
loopIncrement.play()

// infinite loop
// loopIncrement.setInputConstant('test', true)
// loopIncrement.setOutputIgnored('local', true)
// loopIncrement.setOutputIgnored('current', true)
// loopIncrement.push('test', true)
// loopIncrement.push('init', 0)
