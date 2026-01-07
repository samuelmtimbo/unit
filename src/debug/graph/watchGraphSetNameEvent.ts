import { Graph } from '../../Class/Graph'
import { GraphSetNameData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetNameMomentData extends GraphSetNameData {
  path: string[]
}

export interface GraphSetNameMoment extends Moment<GraphSetNameMomentData> {}

export function extractSetNameEventData(
  ...[name, path]: G_EE['set_name']
): GraphSetNameMomentData {
  return {
    name,
    path,
  }
}

export function stringifySetNameEventData(data: GraphSetNameMomentData) {
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
