import { BundleSpec } from './types/BundleSpec'
import { GraphSpecs } from './types/GraphSpecs'
import { R } from './types/interface/R'
import { weakMerge } from './weakMerge'

export function injectUserBundle(registry: R, bundle: BundleSpec) {
  const { spec, specs = {} } = bundle

  const specs_ = weakMerge(specs, { [spec.id]: spec })

  return injectUserSpecs(registry, specs_)
}

export function injectUserSpecs(registry: R, specs: GraphSpecs) {
  // mark as "user" spec to prevent deletion
  for (const specId in specs) {
    specs[specId].user = true
    specs[specId].metadata = specs[specId].metadata ?? {}
    specs[specId].metadata.tags = specs[specId].metadata?.tags ?? []
    if (!specs[specId].metadata.tags.includes('user')) {
      specs[specId].metadata.tags.push('user')
    }
  }

  const specIdMap = registry.injectSpecs(specs)

  return specIdMap
}
