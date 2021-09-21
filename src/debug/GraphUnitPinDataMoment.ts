import { Moment } from './Moment'

export interface GraphUnitPinDataMomentData {
  unitId: string
  type: string
  pinId: string
  data: any
}

export interface GraphUnitPinDataMoment extends Moment {
  type: 'input' | 'output'
  event: 'data'
  data: GraphUnitPinDataMomentData
}
