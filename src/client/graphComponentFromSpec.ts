import { graphFromSpec } from '../spec/fromSpec'
import { getSpec } from '../spec/util'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'
import { G } from '../types/interface/G'
import { AsyncGraph } from '../types/interface/async/AsyncGraph'
import { Component } from './component'
import { componentFromSpec } from './componentFromSpec'
import { Client } from './render/Client'

export function graphComponentFromSpec(
  system: System,
  spec: GraphSpec,
  input: Dict<any> = {}
): Client {
  const { specs } = system

  const graph = graphFromSpec(system, spec, specs, {}, true)

  for (const pinId in input) {
    const data = input[pinId]

    graph.setPinData('input', pinId, data)
  }

  const $graph = AsyncGraph(graph)

  const component = componentFromSpec(system, spec, specs)

  component.connect($graph)

  graph.play()

  const client = { graph, component }

  return client
}

export function graphComponentFromId(
  system: System,

  specId: string,
  input: Dict<any> = {}
): { graph: G; component: Component } {
  const { specs } = system

  const spec: GraphSpec = getSpec(specs, specId) as GraphSpec

  const { component, graph } = graphComponentFromSpec(system, spec, input)

  return { component, graph }
}
