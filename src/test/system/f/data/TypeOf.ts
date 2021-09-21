import { watchUnitAndLog } from '../../../../debug'
import Add from '../../../../system/f/arithmetic/Add'
import TypeOf from '../../../../system/f/data/TypeOf'
import { testSISO } from '../../../util'

const typeOf = new TypeOf()

false && watchUnitAndLog(typeOf)

testSISO(typeOf, 0, 'number')
testSISO(typeOf, 'foo', 'string')
testSISO(typeOf, {}, 'object')
testSISO(typeOf, new Add(), 'unit')
testSISO(typeOf, [], 'array')
