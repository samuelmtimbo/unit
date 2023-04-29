import { evaluate } from '../spec/evaluate'
import { Classes, Specs } from '../types'
import { UnitBundleSpec } from '../types/UnitBundleSpec'

export function evaluateBundleStr(
  value: string,
  specs: Specs,
  classes: Classes
): UnitBundleSpec {
  const bundle_str = value.substring(1)

  const bundle = evaluate(bundle_str, specs, classes) as UnitBundleSpec

  return bundle
}

export function idFromUnitValue(
  value: string,
  specs: Specs,
  classes: Classes
): string {
  const bundle_str = value.substring(1)

  const bundle = evaluate(bundle_str, specs, classes) as UnitBundleSpec

  const { unit } = bundle
  const { id } = unit

  return id
}
