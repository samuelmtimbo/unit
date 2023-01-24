import { Graph } from '../Class/Graph'
import { Unit } from '../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../constant/GRAPH_DEFAULT_EVENTS'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { watchGraphMergeEvent } from './graph/watchGraphMergeEvent'
import { watchGraphPlugEvent } from './graph/watchGraphPlugEvent'
import { Moment } from './Moment'

export function watchGraphUnit<T extends Unit>(
  unit: T,
  events: string[] = GRAPH_DEFAULT_EVENTS,
  callback: (moment: Moment) => void
): Unlisten {
  let all: Unlisten[] = []

  const watch_add_merge = events.includes('add_merge')
  const watch_remove_merge = events.includes('remove_merge')
  const watch_plug_pin = events.includes('plug_pin')
  const watch_unplug_pin = events.includes('unplug_pin')

  if (unit instanceof Graph) {
    if (watch_add_merge) {
      all.push(watchGraphMergeEvent('add_merge', unit, callback))
    }

    if (watch_remove_merge) {
      all.push(watchGraphMergeEvent('remove_merge', unit, callback))
    }

    if (watch_plug_pin) {
      all.push(watchGraphPlugEvent('plug_pin', unit, callback))
    }

    if (watch_unplug_pin) {
      all.push(watchGraphPlugEvent('unplug_pin', unit, callback))
    }
  }

  let unlisten = callAll(all)

  return unlisten
}
