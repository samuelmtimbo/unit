import assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Substring from '../../../../system/f/string/Substr'
import { system } from '../../../util/system'

const substr = new Substring(system)

substr.play()

false && watchUnitAndLog(substr)

substr.push('a', 'foobar')
substr.push('from', 3)
substr.push('length', 3)
assert.equal(substr.take('a'), 'bar')

substr.push('a', 'foobar')
substr.push('from', 0)
substr.push('length', 3)
assert.equal(substr.take('a'), 'foo')
