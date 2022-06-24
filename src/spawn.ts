import { Graph } from './Class/Graph'
import { Pod } from './pod'
import { fromSpec } from './spec/fromSpec'
import { System } from './system'
import { GraphSpec, GraphSpecs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { randomIdNotIn } from './util/id'

export function spawn(system: System, specs: GraphSpecs = {}): Pod {
  const { pods } = system

  // const specs = {}
  const graphs = []

  const pod: Pod = {
    specs,
    graphs,
    newSpec: (spec: GraphSpec): string => {
      const id = randomIdNotIn({ ...specs, ...system.specs })

      specs[id] = spec

      return id
    },
  }

  pods.push(pod)

  return pod
}

export function start(system: System, pod: Pod, spec: GraphSpec): Graph {
  const Class = fromSpec(spec, { ...pod.specs, ...system.specs }, {})

  const graph = new Class(system, pod)

  pod.graphs.push(graph)

  graph.play()

  return graph
}
