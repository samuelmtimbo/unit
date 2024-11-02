import { Graph } from '../../Class/Graph'
import { SELF } from '../../constant/SELF'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_ADD_UNIT, ID_EMPTY, ID_RANGE } from '../../system/_ids'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const UNIT_ID_RANGE = 'UNIT_ID_RANGE'
const UNIT_ID_ADD_UNIT = 'UNIT_ID_ADD_UNIT'
const UNIT_ID_EMPTY = 'UNIT_ID_EMPTY'

const spec = system.emptySpec()

const composition0 = new Graph<{ number: number }, { sum: number }>(
  spec,
  {},
  system
)

false && watchUnitAndLog(composition0)
false && watchGraphAndLog(composition0)

composition0.play()

composition0.addUnitSpec(UNIT_ID_EMPTY, {
  unit: {
    id: ID_EMPTY,
    input: {},
  },
})

composition0.addUnitSpec(UNIT_ID_ADD_UNIT, {
  unit: {
    id: ID_ADD_UNIT,
    input: {
      class: {
        data: {
          ref: [[]],
          data: {
            unit: {
              id: ID_RANGE,
              input: {
                a: {
                  constant: true,
                  data: {
                    data: 0,
                  },
                },
                b: {
                  constant: true,
                  data: {
                    data: 3,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

composition0.addMerge(
  {
    [UNIT_ID_ADD_UNIT]: {
      input: {
        graph: true,
      },
    },
    [UNIT_ID_EMPTY]: {
      output: {
        [SELF]: true,
      },
    },
  },
  '0'
)

composition0.setUnitPinData(UNIT_ID_ADD_UNIT, 'input', 'id', UNIT_ID_RANGE)

const empty = composition0.getUnit(UNIT_ID_EMPTY) as Graph

assert.equal(empty.getUnitCount(), 1)

const range = empty.getUnit(UNIT_ID_RANGE)

assert.equal(range.getPinData('input', 'a'), 0)
assert.equal(range.getPinData('input', 'b'), 3)
assert.equal(range.getPinData('output', 'i'), 0)
