import { Graph } from '../../Class/Graph'
import { GraphSpecs } from '..'
import { BundleSpec } from '../BundleSpec'
import { Dict } from '../Dict'
import { G } from './G'
import { Unlisten } from '../Unlisten'

export interface P {
  refUnit(id: string): void

  newGraph(bundle: BundleSpec): [Dict<string>, Graph, Unlisten]

  getSpecs(): GraphSpecs
}
