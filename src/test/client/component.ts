import Div from '../../system/platform/component/Div/Component'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const parent = new Div({}, system)

const A = new Div({}, system)
const B = new Div({}, system)
const C = new Div({}, system)

assert(parent.$children.length === 0)

parent.appendChild(A)
parent.appendChild(B)
parent.appendChild(C)

assert(parent.$children.length === 3)

assert.deepEqual(parent.$childSlotName, ['default', 'default', 'default'])

parent.removeChild(B)

assert(parent.$children.length === 2)

assert.deepEqual(parent.$childSlotName, ['default', 'default'])
