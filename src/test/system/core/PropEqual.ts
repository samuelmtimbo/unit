import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'

const spec = require('../../../system/core/relation/PropEqual/spec.json')

const PropEqual = fromSpec(spec, _specs)

import { system } from '../../util/system'

const propEqual = new PropEqual(system)

false && watchUnitAndLog(propEqual)
false && watchGraphAndLog(propEqual)


propEqual.play()

propEqual.push('value', 0)
propEqual.push('key', 'a')
propEqual.push('obj', { a: 1 })
assert.deepEqual(propEqual.take('equal'), false)
