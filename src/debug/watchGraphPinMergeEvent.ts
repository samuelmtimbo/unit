import { Graph } from '../Class/Graph'
import { Moment } from './Moment'

export interface GraphMergePinMomentData {
  mergeId: string
  unitId: string
  type: 'input' | 'output'
  pinId: string
}

export interface GraphPinMergeMoment extends Moment<GraphMergePinMomentData> {}

export function watchGraphPinMergeEvent(
  event: 'add_pin_to_merge' | 'remove_pin_from_merge',
  graph: Graph,
  callback: (moment: GraphPinMergeMoment) => void
): () => void {
  const listener = (
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        mergeId,
        unitId,
        type,
        pinId,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
