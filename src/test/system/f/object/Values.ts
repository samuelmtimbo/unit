import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Values from '../../../../system/f/object/Values'

const values = new Values()

values.play()

false && watchUnitAndLog(values)

values.push('obj', {})
assert.deepEqual(values.take('values'), [])

values.push('obj', { foo: 0, bar: 1 })
assert.deepEqual(values.take('values'), [0, 1])
