import { Moment } from './Moment'

export interface GraphUnitPinDropMomentData {
  unitId: string
  type: 'input' | 'output'
  pinId: string
}

export interface GraphUnitPinDropMoment extends Moment {
  type: 'input' | 'output'
  event: 'drop'
}
