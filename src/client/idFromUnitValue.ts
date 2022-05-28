import { evaluate } from '../spec/evaluate'
import { UnitBundleSpec } from '../types/UnitBundleSpec'

export function evaluateBundleStr(value: string): UnitBundleSpec {
  const bundle_str = value.substring(1)
  const bundle = evaluate(bundle_str, {}, {}) as UnitBundleSpec
  return bundle
}

export function idFromUnitValue(value: string): string {
  const bundle_str = value.substring(1)
  const bundle = evaluate(bundle_str, {}, {}) as UnitBundleSpec
  const { unit } = bundle
  const { id } = unit
  return id
}
