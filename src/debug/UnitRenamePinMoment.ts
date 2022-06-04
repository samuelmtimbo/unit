import { Moment } from './Moment'

export interface UnitRenamePinMomentData {
  name: string
  newName: string
}

export interface UnitRenamePinMoment<T = any> extends Moment<UnitRenamePinMomentData & T> {
  type: 'unit'
  event: 'rename_input' | 'rename_output'
}
