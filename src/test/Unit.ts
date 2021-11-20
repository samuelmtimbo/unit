import * as assert from 'assert'
import { Unit } from '../Class/Unit'
import { system } from './util/system'

const unit = new Unit({}, {}, system)

unit.play()

assert.equal(unit.getInputCount(), 0)
assert.equal(unit.getOutputCount(), 0)
