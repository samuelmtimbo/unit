import { Graph } from '../../Class/Graph'
import { GraphSetPinSetDefaultIgnoredData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphSetPinSetDefaultIgnoredMomentData
  extends GraphSetPinSetDefaultIgnoredData {
  path: string[]
}

export interface GraphSetPinSetDefaultIgnoredMoment
  extends Moment<GraphSetPinSetDefaultIgnoredMomentData> {}

export function extractSetPinSetDefaultIgnoredEventData(
  ...[type, pinId, defaultIgnored, path]: G_EE['set_pin_set_default_ignored']
): GraphSetPinSetDefaultIgnoredMomentData {
  return {
    type,
    pinId,
    defaultIgnored,
    path,
  }
}

export function stringifySetPinSetDefaultIgnoredEventData(
  data: GraphSetPinSetDefaultIgnoredMomentData
) {
  return data
}

export function watchGraphSetPinSetDefaultIgnored(
  event: 'set_pin_set_default_ignored',
  graph: Graph,
  callback: (moment: GraphSetPinSetDefaultIgnoredMoment) => void
): () => void {
  const listener = (...args: G_EE['set_pin_set_default_ignored']) => {
    const data = stringifySetPinSetDefaultIgnoredEventData(
      extractSetPinSetDefaultIgnoredEventData(...args)
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
