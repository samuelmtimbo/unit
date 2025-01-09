import { watchUnitAndLog } from '../../../../debug'
import { fromBundle } from '../../../../spec/fromBundle'
import { ID_IDENTITY } from '../../../../system/_ids'
import Bundle from '../../../../system/f/meta/Bundle'
import { assert } from '../../../../util/assert'
import { system } from '../../../util/system'

const bundle = new Bundle(system)

bundle.play()

false && watchUnitAndLog(bundle)

const Class = fromBundle(
  {
    spec: {},
    specs: {},
  },
  system.specs,
  system.classes
)

const graph = new Class(system)

graph.play()

bundle.push('opt', {})
bundle.push('graph', graph)

assert.deepEqual(bundle.take('bundle'), {
  spec: {
    id: graph.id,
  },
  specs: {},
})

graph.addUnitSpec('identity', {
  unit: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '1',
        ignored: false,
      },
    },
    output: {
      a: {
        constant: false,
        ignored: false,
      },
    },
  },
})

bundle.push('opt', {})
bundle.push('graph', graph)

assert.deepEqual(bundle.take('bundle'), {
  spec: {
    id: graph.id,
    units: {
      identity: {
        id: '260d774e-bc89-4027-aa92-cb1985fb312b',
        input: {
          a: {
            data: '1',
            ignored: false,
          },
        },
        output: {
          a: {
            constant: false,
            ignored: false,
          },
        },
      },
    },
  },
  specs: {},
})

const identity = graph.getUnit('identity')

identity.push('a', 1)

bundle.push('opt', { deep: true })
bundle.push('graph', graph)

assert.deepEqual(bundle.take('bundle'), {
  spec: {
    id: graph.id,
    units: {
      identity: {
        id: '260d774e-bc89-4027-aa92-cb1985fb312b',
        memory: {
          input: {
            a: {
              _register: '1',
              _invalid: 'false',
              _constant: 'false',
              _ignored: 'false',
              _idle: 'false',
            },
          },
          output: {
            a: {
              _register: '1',
              _invalid: 'false',
              _constant: 'false',
              _ignored: 'false',
              _idle: 'false',
            },
          },
          memory: {
            _forwarding: 'false',
            _backwarding: 'false',
            _forwarding_empty: 'false',
            _looping: 'true',
          },
        },
        input: {
          a: {
            ignored: false,
            data: '1',
          },
        },
        output: {
          a: {
            ignored: false,
            constant: false,
          },
        },
      },
    },
  },
  specs: {},
})
