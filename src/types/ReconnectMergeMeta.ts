import { Position } from '../client/util/geometry/types'
import { IO } from './IO'

export type ReconnectMergeMeta = {
  position?: Position
  selected: {
    pins: { unitId: string; type: IO; pinId: string }[]
  }
}
