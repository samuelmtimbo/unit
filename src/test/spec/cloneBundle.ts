import pod from '../../script/build/worker/pod'
import Identity from '../../system/f/control/Identity'
import assert from '../../util/assert'
import { system } from '../util/system'
import { ID_IDENTITY } from './id'

const identity = new Identity(system, pod)

identity._ = ID_IDENTITY

assert.deepEqual(identity.getBundleSpec(), {
  unit: { id: ID_IDENTITY },
})

identity.push('a', 0)

assert.deepEqual(identity.getBundleSpec(), {
  unit: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '0',
      },
    },
  },
})
