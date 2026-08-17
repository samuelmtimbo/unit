import { Graph } from '../../Class/Graph'
import { GraphRemovePinFromMergeData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphRemovePinFromMergeMomentData
  extends GraphRemovePinFromMergeData {}

export interface GraphRemovePinFromMergeMoment
  extends GraphMoment<GraphRemovePinFromMergeMomentData> {}

export function extractRemovePinFromMergeEventData(
  ...[mergeId, unitId, type, pinId, path]: G_EE['remove_pin_from_merge']
): GraphRemovePinFromMergeMoment['data'] {
  return {
    mergeId,
    unitId,
    type,
    pinId,
    path,
  }
}

export function stringifyAddUnitEventData(
  data: GraphRemovePinFromMergeMoment['data']
): any {
  return data
}

export function watchGraphRemovePinFromMergeEvent(
  event: 'remove_pin_from_merge',
  graph: Graph,
  callback: (moment: GraphRemovePinFromMergeMoment) => void
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
