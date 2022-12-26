import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_IDENTITY } from '../../system/_ids'
import { system } from '../util/system'

const spec = system.emptySpec()

const composition0 = new Graph<{}, {}>(spec, {}, system)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const id0 = 'id0'
const id1 = 'id1'
const id2 = 'id2'

composition0.play()

composition0.addUnitSpecs({
  [id0]: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '0',
      },
    },
    output: {},
  },
  [id1]: {
    id: ID_IDENTITY,
  },
  [id2]: {
    id: ID_IDENTITY,
  },
})

composition0.addMerges({
  merge0: {
    [id0]: {
      output: {
        a: true,
      },
    },
    [id1]: {
      input: {
        a: true,
      },
    },
    [id2]: {
      input: {
        a: true,
      },
    },
  },
  merge1: {
    [id1]: {
      output: {
        a: true,
      },
    },
    [id0]: {
      input: {
        a: true,
      },
    },
  },
})

composition0.exposePinSet('output', 'a', { plug: { 0: { mergeId: 'merge0' } } })

composition0.removeMerge('merge0')

assert.deepEqual(composition0.getExposedPinSpec('output', 'a'), {
  plug: {
    '0': {},
  },
  ref: false,
})

composition0.exposePinSet('output', 'b', {
  plug: { 0: { unitId: id0, pinId: 'a' } },
})

composition0.removeUnit(id0)

assert.deepEqual(composition0.getExposedPinSpec('output', 'b'), {
  plug: {
    '0': {},
  },
  ref: false,
})
