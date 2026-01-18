import { Moment } from './Moment'

export interface ComponentRemoveChildAtMoment extends Moment<{ at: number }> {
  path: string[]
}
