import { Graph } from '../Class/Graph'
import { AsyncGraph } from '../interface/async/AsyncGraph'
import { G } from '../interface/G'
import { fromSpec } from '../spec/fromSpec'
import { GraphSpec } from '../types'
import { Dict } from '../types/Dict'
import { Component, componentFromSpec } from './component'
import { Client } from './render/Client'
import { getSpec } from './spec'

export function graphComponentFromSpec(
  spec: GraphSpec,
  input: Dict<any> = {}
): Client {
  const Class = fromSpec(spec, globalThis.__specs)

  const graph = new Class() as Graph

  for (const pinId in input) {
    const data = input[pinId]
    graph.setPinData('input', pinId, data)
  }

  const $graph = AsyncGraph(graph)

  const component = componentFromSpec(spec)

  component.connect($graph)

  graph.play()

  const client = { graph, component }

  return client
}

export function graphComponentFromId(
  spec_id: string,
  input: Dict<any> = {}
): { graph: G; component: Component } {
  const spec: GraphSpec = getSpec(spec_id) as GraphSpec

  const controller = graphComponentFromSpec(spec, input)

  return controller
}
