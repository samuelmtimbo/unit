import { Moment } from './Moment'

export interface ComponentLeafAppendChildAtMoment
  extends Moment<{ id: string; path: string[] }> {}
