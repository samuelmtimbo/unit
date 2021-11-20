import { UnitPropMoment, UnitPropMomentData } from './watchUnitPropEvent'

export interface GraphUnitPropMomentData extends UnitPropMomentData {
  unitId: string
}

export interface GraphUnitPropMoment
  extends UnitPropMoment<GraphUnitPropMomentData> {}
