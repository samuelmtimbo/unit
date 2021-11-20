import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Constant from '../../../../system/f/control/Constant'

const constant = new Constant()

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
