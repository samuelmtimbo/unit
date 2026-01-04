import { parentComponent } from '../../client/createParent'
import Div from '../../system/platform/component/Div/Component'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const root = new Div({}, system)

const parent = parentComponent({}, system)

const parentA = parentComponent({}, system)
const parentB = parentComponent({}, system)
const parentC = parentComponent({}, system)

const A = new Div({}, system)
const B = new Div({}, system)
const C = new Div({}, system)
const D = new Div({}, system)

parentA.registerRoot(A)

parentB.registerRoot(B)
parentB.registerRoot(C)

parentC.registerRoot(D)

parent.registerRoot(parentA)
parent.registerRoot(parentB)
parent.registerRoot(parentC)

root.appendChild(parent)

const leaves = parent.getRootLeaves()

assert.equal(leaves[0], A)
assert.equal(leaves[1], B)
assert.equal(leaves[2], C)
assert.equal(leaves[3], D)

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], B)
assert.equal(root.$domChildren[2], C)
assert.equal(root.$domChildren[3], D)
