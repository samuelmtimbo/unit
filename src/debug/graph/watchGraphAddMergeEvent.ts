import { Graph } from '../../Class/Graph'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphAddMergeMomentData {
  mergeId: string
  mergeSpec: GraphMergeSpec
  path: string[]
}

export interface GraphAddMergeMoment extends Moment<GraphAddMergeMomentData> {}

export function extractAddMergeEventData(
  ...[mergeId, mergeSpec, merge, path]: G_EE['add_merge']
): GraphAddMergeMomentData {
  return {
    mergeId,
    mergeSpec,
    path,
  }
}

export function stringifyAddMergeEventData(data: GraphAddMergeMomentData) {
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
