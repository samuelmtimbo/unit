import callAll from '../callAll'
import { U } from '../interface/U'
import { Unlisten } from '../Unlisten'
import { Moment } from './Moment'

export interface UnitSpecMomentData {
  pinId: string
}

export interface UnitSpecMoment<T = any>
  extends Moment<UnitSpecMomentData & T> {}

export const watchUnitSpecEvent = (
  event: 'set_input' | 'set_output' | 'remove_input' | 'remove_output',
  unit: U,
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
