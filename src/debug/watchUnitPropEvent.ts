import { U } from '../interface/U'
import { Moment } from './Moment'

export interface UnitPropMomentData {
  name: string
  path: string[]
  data: any
}

export interface UnitPropMoment<T = any>
  extends Moment<UnitPropMomentData & T> {}

export function watchUnitSetEvent(
  event: 'leaf_set',
  unit: U,
  callback: (moment: UnitPropMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    })
  }
  unit.prependListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
