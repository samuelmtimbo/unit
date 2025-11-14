import assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Set from '../../../../system/f/object/Set'
import { system } from '../../../util/system'

const set_ = new Set(system)

set_.play()

false && watchUnitAndLog(set_)

set_.push('obj', {})
set_.push('key', 'foo')
set_.push('value', 'bar')
assert.deepEqual(set_.peakOutput('obj'), { foo: 'bar' })
