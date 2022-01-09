import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Length from '../../../../system/f/array/Length'
import { pod, system } from '../../../util/system'

const length = new Length(system, pod)

length.play()

false && watchUnitAndLog(length)

length.push('a', [])
assert.equal(length.take('length'), 0)

length.push('a', [1])
length.push('a', [1, 2])
assert.equal(length.take('length'), 2)
