import { UnitErrMoment, UnitErrMomentData } from './UnitErrMoment'

export interface GraphUnitErrMomentData extends UnitErrMomentData {
  unitId: string
}

export interface GraphUnitErrMoment
  extends UnitErrMoment<GraphUnitErrMomentData> {}
