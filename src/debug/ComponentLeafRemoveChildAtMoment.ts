import { Moment } from './Moment'

export interface ComponentLeafRemoveChildAtMoment
  extends Moment<{ at: number; path: string[] }> {}
