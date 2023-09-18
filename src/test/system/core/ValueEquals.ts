import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { system } from '../../util/system'

const spec = require('../../../system/core/relation/ValueEquals/spec.json')

const ValueEquals = fromSpec(spec, _specs)

const valueEquals = new ValueEquals(system)

false && watchUnitAndLog(valueEquals)
false && watchGraphAndLog(valueEquals)

valueEquals.play()

valueEquals.push('value', 0)
valueEquals.push('key', 'a')
valueEquals.push('obj', { a: 1 })

assert.deepEqual(valueEquals.take('equal'), false)
