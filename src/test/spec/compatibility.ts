import * as assert from 'assert'
import { compatibleInterface } from '../../spec/compatibility'
import __specs from '../../system/_specs'

assert(
  compatibleInterface(
    'system/f/control/Identity',
    'system/core/common/Increment',
    __specs
  )
)

assert(
  !compatibleInterface(
    'system/f/control/Identity',
    'system/f/arithmetic/Add',
    __specs
  )
)
