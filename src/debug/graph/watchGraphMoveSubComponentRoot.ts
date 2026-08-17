import { Graph } from '../../Class/Graph'
import { GraphMoveSubComponentRootData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphMoveSubComponentRootMomentData
  extends GraphMoveSubComponentRootData {}

export interface GraphMoveSubComponentRootMoment
  extends GraphMoment<GraphMoveSubComponentRootMomentData> {}

export function extractMoveSubComponentRootEventData(
  ...[
    { parentId, prevParentIdMap, children, index, slotMap, prevSlotMap },
    path,
  ]: G_EE['move_sub_component_root']
): GraphMoveSubComponentRootMoment['data'] {
  return {
    parentId,
    prevParentIdMap,
    children,
    index,
    slotMap,
    prevSlotMap,
    path,
  }
}

export function stringifyMoveSubComponentRootEventData(
  data: GraphMoveSubComponentRootMoment['data']
) {
  return data
}

export function watchGraphMoveSubComponentRoot(
  event: 'move_sub_component_root',
  graph: Graph,
  callback: (moment: GraphMoveSubComponentRootMoment) => void
): () => void {
  const listener = (...args: G_EE['move_sub_component_root']) => {
    const data = stringifyMoveSubComponentRootEventData(
      extractMoveSubComponentRootEventData(...args)
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
