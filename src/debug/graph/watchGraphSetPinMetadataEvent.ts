import { Graph } from '../../Class/Graph'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetPinMetadataMomentData {
  type: IO
  pinId: string
  path_: string[]
  data: any
  path: string[]
}

export interface GraphMetadataMoment
  extends Moment<GraphSetPinMetadataMomentData> {}

export function watchGraphSetPinMetadataEvent(
  event: 'set_pin_metadata',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
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
