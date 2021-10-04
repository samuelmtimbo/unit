import { U } from '../interface/U'
import { GraphMergeSpec } from '../types'
import { Moment } from './Moment'

export interface GraphMergeMomentData {
  mergeId: string
  mergeSpec: GraphMergeSpec
}

export interface GraphMergeMoment extends Moment<GraphMergeMomentData> {}

export function watchGraphMergeEvent(
  event: 'add_merge' | 'remove_merge',
  unit: U,
  callback: (moment: GraphMergeMoment) => void
): () => void {
  const listener = (mergeId: string, mergeSpec: GraphMergeSpec) => {
    callback({
      type: 'graph',
      event,
      data: {
        mergeId,
        mergeSpec,
      },
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
