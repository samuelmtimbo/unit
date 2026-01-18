import { Graph } from '../../Class/Graph'
import { GraphMoveSubComponentRootData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphMoveSubComponentRootMomentData
  extends GraphMoveSubComponentRootData {
  path?: string[]
}

export interface GraphMoveSubcomponentRootMoment
  extends Moment<GraphMoveSubComponentRootMomentData> {}

export function extractMoveSubComponentRootEventData(
  ...[
    { parentId, prevParentIdMap, children, index, slotMap, prevSlotMap },
    path,
  ]: G_EE['move_sub_component_root']
): GraphMoveSubComponentRootMomentData {
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
  data: GraphMoveSubComponentRootMomentData
) {
  return data
}

export function watchGraphMoveSubComponentRoot(
  event: 'move_sub_component_root',
  graph: Graph,
  callback: (moment: GraphMoveSubcomponentRootMoment) => void
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
