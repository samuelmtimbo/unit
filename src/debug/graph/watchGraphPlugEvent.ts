import { Graph } from '../../Class/Graph'
import { GraphSubPinSpec } from '../../types'
import { IO } from '../../types/IO'
import { Moment } from './../Moment'

export interface GraphPlugMomentData {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  path: string[]
}

export interface GraphPlugMoment extends Moment<GraphPlugMomentData> {}

export function watchGraphPlugEvent(
  event: 'plug_pin' | 'unplug_pin',
  graph: Graph,
  callback: (moment: GraphPlugMoment) => void
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
