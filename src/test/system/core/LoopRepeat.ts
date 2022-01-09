import * as assert from 'assert'
import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { pod, system } from '../../util/system'

const spec = require('../../../system/core/common/LoopRepeat/spec.json')

const LoopRepeat = fromSpec(spec, _specs)

const loopRepeat = new LoopRepeat(system, pod)

false && watchUnitAndLog(loopRepeat)
false && watchGraphAndLog(loopRepeat)
false && watchTreeAndLog(loopRepeat)

loopRepeat.play()

loopRepeat.setOutputIgnored('current', true)
loopRepeat.push('init', 0)
loopRepeat.push('test', true)
assert.equal(loopRepeat.peakInput('test'), undefined)
assert.equal(loopRepeat.peakOutput('local'), 0)
loopRepeat.push('test', true)
assert.equal(loopRepeat.peakInput('test'), true)
assert.equal(loopRepeat.takeOutput('local'), 0)
assert.equal(loopRepeat.peakInput('test'), undefined)

// infinite loop
// loopRepeat.setInputConstant('test', true)
// loopRepeat.setOutputIgnored('local', true)
// loopRepeat.setOutputIgnored('current', true)
// loopRepeat.push('test', true)
// loopRepeat.push('init', 0)
