import { Graph } from '../../Class/Graph'
import { Action } from '../../types/Action'
import { stringifyBulkEditActions } from '../../types/interface/async/AsyncG'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphBulkEditMomentData {
  actions: Action[]
  path: string[]
}

export interface GraphBulkEditMoment extends Moment<GraphBulkEditMomentData> {}

export function extractBulkEditEventData(
  ...[actions, path]: G_EE['bulk_edit']
): GraphBulkEditMomentData {
  return {
    actions,
    path,
  }
}

export function stringifyBulkEditEventData({
  path,
  actions,
}: GraphBulkEditMomentData) {
  actions = stringifyBulkEditActions(actions)

  return {
    actions,
    path,
  }
}

export function watchGraphBulkEditEvent(
  event: 'bulk_edit',
  graph: Graph,
  callback: (moment) => void
): () => void {
  const listener = (...args: G_EE['bulk_edit']) => {
    const data = stringifyBulkEditEventData(extractBulkEditEventData(...args))

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
