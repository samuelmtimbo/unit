import * as assert from 'assert'
import { extractSubSpec, GraphSpecSelection } from '../../spec/extract'
import _specs from '../../system/_specs'
import { Specs } from '../../types'
import { GraphSpec } from '../../types/GraphSpec'
import { ID_IDENTITY } from '../../system/_ids'

const NEW_UNIT_ID = 'new'
const NEW_UNIT_SPEC_ID = 'bcf31149-1b3a-49dc-b8f9-aad51fdeb9eb'

function test(
  specs: Specs,
  spec: GraphSpec,
  selection: GraphSpecSelection,
  parentSpec: GraphSpec,
  newSpec: GraphSpec
) {
  const actual = extractSubSpec(
    specs,
    spec,
    selection,
    NEW_UNIT_ID,
    NEW_UNIT_SPEC_ID
  )
  const expected = [parentSpec, newSpec]
  assert.deepEqual(actual, expected, JSON.stringify(actual, null, 2))
}

test(
  _specs,
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
    links: {
      input: { identity: ['a'] },
      output: { identity0: ['a'] },
    },
    merges: ['0'],
  },
  {
    units: {
      [NEW_UNIT_ID]: {
        id: NEW_UNIT_SPEC_ID,
      },
    },
  },
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
  _specs,
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
  },
  {
    units: ['identity', 'identity0'],
    links: {
      input: { identity: ['a'], identity0: ['a'] },
      output: { identity: ['a'], identity0: ['a'] },
    },
  },
  {
    units: {
      [NEW_UNIT_ID]: {
        id: NEW_UNIT_SPEC_ID,
      },
    },
  },
  {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
  }
)

test(
  _specs,
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
        id: NEW_UNIT_SPEC_ID,
      },
    },
  },
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
        plug: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
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
  _specs,
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
        id: NEW_UNIT_SPEC_ID,
      },
    },
    merges: {
      0: {
        [NEW_UNIT_ID]: {
          output: {
            a: true,
          },
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
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
      a0: {
        plug: {
          0: {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
      a0: {
        plug: {
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
  _specs,
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
        id: ID_IDENTITY,
      },
      [NEW_UNIT_ID]: {
        id: NEW_UNIT_SPEC_ID,
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
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
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
  _specs,
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
    links: {
      input: {
        identity: ['a'],
      },
    },
  },
  {
    units: {
      identity0: {
        id: ID_IDENTITY,
      },
      [NEW_UNIT_ID]: {
        id: NEW_UNIT_SPEC_ID,
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
        id: ID_IDENTITY,
      },
    },
    outputs: {
      a: {
        plug: {
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
  _specs,
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
        id: ID_IDENTITY,
      },
      [NEW_UNIT_ID]: {
        id: NEW_UNIT_SPEC_ID,
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
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          0: {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
    },
  }
)
