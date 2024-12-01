import { Graph } from '../../Class/Graph'
import { BundleSpec } from '../BundleSpec'

export interface S {
  start(bundle: BundleSpec): Graph
}
