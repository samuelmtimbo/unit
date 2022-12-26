import { Graph } from '../../Class/Graph'
import { GraphMergeSpec } from '../../types'
import { Moment } from './../Moment'

export interface GraphMergeMomentData {
  mergeId: string
  mergeSpec: GraphMergeSpec
}

export interface GraphMergeMoment extends Moment<GraphMergeMomentData> {}

export function watchGraphMergeEvent(
  event: 'add_merge' | 'remove_merge',
  graph: Graph,
  callback: (moment: GraphMergeMoment) => void
): () => void {
  const listener = (mergeId: string, mergeSpec: GraphMergeSpec) => {
    callback({
      type: 'graph',
      event,
      data: {
        mergeId,
        mergeSpec,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
