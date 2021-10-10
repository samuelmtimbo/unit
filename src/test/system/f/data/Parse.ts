import { watchUnitAndLog } from '../../../../debug'
import Parse from '../../../../system/f/data/Parse'
import { testSISO } from '../../../util'

const parse = new Parse()

false && watchUnitAndLog(parse)

testSISO(parse, '0', 0)
testSISO(parse, '"foo"', 'foo')
testSISO(parse, '{}', {})
testSISO(parse, '[]', [])
