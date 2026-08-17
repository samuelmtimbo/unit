import { Graph } from '../../Class/Graph'
import { GraphSetNameData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { GraphMoment } from '../GraphMoment'

export interface GraphSetNameMomentData extends GraphSetNameData {}

export interface GraphSetNameMoment
  extends GraphMoment<GraphSetNameMomentData> {}

export function extractSetNameEventData(
  ...[name, path]: G_EE['set_name']
): GraphSetNameMoment['data'] {
  return {
    name,
    path,
  }
}

export function stringifySetNameEventData(data: GraphSetNameMoment['data']) {
  return data
}

export function watchGraphSetNameEvent(
  event: 'set_name',
  graph: Graph,
  callback: (moment: GraphSetNameMoment) => void
): () => void {
  const listener = (...args: G_EE['set_name']) => {
    const data = stringifySetNameEventData(extractSetNameEventData(...args))

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
