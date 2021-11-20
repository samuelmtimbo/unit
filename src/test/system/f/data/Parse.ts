import { watchUnitAndLog } from '../../../../debug'
import Parse from '../../../../system/f/data/Parse'
import { testSISO } from '../../../util'

const parse = new Parse()

false && watchUnitAndLog(parse)

testSISO(parse, 'str', '0', 'a', 0)
testSISO(parse, 'str', '"foo"', 'a', 'foo')
testSISO(parse, 'str', '{}', 'a', {})
testSISO(parse, 'str', '[]', 'a', [])
