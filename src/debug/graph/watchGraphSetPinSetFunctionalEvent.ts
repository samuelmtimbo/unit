import { Graph } from '../../Class/Graph'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetPinSetFunctionalMomentData {
  type: IO
  pinId: string
  functional: boolean
  path: string[]
}

export interface GraphSetPinSetFunctionalMoment
  extends Moment<GraphSetPinSetFunctionalMomentData> {}

export function watchGraphSetUnitPinFunctional(
  event: 'set_pin_set_functional',
  graph: Graph,
  callback: (moment: GraphSetPinSetFunctionalMoment) => void
): () => void {
  const listener = (
    ...[type, pinId, functional, path]: G_EE['set_pin_set_functional']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        type,
        pinId,
        functional,
        path,
      },
    })
  }

  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
