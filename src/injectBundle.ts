import { BundleSpec } from './types/BundleSpec'
import { GraphSpecs } from './types/GraphSpecs'
import { RE } from './types/interface/RE'
import { weakMerge } from './weakMerge'

export function injectUserBundle(
  registry: { lockSpec: RE['lockSpec']; injectSpecs: RE['injectSpecs'] },
  bundle: BundleSpec
) {
  const { spec, specs = {} } = bundle

  const specs_ = weakMerge(specs, { [spec.id]: spec })

  return injectUserSpecs(registry, specs_)
}

export function injectUserSpecs(
  registry: { lockSpec: RE['lockSpec']; injectSpecs: RE['injectSpecs'] },
  specs: GraphSpecs
) {
  const specIdMap = registry.injectSpecs(specs)

  // lock spec to prevent deletion
  for (const specId in specs) {
    registry.lockSpec(specId)
  }

  return specIdMap
}
