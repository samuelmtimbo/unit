import { evaluateDataValue } from './spec/evaluateDataValue'
import { getSpec, isSystemSpecId } from './spec/util'
import { Specs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { GraphSpec } from './types/GraphSpec'
import { GraphSpecs } from './types/GraphSpecs'
import { GraphUnitSpec } from './types/GraphUnitSpec'
import { UnitBundleSpec } from './types/UnitBundleSpec'
import { deepGet } from './util/object'
import { weakMerge } from './weakMerge'

export function unitBundleSpec(
  unit: GraphUnitSpec,
  specs: Specs,
  system: boolean = false
): UnitBundleSpec {
  const { id } = unit

  const custom = {}

  _bundleUnit(unit, specs, custom, new Set(), system)

  return {
    unit: {
      id,
      ...unit,
    },
    specs: custom,
  }
}

export function unitBundleSpecById(
  id: string,
  specs: Specs,
  system: boolean = false
): UnitBundleSpec {
  const spec = getSpec(specs, id)

  const { base } = spec

  if (base) {
    return {
      unit: {
        id,
      },
    }
  } else {
    const custom: GraphSpecs = {
      [id]: spec as GraphSpec,
    }

    _bundle(spec as GraphSpec, specs, custom, new Set(), system)

    return {
      unit: {
        id,
      },
      specs: custom,
    }
  }
}

export function bundleSpec(
  spec: GraphSpec,
  specs: Specs,
  system: boolean = false,
  custom: GraphSpecs = {}
): BundleSpec {
  const branch = new Set<string>([])

  _bundle(spec, specs, custom, branch, system)

  return { spec, specs: custom }
}

function _bundle(
  spec: GraphSpec,
  specs: Specs,
  custom: GraphSpecs,
  branch: Set<string>,
  system: boolean
): void {
  if (!spec.id) {
    throw new Error('spec id is required')
  }

  if (spec.system && !system) {
    return
  }

  if (branch.has(spec.id)) {
    return
  }

  branch.add(spec.id)

  _bundleUnits(spec, specs, custom, branch, system)
}

function _bundleUnit(
  unit: GraphUnitSpec,
  specs: Specs,
  custom: GraphSpecs,
  branch: Set<string>,
  system: boolean
) {
  const { id, input = {} } = unit

  for (const inputId in input) {
    const _input = input[inputId] ?? {}

    const { data } = _input

    if (data !== undefined) {
      const dataRef = evaluateDataValue(data, specs, {})

      for (const path of dataRef.ref ?? []) {
        const bundle = deepGet(dataRef.data, path)

        for (const specId in bundle.specs) {
          const spec = bundle.specs[specId]

          if (!custom[specId] && (!isSystemSpecId(specs, specId) || system)) {
            custom[specId] = spec
          }

          _bundle(
            spec,
            weakMerge(specs, bundle.specs ?? {}),
            custom,
            branch,
            system
          )
        }

        _bundleUnit(bundle.unit, specs, custom, branch, system)
      }
    }
  }

  const _spec = getSpec(weakMerge(specs, custom), id) as GraphSpec

  if (!custom[id] && (!isSystemSpecId(specs, id) || system)) {
    custom[id] = _spec
  }

  _bundle(_spec, specs, custom, new Set(branch), system)
}

function _bundleUnits(
  spec: GraphSpec,
  specs: Specs,
  custom: GraphSpecs,
  branch: Set<string>,
  system: boolean
): void {
  const { units = {} } = spec

  for (const unit_id in units) {
    const unit = units[unit_id]

    _bundleUnit(unit, specs, custom, branch, system)
  }
}
