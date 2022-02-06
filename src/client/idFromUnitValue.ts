import { evaluate } from '../spec/evaluate'
import { UnitBundleSpec } from '../system/platform/method/process/UnitBundleSpec'

export function idFromUnitValue(value: string): string {
  const bundle_str = value.substring(1)
  const bundle = evaluate(bundle_str, {}, {}) as UnitBundleSpec
  const { unit } = bundle
  const { id } = unit
  return id
}
