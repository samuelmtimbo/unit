import { GraphSubPinSpec, PinBaseMetadataSpec, PinSpecBase } from '.'
import { Position } from '../client/util/geometry/types'
import { Dict } from './Dict'

export type GraphPinSpec = PinSpecBase & {
  metadata?: PinBaseMetadataSpec & {
    position?: Dict<{
      int?: Position
      ext?: Position
    }>
  }
  plug?: Dict<GraphSubPinSpec>
}
