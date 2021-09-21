import { UnitSpecMoment, UnitSpecMomentData } from './watchUnitSpecEvent'

export interface GraphUnitSpecMomentData extends UnitSpecMomentData {
  unitId: string
}

export interface GraphUnitSpecMoment
  extends UnitSpecMoment<GraphUnitSpecMomentData> {}
