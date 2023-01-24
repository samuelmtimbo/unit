import { Graph } from '../../Class/Graph'
import { Moment } from './../Moment'

export interface GraphSpecUnitMoveMomentData {
  id: string
  unitId: string
  inputId: string
  path: string[]
}

export interface GraphSpecUnitMoveMoment
  extends Moment<GraphSpecUnitMoveMomentData> {}

export function watchGraphUnitMoveEvent(
  event: 'move_unit',
  graph: Graph,
  callback: (moment: GraphSpecUnitMoveMoment) => void
): () => void {
  const listener = (
    id: string,
    unitId: string,
    inputId: string,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        id,
        unitId,
        inputId,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
