import { GraphSpec } from './GraphSpec'
import { GraphSpecs } from './GraphSpecs'

export type BundleSpecMetadata = {
  author?: string
}

export type BundleSpec = {
  spec?: GraphSpec
  specs?: GraphSpecs
  metadata?: BundleSpecMetadata
}
