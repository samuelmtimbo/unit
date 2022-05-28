import { Graph } from '../Class/Graph'
import { GraphPinSpec } from '../types'
import { IO } from '../types/IO'
import { Moment } from './Moment'

export interface UnitLeafExposedPinSetEventData {
  path: string[]
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
}

export interface UnitLeafExposedPinSetEvent
  extends Moment<UnitLeafExposedPinSetEventData> {}

export function watchUnitLeafExposedPinSetEvent(
  event: 'leaf_expose_pin_set' | 'leaf_cover_pin_set',
  graph: Graph,
  callback: (moment: UnitLeafExposedPinSetEvent) => void
): () => void {
  const listener = (
    path: string[],
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec
  ) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
        type,
        pinId,
        pinSpec,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
