import { Component } from '../../client/component'
import { componentClassFromSpec } from '../../client/componentClassFromSpec'
import { parentElement } from '../../client/platform/web/parentElement'
import Div from '../../system/platform/component/Div/Component'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const RandomColorBoxSpec = require('../../system/platform/core/component/RandomColorBox/spec.json')

const RandomColorBox = componentClassFromSpec(RandomColorBoxSpec, system.specs)

const root = new Div({}, system)

const parentA = new Component({}, system, parentElement(system))
const parentB = new Component({}, system, parentElement(system))

const A = new RandomColorBox({}, system)
const B = new RandomColorBox({}, system)
const C = new RandomColorBox({}, system)

const BBox = B.pathGetSubComponent(['box'])
const CBox = C.pathGetSubComponent(['box'])

const ADiv = A.pathGetSubComponent(['box', 'div'])
const BDiv = B.pathGetSubComponent(['box', 'div'])
const CDiv = C.pathGetSubComponent(['box', 'div'])

parentA.registerRoot(A)

parentA.$slot['default'] = A

A.registerParentRoot(B)
A.registerParentRoot(C)

parentB.registerRoot(parentA)

parentB.$slot['default'] = parentA

root.appendChild(parentB)

assert.equal(BDiv.$parent, BBox)
assert.equal(CDiv.$parent, CBox)

assert.equal(BDiv.$rootParent, null)
assert.equal(CDiv.$rootParent, null)

assert.equal(B.$rootParent, A)
assert.equal(C.$rootParent, A)

assert.equal(BDiv.$domParent, ADiv)
assert.equal(CDiv.$domParent, ADiv)

assert.equal(A.$parentRoot.indexOf(B), 0)
assert.equal(A.$parentRoot.indexOf(C), 1)

assert.equal(A.$mountParentRoot.indexOf(B), 0)
assert.equal(A.$mountParentRoot.indexOf(C), 1)

assert.equal(BDiv.$slotParent, ADiv)
assert.equal(CDiv.$slotParent, ADiv)

A.removeParentRoot(B)
A.removeParentRoot(C)

A.appendParentRoot(B, 'default')
A.appendParentRoot(C, 'default')

assert.equal(BDiv.$parent, BBox)
assert.equal(CDiv.$parent, CBox)

assert.equal(BDiv.$rootParent, null)
assert.equal(CDiv.$rootParent, null)

assert.equal(B.$rootParent, A)
assert.equal(C.$rootParent, A)

assert.equal(BDiv.$domParent, ADiv)
assert.equal(CDiv.$domParent, ADiv)

assert.equal(A.$parentRoot.indexOf(B), 0)
assert.equal(A.$parentRoot.indexOf(C), 1)

assert.equal(A.$mountParentRoot.indexOf(B), 0)
assert.equal(A.$mountParentRoot.indexOf(C), 1)

assert.equal(BDiv.$slotParent, ADiv)
assert.equal(CDiv.$slotParent, ADiv)

parentA.removeRoot(A)
parentA.appendRoot(A)

assert.equal(BDiv.$parent, BBox)
assert.equal(CDiv.$parent, CBox)

assert.equal(BDiv.$rootParent, null)
assert.equal(CDiv.$rootParent, null)

assert.equal(B.$rootParent, A)
assert.equal(C.$rootParent, A)

assert.equal(BDiv.$domParent, ADiv)
assert.equal(CDiv.$domParent, ADiv)

assert.equal(A.$parentRoot.indexOf(B), 0)
assert.equal(A.$parentRoot.indexOf(C), 1)

assert.equal(A.$mountParentRoot.indexOf(B), 0)
assert.equal(A.$mountParentRoot.indexOf(C), 1)

assert.equal(BDiv.$slotParent, ADiv)
assert.equal(CDiv.$slotParent, ADiv)

parentB.removeRoot(parentA)
parentB.appendRoot(parentA)

assert.equal(BDiv.$parent, BBox)
assert.equal(CDiv.$parent, CBox)

assert.equal(BDiv.$rootParent, null)
assert.equal(CDiv.$rootParent, null)

assert.equal(B.$rootParent, A)
assert.equal(C.$rootParent, A)

assert.equal(BDiv.$domParent, ADiv)
assert.equal(CDiv.$domParent, ADiv)

assert.equal(A.$parentRoot.indexOf(B), 0)
assert.equal(A.$parentRoot.indexOf(C), 1)

assert.equal(A.$mountParentRoot.indexOf(B), 0)
assert.equal(A.$mountParentRoot.indexOf(C), 1)

assert.equal(BDiv.$slotParent, ADiv)
assert.equal(CDiv.$slotParent, ADiv)

assert.equal(A.$slotParent, parentA)

parentB.removeRoot(parentA)
parentB.appendRoot(parentA)

assert.equal(BDiv.$parent, BBox)
assert.equal(CDiv.$parent, CBox)

assert.equal(BDiv.$rootParent, null)
assert.equal(CDiv.$rootParent, null)

assert.equal(B.$rootParent, A)
assert.equal(C.$rootParent, A)

assert.equal(BDiv.$domParent, ADiv)
assert.equal(CDiv.$domParent, ADiv)

assert.equal(A.$parentRoot.indexOf(B), 0)
assert.equal(A.$parentRoot.indexOf(C), 1)

assert.equal(A.$mountParentRoot.indexOf(B), 0)
assert.equal(A.$mountParentRoot.indexOf(C), 1)

assert.equal(BDiv.$slotParent, ADiv)
assert.equal(CDiv.$slotParent, ADiv)

assert.equal(A.$slotParent, parentA)
