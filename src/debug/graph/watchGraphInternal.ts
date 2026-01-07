import { Graph } from '../../Class/Graph'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { callAll } from '../../util/call/callAll'
import { Moment } from './../Moment'
import {
  extractAddMergeEventData,
  watchGraphAddMergeEvent,
} from './watchGraphAddMergeEvent'
import {
  extractAddPinToMergeEventData,
  watchGraphAddPinToMergeEvent,
} from './watchGraphAddPinToMergeEvent'
import {
  extractAddUnitEventData,
  watchGraphAddUnitEvent,
} from './watchGraphAddUnitEvent'
import {
  extractBulkEditEventData,
  watchGraphBulkEditEvent,
} from './watchGraphBulkEditEvent'
import {
  extractCoverPinEventData,
  watchGraphCoverPinEvent,
} from './watchGraphCoverPinEvent'
import {
  extractCoverPinSetEventData,
  watchGraphCoverPinSetEvent,
} from './watchGraphCoverPinSetEvent'
import {
  extractDestroyEventData,
  watchGraphDestroyEvent,
} from './watchGraphDestroyEvent'
import {
  extractExposePinEventData,
  watchGraphExposePinEvent,
} from './watchGraphExposePinEvent'
import {
  extractExposePinSetEventData,
  watchGraphExposePinSetEvent,
} from './watchGraphExposePinSetEvent'
import {
  extractForkEventData,
  watchGraphForkEvent,
} from './watchGraphForkEvent'
import {
  extractSetMetadataEventData,
  watchGraphSetMetadataEvent,
} from './watchGraphMetadataEvent'
import {
  extractMoveSubComponentRootEventData,
  watchGraphMoveSubComponentRoot,
} from './watchGraphMoveSubComponentRoot'
import {
  extractMoveSubgraphIntoEventData,
  watchGraphMoveSubgraphIntoEvent,
} from './watchGraphMoveSubgraphIntoEvent'
import {
  extractMoveSubgraphOutOfEventData,
  watchGraphMoveSubgraphOutOfEvent,
} from './watchGraphMoveSubgraphOutEvent'
import {
  extractPlugPinEventData,
  watchGraphPlugPinEvent,
} from './watchGraphPlugPinEvent'
import {
  extractRemoveMergeEventData,
  watchGraphRemoveMergeEvent,
} from './watchGraphRemoveMergeEvent'
import {
  extractRemovePinFromMergeEventData,
  watchGraphRemovePinFromMergeEvent,
} from './watchGraphRemovePinFromMergeEvent'
import {
  extractRemoveUnitPinDataEventData,
  watchGraphRemoveUnitPinData,
} from './watchGraphRemoveUnitPinDataEvent'
import {
  extractReorderSubComponentEventData,
  watchGraphReorderSubComponent,
} from './watchGraphReorderSubComponent'
import {
  extractSetForkEventData,
  watchGraphSetForkEvent,
} from './watchGraphSetForkEvent'
import {
  extractSetNameEventData,
  watchGraphSetNameEvent,
} from './watchGraphSetNameEvent'
import {
  extractSetPinSetDefaultIgnoredEventData,
  watchGraphSetPinSetDefaultIgnored,
} from './watchGraphSetPinSetDefaultIgnored'
import {
  extractSetPinSetFunctionalEventData,
  watchGraphSetUnitPinFunctional,
} from './watchGraphSetPinSetFunctionalEvent'
import {
  extractSetPinSetIdEventData,
  watchGraphSetPinSetId,
} from './watchGraphSetPinSetIdEvent'
import {
  extractSetUnitIdEventData,
  watchGraphSetUnitIdEvent,
} from './watchGraphSetUnitIdEvent'
import {
  extractSetUnitPinConstantEventData,
  watchGraphSetUnitPinConstant,
} from './watchGraphSetUnitPinConstantEvent'
import {
  extractSetUnitPinDataEventData,
  watchGraphSetUnitPinData,
} from './watchGraphSetUnitPinDataEvent'
import {
  extractSetUnitPinIgnoredEventData,
  watchGraphSetUnitPinIgnored,
} from './watchGraphSetUnitPinIgnoredEvent'
import {
  extractSetUnitPinSetIdEventData,
  watchGraphSetUnitPinSetId,
} from './watchGraphSetUnitPinSetIdEvent'
import {
  extractUnplugPinEventData,
  watchGraphUnplugPinEvent,
} from './watchGraphUnplugPinEvent'

export const GRAPH_EVENT_TO_WATCH: Dict<
  (event: string, graph: Graph, callback: Callback) => Unlisten
> = {
  fork: watchGraphForkEvent,
  set_name: watchGraphSetNameEvent,
  add_unit: watchGraphAddUnitEvent,
  remove_unit: watchGraphAddUnitEvent,
  add_merge: watchGraphAddMergeEvent,
  remove_merge: watchGraphRemoveMergeEvent,
  add_pin_to_merge: watchGraphAddPinToMergeEvent,
  remove_pin_from_merge: watchGraphRemovePinFromMergeEvent,
  expose_pin: watchGraphExposePinEvent,
  cover_pin: watchGraphCoverPinEvent,
  expose_pin_set: watchGraphExposePinSetEvent,
  cover_pin_set: watchGraphCoverPinSetEvent,
  plug_pin: watchGraphPlugPinEvent,
  unplug_pin: watchGraphUnplugPinEvent,
  move_subgraph_into: watchGraphMoveSubgraphIntoEvent,
  move_subgraph_out_of: watchGraphMoveSubgraphOutOfEvent,
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
  set_fork: watchGraphSetForkEvent,
  set_metadata: watchGraphSetMetadataEvent,
}

export const GRAPH_EVENT_TO_EXTRACT: Dict<(...args: any[]) => any> = {
  fork: extractForkEventData,
  set_name: extractSetNameEventData,
  add_unit: extractAddUnitEventData,
  remove_unit: extractAddUnitEventData,
  add_merge: extractAddMergeEventData,
  remove_merge: extractRemoveMergeEventData,
  add_pin_to_merge: extractAddPinToMergeEventData,
  remove_pin_from_merge: extractRemovePinFromMergeEventData,
  expose_pin: extractExposePinEventData,
  cover_pin: extractCoverPinEventData,
  expose_pin_set: extractExposePinSetEventData,
  cover_pin_set: extractCoverPinSetEventData,
  plug_pin: extractPlugPinEventData,
  unplug_pin: extractUnplugPinEventData,
  move_subgraph_into: extractMoveSubgraphIntoEventData,
  move_subgraph_out_of: extractMoveSubgraphOutOfEventData,
  reorder_sub_component: extractReorderSubComponentEventData,
  move_sub_component_root: extractMoveSubComponentRootEventData,
  set_unit_pin_constant: extractSetUnitPinConstantEventData,
  set_unit_pin_set_id: extractSetUnitPinSetIdEventData,
  set_unit_pin_ignored: extractSetUnitPinIgnoredEventData,
  set_pin_set_functional: extractSetPinSetFunctionalEventData,
  set_pin_set_id: extractSetPinSetIdEventData,
  set_pin_set_default_ignored: extractSetPinSetDefaultIgnoredEventData,
  set_unit_pin_data: extractSetUnitPinDataEventData,
  remove_unit_pin_data: extractRemoveUnitPinDataEventData,
  set_unit_id: extractSetUnitIdEventData,
  bulk_edit: extractBulkEditEventData,
  destroy: extractDestroyEventData,
  set_fork: extractSetForkEventData,
  set_metadata: extractSetMetadataEventData,
}

export function watchGraphInternal(
  graph: Graph,
  events: string[],
  callback: Callback<Moment>
): Unlisten {
  const all: Unlisten[] = []

  for (const event in GRAPH_EVENT_TO_WATCH) {
    if (events.includes(event)) {
      const watchEvent = GRAPH_EVENT_TO_WATCH[event]

      all.push(watchEvent(event, graph, callback))
    }
  }

  const unlisten = callAll(all)

  return unlisten
}
