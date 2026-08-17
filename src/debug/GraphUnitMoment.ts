import { GraphMoment } from './GraphMoment'

export interface GraphUnitMoment<D extends object>
  extends GraphMoment<{ unitId: string } & D> {}
