import { PinEvent } from '../Pin'
import { Moment } from './Moment'
import { PinType } from './PinType'

export interface PinDropMomentData {
  type: string
  pinId: string
}

export interface PinDropMoment extends Moment {
  type: PinType
  event: PinEvent
}
