import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../../debug'
import Variables from '../../../../../system/f/math/expression/Variables'

const variables = new Variables()

false && watchUnitAndLog(variables)

variables.push('exp', '1')
assert.deepEqual(variables.take('names'), [])

variables.push('exp', 'x')
assert.deepEqual(variables.take('names'), ['x'])

variables.push('exp', '4a(1 + b)')
assert.deepEqual(variables.take('names'), ['a', 'b'])

variables.push('exp', '(b + c)^a')
assert.deepEqual(variables.take('names'), ['a', 'b', 'c'])
