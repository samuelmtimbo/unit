import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { IDENTITY } from '../spec/id'

const composition0 = new Graph<{}, {}>()

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const id0 = 'id0'
const id1 = 'id1'
const id2 = 'id2'

composition0.play()

composition0.addUnits({
  [id0]: {
    path: IDENTITY,
    input: {
      a: {
        data: 0,
      },
    },
    output: {},
  },
  [id1]: {
    path: IDENTITY,
  },
  [id2]: {
    path: IDENTITY,
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
composition1.addUnit({ path: IDENTITY }, id3)
composition1.addUnit({ path: IDENTITY }, id4)
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
composition2.addUnit({ path: IDENTITY }, id0)
composition2.addUnit({ path: IDENTITY }, id1)
composition2.addUnit({ path: IDENTITY }, id2)
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
