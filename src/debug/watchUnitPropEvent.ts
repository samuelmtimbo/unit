import { EventEmitter, EventEmitter_EE } from '../EventEmitter'
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
  unit: EventEmitter<
    EventEmitter_EE<{
      leaf_set: [{ path: string[]; name: string; data: any }]
    }> & { leaf_set: [{ path: string[]; name: string; data: any }] }
  >,
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
