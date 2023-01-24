import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetUnitPinConstantMomentData {
  unitId: string
  type: IO
  pinId: string
  constant: boolean
  path: string[]
}

export interface GraphSetUnitPinConstantMoment
  extends Moment<GraphSetUnitPinConstantMomentData> {}

export function watchGraphSetUnitPinConstant(
  event: 'set_unit_pin_constant',
  graph: Graph,
  callback: (moment: GraphSetUnitPinConstantMoment) => void
): () => void {
  const listener = (
    ...[unitId, type, pinId, constant, path]: G_EE['set_unit_pin_constant']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        type,
        pinId,
        constant,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
