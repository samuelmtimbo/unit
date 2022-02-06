import { Graph } from '../Class/Graph'
import { GraphExposedSubPinSpec } from '../types'
import { IO } from '../types/IO'
import { Moment } from './Moment'

export interface GraphExposedPinEventData {
  type: IO
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
    type: IO,
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
