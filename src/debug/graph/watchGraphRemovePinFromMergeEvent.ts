import { Graph } from '../../Class/Graph'
import { GraphRemovePinFromMergeData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphRemovePinFromMergeMomentData
  extends GraphRemovePinFromMergeData {
  path: string[]
}

export interface GraphAddPinToMergeMoment
  extends Moment<GraphRemovePinFromMergeMomentData> {}

export function extractRemovePinFromMergeEventData(
  ...[mergeId, unitId, type, pinId, path]: G_EE['remove_pin_from_merge']
): GraphRemovePinFromMergeMomentData {
  return {
    mergeId,
    unitId,
    type,
    pinId,
    path,
  }
}

export function stringifyAddUnitEventData(
  data: GraphRemovePinFromMergeMomentData
): any {
  return data
}

export function watchGraphRemovePinFromMergeEvent(
  event: 'remove_pin_from_merge',
  graph: Graph,
  callback: (moment: GraphAddPinToMergeMoment) => void
): () => void {
  const listener = (...args: G_EE['remove_pin_from_merge']) => {
    const data = stringifyAddUnitEventData(
      extractRemovePinFromMergeEventData(...args)
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
