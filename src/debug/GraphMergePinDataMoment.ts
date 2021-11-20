import { Moment } from './Moment'

export interface GraphMergePinDataMomentData {
  mergeId: string
  type: string
  pinId: string
  data: any
}

export interface GraphMergePinDataMoment extends Moment {
  type: 'input' | 'output'
  event: 'data' | 'drop'
  data: GraphMergePinDataMomentData
}
