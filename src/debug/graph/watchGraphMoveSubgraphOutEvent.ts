import { Graph } from '../../Class/Graph'
import { GraphMoveSubGraphOutOfData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphMoveSubgraphOutOfMomentData
  extends GraphMoveSubGraphOutOfData {
  path: string[]
}

export interface GraphMoveSubgraphOutOfMoment
  extends Moment<GraphMoveSubgraphOutOfMomentData> {}

export function extractMoveSubgraphOutOfEventData(
  ...[
    graphId,
    spec,
    selection,
    mapping,
    moves,
    path,
  ]: G_EE['move_subgraph_out_of']
): GraphMoveSubgraphOutOfMomentData {
  return {
    graphId,
    spec,
    selection,
    mapping,
    moves,
    path,
  }
}

export function stringifyMoveSubgraphOutOfEventData(
  data: GraphMoveSubgraphOutOfMomentData
) {
  return data
}

export function watchGraphMoveSubgraphOutOfEvent(
  event: 'move_subgraph_out_of',
  graph: Graph,
  callback: (moment: GraphMoveSubgraphOutOfMoment) => void
): () => void {
  const listener = (...args: G_EE['move_subgraph_out_of']) => {
    const data = stringifyMoveSubgraphOutOfEventData(
      extractMoveSubgraphOutOfEventData(...args)
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
