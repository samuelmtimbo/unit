import { Graph } from '../../Class/Graph'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphAddMergeMomentData {
  mergeId: string
  mergeSpec: GraphMergeSpec
}

export interface GraphAddMergeMoment
  extends GraphMoment<GraphAddMergeMomentData> {}

export function extractAddMergeEventData(
  ...[mergeId, mergeSpec, merge, path]: G_EE['add_merge']
): GraphAddMergeMoment['data'] {
  return {
    mergeId,
    mergeSpec,
    path,
  }
}

export function stringifyAddMergeEventData(data: GraphAddMergeMoment['data']) {
  return data
}

export function watchGraphAddMergeEvent(
  event: 'add_merge',
  graph: Graph,
  callback: (moment: GraphAddMergeMoment) => void
): () => void {
  const listener = (...args: G_EE['add_merge']) => {
    const data = stringifyAddMergeEventData(extractAddMergeEventData(...args))

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
