import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetUnitPinIgnoredMomentData {
  unitId: string
  type: IO
  pinId: string
  ignored: boolean
  path: string[]
}

export interface GraphSetUnitPinConstantMoment
  extends Moment<GraphSetUnitPinIgnoredMomentData> {}

export function watchGraphSetUnitPinIgnored(
  event: 'set_unit_pin_ignored',
  graph: Graph,
  callback: (moment: GraphSetUnitPinConstantMoment) => void
): () => void {
  const listener = (
    ...[unitId, type, pinId, ignored, path]: G_EE['set_unit_pin_ignored']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        type,
        pinId,
        ignored,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
