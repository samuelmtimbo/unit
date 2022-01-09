import * as assert from 'assert'
import Subtract from '../../../../system/f/arithmetic/Subtract'
import { pod, system } from '../../../util/system'

const subtract = new Subtract(system, pod)

subtract.play()

subtract.push('a', 1)
subtract.push('b', 2)
assert.equal(subtract.peakInput('a'), 1)
assert.equal(subtract.peakInput('b'), 2)
assert.equal(subtract.take('a - b'), -1)
