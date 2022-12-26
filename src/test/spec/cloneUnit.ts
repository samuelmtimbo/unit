import assert = require('assert')
import { Graph } from '../../Class/Graph'
import { Unit } from '../../Class/Unit'
import { cloneUnit } from '../../spec/cloneUnit'
import { fromId } from '../../spec/fromId'
import Add from '../../system/f/arithmetic/Add'
import Identity from '../../system/f/control/Identity'
import _classes from '../../system/_classes'
import { ID_RANGE } from '../../system/_ids'
import _specs from '../../system/_specs'
import { system } from '../util/system'

const identity = new Identity<number>(system)

identity.play()

identity.push('a', 0)

assert.equal(identity.peakInput('a'), 0)
assert.equal(identity.peakOutput('a'), 0)

const clonedIdentity = cloneUnit(identity)

assert.equal(clonedIdentity.peakInput('a'), 0)
assert.equal(clonedIdentity.peakOutput('a'), 0)

clonedIdentity.play()

assert.equal(clonedIdentity.peakInput('a'), 0)
assert.equal(clonedIdentity.peakOutput('a'), 0)

clonedIdentity.push('a', 1)

assert.equal(clonedIdentity.peakInput('a'), 1)
assert.equal(clonedIdentity.peakOutput('a'), 1)

const add = new Add(system)

add.play()

add.setInputConstant('a', true)
add.push('a', 1)

const clonedAdd = cloneUnit(add)

clonedAdd.play()

clonedAdd.push('b', 2)

assert.equal(clonedAdd.getInput('a').constant(), true)
assert.equal(clonedAdd.peakInput('a'), 1)
assert.equal(clonedAdd.peakOutput('a + b'), 3)

const Range = fromId<Unit<{ a: number; b: number }, { i: number }>>(
  ID_RANGE,
  _specs,
  _classes
)

const range = new Range(system)

range.play()

range.push('a', 0)
range.push('b', 3)

range.setOutputIgnored('test', true)

assert.equal(range.peakInput('a'), 0)
assert.equal(range.peakInput('b'), 3)
assert.equal(range.peakOutput('i'), 0)

const clonedRange = cloneUnit(range)

clonedRange.play()

assert.equal(clonedRange.peakInput('a'), 0)
assert.equal(clonedRange.peakInput('b'), 3)
assert.equal(clonedRange.takeOutput('i'), 0)
assert.equal(clonedRange.takeOutput('i'), 1)
assert.equal(clonedRange.takeOutput('i'), 2)
assert.equal(clonedRange.peakOutput('i'), undefined)

const clonedRange0 = cloneUnit(range) as Graph

clonedRange0.play()

assert.equal(clonedRange0.takeInput('a'), 0)
assert.equal(clonedRange0.takeOutput('i'), undefined)
