import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'
const spec =
  require('../../../system/core/common/Increment/spec.json') as GraphSpec

const Increment = fromSpec<{ a: number }, { 'a + 1': number }>(
  spec,
  globalThis.__specs
)

const increment = new Increment()

false && watchUnitAndLog(increment)
false && watchGraphAndLog(increment)

// do not forget to play
increment.play()

increment.push('a', 0)
assert.equal(increment.take('a + 1'), 1)
assert.equal(increment.take('a + 1'), undefined)

increment.push('a', 1)
assert.equal(increment.take('a + 1'), 2)
assert.equal(increment.take('a + 1'), undefined)
