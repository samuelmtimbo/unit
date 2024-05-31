import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { remapSpec } from './remapSpec'

export const remapBundle = (bundle: BundleSpec, specIdMap: Dict<string>) => {
  remapSpec(bundle.spec, specIdMap)

  for (const specId in { ...bundle.specs }) {
    const spec = bundle.specs[specId]

    const nextSpecId = specIdMap[specId]

    if (nextSpecId) {
      delete bundle.specs[specId]

      bundle.specs[nextSpecId] = spec
    }

    remapSpec(spec, specIdMap)
  }
}
