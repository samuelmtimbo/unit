import { GraphMoment } from './GraphMoment'

export interface GraphMergeMoment<D extends object>
  extends GraphMoment<{ mergeId: string } & D> {}
