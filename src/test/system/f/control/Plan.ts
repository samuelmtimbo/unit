import assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Plan from '../../../../system/f/control/Plan'
import { system } from '../../../util/system'

const plan = new Plan(system)

plan.play()

false && watchUnitAndLog(plan)

plan.push('a', 0)
assert.equal(plan.peakInput('a'), 0)
assert.equal(plan.take('0'), 0)
assert.equal(plan.take('0'), undefined)
assert.equal(plan.peakInput('a'), 0)
assert.equal(plan.take('1'), 0)
assert.equal(plan.take('1'), undefined)
assert.equal(plan.peakInput('a'), undefined)

plan.push('a', 1)
assert.equal(plan.peakInput('a'), 1)
assert.equal(plan.peak('0'), 1)
plan.push('a', 2)
assert.equal(plan.peakInput('a'), 2)
assert.equal(plan.take('0'), 2)
assert.equal(plan.take('0'), undefined)
assert.equal(plan.take('1'), 2)
assert.equal(plan.take('1'), undefined)
assert.equal(plan.peakInput('a'), undefined)

plan.push('a', 3)
assert.equal(plan.peakInput('a'), 3)
assert.equal(plan.peak('0'), 3)
assert.equal(plan.takeInput('a'), 3)
assert.equal(plan.peak('0'), undefined)

plan.setOutputIgnored('0', true)
plan.push('a', 4)
assert.equal(plan.take('1'), 4)

// // infinite loop
// plan.setInputConstant('a', true)
// plan.setOutputIgnored('0', true)
// plan.setOutputIgnored('1', true)
// plan.push('a', 1)
