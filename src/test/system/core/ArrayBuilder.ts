import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphClass, GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/array/ArrayBuilder/spec.json') as GraphSpec
const ArrayBuilder = fromSpec(spec, globalThis.__specs) as GraphClass

const arrayBuilder = new ArrayBuilder()

false && watchUnitAndLog(arrayBuilder)
false && watchGraphAndLog(arrayBuilder)

arrayBuilder.play()
