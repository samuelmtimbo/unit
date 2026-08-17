import { Graph } from '../../Class/Graph'
import { GraphSpec } from '../../types/GraphSpec'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphForkMomentData {
  specId: string
  spec: GraphSpec
  bubble: boolean
}

export interface GraphForkMoment extends GraphMoment<GraphForkMomentData> {}

export function extractForkEventData(
  ...[specId, spec, bubble, path]: G_EE['fork']
): GraphForkMoment['data'] {
  return {
    path,
    specId,
    spec,
    bubble,
  }
}

export function stringifyForkEventData(data: GraphForkMoment['data']) {
  return data
}

export function watchGraphForkEvent(
  event: 'fork',
  graph: Graph,
  callback: (moment: GraphForkMoment) => void
): () => void {
  const listener = (...args: G_EE['fork']) => {
    const data = stringifyForkEventData(extractForkEventData(...args))

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
