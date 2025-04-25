import { buildMoveMap, MoveMap } from '../../Class/Graph/buildMoveMap'
import {
  applyMoves,
  applyMoves_,
  buildMoves,
  Moves,
} from '../../Class/Graph/buildMoves'
import { moveMerge } from '../../Class/Graph/moveMerge'
import { moveUnit } from '../../Class/Graph/moveUnit'
import { ID_EMPTY, ID_IDENTITY, ID_INCREMENT } from '../../system/_ids'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphSelection } from '../../types/interface/G'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const { specs } = system

let moves: Moves
let source: GraphSpec
let target: GraphSpec
let selection: GraphSelection
let graphId: string = 'untitled'
let map: MoveMap

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
}

target = {}

selection = {
  unit: ['identity'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
  },
})

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
  },
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
}

target = {}

selection = {
  link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    merges: {
      '0': {
        untitled: {
          output: {
            a: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
}

target = {}

selection = {
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'input', pinId: 'a' },
  ],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        untitled: {
          output: {
            a: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
      '1': {
        untitled: {
          output: {
            a0: true,
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
  target: {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
      a0: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  merge: ['0'],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '1': {
        identity: {
          output: {
            a: true,
          },
        },
        untitled: {
          input: {
            a: true,
          },
        },
      },
      '2': {
        untitled: {
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
  target: {
    merges: {
      '0': {},
    },
    inputs: {
      a: {
        plug: {
          '0': { mergeId: '0' },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': { mergeId: '0' },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  unit: ['identity'],
  merge: ['0'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '1': {
        untitled: {
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
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': { unitId: 'identity', kind: 'input', pinId: 'a' },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': { unitId: 'identity', kind: 'output', pinId: 'a' },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
  },
  target: {
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
      a: {
        plug: {
          '0': { unitId: 'identity', kind: 'input', pinId: 'a' },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': { unitId: 'identity0', kind: 'output', pinId: 'a' },
        },
      },
    },
  },
})

source = {
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
    untitled: {
      id: ID_EMPTY,
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
      identity1: {
        output: {
          a: true,
        },
      },
    },
  },
}

target = {}

selection = {
  unit: ['identity'],
  merge: ['0'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity0: {
        id: ID_IDENTITY,
      },
      identity1: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '1': {
        untitled: {
          input: {
            a0: true,
          },
        },
        identity1: {
          output: {
            a: true,
          },
        },
      },
      '2': {
        untitled: {
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
  target: {
    units: {
      identity: {
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
      },
    },
    inputs: {
      a: {
        plug: {
          '0': { unitId: 'identity', kind: 'input', pinId: 'a' },
        },
      },
      a0: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
        ref: false,
      },
    },
    outputs: {
      a: {
        plug: {
          '0': { mergeId: '0' },
        },
        ref: false,
      },
    },
  },
})

source = {
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
    untitled: {
      id: ID_EMPTY,
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
        output: {
          a: true,
        },
      },
      identity1: {
        output: {
          a: true,
        },
      },
    },
  },
}

target = {}

selection = {
  unit: ['identity'],
  link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
  merge: ['0'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity0: {
        id: ID_IDENTITY,
      },
      identity1: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        untitled: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
            a: true,
          },
        },
        identity1: {
          output: {
            a: true,
          },
        },
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': { unitId: 'identity', kind: 'output', pinId: 'a' },
        },
        ref: false,
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  merge: ['0'],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '1': {
        identity: {
          output: {
            a: true,
          },
        },
        untitled: {
          input: {
            a: true,
          },
        },
      },
      '2': {
        untitled: {
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
      '3': {
        untitled: {
          output: {
            a0: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
      '4': {
        identity0: {
          output: {
            a: true,
          },
        },
        untitled: {
          input: {
            a0: true,
          },
        },
      },
    },
  },
  target: {
    merges: {
      '0': {},
    },
    inputs: {
      a0: {
        plug: {
          '0': {},
        },
      },
      a: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
    outputs: {
      a0: {
        plug: {
          '0': {},
        },
      },
      a: {
        plug: {
          '0': { mergeId: '0' },
        },
      },
    },
  },
})

source = {
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
    untitled: {
      id: ID_EMPTY,
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
    '1': {
      identity0: {
        output: {
          a: true,
        },
      },
      identity1: {
        input: {
          a: true,
        },
      },
    },
  },
}

target = {}

selection = {
  merge: ['0', '1'],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
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
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '2': {
        identity: {
          output: {
            a: true,
          },
        },
        untitled: {
          input: {
            a: true,
          },
        },
      },
      '3': {
        untitled: {
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
      '4': {
        identity0: {
          output: {
            a: true,
          },
        },
        untitled: {
          input: {
            a0: true,
          },
        },
      },
      '5': {
        untitled: {
          output: {
            a0: true,
          },
        },
        identity1: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
    merges: {
      '0': {},
      '1': {},
    },
    inputs: {
      a0: {
        plug: {
          '0': {
            mergeId: '1',
          },
        },
      },
      a: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
    outputs: {
      a0: {
        plug: {
          '0': {
            mergeId: '1',
          },
        },
      },
      a: {
        plug: {
          '0': { mergeId: '0' },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  link: [{ unitId: 'identity', type: 'input', pinId: 'a' }],
  plug: [{ type: 'input', pinId: 'x', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
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
      '1': {
        untitled: {
          output: {
            x: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
    outputs: {
      x: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  plug: [{ type: 'input', pinId: 'x', subPinId: '0' }],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
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
      '1': {
        untitled: {
          output: {
            x: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
    outputs: {
      x: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  plug: [{ type: 'input', pinId: 'x', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
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
        untitled: {
          output: {
            x: true,
          },
        },
      },
    },
  },
  target: {
    outputs: {
      x: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  merge: ['0'],
  plug: [{ type: 'input', pinId: 'x', subPinId: '0' }],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '1': {
        identity: {
          output: {
            a: true,
          },
        },
        untitled: {
          input: {
            a: true,
          },
        },
      },
      '2': {
        untitled: {
          output: {
            x: true,
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
  target: {
    merges: {
      '0': {},
    },
    inputs: {
      a: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {
  merges: {
    '0': {},
  },
  outputs: {
    x: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  inputs: {
    y: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
}

selection = {
  link: [
    { unitId: 'untitled', type: 'output', pinId: 'x' },
    { unitId: 'untitled', type: 'input', pinId: 'y' },
  ],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
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
  target: {},
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {
  outputs: {
    x: {
      plug: {
        '0': {},
      },
    },
  },
}

selection = {
  link: [{ unitId: 'untitled', type: 'output', pinId: 'x' }],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
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
  target: {},
})

source = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
  },
  inputs: {
    x: {
      plug: {
        '0': { unitId: 'identity', pinId: 'a' },
      },
    },
  },
  outputs: {
    y: {
      plug: {
        '0': { unitId: 'identity0', pinId: 'a' },
      },
    },
  },
}

selection = {
  link: [
    { unitId: 'untitled', type: 'input', pinId: 'x' },
    { unitId: 'untitled', type: 'output', pinId: 'y' },
  ],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
  },
  inputs: {
    x: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  plug: [{ type: 'input', pinId: 'x', subPinId: '0' }],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
  },
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          x: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
    },
  },
}

selection = {
  plug: [{ type: 'output', pinId: 'x', subPinId: '0' }],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        untitled: {
          output: {
            x: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
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
}

target = {}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
}
map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = moveMerge(map, '0')

applyMoves_(specs, source, target, moves)

assert.deepEqual(
  { source, target },
  {
    source: {
      units: {
        identity: {
          id: ID_IDENTITY,
        },
        identity0: {
          id: ID_IDENTITY,
        },
        untitled: {
          id: ID_EMPTY,
        },
      },
    },
    target: {},
  }
)

moves = moveUnit(map, 'identity')

applyMoves_(specs, source, target, moves)

assert.deepEqual(
  { source, target },
  {
    source: {
      units: {
        identity0: {
          id: ID_IDENTITY,
        },
        untitled: {
          id: ID_EMPTY,
        },
      },
    },
    target: {
      units: {
        identity: {
          id: ID_IDENTITY,
        },
      },
      inputs: {
        a: {
          plug: {
            '0': {
              unitId: 'identity',
              kind: 'input',
              pinId: 'a',
            },
          },
        },
      },
    },
  }
)

moves = moveUnit(map, 'identity0')

applyMoves_(specs, source, target, moves)

assert.deepEqual(
  { source, target },
  {
    source: {
      units: {
        untitled: {
          id: ID_EMPTY,
        },
      },
    },
    target: {
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
        a: {
          plug: {
            '0': {
              unitId: 'identity',
              kind: 'input',
              pinId: 'a',
            },
          },
        },
      },
      outputs: {
        a: {
          plug: {
            '0': {
              unitId: 'identity0',
              kind: 'output',
              pinId: 'a',
            },
          },
        },
      },
    },
  }
)

source = {
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
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  merge: ['0'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
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
          '0': {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
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
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        untitled: {
          input: {
            a: true,
          },
          output: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
  merges: {
    '0': {},
  },
  inputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      identity: {
        output: {
          a: true,
        },
      },
      untitled: {
        input: {
          a: true,
        },
      },
    },
    '1': {
      untitled: {
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

selection = {
  merge: ['0'],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
    },
    merges: {
      '2': {
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
})

source = {
  merges: {
    '0': {},
  },
  inputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
}

target = {
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
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      identity: {
        output: {
          a: true,
        },
      },
      untitled: {
        input: {
          a: true,
        },
      },
    },
    '1': {
      untitled: {
        output: {
          a: true,
        },
      },
      identity0: {
        input: {
          a: true,
        },
      },
      identity1: {
        input: {
          a: true,
        },
      },
    },
  },
}

selection = {
  merge: ['0'],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
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
      '2': {
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
        identity1: {
          input: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
  },
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
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
      identity: {
        id: ID_IDENTITY,
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
  },
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
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, false)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
})

source = {
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
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
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
})

source = {
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
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [{ type: 'input', pinId: 'x', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, false)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
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
  },
})

source = {
  outputs: {
    x: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  plug: [{ type: 'output', pinId: 'x', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  outputs: {
    x: {
      plug: {
        '0': {},
        '1': {},
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
}

selection = {
  plug: [
    { type: 'output', pinId: 'x', subPinId: '0' },
    { type: 'output', pinId: 'x', subPinId: '1' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {},
          '1': {},
        },
      },
    },
  },
})

source = {
  outputs: {
    x: {
      plug: {
        '0': {},
        '1': {},
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {},
        '1': {},
      },
    },
  },
}

selection = {
  plug: [
    { type: 'output', pinId: 'x', subPinId: '0' },
    { type: 'output', pinId: 'x', subPinId: '1' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {},
          '1': {},
          '2': {},
          '3': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: '',
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
    },
  },
}

target = {
  outputs: {
    a: {
      plug: {
        '0': {},
      },
    },
  },
}

selection = {
  merge: ['0'],
}

system.setSpec('', target)

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: '',
      },
    },
    merges: {
      '1': {
        untitled: {
          output: {
            a: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: '',
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a: true,
        },
        input: {
          a: true,
        },
      },
    },
  },
}

target = {
  inputs: {
    a: {
      plug: {
        '0': {},
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {},
      },
    },
  },
}

selection = {
  merge: ['0'],
}

system.setSpec('', target)

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: '',
      },
    },
  },
  target: {},
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: '',
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
}

target = {}

selection = {
  unit: ['identity', 'identity0'],
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

system.setSpec('', target)

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: '',
      },
    },
    merges: {
      '0': {
        untitled: {
          output: {
            a: true,
          },
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
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
          '0': {
            unitId: 'identity0',
            pinId: 'a',
            kind: 'input',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            pinId: 'a',
            kind: 'output',
          },
        },
      },
    },
  },
})

source = {
  units: {
    untitled: {
      id: '',
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a: true,
        },
        input: {
          a: true,
        },
      },
    },
  },
}

target = {
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
        '0': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
}

selection = {
  merge: ['0'],
}

system.setSpec('', target)

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: '',
      },
    },
  },
  target: {
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
})

source = {
  units: {
    untitled: {
      id: '',
    },
    increment: {
      id: ID_INCREMENT,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a: true,
          a0: true,
        },
      },
      increment: {
        input: {
          a: true,
        },
      },
    },
  },
}

target = {
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
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
    a0: {
      plug: {
        '0': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
    a0: {
      plug: {
        '0': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
}

selection = {
  merge: ['0'],
}

system.setSpec('', target)

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: '',
      },
      increment: {
        id: ID_INCREMENT,
      },
    },
    merges: {
      '1': {
        untitled: {
          output: {
            a: true,
          },
        },
        increment: {
          input: {
            a: true,
          },
        },
      },
    },
  },
  target: {
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
          output: {
            a: true,
          },
        },
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
      a0: {
        plug: {
          '0': {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
}

target = {}

selection = {
  unit: ['identity'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            unitId: 'untitled',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
}

target = {}

selection = {
  unit: ['identity'],
  link: [{ unitId: 'identity', type: 'output', pinId: 'a' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            unitId: 'untitled',
            kind: 'output',
            pinId: 'x',
          },
        },
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
})

source = {
  outputs: {
    x: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          x: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
    },
  },
}

selection = {
  plug: [{ type: 'output', pinId: 'x', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
        },
      },
    },
  },
})

source = {
  outputs: {
    x: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          x: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
}

selection = {
  plug: [{ type: 'output', pinId: 'x', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    merges: {
      '0': {
        identity: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
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
  },
})

source = {
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
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
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
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        input: {
          x: true,
        },
        output: {
          y: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'x', subPinId: '0' },
    { type: 'output', pinId: 'y', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
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
      identity2: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '1': {
        identity: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
            a: true,
          },
        },
        identity1: {
          input: {
            a: true,
          },
        },
        identity2: {
          output: {
            a: true,
          },
        },
      },
    },
    inputs: {
      y: {
        plug: {
          '0': {
            mergeId: '1',
          },
        },
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            mergeId: '1',
          },
        },
      },
    },
  },
})

source = {
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
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
  inputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
    a0: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
    a0: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a0: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
    },
    '1': {
      untitled: {
        input: {
          a0: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
    { type: 'input', pinId: 'a0', subPinId: '0' },
    { type: 'output', pinId: 'a0', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
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
      identity2: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    merges: {
      '2': {
        identity: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
            a: true,
          },
        },
        identity1: {
          input: {
            a: true,
          },
        },
        identity2: {
          output: {
            a: true,
          },
        },
      },
    },
    inputs: {
      a0: {
        plug: {
          '0': {
            mergeId: '2',
          },
        },
      },
    },
    outputs: {
      a0: {
        plug: {
          '0': {
            mergeId: '2',
          },
        },
      },
    },
  },
})

source = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
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
}

target = {}

selection = {
  unit: ['identity', 'identity0'],
  merge: ['0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, false)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    inputs: {
      x: {
        plug: {
          '0': {
            unitId: 'untitled',
            pinId: 'x',
          },
        },
      },
    },
  },
  target: {
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
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
  },
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
}

target = {
  units: {
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
}

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
  plug: [{ type: 'input', pinId: 'a', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        identity: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
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
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
        '1': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
}

selection = {
  unit: ['identity', 'identity0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
    { unitId: 'identity0', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'input', pinId: 'a', subPinId: '1' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
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
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        identity: {
          input: {
            a: true,
          },
        },
        identity1: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
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
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
        '1': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        input: {
          a: true,
        },
      },
      identity0: {
        output: {
          a: true,
        },
      },
    },
  },
}

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
  plug: [{ type: 'input', pinId: 'a', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      identity0: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '1': {
            unitId: 'identity0',
            pinId: 'a',
          },
        },
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '0': {
        untitled: {
          input: {
            a: true,
          },
        },
        identity: {
          input: {
            a: true,
          },
        },
        identity0: {
          output: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
        '1': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    identity0: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a: true,
        },
      },
      identity: {
        input: {
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

selection = {
  unit: ['identity', 'identity0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'output', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '1' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
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
      identity2: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    merges: {
      '0': {
        identity: {
          input: {
            a: true,
          },
        },
        identity0: {
          input: {
            a: true,
          },
        },
        identity1: {
          output: {
            a: true,
          },
        },
        identity2: {
          output: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
  },
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
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {
          unitId: 'untitled',
          pinId: 'a',
        },
      },
    },
  },
}

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    outputs: {
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
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
  },
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
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
        '1': {},
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {
          unitId: 'untitled',
          pinId: 'a',
        },
      },
    },
  },
}

selection = {
  unit: ['identity'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '1' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            unitId: 'identity',
            pinId: 'a',
          },
        },
      },
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            pinId: 'a',
            kind: 'output',
          },
          '1': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
    },
  },
  outputs: {
    x: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
    a: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {}

selection = {
  unit: ['identity'],
  link: [],
  plug: [{ type: 'output', pinId: 'a', subPinId: '0' }],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, false)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    outputs: {
      x: {
        plug: {
          '0': {
            unitId: 'untitled',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'output',
            pinId: 'a',
          },
          '1': {},
        },
      },
    },
  },
})

source = {
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
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'identity',
          pinId: 'a',
        },
        '1': {
          unitId: 'identity0',
          pinId: 'a',
        },
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
  outputs: {},
}

selection = {
  unit: ['identity', 'identity0'],
  link: [
    { unitId: 'identity', type: 'input', pinId: 'a' },
    { unitId: 'identity', type: 'output', pinId: 'a' },
    { unitId: 'identity0', type: 'input', pinId: 'a' },
    { unitId: 'identity0', type: 'output', pinId: 'a' },
  ],
  plug: [
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'a', subPinId: '1' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      identity0: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'output',
            pinId: 'a',
          },
          '1': {
            unitId: 'identity0',
            kind: 'output',
            pinId: 'a',
          },
        },
      },
    },
  },
})

source = {
  outputs: {
    a: {
      plug: {
        '0': {},
      },
    },
    b: {
      plug: {
        '0': {},
      },
    },
  },
}

target = {
  units: {
    untitled: {
      id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          unitId: 'untitled',
          pinId: 'a',
        },
      },
    },
    b: {
      plug: {
        '0': {
          unitId: 'untitled',
          pinId: 'b',
        },
      },
    },
  },
}

selection = {
  plug: [
    { type: 'output', pinId: 'a', subPinId: '0' },
    { type: 'output', pinId: 'b', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
    units: {
      untitled: {
        id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {},
        },
      },
      b: {
        plug: {
          '0': {},
        },
      },
    },
  },
})

source = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
  },
  inputs: {
    a: {
      plug: {
        '0': { unitId: 'identity', kind: 'input', pinId: 'a' },
      },
    },
    a0: {
      plug: {
        '0': {
          unitId: 'identity',
          kind: 'output',
          pinId: 'a',
        },
      },
      ref: false,
    },
  },
  outputs: {
    a: {
      plug: {
        '0': { unitId: 'identity', kind: 'output', pinId: 'a' },
      },
      ref: false,
    },
  },
}

target = {
  units: {
    identity0: {
      id: ID_IDENTITY,
    },
    identity1: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '1': {
      untitled: {
        input: {
          a0: true,
        },
      },
      identity1: {
        output: {
          a: true,
        },
      },
    },
    '2': {
      untitled: {
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

selection = {
  unit: ['identity'],
  plug: [
    { type: 'output', pinId: 'a', subPinId: '0' },
    { type: 'input', pinId: 'a', subPinId: '0' },
    { type: 'input', pinId: 'a0', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {},
  target: {
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
      untitled: {
        id: ID_EMPTY,
      },
    },
    merges: {
      '2': {
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
        identity1: {
          output: {
            a: true,
          },
        },
      },
    },
  },
})

source = {
  units: {},
  inputs: {
    a0: {
      plug: {
        '0': {},
      },
      ref: false,
    },
  },
  outputs: {
    a0: {
      plug: {
        '0': {},
      },
      ref: false,
    },
  },
}

target = {
  units: {
    identity: {
      id: ID_IDENTITY,
    },
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {
      untitled: {
        output: {
          a0: true,
        },
      },
      identity: {
        input: {
          a: true,
        },
      },
    },
  },
}

selection = {
  plug: [
    { type: 'output', pinId: 'a0', subPinId: '0' },
    { type: 'input', pinId: 'a0', subPinId: '0' },
  ],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, true)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {},
  },
  target: {
    units: {
      identity: {
        id: ID_IDENTITY,
      },
      untitled: {
        id: ID_EMPTY,
      },
    },
    inputs: {
      a0: {
        plug: {
          '0': {
            unitId: 'identity',
            kind: 'input',
            pinId: 'a',
          },
          '1': {},
        },
      },
    },
  },
})

source = {
  units: {
    untitled: {
      id: ID_EMPTY,
    },
  },
  merges: {
    '0': {},
  },
  inputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
  outputs: {
    a: {
      plug: {
        '0': {
          mergeId: '0',
        },
      },
    },
  },
}

target = {}

selection = {
  merge: ['0'],
}

map = buildMoveMap(system.specs, source, target, graphId, selection, {}, false)

moves = buildMoves(selection, map)

assert.deepEqual(applyMoves(specs, source, target, moves), {
  source: {
    units: {
      untitled: {
        id: ID_EMPTY,
      },
    },
    inputs: {
      a: {
        plug: {
          '0': {
            unitId: 'untitled',
            pinId: 'a',
          },
        },
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            unitId: 'untitled',
            pinId: 'a',
          },
        },
      },
    },
  },
  target: {
    merges: {
      '0': {},
    },
    inputs: {
      a: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
        ref: false,
      },
    },
    outputs: {
      a: {
        plug: {
          '0': {
            mergeId: '0',
          },
        },
        ref: false,
      },
    },
  },
})
