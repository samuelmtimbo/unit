import { deepGet } from '../util/object'
import { evaluateDataValue } from '../spec/evaluateDataValue'
import _classes from '../system/_classes'
import _specs from '../system/_specs'
import { Spec } from '../types'
import { BaseSpec } from '../types/BaseSpec'
import { BundleSpec } from '../types/BundleSpec'
import { GraphSpec } from '../types/GraphSpec'
import { GraphSpecs } from '../types/GraphSpecs'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { UnitBundleSpec } from '../types/UnitBundleSpec'

export function collectUnitIdSet(
  unit: GraphUnitSpec,
  specs: GraphSpecs,
  set: Set<string>
): void {
  const { id, input = {} } = unit

  for (const inputId in input) {
    const _input = input[inputId] ?? {}

    let { data } = _input

    const buildBundleIdSet = (bundle: UnitBundleSpec) => {
      const unitSpec =
        _specs[bundle.unit.id] ??
        specs[bundle.unit.id] ??
        bundle.specs[bundle.unit.id]

      collectUnitIdSet(bundle.unit, specs, set)
      collectIdSetFromSpec(unitSpec, specs, set)

      for (const specId in bundle.specs) {
        const spec = bundle.specs[specId]

        collectIdSetFromSpec(spec, specs, set)
      }
    }

    if (data !== undefined) {
      const dataRef = evaluateDataValue(data, _specs, _classes)

      for (const path of (dataRef.ref ?? [])) {
        const bundle = deepGet(dataRef.data, path)

        buildBundleIdSet(bundle)
      }
    }
  }

  const unit_spec = _specs[id]

  if (unit_spec) {
    collectIdSetFromSpec(unit_spec, specs, set)
  } else {
    //
  }
}

export function collectIdSetFromSpec(
  spec: Spec,
  specs: GraphSpecs,
  set: Set<string> = new Set()
): Set<string> {
  const { units = {} } = spec as GraphSpec

  if (set.has(spec.id)) {
    return set
  }

  set.add(spec.id)

  for (const unitId in units) {
    const unit = units[unitId]

    collectUnitIdSet(unit, specs, set)
  }

  ;(spec as BaseSpec).deps?.forEach((id) => {
    const dep_spec = _specs[id]

    collectIdSetFromSpec(dep_spec, specs, set)
  })

  return set
}

export function collectIdSetFromBundle(
  bundle: BundleSpec,
  set: Set<string> = new Set()
): Set<string> {
  const { spec = {}, specs = {} } = bundle

  collectIdSetFromSpec(spec, specs, set)

  for (const specId in specs) {
    const spec = specs[specId]

    collectIdSetFromSpec(spec, specs, set)
  }

  return set
}
