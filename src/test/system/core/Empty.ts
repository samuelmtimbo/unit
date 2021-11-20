
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types'

const spec = require('../../../system/core/Empty/spec.json') as GraphSpec
const Empty = fromSpec<{}, {}>(spec, _specs)

import { system } from '../../util/system'

const empty = new Empty(system)

empty.play()
