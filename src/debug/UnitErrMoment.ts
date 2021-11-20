import { Moment } from './Moment'

export interface UnitErrMomentData {
  err: string
}

export interface UnitErrMoment<T = any> extends Moment<UnitErrMomentData & T> {
  type: 'unit'
  event: 'err' | 'take_err'
}
