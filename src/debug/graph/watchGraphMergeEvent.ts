import { Graph } from '../../Class/Graph'
import { GraphMergeSpec } from '../../types'
import { G_EE } from '../../types/interface/G'
import { Moment } from './../Moment'

export interface GraphMergeMomentData {
  mergeId: string
  mergeSpec: GraphMergeSpec
  path: string[]
}

export interface GraphMergeMoment extends Moment<GraphMergeMomentData> {}

export function watchGraphMergeEvent(
  event: 'add_merge' | 'remove_merge',
  graph: Graph,
  callback: (moment: GraphMergeMoment) => void
): () => void {
  const listener = (
    ...[mergeId, mergeSpec, merge, path]: G_EE['add_merge']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        mergeId,
        mergeSpec,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
