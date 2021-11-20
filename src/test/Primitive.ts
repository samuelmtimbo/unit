import * as assert from 'assert'
import { Primitive } from '../Primitive'

const primitive = new Primitive({})

primitive.play()

assert.equal(primitive.getInputCount(), 0)
assert.equal(primitive.getOutputCount(), 0)
