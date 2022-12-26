import * as assert from 'assert'
import { Primitive } from '../Primitive'
import { system } from './util/system'

const RANDOM_ID = system.newSpecId()

const primitive = new Primitive({}, {}, system, RANDOM_ID)

primitive.play()

assert.equal(primitive.getInputCount(), 0)
assert.equal(primitive.getOutputCount(), 0)
