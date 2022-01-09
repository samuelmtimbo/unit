import { Graph } from '../Class/Graph'
import { BundleSpec } from '../system/platform/method/process/BundleSpec'
import { GraphSpecs } from '../types'
import { Dict } from '../types/Dict'

export interface PO {
  refUnit(id: string): void

  refGraph(bundle: BundleSpec): [Dict<string>, Graph]

  getSpecs(): GraphSpecs
}
