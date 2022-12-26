import { Graph } from '../Class/Graph'
import { Moment } from './Moment'

export interface LeafForkMomentData {
  specId: string
  path: string[]
}

export interface LeafForkMoment extends Moment<LeafForkMomentData> {
  type: 'unit'
  event: 'leaf_fork'
}

export function watchUnitLeafForkEvent(
  event: 'leaf_fork',
  unit: Graph,
  callback: (moment) => void
): () => void {
  const listener = (specId, path) => {
    callback({
      type: 'unit',
      event,
      data: {
        specId,
        path,
      },
    })
  }

  unit.prependListener(event, listener)

  return () => {
    unit.removeListener(event, listener)
  }
}
