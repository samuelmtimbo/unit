import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Assoc from '../../../../system/f/object/Assoc'

const assoc = new Assoc()

false && watchUnitAndLog(assoc)

assoc.push('obj', {})
assoc.push('key', 'foo')
assoc.push('value', 'bar')
assert.deepEqual(assoc.peakOutput('obj'), { foo: 'bar' })
