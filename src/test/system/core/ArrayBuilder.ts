import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { GraphClass } from '../../../types/GraphClass'
import { pod, system } from '../../util/system'

const spec =
  require('../../../system/core/array/ArrayBuilder/spec.json') as GraphSpec

const ArrayBuilder = fromSpec(spec, _specs) as GraphClass

const arrayBuilder = new ArrayBuilder(system, pod)

false && watchUnitAndLog(arrayBuilder)
false && watchGraphAndLog(arrayBuilder)

arrayBuilder.play()
