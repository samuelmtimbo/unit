import callAll from '../callAll'
import { DEFAULT_EVENTS } from '../constant/DEFAULT_EVENTS'
import { U } from '../interface/U'
import { Unlisten } from '../Unlisten'
import { Moment } from './Moment'
import { watchUnitSpecEvent } from './watchUnitSpecEvent'

export function watchUnitIOSpec(
  unit: U,
  callback: (moment: Moment) => void,
  events: string[] = DEFAULT_EVENTS
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
