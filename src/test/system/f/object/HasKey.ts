import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import HasKey from '../../../../system/f/object/HasKey'
import { pod, system } from '../../../util/system'

const hasKey = new HasKey(system, pod)

hasKey.play()

false && watchUnitAndLog(hasKey)

hasKey.push('obj', {})
hasKey.push('key', 'foo')
assert.deepEqual(hasKey.takeOutput('has'), false)

hasKey.push('obj', { a: 1 })
hasKey.push('key', 'a')
assert.deepEqual(hasKey.takeOutput('has'), true)

hasKey.push('obj', { a: 1 })
hasKey.push('key', 'constructor')
assert.deepEqual(hasKey.takeOutput('has'), false)
