import { getSpec, isSystemSpecId } from './client/spec'
import { GraphSpec, GraphSpecs, GraphUnitSpec, Specs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { UnitBundleSpec } from './types/UnitBundleSpec'

export function unitBundleSpec(
  unit: GraphUnitSpec,
  specs: Specs
): UnitBundleSpec {
  const { id } = unit

  const spec = getSpec(specs, id)

  const { system } = spec

  if (system) {
    return {
      unit: {
        id,
        ...unit,
      },
    }
  } else {
    const custom: GraphSpecs = {
      [id]: spec as GraphSpec,
    }

    _bundle(spec as GraphSpec, specs, custom, new Set())

    return {
      unit: {
        id,
        ...unit,
      },
      specs: custom,
    }
  }
}

export function unitBundleSpecById(id: string, specs: Specs): UnitBundleSpec {
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

    _bundle(spec as GraphSpec, specs, custom, new Set())

    return {
      unit: {
        id,
      },
      specs: custom,
    }
  }
}

export function bundleSpec(spec: GraphSpec, specs: Specs): BundleSpec {
  const custom: GraphSpecs = {}

  _bundle(spec, specs, custom, new Set())

  return { spec, specs: custom }
}

function _bundle(
  spec: GraphSpec,
  specs: Specs,
  custom: GraphSpecs,
  branch: Set<string>
): void {
  const { units = {} } = spec

  if (branch.has(spec.id)) {
    return
  }

  if (!custom[spec.id]) {
    if (!specs[spec.id] || !isSystemSpecId(specs, spec.id)) {
      custom[spec.id] = spec
    }
  }

  branch.add(spec.id)

  for (const unit_id in units) {
    const unit = units[unit_id]

    const { id } = unit

    const _spec = getSpec(specs, id) as GraphSpec

    _bundle(_spec, specs, custom, new Set(branch))
  }
}
