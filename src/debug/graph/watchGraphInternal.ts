import { Graph } from '../../Class/Graph'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { callAll } from '../../util/call/callAll'
import { Moment } from './../Moment'
import { watchGraphExposedPinEvent } from './watchGraphExposedPinEvent'
import { watchGraphExposedPinSetEvent } from './watchGraphExposedPinSetEvent'
import { watchGraphForkEvent } from './watchGraphForkEvent'
import { watchGraphMergeEvent } from './watchGraphMergeEvent'
import { watchGraphMoveSubgraphIntoEvent } from './watchGraphMoveSubgraphIntoEvent'
import { watchGraphPinMergeEvent } from './watchGraphPinMergeEvent'
import { watchGraphPlugEvent } from './watchGraphPlugEvent'
import { watchGraphUnitComponentAppendEvent } from './watchGraphUnitComponentAppendEvent'
import { watchGraphUnitComponentRemoveEvent } from './watchGraphUnitComponentRemoveEvent'
import { watchGraphUnitEvent } from './watchGraphUnitEvent'
import { watchGraphUnitMoveEvent } from './watchGraphUnitMoveEvent'
import { watchGraphInjectGraphEvent } from './watchInjectGraph'

export const GRAPH_EVENT_TO_WATCHER: Dict<
  (event: string, graph: Graph, callback: Callback) => Unlisten
> = {
  fork: watchGraphForkEvent,
  add_unit: watchGraphUnitEvent,
  remove_unit: watchGraphUnitEvent,
  move_unit: watchGraphUnitMoveEvent,
  component_append: watchGraphUnitComponentAppendEvent,
  component_remove: watchGraphUnitComponentRemoveEvent,
  add_merge: watchGraphMergeEvent,
  remove_merge: watchGraphMergeEvent,
  add_pin_to_merge: watchGraphPinMergeEvent,
  remove_pin_from_merge: watchGraphPinMergeEvent,
  expose_pin: watchGraphExposedPinEvent,
  cover_pin: watchGraphExposedPinEvent,
  expose_pin_set: watchGraphExposedPinSetEvent,
  cover_pin_set: watchGraphExposedPinSetEvent,
  plug_pin: watchGraphPlugEvent,
  unplug_pin: watchGraphPlugEvent,
  move_subgraph_into: watchGraphMoveSubgraphIntoEvent,
  inject_graph: watchGraphInjectGraphEvent,
}

export function watchGraphInternal(
  graph: Graph,
  events: string[],
  callback: Callback<Moment>
): Unlisten {
  const all: Unlisten[] = []

  for (const event in GRAPH_EVENT_TO_WATCHER) {
    if (events.includes(event)) {
      const watchEvent = GRAPH_EVENT_TO_WATCHER[event]

      all.push(watchEvent(event, graph, callback))
    }
  }

  const unlisten = callAll(all)

  return unlisten
}
