import { Graph } from '../../Class/Graph'
import { GraphSpec } from '../../types/GraphSpec'
import { Moment } from '../Moment'

export interface GraphForkMomentData {
  specId: string
  path: string[]
  spec: GraphSpec
  bubble: boolean
}

export interface GraphForkMoment extends Moment<GraphForkMomentData> {}

export function watchGraphForkEvent(
  event: 'fork',
  graph: Graph,
  callback: (moment: GraphForkMoment) => void
): () => void {
  const listener = (
    specId: string,
    spec: GraphSpec,
    bubble: boolean,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        path,
        specId,
        spec,
        bubble,
      },
    })
  }

  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
