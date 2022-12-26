import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { system } from '../../util/system'

const spec =
  require('../../../system/core/control/IfNot/spec.json') as GraphSpec
const IfNot = fromSpec<{ a: any; b: boolean }, { 'a if not b': any }>(
  spec,
  _specs
)

const ifNot = new IfNot(system)

false && watchUnitAndLog(ifNot)
false && watchGraphAndLog(ifNot)

ifNot.play()

ifNot.push('a', 1)
ifNot.push('b', true)
assert.equal(ifNot.take('a if not b'), undefined)

ifNot.push('a', 1)
ifNot.push('b', false)
assert.equal(ifNot.take('a if not b'), 1)

ifNot.setInputConstant('a', true)
ifNot.setInputConstant('b', true)
ifNot.push('a', 1)
ifNot.push('b', false)
assert.equal(ifNot.take('a if not b'), 1)
assert.equal(ifNot.take('a if not b'), 1)
assert.equal(ifNot.take('a if not b'), 1)
assert.equal(ifNot.take('a if not b'), 1)
assert.equal(ifNot.take('a if not b'), 1)
assert.equal(ifNot.take('a if not b'), 1)
