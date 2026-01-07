import { Graph } from '../../Class/Graph'
import { GraphReorderSubComponentData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphReorderSubComponentMomentData
  extends GraphReorderSubComponentData {
  path: string[]
}

export interface GraphMoveSubcomponentRootMoment
  extends Moment<GraphReorderSubComponentMomentData> {}

export function extractReorderSubComponentEventData(
  ...[parentId, childId, to, path]: G_EE['reorder_sub_component']
): GraphReorderSubComponentMomentData {
  return {
    parentId,
    childId,
    to,
    path,
  }
}

export function stringifyReorderSubComponentEventData(
  data: GraphReorderSubComponentMomentData
) {
  return data
}

export function watchGraphReorderSubComponent(
  event: 'reorder_sub_component',
  graph: Graph,
  callback: (moment: GraphMoveSubcomponentRootMoment) => void
): () => void {
  const listener = (...args: G_EE['reorder_sub_component']) => {
    const data = stringifyReorderSubComponentEventData(
      extractReorderSubComponentEventData(...args)
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
