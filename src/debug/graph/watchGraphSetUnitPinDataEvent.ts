import { Graph } from '../../Class/Graph'
import { stringify } from '../../spec/stringify'
import { G_EE } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { Moment } from '../Moment'

export interface GraphSetUnitPinDataMomentData {
  unitId: string
  type: IO
  pinId: string
  data: string
  path: string[]
}

export interface GraphSetUnitPinDataMoment
  extends Moment<GraphSetUnitPinDataMomentData> {}

export function watchGraphSetUnitPinData(
  event: 'set_unit_pin_data',
  graph: Graph,
  callback: (moment: GraphSetUnitPinDataMoment) => void
): () => void {
  const listener = (
    ...[unitId, type, pinId, data, path]: G_EE['set_unit_pin_data']
  ) => {
    const _data = stringify(data)

    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        type,
        pinId,
        data: _data,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
