import { Graph } from '../Class/Graph'
import { UnitMoment } from './UnitMoment'

export function watchGraphLeafSetEvent(
  event: 'leaf_set',
  unit: Graph,
  callback: (moment: UnitMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    } as UnitMoment)
  }
  unit.addListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
