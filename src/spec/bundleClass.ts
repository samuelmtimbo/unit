import { UnitBundleSpec } from '../system/platform/method/process/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'

export function bundleClass(Class: UnitClass, __bundle: UnitBundleSpec): void {
  Object.defineProperty(Class, '__bundle', {
    value: __bundle,
  })
}
