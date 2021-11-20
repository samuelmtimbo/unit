import { watchUnitAndLog } from '../../../../debug'
import Add from '../../../../system/f/arithmetic/Add'
import TypeOf from '../../../../system/f/data/TypeOf'
import { testSISO } from '../../../util'

const typeOf = new TypeOf()

false && watchUnitAndLog(typeOf)

testSISO(typeOf, 'a', 0, 'type', 'number')
testSISO(typeOf, 'a', 'foo', 'type', 'string')
testSISO(typeOf, 'a', {}, 'type', 'object')
testSISO(typeOf, 'a', new Add(), 'type', 'unit')
testSISO(typeOf, 'a', [], 'type', 'array')
