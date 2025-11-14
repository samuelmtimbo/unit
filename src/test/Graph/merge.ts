import assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_FILTER, ID_IDENTITY, ID_TRUE } from '../../system/_ids'
import { system } from '../util/system'

const spec = system.emptySpec()

const composition0 = new Graph<{}, {}>(spec, {}, system)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const id0 = 'id0'
const id1 = 'id1'
const id2 = 'id2'

composition0.play()

composition0.addUnitSpec(id0, {
  unit: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '0',
      },
    },
    output: {},
  },
})
composition0.addUnitSpec(id1, {
  unit: {
    id: ID_IDENTITY,
  },
})
composition0.addUnitSpec(id2, {
  unit: {
    id: ID_IDENTITY,
  },
})

composition0.addMerge(
  {
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
  'merge0'
)
composition0.addMerge(
  {
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
  'merge1'
)

assert.equal(composition0.getUnit(id0).peakOutput('a'), 0)
assert.equal(composition0.getUnit(id0).peakInput('a'), 0)
assert.equal(composition0.getUnit(id1).peakOutput('a'), 0)
assert.equal(composition0.getUnit(id1).peakInput('a'), 0)
assert.equal(composition0.getUnit(id2).peakOutput('a'), 0)
assert.equal(composition0.getUnit(id2).peakInput('a'), 0)

const spec0 = system.emptySpec()

const composition1 = new Graph<{}, {}>(spec0, {}, system)

composition1.play()

const id3 = 'id3'
const id4 = 'id4'

composition1.addUnitSpec(id3, { unit: { id: ID_IDENTITY } })
composition1.addUnitSpec(id4, { unit: { id: ID_IDENTITY } })
composition1.addMerge(
  {
    [id3]: {
      output: {
        a: true,
      },
    },
    [id4]: {
      input: {
        a: true,
      },
    },
  },
  '0'
)
const identity3 = composition1.getUnit(id3)
const identity4 = composition1.getUnit(id4)

identity3.push('a', 1)
identity3.push('a', 2)
identity3.push('a', 3)
identity3.push('a', 4)

composition1.addMerge(
  {
    [id3]: {
      input: {
        a: true,
      },
    },
    [id4]: {
      output: {
        a: true,
      },
    },
  },
  '0'
)

const spec1 = system.emptySpec()

const composition2 = new Graph<{}, {}>(spec1, {}, system)

composition2.play()

composition2.addUnitSpec(id0, { unit: { id: ID_IDENTITY } })
composition2.addUnitSpec(id1, { unit: { id: ID_IDENTITY } })
composition2.addUnitSpec(id2, { unit: { id: ID_IDENTITY } })
composition2.addMerge(
  {
    [id0]: {
      output: {
        a: true,
      },
    },
    [id1]: {
      output: {
        a: true,
      },
    },
    [id2]: {
      input: {
        a: true,
      },
    },
  },
  'merge0'
)
composition2.setUnitInputData(id1, 'a', 0)
composition2.setUnitOutputIgnored(id1, 'a', true)
composition2.setUnitInputData(id0, 'a', 0)

const UNIT_ID_FILTER = 'UNIT_ID_FILTER'
const UNIT_ID_TRUE = 'UNIT_ID_TRUE'

const spec2 = system.emptySpec()

const composition4 = new Graph<{ number: number }, { sum: number }>(
  spec2,
  {},
  system
)

false && watchUnitAndLog(composition4)
false && watchGraphAndLog(composition4)

composition4.play()

composition4.addUnitSpec(UNIT_ID_FILTER, {
  unit: {
    id: ID_FILTER,
    output: {
      a: {
        ignored: true,
      },
      i: {
        ignored: true,
      },
      test: {
        ignored: true,
      },
    },
  },
})
composition4.addUnitSpec(UNIT_ID_TRUE, {
  unit: { id: ID_TRUE },
})

const filter = composition4.getUnit(UNIT_ID_FILTER)
const _true = composition4.getUnit(UNIT_ID_TRUE)

filter.push('a', [0, 1, 2])

composition4.addMerge(
  {
    [UNIT_ID_FILTER]: {
      output: {
        'a[i]': true,
      },
    },
    [UNIT_ID_TRUE]: {
      input: {
        any: true,
      },
    },
  },
  '0'
)

composition4.addMerge(
  {
    [UNIT_ID_FILTER]: {
      input: {
        test: true,
      },
    },
    [UNIT_ID_TRUE]: {
      output: {
        true: true,
      },
    },
  },
  '1'
)

assert.deepEqual(filter.peak('b'), [0, 1, 2])
