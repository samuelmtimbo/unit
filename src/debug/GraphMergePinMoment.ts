import { GraphMergePinDataMoment } from './GraphMergePinDataMoment'
import { GraphMergePinDropMoment } from './GraphMergePinDropMoment'

export type GraphMergePinMoment =
  | GraphMergePinDataMoment
  | GraphMergePinDropMoment
