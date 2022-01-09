import { Graph } from './Class/Graph'
import { newSpecId } from './client/spec'
import { Pod } from './pod'
import { System } from './system'
import { BundleSpec } from './system/platform/method/process/BundleSpec'
import { Dict } from './types/Dict'

export function spawn(system: System): Pod {
  const { pods } = system

  const pod: Pod = {
    api: new Set(),
    units: {},
    specs: {},
    graphs: {},
  }

  pods.push(pod)

  return pod
}

export function start(
  system: System,
  pod: Pod,
  bundle: BundleSpec
): [Dict<string>, Graph] {
  const { spec, specs } = bundle

  const spec_id_map = {}

  for (const spec_id in specs) {
    if (pod.specs[spec_id]) {
      const new_spec_id = newSpecId(pod.specs)
      spec_id_map[spec_id] = new_spec_id
    }
  }

  const graph = new Graph(spec, {}, system, pod)

  graph.play()

  return [spec_id_map, graph]
}
