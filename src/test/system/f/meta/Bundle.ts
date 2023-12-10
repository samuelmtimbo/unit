import { watchUnitAndLog } from '../../../../debug'
import { ID_IDENTITY } from '../../../../system/_ids'
import Bundle from '../../../../system/f/meta/Bundle'
import assert from '../../../../util/assert'
import { system } from '../../../util/system'

const bundle = new Bundle(system)

bundle.play()

false && watchUnitAndLog(bundle)

const Class = system.fromBundle({
  spec: {},
  specs: {},
})

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
            constant: false,
            data: undefined,
            ignored: false,
          },
        },
        memory: undefined,
        output: {
          a: {
            constant: false,
            data: undefined,
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

bundle.push('opt', { snapshot: true })
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
            data: undefined,
            constant: false,
          },
        },
        output: {
          a: {
            ignored: false,
            data: undefined,
            constant: false,
          },
        },
      },
    },
  },
  specs: {},
})
