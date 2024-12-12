import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphMetadataMomentData {
  data: { path: string[]; data: any }
  path: string[]
}

export interface GraphMetadataMoment extends Moment<GraphMetadataMomentData> {}

export function watchGraphSetMetadataEvent(
  event: 'set_metadata',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (data: { path: string[]; data: any }, path: string[]) => {
    callback({
      type: 'graph',
      event,
      data: {
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
