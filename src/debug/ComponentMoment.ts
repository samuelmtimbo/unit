import { Dict } from '../types/Dict'
import { Moment } from './Moment'

export interface ComponentMoment<D extends Dict<any>> extends Moment<D> {
  type: 'component'
}
