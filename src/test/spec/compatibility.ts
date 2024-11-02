import * as assert from 'assert'
import { compatibleInterface } from '../../spec/compatibility'
import { system } from '../util/system'

assert(
  compatibleInterface(
    system.specs,
    'system/f/control/Identity',
    'system/core/common/Increment'
  )
)

assert(
  !compatibleInterface(
    system.specs,
    'system/f/control/Identity',
    'system/f/arithmetic/Add'
  )
)
