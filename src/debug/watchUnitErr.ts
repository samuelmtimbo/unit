import callAll from '../callAll'
import { DEFAULT_EVENTS } from '../constant/DEFAULT_EVENTS'
import { U } from '../interface/U'
import { UnitErrMoment } from './UnitErrMoment'
import { watchUnitErrEvent } from './watchUnitErrEvent'

export function watchUnitErr(
  unit: U,
  callback: (moment: UnitErrMoment) => void,
  events: string[] = DEFAULT_EVENTS
): () => void {
  const all = []

  if (events.includes('err')) {
    all.push(watchUnitErrEvent('err', unit, callback))
  }

  if (events.includes('take_err')) {
    all.push(watchUnitErrEvent('take_err', unit, callback))
  }

  if (events.includes('catch_err')) {
    all.push(watchUnitErrEvent('catch_err', unit, callback))
  }

  return callAll(all)
}
