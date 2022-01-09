import { IO } from '../types/IO'
import { Moment } from './Moment'

export interface GraphUnitPinDataMomentData {
  unitId: string
  type: IO
  pinId: string
  data: any
}

export interface GraphUnitPinDataMoment extends Moment {
  type: IO
  event: 'data'
  data: GraphUnitPinDataMomentData
}
