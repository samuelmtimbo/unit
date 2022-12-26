import * as assert from 'assert'
import { Unit } from '../Class/Unit'
import { newSpecId } from '../client/spec'
import { system } from './util/system'

const RANDOM_ID = newSpecId(system.specs)

const unit = new Unit({}, {}, system, RANDOM_ID)

unit.play()

assert.equal(unit.getInputCount(), 0)
assert.equal(unit.getOutputCount(), 0)
