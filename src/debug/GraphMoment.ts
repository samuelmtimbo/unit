import { Dict } from '../types/Dict'
import { Moment } from './Moment'

export interface GraphMoment<D extends Dict<any> = any>
  extends Moment<{ path: string[] } & D> {
  type: 'pin' | 'merge' | 'unit' | 'graph' | 'component'
}
