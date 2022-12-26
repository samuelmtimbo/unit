import { Unit } from '../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../constant/GRAPH_DEFAULT_EVENTS'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { Moment } from './Moment'
import { watchUnitSpecEvent } from './watchUnitSpecEvent'

export function watchUnitIOSpec(
  unit: Unit,
  callback: (moment: Moment) => void,
  events: string[] = GRAPH_DEFAULT_EVENTS
): Unlisten {
  const all: Unlisten[] = []

  if (events.includes('set_input')) {
    all.push(watchUnitSpecEvent('set_input', unit, callback))
  }

  if (events.includes('set_output')) {
    all.push(watchUnitSpecEvent('set_output', unit, callback))
  }

  if (events.includes('remove_input')) {
    all.push(watchUnitSpecEvent('remove_input', unit, callback))
  }

  if (events.includes('remove_output')) {
    all.push(watchUnitSpecEvent('remove_output', unit, callback))
  }

  const unlisten = callAll(all)

  return unlisten
}
