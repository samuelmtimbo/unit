import * as assert from 'assert'
import { Primitive } from '../Primitive'

const primitive = new Primitive({})

assert.equal(primitive.getInputCount(), 0)
assert.equal(primitive.getOutputCount(), 0)
