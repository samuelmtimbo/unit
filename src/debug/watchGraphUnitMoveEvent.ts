import { Graph } from '../Class/Graph'
import { Moment } from './Moment'

export interface GraphSpecUnitMoveMomentData {
  id: string
  unitId: string
  inputId: string
}

export interface GraphSpecUnitMoveMoment
  extends Moment<GraphSpecUnitMoveMomentData> {}

export function watchGraphUnitMoveEvent(
  event: 'move_unit',
  graph: Graph,
  callback: (moment: GraphSpecUnitMoveMoment) => void
): () => void {
  const listener = (id: string, unitId: string, inputId: string) => {
    callback({
      type: 'graph',
      event,
      data: {
        id,
        unitId,
        inputId,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
