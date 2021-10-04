import * as assert from 'assert'
import { Unit } from '../Class/Unit'

const unit = new Unit({})

assert.equal(unit.getInputCount(), 0)
assert.equal(unit.getOutputCount(), 0)
