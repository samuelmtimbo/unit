import { sameSpec } from '../../spec/util'
import { ID_IDENTITY } from '../../system/_ids'
import { assert } from '../../util/assert'

assert(sameSpec({}, {}))
assert(sameSpec({ name: 'untitled' }, { name: 'untitled' }))
assert(sameSpec({ name: 'untitled' }, {}))
assert(sameSpec({}, { name: 'untitled' }))
assert(sameSpec({ name: 'untitled' }, { name: 'untitled', units: {} }))
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {},
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: false,
            },
          },
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {},
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)

assert(
  sameSpec(
    {
      type: '`U`&`G`',
      name: 'if equals',
      units: {
        if: {
          id: '06bc3983-44b0-43d6-b041-2e9218ea89c8',
          input: { a: { metadata: { position: { x: -6, y: -52 } } }, b: {} },
          output: { 'a if b': { metadata: { position: { x: -6, y: -15 } } } },
          metadata: { position: { x: null, y: null } },
        },
        equals: {
          id: '85204bf6-6692-4686-a785-23127c0594b5',
          input: {
            a: { constant: false, metadata: { position: { x: -202, y: -15 } } },
            b: { constant: false, metadata: { position: { x: -202, y: -52 } } },
          },
          output: { 'a = b': {} },
          metadata: { position: { x: null, y: null } },
        },
      },
      merges: {
        '18': {
          equals: { output: { 'a = b': true } },
          if: { input: { b: true } },
        },
      },
      inputs: {
        b: {
          plug: { '0': { unitId: 'equals', pinId: 'b', kind: 'input' } },
          ref: false,
        },
        c: {
          plug: { '0': { unitId: 'equals', pinId: 'a', kind: 'input' } },
          ref: false,
        },
        a: {
          plug: { '0': { unitId: 'if', pinId: 'a', kind: 'input' } },
          ref: false,
        },
      },
      outputs: {
        a: {
          plug: { '0': { unitId: 'if', pinId: 'a if b', kind: 'output' } },
          ref: false,
        },
      },
      metadata: { icon: 'question', description: '', tags: ['user'] },
      id: 'ade642cd-2a15-4945-a9be-843da59530e6',
    },
    {
      type: '`U`&`G`',
      name: 'if equals',
      units: {
        if: {
          id: '06bc3983-44b0-43d6-b041-2e9218ea89c8',
          input: { a: { metadata: { position: { x: -6, y: -52 } } }, b: {} },
          output: { 'a if b': { metadata: { position: { x: -6, y: -15 } } } },
          metadata: { position: { x: null, y: null } },
        },
        equals: {
          id: '85204bf6-6692-4686-a785-23127c0594b5',
          input: {
            a: { constant: false, metadata: { position: { x: -202, y: -15 } } },
            b: { constant: false, metadata: { position: { x: -202, y: -52 } } },
          },
          output: { 'a = b': {} },
          metadata: { position: { x: null, y: null } },
        },
      },
      merges: {
        '18': {
          equals: { output: { 'a = b': true } },
          if: { input: { b: true } },
        },
      },
      inputs: {
        b: {
          plug: { '0': { unitId: 'equals', pinId: 'b', kind: 'input' } },
          ref: false,
        },
        c: {
          plug: { '0': { unitId: 'equals', pinId: 'a', kind: 'input' } },
          ref: false,
        },
        a: {
          plug: { '0': { unitId: 'if', pinId: 'a', kind: 'input' } },
          ref: false,
        },
      },
      outputs: {
        a: {
          plug: { '0': { unitId: 'if', pinId: 'a if b', kind: 'output' } },
          ref: false,
        },
      },
      metadata: { icon: 'question', description: '', tags: ['user'] },
      id: 'ade642cd-2a15-4945-a9be-843da59530e6',
    }
  )
)

assert(!sameSpec({ name: 'empty ' }, {}))
assert(!sameSpec({ name: 'empty ' }, { name: '01' }))
assert(
  !sameSpec(
    { name: 'untitled' },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
            },
          },
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
            },
          },
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
      },
      metadata: {
        icon: 'square',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '1': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            output: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
          metadata: {
            position: {
              x: 151,
              y: 24,
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
          metadata: {
            position: {
              x: 100,
              y: 20,
            },
          },
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)

assert(!sameSpec({ name: 'empty ' }, {}))
assert(!sameSpec({ name: 'empty ' }, { name: '01' }))
assert(
  !sameSpec(
    { name: 'untitled' },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
            },
          },
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
            },
          },
        },
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
      },
      metadata: {
        icon: 'square',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '1': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
assert(
  !sameSpec(
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity1: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            input: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    },
    {
      name: 'untitled',
      units: {
        identity: {
          id: ID_IDENTITY,
          input: {
            a: {
              constant: true,
              data: {
                ref: [],
                data: 'foo',
              },
            },
          },
        },
        identity0: {
          id: ID_IDENTITY,
          input: {},
        },
      },
      merges: {
        '0': {
          indetity: {
            output: {
              a: true,
            },
          },
          indetity0: {
            output: {
              a: true,
            },
          },
        },
      },
      metadata: {
        icon: 'circle',
      },
    }
  )
)
