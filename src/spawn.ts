import { Graph } from './Class/Graph'
import { Pod } from './pod'
import { System } from './system'
import { BundleSpec } from './system/platform/method/process/BundleSpec'

export function spawn(system: System): Pod {
  const { pods } = system

  const pod: Pod = {
    specs: {},
    graphs: [],
  }

  pods.push(pod)

  return pod
}

export function start(system: System, pod: Pod, bundle: BundleSpec): Graph {
  const { spec, specs } = bundle

  for (const spec_id in specs) {
    if (pod.specs[spec_id]) {
      throw new Error('cannot have duplicated spec id')
    }

    const spec = specs[spec_id]

    pod.specs[spec_id] = spec
  }

  const graph = new Graph(spec, {}, system, pod)

  pod.graphs.push(graph)

  graph.play()

  return graph
}
