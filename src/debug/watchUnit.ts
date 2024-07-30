import { Graph } from '../Class/Graph'
import { Stateful } from '../Class/Stateful'
import { Unit } from '../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../constant/GRAPH_DEFAULT_EVENTS'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { watchGraphInternal } from './graph/watchGraphInternal'
import { Moment } from './Moment'
import {
  watchElementCallEvent,
  watchStatefulSetEvent,
  watchUnitEvent,
} from './watchUnitEvent'
import { watchUnitIO } from './watchUnitIO'

export function watchUnit<T extends Unit>(
  unit: T,
  callback: (moment: Moment) => void,
  events: string[] = GRAPH_DEFAULT_EVENTS
): Unlisten {
  const all: Unlisten[] = []

  all.push(watchUnitIO(unit, events, callback))

  if (unit instanceof Stateful) {
    if (events.includes('set')) {
      all.push(watchStatefulSetEvent('set', unit, callback))
    }
  }

  if (unit.isElement()) {
    if (events.includes('call')) {
      // @ts-ignore
      all.push(watchElementCallEvent('call', unit, callback))
    }
  }

  if (events.includes('play')) {
    all.push(watchUnitEvent('play', unit, callback))
  }

  if (events.includes('pause')) {
    all.push(watchUnitEvent('pause', unit, callback))
  }

  if (events.includes('listen')) {
    all.push(watchUnitEvent('listen', unit, callback))
  }

  if (events.includes('unlisten')) {
    all.push(watchUnitEvent('unlisten', unit, callback))
  }

  if (events.includes('register')) {
    all.push(watchUnitEvent('register', unit, callback))
  }

  if (events.includes('unregister')) {
    all.push(watchUnitEvent('unregister', unit, callback))
  }

  if (events.includes('destroy')) {
    all.push(watchUnitEvent('destroy', unit, callback))
  }

  if (unit instanceof Graph) {
    all.push(watchGraphInternal(unit, events, callback))
  }

  let unlisten = callAll(all)

  return unlisten
}
