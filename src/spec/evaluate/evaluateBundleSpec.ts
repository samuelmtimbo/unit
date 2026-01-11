import { Classes, Specs } from '../../types'
import { BundleSpec } from '../../types/BundleSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { evaluateData } from '../evaluateDataValue'
import { evaluateMemorySpec } from './evaluateMemorySpec'

export function evaluateBundleSpec(
  bundle: BundleSpec,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
) {
  evaluateSpec(bundle.spec, specs, classes, resolver)

  for (const specId in bundle.specs ?? {}) {
    const spec = bundle.specs[specId]

    evaluateSpec(spec, specs, classes, resolver)
  }
}

export function evaluateUnitBundleSpec(
  bundle: UnitBundleSpec,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
) {
  evaluateMemorySpec(bundle.unit.memory ?? {}, specs, classes, resolver)
}

export function evaluateSpec(
  spec: GraphSpec,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
) {
  for (const unitId in spec?.units ?? []) {
    const unit = spec.units[unitId]

    evaluateGraphUnitSpec(unit, specs, classes, resolver)
  }
}

export function evaluateGraphUnitSpec(
  unit: GraphUnitSpec,
  specs: Specs,
  classes: Classes,
  resolver: (url: string) => any = () => {
    return undefined
  }
) {
  if (unit.memory) {
    evaluateMemorySpec(unit.memory, specs, classes, resolver)
  }

  const { input } = unit

  for (const pinId in input) {
    const input_ = input[pinId]

    if (input_.data) {
      evaluateData(input_.data, specs, classes, [])
    }
  }
}
