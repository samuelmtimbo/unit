import { IO } from '../types/IO'
import { Moment } from './Moment'

export interface GraphMergePinDataMomentData {
  mergeId: string
  type: string
  pinId: string
  data: any
}

export interface GraphMergePinDataMoment extends Moment {
  type: IO
  event: 'data' | 'drop'
  data: GraphMergePinDataMomentData
}
