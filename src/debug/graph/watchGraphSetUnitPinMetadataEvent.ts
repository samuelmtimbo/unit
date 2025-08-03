import { Graph } from '../../Class/Graph'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetUnitPinMetadataMomentData {
  unitId: string
  type: IO
  pinId: string
  path_: string[]
  data: any
  path: string[]
}

export interface GraphMetadataMoment
  extends Moment<GraphSetUnitPinMetadataMomentData> {}

export function watchGraphSetUnitPinMetadataEvent(
  event: 'set_unit_pin_metadata',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
    unitId: string,
    type: IO,
    pinId: string,
    path_: string[],
    data: any,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        type,
        pinId,
        path_,
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
