import * as assert from 'assert'
import { Primitive } from '../Primitive'
import { pod, system } from './util/system'

const primitive = new Primitive({}, {}, system, pod)

primitive.play()

assert.equal(primitive.getInputCount(), 0)
assert.equal(primitive.getOutputCount(), 0)
