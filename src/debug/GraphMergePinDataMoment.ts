import { GraphMergeMoment } from './GraphMergeMoment'

export interface GraphMergePinDataMomentData {
  type: string
  pinId: string
  data: any
}

export interface GraphMergePinDataMoment
  extends GraphMergeMoment<GraphMergePinDataMomentData> {}
