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

export function watchGraphSetPinSetDefaultIgnored(
  event: 'set_pin_set_default_ignored',
  graph: Graph,
  callback: (moment: GraphSetPinSetDefaultIgnoredMoment) => void
): () => void {
  const listener = (
    ...[type, pinId, ignored, path]: G_EE['set_pin_set_default_ignored']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
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
