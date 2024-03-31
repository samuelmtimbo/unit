import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { Moment } from './Moment'

export interface ComponentAppendChildrenMoment
  extends Moment<UnitBundleSpec[]> {
  path: string[]
}
