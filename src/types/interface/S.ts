import { Unlisten } from '../Unlisten'
import { P } from './P'

export interface S {
  newPod(init: {}): [P, Unlisten]
  newSystem(init: {}): [S, Unlisten]
}
