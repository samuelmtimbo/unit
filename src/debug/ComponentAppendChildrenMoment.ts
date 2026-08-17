import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { ComponentMoment } from './ComponentMoment'

export interface ComponentAppendChildrenMoment
  extends ComponentMoment<{ bundles: UnitBundleSpec[] }> {}
