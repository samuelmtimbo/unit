import { Graph } from '../../Class/Graph'
import { Moment } from '../Moment'

export interface GraphSetNameMomentData {
  name: string
  path: string[]
}

export interface GraphSetNameMoment extends Moment<GraphSetNameMomentData> {}

export function watchGraphSetNameEvent(
  event: 'set_name',
  graph: Graph,
  callback: (moment: GraphSetNameMoment) => void
): () => void {
  const listener = (name: string, path: string[]) => {
    callback({
      type: 'graph',
      event,
      data: {
        name,
        path,
      },
    })
  }

  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
