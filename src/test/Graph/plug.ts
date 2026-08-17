import { Graph } from '../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_ADD } from '../../system/_ids'
import { assert } from '../../util/assert'
import { system } from '../util/system'

const spec = system.emptySpec()

const composition = new Graph<{ number: number }, { sum: number }>(
  spec,
  {},
  system
)

false && watchUnitAndLog(composition)
false && watchGraphAndLog(composition)

const addId = '0'

composition.addUnitSpec(addId, {
  unit: {
    id: ID_ADD,
    input: {
      b: {
        data: '0',
      },
    },
    output: {},
  },
})

composition.exposePinSet('output', 'a', { plug: { '0': {} } })

composition.setPlugData('output', 'a', '0', 1)

assert.equal(composition.getPinData('output', 'a'), 1)

composition.plugPin(
  'output',
  'a',
  '0',
  { unitId: addId, kind: 'input', pinId: 'a' },
  undefined
)

const add = composition.getUnit(addId)

assert.equal(add.peakInput('a'), 1)

composition.play()
