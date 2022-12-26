import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Wait from '../../../../system/f/control/Wait'
import { system } from '../../../util/system'

const wait = new Wait(system)

wait.play()

false && watchUnitAndLog(wait)

wait.push('a', 1)
wait.push('b', 1)
assert.equal(wait.take('a'), 1)
assert.equal(wait.peakInput('a'), undefined)
assert.equal(wait.peakInput('b'), undefined)
assert.equal(wait.peakOutput('a'), undefined)

wait.setInputConstant('a', true)
wait.push('a', 2)
assert.equal(wait.take('a'), undefined)
wait.push('b', 'foo')
assert.equal(wait.take('a'), 2)
assert.equal(wait.take('a'), undefined)
