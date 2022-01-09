import * as assert from 'assert'
import { Unit } from '../Class/Unit'
import { pod, system } from './util/system'

const unit = new Unit({}, {}, system, pod)

unit.play()

assert.equal(unit.getInputCount(), 0)
assert.equal(unit.getOutputCount(), 0)
