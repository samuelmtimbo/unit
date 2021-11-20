import { getSpec, isSystemSpecId } from './client/spec'
import { BundleSpec } from './system/platform/method/process/BundleSpec'
import { GraphSpec, GraphSpecs, Specs } from './types'

export function bundleSpec(spec: GraphSpec, specs: Specs): BundleSpec {
  const custom: GraphSpecs = {}

  _bundle(spec, specs, custom)

  return { spec, specs: custom }
}

function _bundle(spec: GraphSpec, specs: Specs, custom: GraphSpecs): void {
  const { units = {} } = spec

  for (const unit_id in units) {
    const unit = units[unit_id]
    const { path } = unit
    if (!custom[path] && !isSystemSpecId(path)) {
      const _spec = getSpec(path) as GraphSpec
      custom[path] = _spec
      _bundle(_spec, specs, custom)
    }
  }
}
