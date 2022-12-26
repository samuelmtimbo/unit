import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_IDENTITY } from '../../system/_ids'
import { system } from '../util/system'

const spec = system.emptySpec()

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnitSpec('0', {
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

composition0.addUnitSpec('1', {
  unit: {
    id: ID_IDENTITY,
    input: {
      a: {
        data: '1',
      },
    },
    output: {},
  },
})

assert.equal(composition0.getUnitPin('0', 'output', 'a').peak(), 0)
assert.equal(composition0.getUnitPin('1', 'output', 'a').peak(), 1)

composition0.addMerge(
  { '0': { output: { a: true } }, '1': { input: { a: true } } },
  '0'
)

assert.equal(composition0.getUnitPin('1', 'output', 'a').peak(), 0)
