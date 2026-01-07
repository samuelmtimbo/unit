import { Graph } from '../Class/Graph'
import { Unit } from '../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../constant/GRAPH_DEFAULT_EVENTS'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { GRAPH_EVENT_TO_WATCH } from './graph/watchGraphInternal'
import { Moment } from './Moment'

export function watchGraphUnit<T extends Unit>(
  unit: T,
  events: string[] = GRAPH_DEFAULT_EVENTS,
  callback: (moment: Moment) => void
): Unlisten {
  let all: Unlisten[] = []

  if (unit instanceof Graph) {
    for (const event of events) {
      const watcher = GRAPH_EVENT_TO_WATCH[event]

      if (watcher) {
        all.push(watcher(event, unit, callback))
      }
    }
  }

  let unlisten = callAll(all)

  return unlisten
}
