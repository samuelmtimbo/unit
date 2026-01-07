import { Graph } from '../../Class/Graph'
import { GraphUnplugPinData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphUnplugPinMomentData extends GraphUnplugPinData {
  path: string[]
}

export interface GraphUnplugPinMoment
  extends Moment<GraphUnplugPinMomentData> {}

export function extractUnplugPinEventData(
  ...[type, pinId, subPinId, subPinSpec, path]: G_EE['unplug_pin']
): GraphUnplugPinMomentData {
  return {
    type,
    pinId,
    subPinId,
    subPinSpec,
    path,
  }
}

export function stringifyUnplugPinEventData(data: GraphUnplugPinMomentData) {
  return data
}

export function watchGraphUnplugPinEvent(
  event: 'unplug_pin',
  graph: Graph,
  callback: (moment: GraphUnplugPinMoment) => void
): () => void {
  const listener = (...args: G_EE['unplug_pin']) => {
    const data = stringifyUnplugPinEventData(extractUnplugPinEventData(...args))

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
