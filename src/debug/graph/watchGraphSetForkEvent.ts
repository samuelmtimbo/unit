import { Graph } from '../../Class/Graph'
import { GraphSetForkData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetForkMomentData extends GraphSetForkData {
  path: string[]
}

export interface GraphSetForkMoment extends Moment<GraphSetForkMomentData> {}

export function extractSetForkEventData(
  ...[fork, path]: G_EE['set_fork']
): GraphSetForkMomentData {
  return {
    fork,
    path,
  }
}

export function stringifySetForkEventData(data: GraphSetForkMomentData) {
  return data
}

export function watchGraphSetForkEvent(
  event: 'set_fork',
  graph: Graph,
  callback: (moment: GraphSetForkMoment) => void
): () => void {
  const listener = (...args: G_EE['set_fork']) => {
    const data = stringifySetForkEventData(extractSetForkEventData(...args))

    callback({
      type: 'graph',
      event,
      data,
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
