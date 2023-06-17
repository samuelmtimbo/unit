import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { system } from '../util/system'

const spec0 = system.emptySpec()

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec0,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

const addId = '0'

assert.equal(composition0.getUnit(addId).getOutput('a + b').take(), 11)
