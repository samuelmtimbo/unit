import { U } from '../interface/U'
import { UnitMoment } from './UnitMoment'

export function watchUnitEvent(
  event:
    | 'state'
    | 'leaf_set'
    | 'append_child'
    | 'remove_child_at'
    | 'leaf_add_unit'
    | 'leaf_remove_unit'
    | 'leaf_expose_pin_set'
    | 'leaf_cover_pin_set'
    | 'leaf_append_child'
    | 'leaf_remove_child_at'
    | 'destroy'
    | 'reset'
    | 'set'
    | 'call'
    | 'listen'
    | 'unlisten',
  unit: U,
  callback: (moment: UnitMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    } as UnitMoment)
  }
  // unit.prependListener(event, listener)
  unit.addListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}
