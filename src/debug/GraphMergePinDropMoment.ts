import { Moment } from './Moment'

export interface GraphMergePinDropMomentData {
  mergeId: string
  type: string
  pinId: string
  data: any
}

export interface GraphMergePinDropMoment extends Moment {
  type: 'input' | 'output'
  event: 'drop'
  data: GraphMergePinDropMomentData
}
