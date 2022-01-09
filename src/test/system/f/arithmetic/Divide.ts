import * as assert from 'assert'
import Divide from '../../../../system/f/arithmetic/Divide'
import { pod, system } from '../../../util/system'

const divide = new Divide(system, pod)

divide.play()

divide.push('a', 1)
divide.push('b', 2)
assert.equal(divide.peakInput('a'), 1)
assert.equal(divide.peakInput('b'), 2)
assert.equal(divide.take('a ÷ b'), 1 / 2)
assert.equal(divide.peakOutput('a ÷ b'), undefined)
assert.equal(divide.peakInput('a'), undefined)
assert.equal(divide.peakInput('b'), undefined)

divide.push('a', 1)
divide.push('b', 0)
assert.notEqual(divide.getErr(), null)
divide.takeErr()
assert.equal(divide.peakOutput('a ÷ b'), undefined)
assert.equal(divide.peakInput('a'), undefined)
assert.equal(divide.peakInput('b'), undefined)

divide.push('a', 1)
divide.push('b', 0)
assert.notEqual(divide.getErr(), null)
assert.equal(divide.peakInput('a'), 1)
assert.equal(divide.peakInput('b'), 0)
divide.push('b', 1)
assert.equal(divide.getErr(), null)
assert.equal(divide.takeInput('a'), 1)
assert.equal(divide.takeInput('b'), 1)

divide.push('a', 1)
divide.push('b', 0)
assert.equal(divide.takeInput('b'), 0)
assert.equal(divide.getErr(), null)
assert.equal(divide.peakInput('a'), 1)
