import { buildMoveMap, MoveMapping } from '../../Class/Graph/buildMoveMap'
import { ID_IDENTITY } from '../../system/_ids'
import { assert } from '../../util/assert'
import { system } from '../util/system'

let mapping: MoveMapping
;({ mapping } = buildMoveMap(system.specs, {}, {}, 'untitled', {}))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity'],
    link: [
      { unitId: 'identity', type: 'input', pinId: 'a' },
      { unitId: 'identity', type: 'output', pinId: 'a' },
    ],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: {
          unitId: 'identity',
        },
      },
    },
  },
  merge: {},
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity'],
    link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          output: {
            a: {
              pinId: 'a',
              type: 'output',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {},
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity'],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          input: {
            a: {
              pinId: 'a',
              type: 'input',
              subPinId: '0',
            },
          },
          output: {
            a: {
              pinId: 'a',
              type: 'output',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {},
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity'],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          input: {
            a: {
              pinId: 'a',
              type: 'input',
              subPinId: '0',
            },
          },
          output: {
            a: {
              pinId: 'a',
              type: 'output',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {},
  link: {
    identity: {
      output: {
        a: {
          in: {
            merge: {
              mergeId: '0',
            },
          },
        },
      },
    },
  },
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity'],
    merge: ['0'],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          input: {
            a: {
              pinId: 'a',
              type: 'input',
              subPinId: '0',
            },
          },
          output: {
            a: {
              pinId: 'a',
              type: 'output',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {
    '0': {
      out: {
        merge: {
          output: {
            mergeId: '1',
          },
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity', 'identity0'],
    merge: ['0'],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          input: {
            a: {
              pinId: 'a',
              type: 'input',
              subPinId: '0',
            },
          },
        },
      },
    },
    identity0: {
      in: {
        unit: { unitId: 'identity0' },
        plug: {
          output: {
            a: {
              pinId: 'a',
              type: 'output',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity', 'identity0'],
    merge: ['0'],
    link: [
      {
        unitId: 'identity',
        type: 'input',
        pinId: 'a',
      },
      {
        unitId: 'identity0',
        type: 'output',
        pinId: 'a',
      },
    ],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
      },
    },
    identity0: {
      in: {
        unit: { unitId: 'identity0' },
      },
    },
  },
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: [],
    merge: ['0'],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
        plug: {
          input: {
            type: 'input',
            pinId: 'a',
            subPinId: '0',
          },
          output: {
            type: 'output',
            pinId: 'a',
            subPinId: '0',
          },
        },
      },
      out: {
        merge: {
          input: {
            mergeId: '1',
          },
          output: {
            mergeId: '2',
          },
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
    merge: ['0'],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
        plug: {
          input: {
            type: 'input',
            pinId: 'a',
            subPinId: '0',
          },
          output: {
            type: 'output',
            pinId: 'a',
            subPinId: '0',
          },
        },
      },
      out: {
        merge: {
          input: {
            mergeId: '1',
          },
          output: {
            mergeId: '2',
          },
        },
      },
    },
  },
  link: {
    identity: {
      input: {
        a: {
          in: {
            plug: {
              output: {
                type: 'output',
                pinId: 'a0',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              output: { mergeId: '3' },
            },
          },
        },
      },
    },
  },
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {},
  },
  {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  'untitled',
  {
    link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {
    identity: {
      input: {
        a: {
          in: {
            plug: {
              output: {
                type: 'output',
                pinId: 'a0',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              output: { mergeId: '0' },
            },
          },
        },
      },
    },
  },
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
  },
  {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  'untitled',
  {
    link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {
    identity: {
      input: {
        a: {
          in: {
            plug: {
              output: {
                type: 'output',
                pinId: 'x',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              output: {
                mergeId: '1',
              },
            },
          },
        },
      },
    },
  },
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
    outputs: {
      y: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
  },
  {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  'untitled',
  {
    merge: ['0'],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
        plug: {
          output: {
            type: 'output',
            pinId: 'x',
            subPinId: '0',
          },
          input: {
            type: 'input',
            pinId: 'y',
            subPinId: '0',
          },
        },
      },
      out: {
        merge: {
          input: {
            mergeId: '1',
          },
          output: {
            mergeId: '2',
          },
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {},
    merges: {},
    inputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  {},
  'untitled',
  {
    link: [],
    merge: [],
    plug: [{ type: 'input', pinId: 'a', subPinId: '0', template: true }],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {},
  plug: {
    input: {
      a: {
        '0': {
          in: {
            plug: {
              input: {
                type: 'input',
                pinId: 'a',
                subPinId: '0',
              },
            },
          },
        },
      },
    },
  },
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {},
    merges: {},
    inputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  {},
  'untitled',
  {
    link: [],
    merge: [],
    plug: [{ type: 'input', pinId: 'a', subPinId: '0', template: false }],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {},
  plug: {
    input: {
      a: {
        '0': {
          in: {
            plug: {
              input: {
                type: 'input',
                pinId: 'a',
                subPinId: '0',
              },
            },
          },
        },
      },
    },
  },
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    merges: {},
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    link: [],
    merge: [],
    plug: [{ type: 'input', pinId: 'a', subPinId: '0', template: false }],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {
    identity: {
      input: {
        a: {
          in: {
            merge: {
              mergeId: '0',
            },
          },
        },
      },
    },
  },
  plug: {
    input: {
      a: {
        '0': {
          in: {
            plug: {
              output: {
                type: 'output',
                pinId: 'a',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              output: {
                mergeId: '0',
              },
            },
          },
        },
      },
    },
  },
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
    outputs: {
      y: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
  },
  {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  'untitled',
  {
    merge: ['0'],
    plug: [{ pinId: 'x', type: 'input', subPinId: '0' }],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
        plug: {
          output: {
            type: 'output',
            pinId: 'x',
            subPinId: '0',
          },
          input: {
            type: 'input',
            pinId: 'y',
            subPinId: '0',
          },
        },
      },
      out: {
        merge: {
          input: {
            mergeId: '1',
          },
          output: {
            mergeId: '2',
          },
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
    outputs: {
      y: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
  },
  {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
  'untitled',
  {
    merge: ['0'],
    plug: [
      { pinId: 'x', type: 'input', subPinId: '0' },
      { pinId: 'y', type: 'output', subPinId: '0' },
    ],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
        plug: {
          output: {
            type: 'output',
            pinId: 'x',
            subPinId: '0',
          },
          input: {
            type: 'input',
            pinId: 'y',
            subPinId: '0',
          },
        },
      },
      out: {
        merge: {
          input: {
            mergeId: '1',
          },
          output: {
            mergeId: '2',
          },
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {},
    inputs: {},
    outputs: {},
  },
  {},
  'untitled',
  {
    link: [
      { unitId: 'identity', type: 'input', pinId: 'a' },
      { unitId: 'identity', type: 'output', pinId: 'a' },
      { unitId: 'identity0', type: 'input', pinId: 'a' },
      { unitId: 'identity0', type: 'output', pinId: 'a' },
    ],
  }
))

assert.deepEqual(mapping, {
  unit: {},
  merge: {},
  link: {
    identity: {
      input: {
        a: {
          in: {
            plug: {
              output: {
                pinId: 'a',
                type: 'output',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              output: {
                mergeId: '0',
              },
            },
          },
        },
      },
      output: {
        a: {
          in: {
            plug: {
              input: {
                pinId: 'a',
                type: 'input',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              input: {
                mergeId: '1',
              },
            },
          },
        },
      },
    },
    identity0: {
      input: {
        a: {
          in: {
            plug: {
              output: {
                pinId: 'a0',
                type: 'output',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              output: {
                mergeId: '2',
              },
            },
          },
        },
      },
      output: {
        a: {
          in: {
            plug: {
              input: {
                pinId: 'a0',
                type: 'input',
                subPinId: '0',
              },
            },
          },
          out: {
            merge: {
              input: {
                mergeId: '3',
              },
            },
          },
        },
      },
    },
  },
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      identity1: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity', 'identity0', 'identity1'],
    merge: ['0'],
    link: [
      {
        unitId: 'identity',
        type: 'input',
        pinId: 'a',
      },
      {
        unitId: 'identity0',
        type: 'output',
        pinId: 'a',
      },
    ],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
      },
    },
    identity0: {
      in: {
        unit: { unitId: 'identity0' },
      },
    },
    identity1: {
      in: {
        unit: { unitId: 'identity1' },
        plug: {
          input: {
            a: {
              type: 'input',
              pinId: 'a',
              subPinId: '0',
            },
          },
          output: {
            a: {
              type: 'output',
              pinId: 'a',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      identity1: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity', 'identity0', 'identity1'],
    merge: ['0'],
    link: [],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          input: {
            a: {
              type: 'input',
              pinId: 'a',
              subPinId: '0',
            },
          },
        },
      },
    },
    identity0: {
      in: {
        unit: { unitId: 'identity0' },
        plug: {
          output: {
            a: {
              type: 'output',
              pinId: 'a',
              subPinId: '0',
            },
          },
        },
      },
    },
    identity1: {
      in: {
        unit: { unitId: 'identity1' },
        plug: {
          input: {
            a: {
              type: 'input',
              pinId: 'a0',
              subPinId: '0',
            },
          },
          output: {
            a: {
              type: 'output',
              pinId: 'a0',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
      },
    },
  },
  link: {},
  plug: {},
})
;({ mapping } = buildMoveMap(
  system.specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      identity1: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '0': {
        identity: {
          output: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  {},
  'untitled',
  {
    unit: ['identity1', 'identity0', 'identity'],
    merge: ['0'],
    link: [],
  }
))

assert.deepEqual(mapping, {
  unit: {
    identity: {
      in: {
        unit: { unitId: 'identity1' },
        plug: {
          input: {
            a: {
              type: 'input',
              pinId: 'a0',
              subPinId: '0',
            },
          },
        },
      },
    },
    identity0: {
      in: {
        unit: { unitId: 'identity0' },
        plug: {
          output: {
            a: {
              type: 'output',
              pinId: 'a0',
              subPinId: '0',
            },
          },
        },
      },
    },
    identity1: {
      in: {
        unit: { unitId: 'identity' },
        plug: {
          input: {
            a: {
              type: 'input',
              pinId: 'a',
              subPinId: '0',
            },
          },
          output: {
            a: {
              type: 'output',
              pinId: 'a',
              subPinId: '0',
            },
          },
        },
      },
    },
  },
  merge: {
    0: {
      in: {
        merge: {
          mergeId: '0',
        },
      },
    },
  },
  link: {},
  plug: {},
})
