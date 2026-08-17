import { Graph } from '../../Class/Graph'
import { GraphReorderSubComponentData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphReorderSubComponentMomentData
  extends GraphReorderSubComponentData {}

export interface GraphReorderSubComponentMoment
  extends GraphMoment<GraphReorderSubComponentMomentData> {}

export function extractReorderSubComponentEventData(
  ...[{ parentId, childId, to }, path]: G_EE['reorder_sub_component']
): GraphReorderSubComponentMoment['data'] {
  return {
    parentId,
    childId,
    to,
    path,
  }
}

export function stringifyReorderSubComponentEventData(
  data: GraphReorderSubComponentMoment['data']
) {
  return data
}

export function watchGraphReorderSubComponent(
  event: 'reorder_sub_component',
  graph: Graph,
  callback: (moment: GraphReorderSubComponentMoment) => void
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
