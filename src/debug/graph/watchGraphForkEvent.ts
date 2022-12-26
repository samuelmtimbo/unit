import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphForkMomentData {
  specId: string
}

export interface GraphForkMoment extends Moment<GraphForkMomentData> {}

export function watchGraphForkEvent(
  event: 'fork',
  graph: Graph,
  callback: (moment: GraphForkMoment) => void
): () => void {
  const listener = (specId: string) => {
    callback({
      type: 'graph',
      event,
      data: {
        specId,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
