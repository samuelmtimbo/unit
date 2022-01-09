import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'
import { pod, system } from '../../util/system'

const spec = require('../../../system/core/Empty/spec.json') as GraphSpec
const Empty = fromSpec<{}, {}>(spec, _specs)

const empty = new Empty(system, pod)

empty.play()
