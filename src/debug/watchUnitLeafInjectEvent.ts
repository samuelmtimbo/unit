import { Graph } from '../Class/Graph'
import { BundleSpec } from '../types/BundleSpec'
import { Moment } from './Moment'

export interface LeafInjectGraphMomentData {
  path: string[]
  bundle: BundleSpec
}

export interface LeafInjectGraphMoment
  extends Moment<LeafInjectGraphMomentData> {
  type: 'unit'
  event: 'leaf_inject_graph'
}

export function watchUnitLeafInjectEvent(
  event: 'leaf_inject_graph',
  unit: Graph,
  callback: (moment) => void
): () => void {
  const listener = (bundle: BundleSpec, path: string[]) => {
    callback({
      type: 'unit',
      event,
      data: {
        path,
        bundle,
      },
    })
  }

  unit.prependListener(event, listener)

  return () => {
    unit.removeListener(event, listener)
  }
}
