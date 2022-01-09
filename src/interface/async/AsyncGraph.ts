import { Graph } from '../../Class/Graph'
import { $Graph } from './$Graph'
import { AsyncComponent } from './AsyncComponent'
import { AsyncGCall, AsyncGRef, AsyncGWatch } from './AsyncG_'

export const AsyncGraph = (graph: Graph): $Graph => {
  return {
    ...AsyncComponent(graph),

    ...AsyncGCall(graph),
    ...AsyncGWatch(graph),
    ...AsyncGRef(graph),
  }
}
