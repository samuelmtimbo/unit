import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../../debug'
import Evaluate from '../../../../../system/f/math/expression/Evaluate'

const evaluate = new Evaluate()

false && watchUnitAndLog(evaluate)

evaluate.push('exp', 'x')
evaluate.push('obj', { x: 1 })
assert.equal(evaluate.take('value'), 1)

evaluate.push('exp', '4a(1 + b)')
evaluate.push('obj', { a: 1, b: 2 })
assert.equal(evaluate.take('value'), 12)

evaluate.push('exp', '4a(1 + b)^')
evaluate.push('obj', { a: 1, b: 2 })
assert.notEqual(evaluate.getErr(), null)
assert.notEqual(evaluate.getErr(), null)
