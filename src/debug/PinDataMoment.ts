import { PinEvent } from '../Pin'
import { IO } from '../types/IO'
import { Moment } from './Moment'

export interface PinDataMomentData {
  type: IO
  pinId: string
  data: any
}

export interface PinDataMoment extends Moment {
  type: IO
  event: PinEvent
  data: PinDataMomentData
}
