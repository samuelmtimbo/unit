import { Graph } from './Class/Graph/index'
import { getGlobalUnit } from './client/globalUnit'
import { C } from './interface/C'
import { G } from './interface/G'
import { PO } from './interface/PO'
import { U } from './interface/U'
import { GraphSpec } from './types/index'

export function spawn(spec: GraphSpec): PO {
  const graph = new Graph(spec)

  // RETURN
  graph.play()

  const pod = {
    refGlobalUnit(id: string): void {
      const unit = getGlobalUnit(id)
      const _unit = unit.connect({}, new Set())
      return _unit
    },

    graph(): U & C & G {
      return graph
    },
  }

  return pod
}
