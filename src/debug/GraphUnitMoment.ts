import { Moment } from './Moment'

export interface GraphUnitMoment<T = any>
  extends Moment<{ unitId: string } & T> {}
