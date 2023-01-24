import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { Moment } from './../Moment'

export interface GraphMoveSubgraphIntoMomentData {
  graphId
  nodeIds
  nextIdMap
  nextPinIdMap
  nextMergePinId
  nextPlugSpec
  nextSubComponentParent
  nextSubComponentChildrenMap
  path: string[]
}

export interface GraphMoveSubgraphIntoMoment
  extends Moment<GraphMoveSubgraphIntoMomentData> {}

export function watchGraphMoveSubgraphIntoEvent(
  event: 'move_subgraph_into',
  graph: Graph,
  callback: (moment: GraphMoveSubgraphIntoMoment) => void
): () => void {
  const listener = (
    ...[
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParent,
      nextSubComponentChildrenMap,
      path,
    ]: G_EE['move_subgraph_into']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        graphId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParent,
        nextSubComponentChildrenMap,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
