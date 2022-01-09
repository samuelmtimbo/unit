import { Unit } from '../Class/Unit'
import { Unlisten } from '../types/Unlisten'
import callAll from '../util/call/callAll'
import { Moment } from './Moment'

export interface UnitSpecMomentData {
  pinId: string
}

export interface UnitSpecMoment<T = any>
  extends Moment<UnitSpecMomentData & T> {}

export const watchUnitSpecEvent = (
  event: 'set_input' | 'set_output' | 'remove_input' | 'remove_output',
  unit: Unit,
  callback: (moment: UnitSpecMoment) => void
): (() => void) => {
  const all: Unlisten[] = []
  const listener = (pinId, pin) => {
    callback({
      type: 'unit',
      event,
      data: { pinId },
    })
  }
  unit.addListener(event, listener)
  return () => {
    callAll(all)()
    unit.removeListener(event, listener)
  }
}
