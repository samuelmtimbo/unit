import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { pod, system } from '../util/system'

const UNIT_ID_EMTPY = 'UNIT_ID_EMTPY'
const UNIT_ID_IDENTITY = 'UNIT_ID_IDENTITY'

const composition0 = new Graph<{ number: number }, { sum: number }>(
  {},
  {},
  system,
  pod
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnit(
  {
    unit: { id: ID_EMPTY },
  },
  UNIT_ID_EMTPY
)
composition0.addUnit(
  {
    unit: { id: ID_IDENTITY },
  },
  UNIT_ID_IDENTITY
)

const empty = composition0.refUnit(UNIT_ID_EMTPY)
const identity = composition0.refUnit(UNIT_ID_IDENTITY)

assert.equal(composition0.getUnitCount(), 2)

composition0.moveLinkPinInto(
  UNIT_ID_EMTPY,
  UNIT_ID_IDENTITY,
  'input',
  'a',
  '0',
  'a'
)

assert.equal(composition0.getUnitCount(), 2)

assert.equal(empty.getInputCount(), 0)
assert.equal(empty.getOutputCount(), 1)

assert(empty.hasOutputNamed('a'))
