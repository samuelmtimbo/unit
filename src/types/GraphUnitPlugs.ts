import { Position } from '../client/util/geometry/types'
import { Dict } from './Dict'
import { IOOf } from './IOOf'

export type GraphUnitPlugs = IOOf<
  Dict<{
    pinId: string
    subPinId: string
    position?: Position
  }>
>
