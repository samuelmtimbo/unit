import { Graph } from '../Class/Graph'
import { Moment } from './Moment'

export interface GraphSpecComponentRemoveMomentData {
  unitId: string
}

export interface GraphSpecComponentRemoveMoment
  extends Moment<GraphSpecComponentRemoveMomentData> {}

const event = 'component_remove'

export function watchGraphUnitComponentRemoveEvent(
  graph: Graph,
  callback: (moment: GraphSpecComponentRemoveMoment) => void
): () => void {
  const listener = (unitId: string) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
