import { Moment } from './Moment'

export interface PinMomentData {
  data: any
}

export interface PinMoment<D = {}> extends Moment<PinMomentData & D> {}
