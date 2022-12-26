import { watchUnitAndLog } from '../../../../debug'
import Add from '../../../../system/f/arithmetic/Add'
import TypeOf from '../../../../system/f/data/TypeOf'
import { testSISO } from '../../../util'
import { system } from '../../../util/system'

const typeOf = new TypeOf(system)

typeOf.play()

false && watchUnitAndLog(typeOf)

testSISO(typeOf, 'a', 0, 'type', 'number')
testSISO(typeOf, 'a', 'foo', 'type', 'string')
testSISO(typeOf, 'a', {}, 'type', 'object')
testSISO(typeOf, 'a', new Add(system), 'type', 'unit')
testSISO(typeOf, 'a', [], 'type', 'array')
