import * as assert from 'assert'
import { NOOP } from '../NOOP'
import { watchUnit } from '../debug/watchUnit'
import Identity from '../system/f/control/Identity'
import { system } from './util/system'

const identity = new Identity<number>(system)

assert.equal(identity.listenerCount('err'), 0)
assert.equal(identity.listenerCount('destroy'), 1)
assert.equal(identity._input.a.listenerCount('data'), 0)
assert.equal(identity._output.a.listenerCount('data'), 0)

const unlisten = watchUnit(identity, NOOP)

assert.equal(identity.listenerCount('err'), 2)
assert.equal(identity.listenerCount('destroy'), 3)
assert.equal(identity._input.a.listenerCount('data'), 1)
assert.equal(identity._output.a.listenerCount('data'), 1)

const unlisten0 = watchUnit(identity, NOOP)

assert.equal(identity.listenerCount('err'), 4)
assert.equal(identity.listenerCount('destroy'), 5)
assert.equal(identity._input.a.listenerCount('data'), 2)
assert.equal(identity._output.a.listenerCount('data'), 2)

unlisten()

assert.equal(identity.listenerCount('err'), 2)
assert.equal(identity.listenerCount('destroy'), 3)
assert.equal(identity._input.a.listenerCount('data'), 1)
assert.equal(identity._output.a.listenerCount('data'), 1)

unlisten0()

assert.equal(identity.listenerCount('err'), 0)
assert.equal(identity.listenerCount('destroy'), 1)
assert.equal(identity._input.a.listenerCount('data'), 0)
assert.equal(identity._output.a.listenerCount('data'), 0)

const unlisten1 = watchUnit(identity, NOOP)

assert.equal(identity.listenerCount('err'), 2)
assert.equal(identity.listenerCount('destroy'), 3)
assert.equal(identity._input.a.listenerCount('data'), 1)
assert.equal(identity._output.a.listenerCount('data'), 1)

identity.destroy()

assert.equal(identity.listenerCount('err'), 0)
assert.equal(identity.listenerCount('destroy'), 1)
assert.equal(identity._input.a.listenerCount('data'), 0)
assert.equal(identity._output.a.listenerCount('data'), 0)
