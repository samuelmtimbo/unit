import { Moment } from './Moment'

export interface ComponentRemoveChildAtMoment extends Moment<number> {
  path: string[]
}
