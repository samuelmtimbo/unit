import { Moment } from './Moment'

export interface UnitMoment extends Moment {
  type: 'unit'
  event:
    | 'reset'
    | 'state'
    | 'leaf_set'
    | 'call'
    | 'append_child'
    | 'remove_child_at'
    | 'leaf_add_unit'
    | 'leaf_remove_unit'
    | 'leaf_append_child'
    | 'leaf_remove_child_at'
    | 'listen'
    | 'unlisten'
    | 'err'
    | 'take_err'
    | 'catch_err'
    | 'add_unit'
    | 'remove_unit'
    | 'add_merge'
    | 'remove_merge'
    | 'add_pin_to_merge'
    | 'remove_pin_from_merge'
    | 'metadata'
  data: any
}
