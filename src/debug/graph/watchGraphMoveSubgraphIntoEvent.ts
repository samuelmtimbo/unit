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

export function watchGraphMoveSubgraphEvent(
  event: 'move_subgraph_into' | 'move_subgraph_out_of',
  graph: Graph,
  callback: (moment: GraphMoveSubgraphIntoMoment) => void
): () => void {
  const listener = (
    ...[
      graphId,
      graphBundle,
      graphSpec,
      nextSpecId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      path,
    ]: G_EE['move_subgraph_into']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        graphId,
        graphBundle,
        graphSpec,
        nodeIds,
        nextSpecId,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentIndexMap: {}, // TODO
        nextUnitPinMergeMap: {},
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
