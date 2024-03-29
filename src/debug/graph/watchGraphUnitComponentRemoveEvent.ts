import { Graph } from '../../Class/Graph'
import { Moment } from './../Moment'

export interface GraphSpecComponentRemoveMomentData {
  unitId: string
  path: string[]
}

export interface GraphSpecComponentRemoveMoment
  extends Moment<GraphSpecComponentRemoveMomentData> {}

export function watchGraphUnitComponentRemoveEvent(
  event: 'component_remove',
  graph: Graph,
  callback: (moment: GraphSpecComponentRemoveMoment) => void
): () => void {
  const listener = (unitId: string, path: string[]) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
