import * as assert from 'assert'
import { Unit } from '../../../../Class/Unit'
import { watchUnitAndLog } from '../../../../debug'
import Exec from '../../../../system/f/meta/Exec'
import { pod, system } from '../../../util/system'

const exec = new Exec(system, pod)

exec.play()

const unit = new Unit({}, {}, system, pod)

false && watchUnitAndLog(exec)

exec.push('unit', unit)
exec.push('method', 'getInputCount')
exec.push('args', [])
assert.equal(exec.takeOutput('return'), 0)
assert.equal(exec.peakInput('unit'), unit)

exec.push('method', 'getInputCount')
exec.push('args', [])
assert.equal(exec.peakOutput('return'), 0)
exec.takeInput('unit')
assert.equal(exec.peakOutput('return'), undefined)
