import { Graph } from '../../Class/Graph'
import { GraphMoveSubGraphIntoData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from './../Moment'

export interface GraphMoveSubgraphIntoMomentData
  extends GraphMoveSubGraphIntoData {
  path: string[]
}

export interface GraphMoveSubgraphIntoMoment
  extends Moment<GraphMoveSubgraphIntoMomentData> {}

export function extractMoveSubgraphIntoEventData(
  ...[
    graphId,
    spec,
    selection,
    mapping,
    moves,
    path,
  ]: G_EE['move_subgraph_into']
): GraphMoveSubgraphIntoMomentData {
  return {
    graphId,
    spec,
    selection,
    mapping,
    moves,
    path,
  }
}

export function stringifyMoveSubgraphIntoEventData(
  data: GraphMoveSubgraphIntoMomentData
) {
  return data
}

export function watchGraphMoveSubgraphIntoEvent(
  event: 'move_subgraph_into',
  graph: Graph,
  callback: (moment: GraphMoveSubgraphIntoMoment) => void
): () => void {
  const listener = (...args: G_EE['move_subgraph_into']) => {
    const data = stringifyMoveSubgraphIntoEventData(
      extractMoveSubgraphIntoEventData(...args)
    )

    callback({
      type: 'graph',
      event,
      data,
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
