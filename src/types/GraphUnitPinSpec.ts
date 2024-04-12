import { Position } from '../client/util/geometry/types'
import { DataRef } from '../DataRef'
import { None } from './None'

export type GraphUnitPinSpec = {
  data?: string | DataRef
  constant?: boolean | None
  ignored?: boolean | None
  ref?: boolean
  metadata?: {
    position?: Position
    data?: {
      position?: Position
    }
  }
}
