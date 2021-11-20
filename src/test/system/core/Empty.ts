import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'

const spec = require('../../../system/core/Empty/spec.json') as GraphSpec
const Empty = fromSpec<{}, {}>(spec, globalThis.__specs)

const empty = new Empty()

// do not forget to play
empty.play()
