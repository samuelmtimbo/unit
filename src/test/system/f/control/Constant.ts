import assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Constant from '../../../../system/f/control/Constant'
import { system } from '../../../util/system'

const constant = new Constant(system)

constant.play()

false && watchUnitAndLog(constant)

constant.push('a', 0)
assert.equal(constant.take('a'), 0)
assert.equal(constant.take('a'), 0)
assert.equal(constant.take('a'), 0)

constant.push('a', 1)
assert.equal(constant.take('a'), 1)
assert.equal(constant.take('a'), 1)
assert.equal(constant.take('a'), 1)

assert.equal(constant.takeInput('a'), 1)
assert.equal(constant.takeOutput('a'), undefined)
