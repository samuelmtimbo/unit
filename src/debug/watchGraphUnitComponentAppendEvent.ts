import { Graph } from '../Class/Graph'
import { GraphUnitSpec } from '../types'
import { Moment } from './Moment'

export interface GraphSpecComponentAppendMomentData {
  unitId: string
  unitSpec: GraphUnitSpec
}

export interface GraphSpecComponentAppendMoment
  extends Moment<GraphSpecComponentAppendMomentData> {}

const event = 'component_append'

export function watchGraphUnitComponentAppendEvent(
  graph: Graph,
  callback: (moment: GraphSpecComponentAppendMoment) => void
): () => void {
  const listener = (unitId: string, unitSpec: GraphUnitSpec) => {
    callback({
      type: 'graph',
      event,
      data: {
        unitId,
        unitSpec,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
