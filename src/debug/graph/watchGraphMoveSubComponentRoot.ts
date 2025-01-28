import { Graph } from '../../Class/Graph'
import { GraphMoveSubComponentRootData } from '../../Class/Graph/interface'
import { Dict } from '../../types/Dict'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphMoveSubComponentRootMomentData
  extends GraphMoveSubComponentRootData {
  prevParentIdMap: Dict<string>
  prevSlotMap: Dict<string>
  path?: string[]
}

export interface GraphMoveSubcomponentRootMoment
  extends Moment<GraphMoveSubComponentRootMomentData> {}

export function watchGraphMoveSubComponentRoot(
  event: 'move_sub_component_root',
  graph: Graph,
  callback: (moment: GraphMoveSubcomponentRootMoment) => void
): () => void {
  const listener = (
    ...[
      parentId,
      prevParentIdMap,
      children,
      index,
      slotMap,
      prevSlotMap,
      path,
    ]: G_EE['move_sub_component_root']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        parentId,
        prevParentIdMap,
        children,
        index,
        slotMap,
        prevSlotMap,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
