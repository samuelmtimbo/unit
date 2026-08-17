import { GraphMergeMoment } from './GraphMergeMoment'

export interface GraphMergePinDropMomentData {
  type: string
  pinId: string
  data: any
}

export interface GraphMergePinDropMoment
  extends GraphMergeMoment<GraphMergePinDropMomentData> {}
