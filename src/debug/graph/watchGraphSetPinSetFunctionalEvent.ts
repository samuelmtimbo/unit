import { Graph } from '../../Class/Graph'
import { GraphSetPinSetFunctionalData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetPinSetFunctionalMomentData
  extends GraphSetPinSetFunctionalData {
  path: string[]
}

export interface GraphSetPinSetFunctionalMoment
  extends Moment<GraphSetPinSetFunctionalMomentData> {}

export function extractSetPinSetFunctionalEventData(
  ...[type, pinId, functional, path]: G_EE['set_pin_set_functional']
): GraphSetPinSetFunctionalMomentData {
  return {
    type,
    pinId,
    functional,
    path,
  }
}

export function stringifySetPinSetFunctionalEventData(
  data: GraphSetPinSetFunctionalMomentData
) {
  return data
}

export function watchGraphSetUnitPinFunctional(
  event: 'set_pin_set_functional',
  graph: Graph,
  callback: (moment: GraphSetPinSetFunctionalMoment) => void
): () => void {
  const listener = (...args: G_EE['set_pin_set_functional']) => {
    const data = stringifySetPinSetFunctionalEventData(
      extractSetPinSetFunctionalEventData(...args)
    )

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
