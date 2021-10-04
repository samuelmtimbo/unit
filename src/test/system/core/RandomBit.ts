import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/common/RandomBit/spec.json') as GraphSpec
const RandomBit = fromSpec<{ any: any }, { bit: number }>(
  spec,
  globalThis.__specs
)

const randomBit = new RandomBit()

false && watchUnitAndLog(randomBit)
false && watchGraphAndLog(randomBit)

// do not forget to play
randomBit.play()

let bit

randomBit.push('any', 1)
bit = randomBit.take('bit')
assert(bit === 0 || bit === 1)

randomBit.push('any', 'foo')
bit = randomBit.take('bit')
assert(bit === 0 || bit === 1)
