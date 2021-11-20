import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'

const spec = require('../../../system/core/string/NStringBuilderFrom/spec.json')
const NStringBuilderFrom = fromSpec(spec, _specs)

import { system } from '../../util/system'

const stringBuilder = new NStringBuilderFrom(system)

false && watchUnitAndLog(stringBuilder)
false && watchGraphAndLog(stringBuilder)

stringBuilder.play()

stringBuilder.push('n', 0)
stringBuilder.push('from', '')
assert.equal(stringBuilder.take('str'), '')
assert.equal(stringBuilder.take('str'), undefined)
assert.equal(stringBuilder.peakInput('n'), undefined)
assert.equal(stringBuilder.peakInput('a'), undefined)
assert.equal(stringBuilder.peakInput('from'), undefined)

stringBuilder.push('n', 7)
stringBuilder.push('from', '#')
stringBuilder.push('a', '7')
stringBuilder.push('a', '7')
stringBuilder.push('a', '5')
stringBuilder.push('a', '5')
stringBuilder.push('a', 'd')
stringBuilder.push('a', 'd')
assert.equal(stringBuilder.take('str'), '#7755dd')
assert.equal(stringBuilder.take('str'), undefined)
assert.equal(stringBuilder.peakInput('n'), undefined)
assert.equal(stringBuilder.peakInput('a'), undefined)
assert.equal(stringBuilder.peakInput('from'), undefined)

stringBuilder.setInputConstant('n', true)
stringBuilder.setInputConstant('from', true)
stringBuilder.push('n', 7)
stringBuilder.push('from', '#')
stringBuilder.push('a', '7')
stringBuilder.push('a', '7')
stringBuilder.push('a', '5')
stringBuilder.push('a', '5')
stringBuilder.push('a', 'd')
stringBuilder.push('a', 'd')
assert.equal(stringBuilder.take('str'), '#7755dd')
stringBuilder.push('a', '8')
assert.equal(stringBuilder.peakInput('a'), undefined)
