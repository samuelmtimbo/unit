import { Graph } from '../../Class/Graph'
import { _stringifyGraphSpecData } from '../../spec/stringifySpec'
import { BundleSpec } from '../../types/BundleSpec'
import { G_EE } from '../../types/interface/G'
import { Moment } from '../Moment'

export interface GraphInjectGraphMomentData {
  bundle: BundleSpec
}

export interface GraphInjectGraphMoment
  extends Moment<GraphInjectGraphMomentData> {}

export function watchGraphInjectGraphEvent(
  event: 'inject_graph',
  bundle: Graph,
  callback: (moment: GraphInjectGraphMoment) => void
): () => void {
  const listener = (...[bundle]: G_EE['inject_graph']) => {
    const { spec } = bundle

    _stringifyGraphSpecData(spec)

    callback({
      type: 'graph',
      event,
      data: {
        bundle,
      },
    })
  }

  bundle.prependListener(event, listener)

  return () => {
    bundle.removeListener(event, listener)
  }
}
