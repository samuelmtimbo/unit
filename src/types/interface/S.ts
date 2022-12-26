import { Graph } from '../../Class/Graph'
import { Dict } from '../Dict'
import { GraphBundle } from '../GraphClass'
import { Unlisten } from '../Unlisten'

export interface S {
  newSystem(init: {}): [S, Unlisten]
  newGraph(bundle: GraphBundle): [Dict<string>, Graph, Unlisten]
}
