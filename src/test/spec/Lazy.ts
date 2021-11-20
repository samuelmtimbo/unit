import * as assert from 'assert'
import { watchUnitAndLog } from '../../debug'
import { lazyFromSpec } from '../../spec/Lazy'
import _specs from '../../system/_specs'
import { system } from '../util/system'

const LazyRange = lazyFromSpec(
  _specs['29e43ad7-be5e-437f-8f0f-2df996c8b89c'],
  _specs,
  {}
)

const lazyRange = new LazyRange(system)

lazyRange.play()

lazyRange.setOutputIgnored('test', true)

false && watchUnitAndLog(lazyRange)

lazyRange.push('a', 0)
lazyRange.push('b', 1)
assert.equal(lazyRange.take('i'), 0)
assert.equal(lazyRange.take('i'), undefined)

lazyRange.push('a', 0)
lazyRange.push('b', 2)
assert.equal(lazyRange.take('i'), 0)
assert.equal(lazyRange.take('i'), 1)
assert.equal(lazyRange.take('i'), undefined)

lazyRange.push('a', 2)
lazyRange.push('b', 5)
assert.equal(lazyRange.take('i'), 2)
assert.equal(lazyRange.take('i'), 3)
assert.equal(lazyRange.take('i'), 4)
assert.equal(lazyRange.take('i'), undefined)
