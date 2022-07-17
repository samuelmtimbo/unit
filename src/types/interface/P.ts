import { GraphSpecs } from '..'
import { Graph } from '../../Class/Graph'
import { BundleSpec } from '../BundleSpec'
import { Dict } from '../Dict'
import { Unlisten } from '../Unlisten'

export interface P {
  refUnit(id: string): void

  newGraph(bundle: BundleSpec): [Dict<string>, Graph, Unlisten]

  getSpecs(): GraphSpecs
}
