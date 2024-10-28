import { Graph } from '../../Class/Graph'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { callAll } from '../../util/call/callAll'
import { Moment } from './../Moment'
import { watchGraphBulkEditEvent } from './watchGraphBulkEditEvent'
import { watchGraphDestroyEvent } from './watchGraphDestroyEvent'
import { watchGraphExposePinEvent } from './watchGraphExposedPinEvent'
import { watchGraphExposedPinSetEvent } from './watchGraphExposedPinSetEvent'
import { watchGraphForkEvent } from './watchGraphForkEvent'
import { watchGraphMergeEvent } from './watchGraphMergeEvent'
import { watchGraphMetadataEvent } from './watchGraphMetadataEvent'
import { watchGraphMoveSubComponentRoot } from './watchGraphMoveSubComponentRoot'
import { watchGraphMoveSubgraphEvent } from './watchGraphMoveSubgraphIntoEvent'
import { watchGraphPinMergeEvent } from './watchGraphPinMergeEvent'
import { watchGraphPlugEvent } from './watchGraphPlugEvent'
import { watchGraphRemoveUnitPinData } from './watchGraphRemoveUnitPinDataEvent'
import { watchGraphReorderSubComponent } from './watchGraphReorderSubComponent'
import { watchGraphSetPinSetDefaultIgnored } from './watchGraphSetPinSetDefaultIgnored'
import { watchGraphSetUnitPinFunctional } from './watchGraphSetPinSetFunctionalEvent'
import { watchGraphSetPinSetId } from './watchGraphSetPinSetIdEvent'
import { watchGraphSetUnitIdEvent } from './watchGraphSetUnitIdEvent'
import { watchGraphSetUnitPinConstant } from './watchGraphSetUnitPinConstantEvent'
import { watchGraphSetUnitPinData } from './watchGraphSetUnitPinDataEvent'
import { watchGraphSetUnitPinIgnored } from './watchGraphSetUnitPinIgnoredEvent'
import { watchGraphSetUnitPinSetId } from './watchGraphSetUnitPinSetIdEvent'
import {
  watchGraphCloneUnitEvent,
  watchGraphUnitEvent,
} from './watchGraphUnitEvent'
import { watchGraphUnitMoveEvent as watchGraphMoveUnitEvent } from './watchGraphUnitMoveEvent'

export const GRAPH_EVENT_TO_WATCHER: Dict<
  (event: string, graph: Graph, callback: Callback) => Unlisten
> = {
  fork: watchGraphForkEvent,
  add_unit: watchGraphUnitEvent,
  remove_unit: watchGraphUnitEvent,
  clone_unit: watchGraphCloneUnitEvent,
  move_unit: watchGraphMoveUnitEvent,
  add_merge: watchGraphMergeEvent,
  remove_merge: watchGraphMergeEvent,
  add_pin_to_merge: watchGraphPinMergeEvent,
  remove_pin_from_merge: watchGraphPinMergeEvent,
  expose_pin: watchGraphExposePinEvent,
  cover_pin: watchGraphExposePinEvent,
  expose_pin_set: watchGraphExposedPinSetEvent,
  cover_pin_set: watchGraphExposedPinSetEvent,
  plug_pin: watchGraphPlugEvent,
  unplug_pin: watchGraphPlugEvent,
  move_subgraph_into: watchGraphMoveSubgraphEvent,
  move_subgraph_out_of: watchGraphMoveSubgraphEvent,
  reorder_sub_component: watchGraphReorderSubComponent,
  move_sub_component_root: watchGraphMoveSubComponentRoot,
  set_unit_pin_constant: watchGraphSetUnitPinConstant,
  set_unit_pin_set_id: watchGraphSetUnitPinSetId,
  set_unit_pin_ignored: watchGraphSetUnitPinIgnored,
  set_pin_set_functional: watchGraphSetUnitPinFunctional,
  set_pin_set_id: watchGraphSetPinSetId,
  set_pin_set_default_ignored: watchGraphSetPinSetDefaultIgnored,
  set_unit_pin_data: watchGraphSetUnitPinData,
  remove_unit_pin_data: watchGraphRemoveUnitPinData,
  set_unit_id: watchGraphSetUnitIdEvent,
  bulk_edit: watchGraphBulkEditEvent,
  destroy: watchGraphDestroyEvent,
  metadata: watchGraphMetadataEvent,
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
