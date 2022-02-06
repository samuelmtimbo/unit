import { IO } from '../types/IO'
import { Moment } from './Moment'

export interface GraphUnitPinDropMomentData {
  unitId: string
  type: IO
  pinId: string
}

export interface GraphUnitPinDropMoment extends Moment {
  type: IO
  event: 'drop'
}
