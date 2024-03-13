import { Graph } from '../../Class/Graph'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { IO } from '../../types/IO'
import { Moment } from './../Moment'

export interface GraphExposedPinSetMomentData {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  data: any
  path: string[]
}

export interface GraphExposedPinSetMoment
  extends Moment<GraphExposedPinSetMomentData> {}

export function watchGraphExposedPinSetEvent(
  event: 'expose_pin_set' | 'cover_pin_set',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    data: any,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        pinSpec,
        data,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
