import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphSetUnitMetadataMomentData {
  unitId: string
  path_: string[]
  data: any
  path: string[]
}

export interface GraphMetadataMoment
  extends Moment<GraphSetUnitMetadataMomentData> {}

export function watchGraphSetUnitMetadataEvent(
  event: 'set_unit_metadata',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
    unitId: string,
    path_: string[],
    data: any,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
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
