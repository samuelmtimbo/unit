import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Default from '../../../../system/f/control/Default'
import { system } from '../../../util/system'

const _default = new Default(system)

_default.play()

false && watchUnitAndLog(_default)

_default.push('d', 0)
assert.equal(_default.take('a'), 0)
assert.equal(_default.peakInput('d'), undefined)

_default.push('a', 1)
assert.equal(_default.take('a'), 1)
assert.equal(_default.peakInput('a'), undefined)

_default.push('d', 2)
_default.push('a', 3)
assert.equal(_default.take('a'), 3)
assert.equal(_default.peakInput('a'), undefined)
assert.equal(_default.peakInput('d'), 2)
assert.equal(_default.take('a'), 2)

_default.push('d', 2)
_default.push('a', 3)
assert.equal(_default.peakOutput('a'), 3)
assert.equal(_default.peakInput('a'), 3)
assert.equal(_default.peakInput('d'), 2)
assert.equal(_default.takeInput('a'), 3)
assert.equal(_default.peakOutput('a'), 2)

_default.setInputConstant('d', true)
_default.setInputConstant('a', true)
_default.push('d', 5)
_default.push('a', 6)
assert.equal(_default.take('a'), 6)
assert.equal(_default.take('a'), 6)
assert.equal(_default.take('a'), 6)
