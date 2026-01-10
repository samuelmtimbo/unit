import { Component } from '../../client/component'
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
const E = new Div({}, system)

parentA.setSubComponent('A', A)

parentA.registerRoot(A)

parentB.setSubComponent('B', B)
parentB.setSubComponent('C', C)

parentB.registerRoot(B)
parentB.registerRoot(C)

parentC.setSubComponent('D', D)

parentC.registerRoot(D)

parent.setSubComponent('parentA', parentA)
parent.setSubComponent('parentB', parentB)
parent.setSubComponent('parentC', parentC)

parent.registerRoot(parentA)
parent.registerRoot(parentB)
parent.registerRoot(parentC)

root.appendChild(parent)

let leaves: Component[]

leaves = parent.getRootLeaves()

assert.equal(leaves[0], A)
assert.equal(leaves[1], B)
assert.equal(leaves[2], C)
assert.equal(leaves[3], D)

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], B)
assert.equal(root.$domChildren[2], C)
assert.equal(root.$domChildren[3], D)

parentB.setSubComponent('E', E)

parentB.registerRoot(E)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], B)
assert.equal(root.$domChildren[2], C)
assert.equal(root.$domChildren[3], E)
assert.equal(root.$domChildren[4], D)

parentB.removeSubComponent('C')

parentB.unregisterRoot(C)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], B)
assert.equal(root.$domChildren[2], E)
assert.equal(root.$domChildren[3], D)

parent.removeSubComponent('parentB')

parent.unregisterRoot(parentB)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], D)

parent.setSubComponent('parentB', parentB)

parent.registerRoot(parentB, 1)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], B)
assert.equal(root.$domChildren[2], E)
assert.equal(root.$domChildren[3], D)

parent.removeSubComponent('parentA')

parent.unregisterRoot(parentA)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], B)
assert.equal(root.$domChildren[1], E)
assert.equal(root.$domChildren[2], D)

parent.setSubComponent('parentA', parentA)

parent.registerRoot(parentA, 0)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], A)
assert.equal(root.$domChildren[1], B)
assert.equal(root.$domChildren[2], E)
assert.equal(root.$domChildren[3], D)

parent.reorderSubComponent(null, 'parentB', 0)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], B)
assert.equal(root.$domChildren[1], E)
assert.equal(root.$domChildren[2], A)
assert.equal(root.$domChildren[3], D)

parentB.setSubComponent('C', C)

parentB.registerRoot(C, 1)

leaves = parent.getRootLeaves()

assert.equal(root.$domChildren[0], B)
assert.equal(root.$domChildren[1], C)
assert.equal(root.$domChildren[2], E)
assert.equal(root.$domChildren[3], A)
assert.equal(root.$domChildren[4], D)
