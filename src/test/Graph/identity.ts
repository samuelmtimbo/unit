import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { IDENTITY } from '../spec/id'

const composition0 = new Graph<{ number: number }, { sum: number }>()

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnit(
  {
    path: IDENTITY,
    catchErr: false,
    input: {
      a: {
        data: 0,
      },
    },
    output: {},
  },
  '0'
)

composition0.addUnit(
  {
    path: IDENTITY,
    catchErr: false,
    input: {
      a: {
        data: 1,
      },
    },
    output: {},
  },
  '1'
)

assert.equal(composition0.getUnitPin('0', 'output', 'a').peak(), 0)
assert.equal(composition0.getUnitPin('1', 'output', 'a').peak(), 1)

composition0.addMerge(
  { '0': { output: { a: true } }, '1': { input: { a: true } } },
  '0'
)

assert.equal(composition0.getUnitPin('1', 'output', 'a').peak(), 0)
