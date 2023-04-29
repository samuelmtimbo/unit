import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Identity from '../../../../system/f/control/Identity'
import { system } from '../../../util/system'

const identity = new Identity<number>(system)

identity.play()

false && watchUnitAndLog(identity)

identity.push('a', 1)

assert.equal(identity.takeOutput('a'), 1)

identity.push('a', 1)

assert.equal(identity.takeOutput('a'), 1)

identity.push('a', null)

assert.equal(identity.takeOutput('a'), null)

identity.setInputConstant('a', true)

assert(identity.getInput('a').constant())

identity.push('a', 4)

assert.equal(identity.peakInput('a'), 4)
assert.equal(identity.peakOutput('a'), 4)
assert.equal(identity.takeOutput('a'), 4)
assert.equal(identity.takeOutput('a'), 4)
assert.equal(identity.takeOutput('a'), 4)

const snap = identity.snapshot()

assert.deepEqual(snap, {
  input: {
    a: {
      _register: 4,
      _invalid: false,
      _constant: true,
      _ignored: false,
      _idle: false,
    },
  },
  output: {
    a: {
      _register: 4,
      _invalid: false,
      _constant: false,
      _ignored: false,
      _idle: false,
    },
  },
  memory: {
    _backwarding: false,
    _forwarding: false,
    _forwarding_empty: false,
    _looping: true,
  },
})

const another_identity = new Identity(system)

another_identity.restore(snap)

assert.deepEqual(another_identity.snapshot(), {
  input: {
    a: {
      _register: 4,
      _invalid: false,
      _constant: true,
      _ignored: false,
      _idle: false,
    },
  },
  output: {
    a: {
      _register: 4,
      _invalid: false,
      _constant: false,
      _ignored: false,
      _idle: false,
    },
  },
  memory: {
    _backwarding: false,
    _forwarding: false,
    _forwarding_empty: false,
    _looping: true,
  },
})
