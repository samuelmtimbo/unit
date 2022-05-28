import { PinEvent } from '../Pin'
import { IO } from '../types/IO'
import { Moment } from './Moment'
import { PinType } from './PinType'

export interface PinDataMomentData {
  type: PinType
  pinId: string
  data: any
}

export interface PinDataMoment extends Moment {
  type: PinType
  event: PinEvent
  data: PinDataMomentData
}
