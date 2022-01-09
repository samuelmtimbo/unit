import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Concat from '../../../../system/f/string/Concat'
import { pod, system } from '../../../util/system'

const concat = new Concat(system, pod)

concat.play()

false && watchUnitAndLog(concat)

concat.push('a', 'bar')
concat.push('b', 'foo')
assert.equal(concat.peakOutput('ab'), 'barfoo')
assert.equal(concat.peakInput('a'), 'bar')
assert.equal(concat.peakInput('b'), 'foo')

concat.push('a', 'zaz')
concat.push('b', 'tar')
assert.equal(concat.peakInput('a'), 'zaz')
assert.equal(concat.peakInput('b'), 'tar')
assert.equal(concat.take('ab'), 'zaztar')
