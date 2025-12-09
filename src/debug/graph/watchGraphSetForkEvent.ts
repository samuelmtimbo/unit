import { Graph } from '../../Class/Graph'
import { GraphSetForkData } from '../../Class/Graph/interface'
import { Moment } from '../Moment'

export interface GraphSetForkMomentData extends GraphSetForkData {
  path: string[]
}

export interface GraphMetadataMoment extends Moment<GraphSetForkMomentData> {}

export function watchGraphSetForkEvent(
  event: 'set_fork',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (fork: any, path: string[]) => {
    callback({
      type: 'graph',
      event,
      data: {
        fork,
        path,
      },
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
