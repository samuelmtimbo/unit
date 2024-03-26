import { Classes, Specs } from '../types'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { evaluate } from './evaluate'

export function evaluateBundleStr(
  value: string,
  specs: Specs,
  classes: Classes,
  evaluate_: (
    value: string,
    specs: Specs,
    classes: Classes,
    resolver?: (url: string) => any
  ) => any = evaluate
): UnitBundleSpec {
  let objectStr = value.substring(1)

  const bundle = evaluate_(objectStr, specs, classes) as UnitBundleSpec

  return bundle
}

export function idFromUnitValue(
  value: string,
  specs: Specs,
  classes: Classes,
  evaluate_: (
    value: string,
    specs: Specs,
    classes: Classes,
    resolver?: (url: string) => any
  ) => any = evaluate
): string {
  const bundle = evaluateBundleStr(value, specs, classes, evaluate_)

  const { unit } = bundle
  const { id } = unit

  return id
}
