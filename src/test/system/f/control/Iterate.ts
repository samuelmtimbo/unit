import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Iterate from '../../../../system/f/control/Iterate'
import { system } from '../../../util/system'

const iterate = new Iterate(system)

false && watchUnitAndLog(iterate)

iterate.play()

iterate.push('init', 0)
assert.equal(iterate.peakInput('init'), 0)
assert.equal(iterate.peakOutput('current'), 0)
assert.equal(iterate.peakOutput('local'), 0)

iterate.push('next', 1)
assert.equal(iterate.peakOutput('current'), 1)
assert.equal(iterate.takeOutput('local'), 0)
assert.equal(iterate.peakOutput('local'), 1)
assert.equal(iterate.peakInput('init'), 0)
assert.equal(iterate.peakInput('next'), undefined)
assert.equal(iterate.takeOutput('current'), 1)
assert.equal(iterate.peakInput('init'), undefined)

iterate.push('init', 2)
assert.equal(iterate.peakOutput('current'), 2)
assert.equal(iterate.takeOutput('local'), 2)
assert.equal(iterate.takeInput('init'), 2)
assert.equal(iterate.peakOutput('current'), undefined)

iterate.push('init', 3)
assert.equal(iterate.peakOutput('current'), 3)
assert.equal(iterate.take('local'), 3)
iterate.push('next', 4)
assert.equal(iterate.peakInput('next'), undefined)
assert.equal(iterate.peakOutput('current'), 4)
assert.equal(iterate.take('local'), 4)
iterate.push('next', 5)
assert.equal(iterate.peakInput('next'), undefined)
assert.equal(iterate.peakOutput('current'), 5)
assert.equal(iterate.take('local'), 5)
