import * as assert from 'assert'
import { extractSubSpec, GraphSpecSelection } from '../../spec/extract'
import { GraphSpec } from '../../types'
import { IDENTITY } from './id'

const NEW_UNIT_ID = 'new'
const NEW_UNIT_SPEC_ID = 'bcf31149-1b3a-49dc-b8f9-aad51fdeb9eb'

function test(
  spec: GraphSpec,
  selection: GraphSpecSelection,
  parentSpec: GraphSpec,
  newSpec: GraphSpec
) {
  const actual = extractSubSpec(spec, selection, NEW_UNIT_ID, NEW_UNIT_SPEC_ID)
  const expected = [parentSpec, newSpec]
  assert.deepEqual(actual, expected, JSON.stringify(actual, null, 2))
}

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  {
    units: ['identity', 'identity0'],
    unitInputs: { identity: ['a'] },
    unitOutputs: { identity0: ['a'] },
    merges: ['0'],
  },
  {
    units: {
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
  },
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  }
)

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
  },
  {
    units: ['identity', 'identity0'],
    unitInputs: { identity: ['a'], identity0: ['a'] },
    unitOutputs: { identity: ['a'], identity0: ['a'] },
  },
  {
    units: {
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
  },
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
  }
)

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  {
    units: ['identity', 'identity0'],
    merges: ['0'],
  },
  {
    units: {
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
  },
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
  }
)

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  {
    units: ['identity', 'identity0'],
  },
  {
    units: {
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
    merges: {
      0: {
        [NEW_UNIT_ID]: {
          output: {
            a: true,
          },
        },
        [NEW_UNIT_ID]: {
          input: {
            a0: true,
          },
        },
      },
    },
  },
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    inputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
      a0: {
        pin: {
          0: {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
      a0: {
        pin: {
          0: {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
  }
)

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  {
    units: ['identity'],
  },
  {
    units: {
      identity0: {
        path: IDENTITY,
      },
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
    merges: {
      0: {
        [NEW_UNIT_ID]: {
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
  {
    units: {
      identity: {
        path: IDENTITY,
      },
    },
    inputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
  }
)

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  {
    units: ['identity'],
    unitInputs: {
      identity: ['a'],
    },
  },
  {
    units: {
      identity0: {
        path: IDENTITY,
      },
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
    merges: {
      0: {
        [NEW_UNIT_ID]: {
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
  {
    units: {
      identity: {
        path: IDENTITY,
      },
    },
    outputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
  }
)

test(
  {
    units: {
      identity: {
        path: IDENTITY,
      },
      identity0: {
        path: IDENTITY,
      },
    },
    merges: {
      0: {
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
  {
    units: ['identity'],
    merges: ['0'],
  },
  {
    units: {
      identity0: {
        path: IDENTITY,
      },
      [NEW_UNIT_ID]: {
        path: NEW_UNIT_SPEC_ID,
      },
    },
    merges: {
      0: {
        [NEW_UNIT_ID]: {
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
  {
    units: {
      identity: {
        path: IDENTITY,
      },
    },
    inputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        pin: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
  }
)
