import { Graph } from '../../Class/Graph'
import { GraphSpec } from '../../types/GraphSpec'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphForkMomentData {
  specId: string
  path: string[]
  spec: GraphSpec
  bubble: boolean
}

export interface GraphForkMoment extends Moment<GraphForkMomentData> {}

export function extractForkEventData(
  ...[specId, spec, bubble, path]: G_EE['fork']
): GraphForkMomentData {
  return {
    path,
    specId,
    spec,
    bubble,
  }
}

export function stringifyForkEventData(
  data: GraphForkMomentData
): GraphForkMomentData {
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
