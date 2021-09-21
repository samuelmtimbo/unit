import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/common/Switch/spec.json') as GraphSpec
const Switch = fromSpec<{ a: any; b: any; c: boolean }, { a: any }>(
  spec,
  globalThis.__specs
)
// import Switch from '../../../unit/system/core/common/Switch/Class'

const sweet = new Switch()

false && watchUnitAndLog(sweet)
false && watchGraphAndLog(sweet)

// do not forget to play
sweet.play()

sweet.push('a', 1)
sweet.push('c', true)
assert.equal(sweet.take('a'), 1)
assert.equal(sweet.take('a'), undefined)
assert.equal(sweet.peakInput('a'), undefined)
assert.equal(sweet.peakInput('c'), undefined)

sweet.push('a', 1)
sweet.push('b', 2)
sweet.push('c', false)
assert.equal(sweet.take('a'), 2)
assert.equal(sweet.peakInput('a'), 1)

sweet.setInputConstant('c', true)
sweet.push('c', false)
sweet.push('a', 3)
sweet.push('b', 4)
assert.equal(sweet.take('a'), 4)
sweet.push('b', 5)
assert.equal(sweet.take('a'), 5)
assert.equal(sweet.peakInput('a'), 3)
assert.equal(sweet.peakInput('b'), undefined)
assert.equal(sweet.peakInput('c'), false)
