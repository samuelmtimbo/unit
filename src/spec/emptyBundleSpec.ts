import deepMerge from '../system/f/object/DeepMerge/f'
import { BundleSpec } from '../types/BundleSpec'
import { emptyGraphSpec } from './emptySpec'

export const emptyBundleSpec = (
  partial: Partial<BundleSpec> = {}
): BundleSpec =>
  deepMerge(
    {
      spec: emptyGraphSpec(partial.spec),
      specs: {},
    },
    partial
  )
