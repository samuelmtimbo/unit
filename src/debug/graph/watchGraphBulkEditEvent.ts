import { Graph } from '../../Class/Graph'
import { Action } from '../../types'
import { Moment } from '../Moment'

export interface GraphBulkEditMomentData {
  actions: Action[]
  transaction: boolean
  path: string[]
}

export interface GraphBulkEditMoment extends Moment<GraphBulkEditMomentData> {}

export function watchGraphBulkEditEvent(
  event: 'bulk_edit',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (
    actions: Action[],
    transaction: boolean,
    path: string[]
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        actions,
        transaction,
        path,
      },
    })
  }

  graph.prependListener(event, listener)

  return () => {
    graph.removeListener(event, listener)
  }
}
