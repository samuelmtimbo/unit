import { Classes, Specs } from '../types'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { evaluate } from './evaluate'

export function evaluateBundleStr(
  value: string,
  specs: Specs,
  classes: Classes
): UnitBundleSpec {
  let objectStr = value.substring(1)

  const bundle = evaluate(objectStr, specs, classes) as UnitBundleSpec

  return bundle
}

export function idFromUnitValue(
  value: string,
  specs: Specs,
  classes: Classes
): string {
  const bundle = evaluateBundleStr(value, specs, classes)

  const { unit } = bundle
  const { id } = unit

  return id
}
