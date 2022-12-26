import Div from '../../system/platform/component/Div/Component'
import assert from '../../util/assert'
import { system } from '../util/system'

const parent = new Div({}, system)

const A = new Div({}, system)
const B = new Div({}, system)
const C = new Div({}, system)

assert(parent.$children.length === 0)

parent.insertChild(A, 0)
parent.insertChild(B, 1)
parent.insertChild(C, 1)

assert(parent.$children.length === 3)

assert.deepEqual(parent.$childSlotName, ['default', 'default', 'default'])

parent.removeChild(B)

assert(parent.$children.length === 2)

assert.deepEqual(parent.$childSlotName, ['default', 'default'])

parent.insertChild(B, 0)

assert(parent.$children.length === 3)

assert.deepEqual(parent.$childSlotName, ['default', 'default', 'default'])
