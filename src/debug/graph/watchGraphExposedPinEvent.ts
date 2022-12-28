import { Graph } from '../../Class/Graph'
import { GraphSubPinSpec } from '../../types'
import { IO } from '../../types/IO'
import { Moment } from './../Moment'

export interface GraphExposePinEventData {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  path: string[]
}

export interface GraphExposePinEvent extends Moment<GraphExposePinEventData> {}

export function watchGraphExposePinEvent(
  event: 'expose_pin' | 'cover_pin',
  graph: Graph,
  callback: (moment: GraphExposePinEvent) => void
): () => void {
  const listener = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        subPinId,
        subPinSpec,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
