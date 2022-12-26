import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Set from '../../../../system/f/object/Set'
import { system } from '../../../util/system'

const assoc = new Set(system)

assoc.play()

false && watchUnitAndLog(assoc)

assoc.push('obj', {})
assoc.push('key', 'foo')
assoc.push('value', 'bar')
assert.deepEqual(assoc.peakOutput('obj'), { foo: 'bar' })
