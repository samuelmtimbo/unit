import { Graph } from '../../Class/Graph'
import { BundleSpec } from '../BundleSpec'
import { Dict } from '../Dict'
import { GraphSpecs } from '../GraphSpecs'
import { Unlisten } from '../Unlisten'

export interface P {
  refUnit(id: string): void

  newGraph(bundle: BundleSpec): [Dict<string>, Graph, Unlisten]

  getSpecs(): GraphSpecs
}
