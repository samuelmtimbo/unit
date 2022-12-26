import * as assert from 'assert'
import { watchUnitAndLog } from '../../debug'
import { lazyFromSpec } from '../../spec/Lazy'
import { ID_RANGE } from '../../system/_ids'
import _specs from '../../system/_specs'
import { system } from '../util/system'

const LazyRange = lazyFromSpec(_specs[ID_RANGE], _specs, {})

const lazyRange = new LazyRange(system, ID_RANGE)

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
