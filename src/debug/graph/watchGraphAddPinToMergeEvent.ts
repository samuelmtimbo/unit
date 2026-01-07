import { Graph } from '../../Class/Graph'
import { GraphAddPinToMergeData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphAddPinToMergeMomentData extends GraphAddPinToMergeData {
  path: string[]
}

export interface GraphAddPinToMergeMoment
  extends Moment<GraphAddPinToMergeMomentData> {}

export function extractAddPinToMergeEventData(
  ...[mergeId, unitId, type, pinId, path]: G_EE['add_pin_to_merge']
): GraphAddPinToMergeMomentData {
  return {
    mergeId,
    unitId,
    type,
    pinId,
    path,
  }
}

export function stringifyAddPinToMergeEventData(
  data: GraphAddPinToMergeMomentData
): any {
  return data
}

export function watchGraphAddPinToMergeEvent(
  event: 'add_pin_to_merge',
  graph: Graph,
  callback: (moment: GraphAddPinToMergeMoment) => void
): () => void {
  const listener = (...args: G_EE['add_pin_to_merge']) => {
    const data = stringifyAddPinToMergeEventData(
      extractAddPinToMergeEventData(...args)
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
