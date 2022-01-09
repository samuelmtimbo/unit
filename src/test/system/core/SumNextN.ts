import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { pod, system } from '../../util/system'

const spec = {
  id: '47119174-5dcb-11ea-8a04-4b0a14d0ad1a',
  name: 'sum next n',
  units: {
    add: {
      id: '6fe452f2-2ec1-4ee2-887d-751c3697e6bf',
    },
    decrement: {
      id: '4d67d2e4-8b06-4e15-8243-99be8e4be5d3',
    },
    gt0: {
      id: '6f4ac2fa-e9bd-4c0e-8bda-75976f3e4e58',
    },
    loop2: {
      id: 'eee90e0f-522d-4ac4-a0f1-abf5d69a4e26',
      output: {
        finala: {
          ignored: true,
        },
        finalb: {
          ignored: true,
        },
        localb: {
          ignored: true,
        },
      },
      input: {
        initb: {
          constant: true,
          data: '0',
        },
      },
    },
  },
  merges: {
    0: {
      add: {
        output: {
          'a + b': true,
        },
      },
      loop2: {
        input: {
          'next b': true,
        },
      },
    },
    1: {
      loop2: {
        output: {
          locala: true,
        },
      },
      gt0: {
        input: {
          a: true,
        },
      },
    },
    2: {
      loop2: {
        input: {
          test: true,
        },
      },
      gt0: {
        output: {
          'a > 0': true,
        },
      },
    },
    3: {
      loop2: {
        output: {
          currenta: true,
        },
      },
      decrement: {
        input: {
          a: true,
        },
      },
    },
    4: {
      loop2: {
        input: {
          'next a': true,
        },
      },
      decrement: {
        output: {
          'a - 1': true,
        },
      },
    },
    5: {
      loop2: {
        output: {
          currentb: true,
        },
      },
      add: {
        input: {
          b: true,
        },
      },
    },
  },
  metadata: {
    icon: null,
    description: 'no description',
  },
  inputs: {
    a: {
      name: 'a',
      pin: {
        0: {
          unitId: 'add',
          pinId: 'a',
        },
      },
    },
    n: {
      name: 'n',
      pin: {
        0: {
          unitId: 'loop2',
          pinId: 'inita',
        },
      },
    },
  },
  outputs: {
    sum: {
      name: 'sum',
      pin: { 0: { mergeId: '0' } },
    },
  },
} as GraphSpec

const SumNextN = fromSpec(spec, _specs)

const sumNextN = new SumNextN(system, pod)

false && watchUnitAndLog(sumNextN)
false && watchGraphAndLog(sumNextN)
false && watchGraphAndLog(sumNextN.refUnit('nstringbuilderfrom') as Graph)

sumNextN.play()

sumNextN.push('n', 0)
assert.equal(sumNextN.take('sum'), undefined)
assert.equal(sumNextN.peakInput('n'), undefined)

sumNextN.push('n', 1)
assert.equal(sumNextN.take('sum'), undefined)
sumNextN.push('a', 0)
assert.equal(sumNextN.peakInput('n'), 1)
assert.equal(sumNextN.take('sum'), 0)
assert.equal(sumNextN.take('sum'), undefined)
assert.equal(sumNextN.peakInput('a'), undefined)
assert.equal(sumNextN.peakInput('n'), undefined)
