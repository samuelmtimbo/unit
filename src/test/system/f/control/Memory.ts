import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Memory from '../../../../system/f/control/Memory'
import { pod, system } from '../../../util/system'

const memory = new Memory(system, pod)

memory.play()

false && watchUnitAndLog(memory)

memory.push('a', 0)
assert.equal(memory.peakInput('a'), undefined)
assert.equal(memory.take('a'), 0)
assert.equal(memory.take('a'), undefined)

memory.push('a', 1)
assert.equal(memory.peakInput('a'), undefined)
assert.equal(memory.take('a'), 1)
assert.equal(memory.take('a'), undefined)

// infinite loop
// memory.setInputConstant('a', true)
// memory.push('a', 2)
