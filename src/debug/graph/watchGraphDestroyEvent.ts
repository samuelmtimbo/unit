import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphMetadataMomentData {
  path: string[]
}

export interface GraphMetadataMoment extends Moment<GraphMetadataMomentData> {}

export function watchGraphDestroyEvent(
  event: 'destroy',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (path: string[] = []) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
      },
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
