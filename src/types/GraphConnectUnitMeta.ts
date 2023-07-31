import { Position } from '../client/util/geometry/types'
import { Dict } from './Dict'
import { IOOf } from './IOOf'

export type GraphConnectUnitMeta = {
  position?: {
    merges: Dict<Position>
    data: Dict<Position>
  }
  selected: {
    links: IOOf<Set<string>>
    merges: string[]
  }
}
