import { C } from '../interface/C'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { $Graph } from './$Graph'
import { AsyncComponent } from './AsyncComponent'
import { AsyncGCall, AsyncGRef, AsyncGWatch } from './AsyncG_'

export const AsyncGraph = (graph: U & C & G): $Graph => {
  return {
    ...AsyncComponent(graph),

    ...AsyncGCall(graph),
    ...AsyncGWatch(graph),
    ...AsyncGRef(graph),
  }
}
