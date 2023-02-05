import { evaluate } from '../spec/evaluate'
import { System } from '../system'
import { UnitBundleSpec } from '../types/UnitBundleSpec'

export function evaluateBundleStr(
  system: System,
  value: string
): UnitBundleSpec {
  const bundle_str = value.substring(1)

  const bundle = evaluate(
    bundle_str,
    system.specs,
    system.classes
  ) as UnitBundleSpec

  return bundle
}

export function idFromUnitValue(value: string): string {
  const bundle_str = value.substring(1)
  const bundle = evaluate(bundle_str, {}, {}) as UnitBundleSpec
  const { unit } = bundle
  const { id } = unit
  return id
}
