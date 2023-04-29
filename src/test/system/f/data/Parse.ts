import { watchUnitAndLog } from '../../../../debug'
import Evaluate from '../../../../system/f/data/Evaluate'
import { testSISO } from '../../../util'
import { system } from '../../../util/system'

const parse = new Evaluate(system)

parse.play()

false && watchUnitAndLog(parse)

testSISO(parse, 'str', '0', 'a', 0)
testSISO(parse, 'str', '"foo"', 'a', 'foo')
testSISO(parse, 'str', '{}', 'a', {})
testSISO(parse, 'str', '[]', 'a', [])
