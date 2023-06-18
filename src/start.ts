import { Graph } from './Class/Graph'
import { fromSpec } from './spec/fromSpec'
import { System } from './system'
import { GraphSpec } from './types/GraphSpec'

export function start(system: System, spec: GraphSpec): Graph {
  if (!spec.id) {
    system.newSpec(spec)
  }

  const Class = fromSpec(spec, system.specs, {})

  const graph = new Class(system)

  system.graphs.push(graph)

  graph.play()

  return graph
}
