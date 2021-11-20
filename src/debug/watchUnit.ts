import callAll from '../callAll'
import { DEFAULT_EVENTS } from '../constant/DEFAULT_EVENTS'
import { U } from '../interface/U'
import { Unlisten } from '../Unlisten'
import { Moment } from './Moment'
import { watchGraphInternal } from './watchGraphInternal'
import { watchUnitEvent } from './watchUnitEvent'
import { watchUnitIO } from './watchUnitIO'

export function watchUnit<T extends U>(
  unit: T,
  callback: (moment: Moment) => void,
  events: string[] = DEFAULT_EVENTS
): Unlisten {
  const all: Unlisten[] = []

  all.push(watchUnitIO(unit, events, callback))

  if (events.includes('set')) {
    all.push(watchUnitEvent('set', unit, callback))
  }

  if (events.includes('call')) {
    all.push(watchUnitEvent('call', unit, callback))
  }

  if (events.includes('listen')) {
    all.push(watchUnitEvent('listen', unit, callback))
  }

  if (events.includes('unlisten')) {
    all.push(watchUnitEvent('unlisten', unit, callback))
  }

  all.push(watchGraphInternal(unit, events, callback))

  let unlisten = callAll(all)

  return unlisten
}
