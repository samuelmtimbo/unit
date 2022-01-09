import { Graph } from '../Class/Graph'
import { GraphExposedSubPinSpec } from '../types'
import { Moment } from './Moment'

export interface GraphExposedPinEventData {
  type: 'input' | 'output'
  pinId: string
  subPinId: string
  subPinSpec: GraphExposedSubPinSpec
}

export interface GraphExposedPinEvent
  extends Moment<GraphExposedPinEventData> {}

export function watchGraphExposedPinEvent(
  event: 'expose_pin' | 'cover_pin',
  graph: Graph,
  callback: (moment: GraphExposedPinEvent) => void
): () => void {
  const listener = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        subPinId,
        subPinSpec,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
