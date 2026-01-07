import { Graph } from '../../Class/Graph'
import { GraphRemoveMergeData } from '../../Class/Graph/interface'
import Merge from '../../Class/Merge'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphRemoveMergeMomentData extends GraphRemoveMergeData {
  mergeSpec: GraphMergeSpec
  path: string[]
}

export interface GraphRemoveMergeMoment
  extends Moment<GraphRemoveMergeMomentData> {}

export function extractRemoveMergeEventData(
  mergeId: string,
  mergeSpec: GraphMergeSpec,
  merge: Merge,
  path: string[]
): GraphRemoveMergeMomentData {
  return {
    mergeId,
    mergeSpec,
    path,
  }
}

export function stringifyRemoveMergeEventData(
  data: GraphRemoveMergeMomentData
) {
  return data
}

export function watchGraphRemoveMergeEvent(
  event: 'remove_merge',
  graph: Graph,
  callback: (moment: GraphRemoveMergeMoment) => void
): () => void {
  const listener = (...args: G_EE['add_merge']) => {
    const data = stringifyRemoveMergeEventData(
      extractRemoveMergeEventData(...args)
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
