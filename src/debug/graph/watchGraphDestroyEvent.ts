import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphDestroyMomentData {
  path: string[]
}

export interface GraphDestroyMoment extends Moment<GraphDestroyMomentData> {}

export function extractDestroyEventData([
  path,
]: G_EE['destroy']): GraphDestroyMomentData {
  return {
    path,
  }
}

export function stringifyBulkEditEventData({ path }: GraphDestroyMomentData) {
  return {
    path,
  }
}

export function watchGraphDestroyEvent(
  event: 'destroy',
  graph: Graph,
  callback: (moment: GraphDestroyMoment) => void
): () => void {
  const listener = (path: string[] = []) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
      },
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
