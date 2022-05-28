import { Unit } from '../Class/Unit'
import { UnitBundleSpec } from './UnitBundleSpec'
import { UnitClass } from './UnitClass'

export interface UnitBundle<T extends Unit = any> extends UnitClass<T> {
  readonly __bundle: UnitBundleSpec
}
