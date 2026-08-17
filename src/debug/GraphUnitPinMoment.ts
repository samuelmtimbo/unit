import { IO } from '../types/IO'
import { GraphUnitMoment } from './GraphUnitMoment'

export type GraphUnitPinMomentData = {
  type: IO
  pinId: string
  data: any
}

export interface GraphUnitPinMoment
  extends GraphUnitMoment<GraphUnitPinMomentData> {}
