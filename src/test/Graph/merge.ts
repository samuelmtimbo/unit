import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import _specs from '../../system/_specs'
import { ID_FILTER, ID_IDENTITY, ID_TRUE } from '../spec/id'

globalThis.__specs = _specs

const composition0 = new Graph<{}, {}>()

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const id0 = 'id0'
const id1 = 'id1'
const id2 = 'id2'

composition0.play()

composition0.addUnits({
  [id0]: {
    path: ID_IDENTITY,
    input: {
      a: {
        data: 0,
      },
    },
    output: {},
  },
  [id1]: {
    path: ID_IDENTITY,
  },
  [id2]: {
    path: ID_IDENTITY,
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

assert.equal(composition0.refUnit(id0).peakOutput('a'), 0)
assert.equal(composition0.refUnit(id0).peakInput('a'), 0)
assert.equal(composition0.refUnit(id1).peakOutput('a'), 0)
assert.equal(composition0.refUnit(id1).peakInput('a'), 0)
assert.equal(composition0.refUnit(id2).peakOutput('a'), 0)
assert.equal(composition0.refUnit(id2).peakInput('a'), 0)

const composition1 = new Graph<{}, {}>()
composition1.play()
const id3 = 'id3'
const id4 = 'id4'
composition1.addUnit({ path: ID_IDENTITY }, id3)
composition1.addUnit({ path: ID_IDENTITY }, id4)
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
const identity3 = composition1.refUnit(id3)
const identity4 = composition1.refUnit(id4)
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

const composition2 = new Graph<{}, {}>()
composition2.play()
composition2.addUnit({ path: ID_IDENTITY }, id0)
composition2.addUnit({ path: ID_IDENTITY }, id1)
composition2.addUnit({ path: ID_IDENTITY }, id2)
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

const composition4 = new Graph<{ number: number }, { sum: number }>()

false && watchUnitAndLog(composition4)
false && watchGraphAndLog(composition4)

composition4.play()

composition4.addUnit(
  {
    path: ID_FILTER,
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
  UNIT_ID_FILTER
)
composition4.addUnit(
  {
    path: ID_TRUE,
  },
  UNIT_ID_TRUE
)

const filter = composition4.refUnit(UNIT_ID_FILTER)
const _true = composition4.refUnit(UNIT_ID_TRUE)

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
