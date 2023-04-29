import * as assert from 'assert'
import Identity from '../system/f/control/Identity'
import { ID_IDENTITY } from '../system/_ids'
import { system } from './util/system'

const identity = new Identity(system)

assert.deepEqual(identity.getUnitBundleSpec(), {
  unit: {
    id: ID_IDENTITY,
    memory: {
      input: {
        a: { _invalid: false, _constant: false, _ignored: false, _idle: true },
      },
      output: {
        a: { _invalid: false, _constant: false, _ignored: false, _idle: true },
      },
      memory: {
        _forwarding: false,
        _backwarding: false,
        _forwarding_empty: false,
        _looping: false,
      },
    },
  },
  specs: {},
})
