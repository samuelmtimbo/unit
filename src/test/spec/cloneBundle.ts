import { ID_IDENTITY } from '../../system/_ids'
import Identity from '../../system/f/control/Identity'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const identity = new Identity(system)

assert.deepEqual(identity.getUnitBundleSpec(), {
  unit: { id: ID_IDENTITY },
})

identity.push('a', 0)

assert.deepEqual(identity.getUnitBundleSpec(), {
  unit: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '0',
      },
    },
  },
})
