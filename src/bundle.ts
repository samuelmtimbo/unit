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

    _bundle(spec as GraphSpec, specs, custom)

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

    _bundle(spec as GraphSpec, specs, custom)

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

  _bundle(spec, specs, custom)

  return { spec, specs: custom }
}

function _bundle(spec: GraphSpec, specs: Specs, custom: GraphSpecs): void {
  const { units = {} } = spec

  for (const unit_id in units) {
    const unit = units[unit_id]

    const { id, input = {} } = unit

    if (!custom[id]) {
      if (!isSystemSpecId(specs, id)) {
        const _spec = getSpec(specs, id) as GraphSpec

        custom[id] = _spec

        _bundle(_spec, specs, custom)
      }
    }

    for (const inputId in input) {
      const { data } = input[inputId]

      if (data) {
        if (data.startsWith('${') && data.endsWith('}')) {
          // TODO (?)
        }
      }
    }
  }
}
