import { Graph } from '../../Class/Graph'
import { GraphSetUnitPinIgnoredData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitPinIgnoredMomentData
  extends GraphSetUnitPinIgnoredData {
  path: string[]
}

export interface GraphSetUnitPinIgnoredMoment
  extends Moment<GraphSetUnitPinIgnoredMomentData> {}

export function extractSetUnitPinIgnoredEventData(
  ...[unitId, type, pinId, ignored, path]: G_EE['set_unit_pin_ignored']
): GraphSetUnitPinIgnoredMomentData {
  return {
    unitId,
    type,
    pinId,
    ignored,
    path,
  }
}

export function stringifySetUnitPinIgnoredEventData(
  data: GraphSetUnitPinIgnoredMomentData
) {
  return data
}

export function watchGraphSetUnitPinIgnored(
  event: 'set_unit_pin_ignored',
  graph: Graph,
  callback: (moment: GraphSetUnitPinIgnoredMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_pin_ignored']) => {
    const data = stringifySetUnitPinIgnoredEventData(
      extractSetUnitPinIgnoredEventData(...args)
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
