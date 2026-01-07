import { $ } from '../../Class/$'
import { Graph } from '../../Class/Graph'
import { GraphSetUnitPinConstantData } from '../../Class/Graph/interface'
import { stringify } from '../../spec/stringify'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetUnitPinConstantMomentData
  extends GraphSetUnitPinConstantData {
  data: any
  path: string[]
}

export interface GraphSetUnitPinConstantMoment
  extends Moment<GraphSetUnitPinConstantMomentData> {}

export function extractSetUnitPinConstantEventData(
  ...[unitId, type, pinId, constant, data, path]: G_EE['set_unit_pin_constant']
): GraphSetUnitPinConstantMomentData {
  return {
    unitId,
    type,
    pinId,
    constant,
    data,
    path,
  }
}

export function stringifySetUnitPinConstantEventData(
  data: GraphSetUnitPinConstantMomentData
) {
  let data_: string

  if (data instanceof $) {
    data = null
  }

  if (data !== undefined) {
    data_ = stringify(data)
  }

  return {
    ...data,
    data: data_,
  }
}

export function watchGraphSetUnitPinConstant(
  event: 'set_unit_pin_constant',
  graph: Graph,
  callback: (moment: GraphSetUnitPinConstantMoment) => void
): () => void {
  const listener = (...args: G_EE['set_unit_pin_constant']) => {
    const data = stringifySetUnitPinConstantEventData(
      extractSetUnitPinConstantEventData(...args)
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
