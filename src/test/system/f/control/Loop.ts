import assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Loop from '../../../../system/f/control/Loop'
import { system } from '../../../util/system'

const loop = new Loop(system)

loop.play()

false && watchUnitAndLog(loop)

loop.push('init', 1)

assert.equal(loop.peakInput('init'), 1)
assert.equal(loop.take('local'), 1)

loop.push('test', false)

assert.equal(loop.peakOutput('local'), undefined)
assert.equal(loop.peakOutput('current'), undefined)
assert.equal(loop.take('final'), 1)
assert.equal(loop.peakInput('test'), undefined)
assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.peakInput('test'), undefined)

loop.push('init', 1)

assert.equal(loop.peakInput('init'), 1)
assert.equal(loop.take('local'), 1)

loop.push('test', true)

assert.equal(loop.peakOutput('current'), 1)

loop.push('next', 2)

assert.equal(loop.take('current'), 1)
assert.equal(loop.take('local'), 2)

loop.push('init', 1)

assert.equal(loop.peakInput('init'), 1)
assert.equal(loop.take('local'), 1)

loop.push('next', 2)

assert.equal(loop.peakOutput('local'), undefined)
assert.equal(loop.takeInput('next'), 2)

loop.push('test', false)

assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.peakOutput('local'), undefined)
assert.equal(loop.takeOutput('final'), 1)

loop.push('init', 1)
loop.push('test', true)

assert.equal(loop.take('local'), 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('current'), undefined)

loop.push('next', 2)

assert.equal(loop.take('local'), 2)
assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.peakInput('test'), undefined)

loop.push('test', false)

assert.equal(loop.take('local'), undefined)
assert.equal(loop.take('current'), undefined)
assert.equal(loop.take('final'), 2)
assert.equal(loop.peakInput('test'), undefined)
assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.peakInput('test'), undefined)

loop.push('init', 1)

assert.equal(loop.take('local'), 1)

loop.push('test', false)

assert.equal(loop.peak('current'), undefined)
assert.equal(loop.peak('final'), 1)
assert.equal(loop.takeInput('test'), false)
assert.equal(loop.peak('final'), undefined)

loop.push('init', 1)

assert.equal(loop.take('local'), 1)

loop.push('test', true)

assert.equal(loop.peak('current'), 1)

loop.push('test', true)

assert.equal(loop.peak('current'), 1)

loop.push('init', 1)

assert.equal(loop.take('local'), 1)

loop.push('test', true)

assert.equal(loop.peak('current'), 1)
assert.equal(loop.peak('final'), undefined)

loop.push('test', false)

assert.equal(loop.peak('current'), undefined)
assert.equal(loop.peak('final'), 1)

loop.push('init', 1)

assert.equal(loop.take('local'), 1)

loop.push('test', false)

assert.equal(loop.peak('current'), undefined)
assert.equal(loop.peak('final'), 1)

loop.push('test', true)

assert.equal(loop.peak('current'), 1)
assert.equal(loop.getOutput('final').invalid(), true)

loop.push('init', 1)

assert.equal(loop.take('local'), 1)

loop.push('test', true)
loop.push('next', 2)

assert.equal(loop.peak('current'), 1)
assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.takeInput('test'), true)
assert.equal(loop.peak('current'), undefined)

loop.push('test', true)

assert.equal(loop.take('current'), 1)

loop.push('next', 3)

assert.equal(loop.take('local'), 3)

loop.push('test', false)

assert.equal(loop.take('current'), undefined)
assert.equal(loop.take('final'), 3)
assert.equal(loop.peakInput('test'), undefined)

loop.setOutputIgnored('current', true)
loop.setOutputIgnored('local', true)

loop.push('init', 0)
loop.push('test', true)
loop.push('next', 1)

assert.equal(loop.peakInput('test'), undefined)
assert.equal(loop.takeInput('init'), 0)

loop.setOutputIgnored('current', false)
loop.setOutputIgnored('local', false)

loop.setOutputIgnored('local', true)
loop.push('init', 1)
loop.push('test', true)
loop.push('next', 2)
assert.equal(loop.takeOutput('current'), 1)
loop.setOutputIgnored('local', false)

loop.reset()
loop.pause()
loop.push('init', 7)
loop.push('next', 8)
loop.push('test', true)
loop.play()
assert.equal(loop.take('local'), 7)
assert.equal(loop.take('current'), 7)
assert.equal(loop.take('local'), 8)
assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.peakInput('test'), undefined)
loop.push('test', false)
assert.equal(loop.take('local'), undefined)
assert.equal(loop.take('current'), undefined)
assert.equal(loop.take('final'), 8)
assert.equal(loop.peakInput('next'), undefined)
assert.equal(loop.peakInput('test'), undefined)
assert.equal(loop.peakInput('init'), undefined)

loop.setOutputIgnored('local', true)
loop.setInputConstant('test', true)
loop.push('test', true)
loop.push('init', 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.peak('current'), undefined)
loop.push('next', 1)
assert.equal(loop.take('current'), 1)
assert.equal(
  loop.peak('current'),
  undefined,
  'current should not be overridden'
)
loop.push('next', 1)
assert.equal(loop.peakInput('next'), undefined)
loop.setOutputIgnored('local', false)

loop.setOutputIgnored('local', true)
loop.setInputConstant('test', true)
loop.push('test', true)
loop.push('init', 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.peak('current'), undefined)
loop.push('init', 2)
assert.equal(loop.take('current'), 2)
assert.equal(loop.peak('current'), undefined)

loop.setOutputIgnored('local', true)
loop.setInputConstant('next', true)
loop.push('next', 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('current'), 1)
loop.setOutputIgnored('local', false)

loop.setOutputIgnored('local', true)
loop.setInputConstant('test', true)
loop.push('test', true)
loop.push('init', 1)
assert.equal(loop.peak('current'), 1)
assert.equal(loop.takeInput('init'), 1)
assert.equal(loop.peak('current'), undefined)
loop.push('init', 2)
assert.equal(loop.peak('current'), 2)
loop.setOutputIgnored('local', false)

loop.pause()
loop.setInputConstant('init', true)
loop.setInputConstant('next', true)
loop.setInputConstant('test', true)
loop.push('init', 1)
loop.push('next', 1)
loop.push('test', true)
loop.play()
assert.equal(loop.take('local'), 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('local'), 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('local'), 1)
assert.equal(loop.take('current'), 1)
loop.setInputConstant('next', false)
loop.setInputConstant('test', false)
assert.equal(loop.take('local'), 1)
assert.equal(loop.take('current'), 1)
assert.equal(loop.take('current'), undefined)
loop.setInputConstant('init', false)
loop.setInputConstant('next', false)
loop.setInputConstant('test', false)

const loop0 = new Loop(system)

loop0.play()

false && watchUnitAndLog(loop0)

loop0.push('init', 0)
loop0.push('test', false)

assert.equal(loop0.peak('final'), 0)

loop0.getInput('init').invalidate()
loop0.getInput('test').invalidate()

loop0.push('test', true)
loop0.push('init', 1)

assert.equal(loop0.peak('final'), 0)
assert.equal(loop0.getOutput('final').invalid(), true)
