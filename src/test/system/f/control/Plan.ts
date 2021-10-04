import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Plan from '../../../../system/f/control/Plan'

const plan = new Plan()

false && watchUnitAndLog(plan)

plan.push('a', 0)
assert.equal(plan.peakInput('a'), 0)
assert.equal(plan.take('first'), 0)
assert.equal(plan.take('first'), undefined)
assert.equal(plan.peakInput('a'), 0)
assert.equal(plan.take('second'), 0)
assert.equal(plan.take('second'), undefined)
assert.equal(plan.peakInput('a'), undefined)

plan.push('a', 1)
assert.equal(plan.peakInput('a'), 1)
assert.equal(plan.peak('first'), 1)
plan.push('a', 2)
assert.equal(plan.peakInput('a'), 2)
assert.equal(plan.take('first'), 2)
assert.equal(plan.take('first'), undefined)
assert.equal(plan.take('second'), 2)
assert.equal(plan.take('second'), undefined)
assert.equal(plan.peakInput('a'), undefined)

plan.push('a', 3)
assert.equal(plan.peakInput('a'), 3)
assert.equal(plan.peak('first'), 3)
assert.equal(plan.takeInput('a'), 3)
assert.equal(plan.peak('first'), undefined)

plan.setOutputIgnored('first', true)
plan.push('a', 4)
assert.equal(plan.take('second'), 4)

// // infinite loop
// plan.setInputConstant('a', true)
// plan.setOutputIgnored('first', true)
// plan.setOutputIgnored('second', true)
// plan.push('a', 1)
