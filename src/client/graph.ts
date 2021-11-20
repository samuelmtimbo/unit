import { forEachPinOnMerge } from '../spec/util'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import {
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphSpec,
  PinSpec,
  Specs,
} from '../types'
import { Dict } from '../types/Dict'
import { forEach } from '../util/array'
import { randomIdNotIn } from '../util/id'
import {
  getErrNodeId,
  getExternalNodeId,
  getInputNodeId,
  getMergeNodeId,
  getMetadataNodeId,
  getOutputNodeId,
  getPinNodeId,
} from './id'

export type N = {
  next: { [id: string]: N }
  previous: { [id: string]: N }
}

export function getSubPinSpecNodeId(
  type: 'input' | 'output',
  subPinSpec: GraphExposedSubPinSpec
): string {
  const { mergeId, unitId, pinId } = subPinSpec
  if (mergeId) {
    return getMergeNodeId(mergeId)
  } else {
    return getPinNodeId(unitId!, type, pinId!)
  }
}

// graph
export type G = { [id: string]: N }

// related
export type SG = { [id: string]: Set<string> }

export function build_graph(
  spec: GraphSpec,
  specs: Specs,
  pinToDatum: { [pinNodeId: string]: string } = {}
): G {
  const graph: G = {}

  const { units = {}, merges = {} } = spec

  forEachKeyValue(units, (unit, unitId: string) => {
    graph[unitId] = { next: {}, previous: {} }
    const unitSpec = specs[unit.id]

    const errNodeId = getErrNodeId(unitId)
    graph[errNodeId] = { next: {}, previous: { [unitId]: graph[unitId] } }
    graph[unitId].next[errNodeId] = graph[errNodeId]

    forEachKeyValue<PinSpec>(unitSpec.inputs || {}, (input, inputId) => {
      const inputNodeId = getInputNodeId(unitId, inputId)
      graph[inputNodeId] = { next: { [unitId]: graph[unitId] }, previous: {} }
      graph[unitId].previous[inputNodeId] = graph[inputNodeId]
      const datumNodeId = pinToDatum[inputNodeId]
      if (datumNodeId) {
        graph[datumNodeId] = {
          next: { [inputNodeId]: graph[inputNodeId] },
          previous: {},
        }
        graph[inputNodeId].previous[datumNodeId] = graph[datumNodeId]
      }
      const inputTypeNodeId = getMetadataNodeId(inputNodeId, 'type')
      graph[inputTypeNodeId] = {
        next: { [inputNodeId]: graph[inputNodeId] },
        previous: {},
      }
      graph[inputNodeId].previous[inputTypeNodeId] = graph[inputTypeNodeId]
    })

    forEachKeyValue<PinSpec>(unitSpec.outputs || {}, (output, outputId) => {
      const outputNodeId = getOutputNodeId(unitId, outputId)
      graph[outputNodeId] = { next: {}, previous: { [unitId]: graph[unitId] } }
      graph[unitId].next[outputNodeId] = graph[outputNodeId]
      const datumNodeId = pinToDatum[outputNodeId]
      if (datumNodeId) {
        graph[datumNodeId] = {
          next: {},
          previous: { [outputNodeId]: graph[outputNodeId] },
        }
        graph[outputNodeId].next[datumNodeId] = graph[datumNodeId]
      }
      const outputTypeNodeId = getMetadataNodeId(outputNodeId, 'type')
      graph[outputTypeNodeId] = {
        next: { [outputNodeId]: graph[outputNodeId] },
        previous: {},
      }
      graph[outputNodeId].previous[outputTypeNodeId] = graph[outputTypeNodeId]
    })
  })

  forEachKeyValue(merges, (merge, mergeId) => {
    const mergeNodeId = getMergeNodeId(mergeId)
    graph[mergeNodeId] = { next: {}, previous: {} }
    forEachPinOnMerge(merge, (unitId, type, pinId) => {
      if (type === 'input') {
        graph[mergeNodeId].next[unitId] = graph[unitId]
        graph[unitId].previous[mergeNodeId] = graph[mergeNodeId]
      } else {
        graph[mergeNodeId].previous[unitId] = graph[unitId]
        graph[unitId].next[mergeNodeId] = graph[mergeNodeId]
      }
    })
    const mergeTypeNodeId = getMetadataNodeId(mergeNodeId, 'type')
    graph[mergeTypeNodeId] = {
      next: { [mergeNodeId]: graph[mergeNodeId] },
      previous: {},
    }
    graph[mergeNodeId].previous[mergeTypeNodeId] = graph[mergeTypeNodeId]
  })

  forEachKeyValue(
    spec.inputs || {},
    (pinSpec: GraphExposedPinSpec, exposedPinId: string) => {
      const { pin = {} } = pinSpec
      forEachKeyValue(
        pin,
        (subPinSpec: GraphExposedSubPinSpec, subPinId: string) => {
          const extInputNodeId = getExternalNodeId(
            'input',
            exposedPinId,
            subPinId
          )
          graph[extInputNodeId] = { next: {}, previous: {} }
          const pinNodeId = getSubPinSpecNodeId('input', subPinSpec)
          graph[extInputNodeId].next[pinNodeId] = graph[pinNodeId]
          graph[pinNodeId].previous[extInputNodeId] = graph[extInputNodeId]
          const extInputTypeNodeId = getMetadataNodeId(extInputNodeId, 'type')
          graph[extInputTypeNodeId] = {
            next: { [extInputNodeId]: graph[extInputNodeId] },
            previous: {},
          }
          graph[extInputNodeId].previous[extInputTypeNodeId] =
            graph[extInputTypeNodeId]
        }
      )
    }
  )

  forEachKeyValue(
    spec.outputs || {},
    (pinSpec: GraphExposedPinSpec, exposedPinId: string) => {
      const { pin = {} } = pinSpec
      forEachKeyValue(
        pin,
        (subPinSpec: GraphExposedSubPinSpec, subPinId: string) => {
          const extOutputNodeId = getExternalNodeId(
            'output',
            exposedPinId,
            subPinId
          )
          graph[extOutputNodeId] = { next: {}, previous: {} }
          const pinNodeId = getSubPinSpecNodeId('output', subPinSpec)
          graph[extOutputNodeId].previous[pinNodeId] = graph[pinNodeId]
          graph[pinNodeId].next[extOutputNodeId] = graph[extOutputNodeId]
          const extOutputTypeNodeId = getMetadataNodeId(extOutputNodeId, 'type')
          graph[extOutputTypeNodeId] = {
            next: { [extOutputNodeId]: graph[extOutputNodeId] },
            previous: {},
          }
          graph[extOutputNodeId].previous[extOutputTypeNodeId] =
            graph[extOutputTypeNodeId]
        }
      )
    }
  )

  return graph
}

export const add_node_to_graph = (graph: G, node_id: string): void => {
  graph[node_id] = {
    next: {},
    previous: {},
  }
}

export const add_link_to_graph = (
  graph: G,
  source_id: string,
  target_id: string
): void => {
  const source = graph[source_id]
  const target = graph[target_id]
  source.next[target_id] = target
  target.previous[source_id] = source
}

export const remove_link_from_graph = (
  graph: G,
  source_id: string,
  target_id: string
): void => {
  const source = graph[source_id]
  const target = graph[target_id]
  delete source.next[target_id]
  delete target.previous[source_id]
}

export const change_link_target_on_graph = (
  graph: G,
  source_id: string,
  target_id: string,
  next_target_id: string
): void => {
  const target = graph[target_id]
  const source = graph[source_id]
  delete source.next[target_id]
  delete target.previous[source_id]
  const next_target = graph[next_target_id]
  source.next[next_target_id] = next_target
  next_target.previous[source_id] = source
}

export const change_link_source_on_graph = (
  graph: G,
  source_id: string,
  next_source_id: string,
  target_id: string
): void => {
  const target = graph[target_id]
  const source = graph[source_id]
  const next_source = graph[next_source_id]
  delete source.next[target_id]
  delete target.previous[source_id]
  next_source.next[target_id] = target
  target.previous[next_source_id] = next_source
}

export const remove_node_from_graph = (graph: G, node_id: string): void => {
  const node = graph[node_id]
  const { next, previous } = node
  for (let n_id in next) {
    const n = graph[n_id]
    delete n.previous[node_id]
  }
  for (let p_id in previous) {
    const p = graph[p_id]
    delete p.next[node_id]
  }
  delete graph[node_id]
}

export const build_subgraph = (
  graph: G,
  node_to_subgraph: Dict<string>,
  subgraph_to_node: Dict<Set<string>>,
  visited: Dict<boolean> = {}
) => {
  forEachKeyValue(graph, (_, id) => {
    _build_subgraph(id, graph, node_to_subgraph, subgraph_to_node, visited)
  })
}

const _build_subgraph = (
  id: string,
  graph: G,
  node_to_subgraph: Dict<string>,
  subgraph_to_node: Dict<Set<string>>,
  visited: Dict<boolean>
) => {
  if (visited[id]) {
    return
  }

  visited[id] = true

  const { previous, next } = graph[id]

  let subgraph_id: string
  if (node_to_subgraph[id]) {
    subgraph_id = node_to_subgraph[id]
  } else {
    subgraph_id = randomIdNotIn(subgraph_to_node)
    node_to_subgraph[id] = subgraph_id
    subgraph_to_node[subgraph_id] = new Set([id])
  }

  forEachKeyValue(previous, (_, prev_id) => {
    node_to_subgraph[prev_id] = subgraph_id
    subgraph_to_node[subgraph_id].add(prev_id)
    _build_subgraph(prev_id, graph, node_to_subgraph, subgraph_to_node, visited)
  })

  forEachKeyValue(next, (_, next_id) => {
    node_to_subgraph[next_id] = subgraph_id
    subgraph_to_node[subgraph_id].add(next_id)
    _build_subgraph(next_id, graph, node_to_subgraph, subgraph_to_node, visited)
  })
}

// TODO optimize
export const makeRelated = (graph: G): SG => {
  const related = {}
  forEachKeyValue(graph, (_, id) => {
    const relatedTo = new Set<string>([id])
    setConnectedTo(id, graph, relatedTo)
    related[id] = relatedTo
  })
  return related
}

export const setConnectedTo = (
  id: string,
  graph: G,
  related: Set<string> = new Set(),
  visited: Set<string> = new Set()
): void => {
  const node = graph[id]
  related.add(id)
  visited.add(id)
  const previous = Object.keys(node.previous)
  forEach<string>(previous, (p) => {
    if (!visited.has(p)) {
      setConnectedTo(p, graph, related, visited)
    }
  })
  const next = Object.keys(node.next)
  forEach<string>(next, (p) => {
    if (!visited.has(p)) {
      setConnectedTo(p, graph, related, visited)
    }
  })
}
