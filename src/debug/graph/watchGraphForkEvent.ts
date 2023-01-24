import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphForkMomentData {
  specId: string
  path: string[]
}

export interface GraphForkMoment extends Moment<GraphForkMomentData> {}

export function watchGraphForkEvent(
  event: 'fork',
  graph: Graph,
  callback: (moment: GraphForkMoment) => void
): () => void {
  const listener = (specId: string, path) => {
    callback({
      type: 'graph',
      event,
      data: {
        specId,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
