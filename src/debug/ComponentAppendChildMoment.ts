import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { ComponentMoment } from './ComponentMoment'

export interface ComponentAppendChildMoment
  extends ComponentMoment<{ bundle: UnitBundleSpec }> {
}
