import { C } from '../C'
import { G } from '../G'
import { U } from '../U'
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
