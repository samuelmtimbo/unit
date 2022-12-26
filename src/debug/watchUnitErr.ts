import { Unit } from '../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../constant/GRAPH_DEFAULT_EVENTS'
import { callAll } from '../util/call/callAll'
import { UnitErrMoment } from './UnitErrMoment'
import { watchUnitErrEvent } from './watchUnitErrEvent'

export function watchUnitErr(
  unit: Unit,
  callback: (moment: UnitErrMoment) => void,
  events: string[] = GRAPH_DEFAULT_EVENTS
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
