import { PinMoment } from './PinMoment'

export interface PinDataMomentData {
  data: any
}

export interface PinDataMoment<D = any>
  extends PinMoment<PinDataMomentData & D> {}
