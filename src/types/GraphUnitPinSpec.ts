import { Position } from '../client/util/geometry/types'
import { None } from './None'

export type GraphUnitPinSpec = {
  data?: string
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
