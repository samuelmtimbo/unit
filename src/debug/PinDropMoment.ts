import { PinEvent } from '../Pin'
import { IO } from '../types/IO'
import { Moment } from './Moment'
import { PinType } from './PinType'

export interface PinDropMomentData {
  type: IO
  pinId: string
}

export interface PinDropMoment extends Moment {
  type: PinType
  event: PinEvent
}
