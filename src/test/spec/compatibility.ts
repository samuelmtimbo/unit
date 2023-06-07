import * as assert from 'assert'
import system from '../../script/build/worker/system'
import { compatibleInterface } from '../../spec/compatibility'

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
