import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_EMPTY, ID_IDENTITY } from '../../system/_ids'
import { system } from '../util/system'

const UNIT_ID_EMTPY = 'empty'
const UNIT_ID_IDENTITY = 'identity'
const UNIT_ID_IDENTITY_0 = 'identity0'

const spec = system.newSpec({})

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnitSpec(UNIT_ID_EMTPY, {
  unit: { id: ID_EMPTY },
})
composition0.addUnitSpec(UNIT_ID_IDENTITY, {
  unit: { id: ID_IDENTITY },
})
composition0.addUnitSpec(UNIT_ID_IDENTITY_0, {
  unit: { id: ID_IDENTITY },
})

const empty = composition0.refUnit(UNIT_ID_EMTPY) as Graph
const identity = composition0.refUnit(UNIT_ID_IDENTITY)
const identity0 = composition0.refUnit(UNIT_ID_IDENTITY_0)

assert.equal(composition0.getUnitCount(), 3)

composition0.addMerge(
  {
    [UNIT_ID_IDENTITY]: {
      output: {
        a: true,
      },
    },
    [UNIT_ID_IDENTITY_0]: {
      input: {
        a: true,
      },
    },
  },
  '0'
)

composition0.moveMergeInto(
  UNIT_ID_EMTPY,
  '0',
  { mergeId: '0', pinId: 'a', subPinSpec: {} },
  { mergeId: '1', pinId: 'a', subPinSpec: {} }
)

assert.equal(composition0.getUnitCount(), 3)
assert.equal(composition0.getMergeCount(), 2)

assert.equal(empty.getInputCount(), 1)
assert.equal(empty.getOutputCount(), 1)

assert(empty.hasInputNamed('a'))
assert(empty.hasOutputNamed('a'))

assert.deepEqual(empty.getExposedInputSpec('a'), {
  plug: {
    '0': {},
  },
  ref: false,
})
