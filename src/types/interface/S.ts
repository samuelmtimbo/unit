import { Graph } from '../../Class/Graph'
import { BundleSpec } from '../BundleSpec'
import { GraphBundle } from '../GraphClass'
import { Unlisten } from '../Unlisten'

export interface S {
  fromBundle(bundleSpec: BundleSpec): GraphBundle
  newGraph(bundle: GraphBundle): [Graph, Unlisten]
}
