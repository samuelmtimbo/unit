import * as assert from 'assert'
import { watchUnit } from '../debug/watchUnit'
import NOOP from '../NOOP'
import Identity from '../system/f/control/Identity'

const identity = new Identity<number>()

// for (let i = 0; i < 20; i++) {

// }

// @ts-ignore
assert.equal(identity.listenerCount('err'), 0)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 0)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 0)

const unlisten = watchUnit(identity, NOOP)

// @ts-ignore
assert.equal(identity.listenerCount('err'), 2)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 3)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 1)

const unlisten0 = watchUnit(identity, NOOP)

// @ts-ignore
assert.equal(identity.listenerCount('err'), 4)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 5)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 2)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 2)

unlisten()

// @ts-ignore
assert.equal(identity.listenerCount('err'), 2)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 3)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 1)

unlisten0()

// @ts-ignore
assert.equal(identity.listenerCount('err'), 0)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 0)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 0)

const unlisten1 = watchUnit(identity, NOOP)

// @ts-ignore
assert.equal(identity.listenerCount('err'), 2)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 3)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 1)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 1)

identity.destroy()

// @ts-ignore
assert.equal(identity.listenerCount('err'), 0)
// @ts-ignore
assert.equal(identity.listenerCount('destroy'), 1)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('_data'), 0)
// @ts-ignore
assert.equal(identity._input.a.listenerCount('data'), 0)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('_data'), 0)
// @ts-ignore
assert.equal(identity._output.a.listenerCount('data'), 0)
