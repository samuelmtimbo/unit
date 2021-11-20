import callAll from '../callAll'
import { U } from '../interface/U'
import { Unlisten } from '../Unlisten'
import { Moment } from './Moment'
import { watchGraphExposedPinEvent } from './watchGraphExposedPinEvent'
import { watchGraphExposedPinSetEvent } from './watchGraphExposedPinSetEvent'
import { watchGraphMergeEvent } from './watchGraphMergeEvent'
import { watchGraphPinMergeEvent } from './watchGraphPinMergeEvent'
import { watchGraphPlugEvent } from './watchGraphPlugEvent'
import { watchGraphUnitComponentAppendEvent } from './watchGraphUnitComponentAppendEvent'
import { watchGraphUnitComponentRemoveEvent } from './watchGraphUnitComponentRemoveEvent'
import { watchGraphUnitEvent } from './watchGraphUnitEvent'
import { watchGraphUnitMoveEvent } from './watchGraphUnitMoveEvent'

export function watchGraphInternal(
  unit: U,
  events: string[],
  callback: (moment: Moment) => void
): Unlisten {
  const all: Unlisten[] = []

  if (events.includes('add_unit')) {
    all.push(watchGraphUnitEvent('add_unit', unit, callback))
  }

  if (events.includes('remove_unit')) {
    all.push(watchGraphUnitEvent('remove_unit', unit, callback))
  }

  if (events.includes('move_unit')) {
    all.push(watchGraphUnitMoveEvent('move_unit', unit, callback))
  }

  if (events.includes('component_append')) {
    all.push(watchGraphUnitComponentAppendEvent(unit, callback))
  }

  if (events.includes('component_remove')) {
    all.push(watchGraphUnitComponentRemoveEvent(unit, callback))
  }

  if (events.includes('add_merge')) {
    all.push(watchGraphMergeEvent('add_merge', unit, callback))
  }

  if (events.includes('remove_merge')) {
    all.push(watchGraphMergeEvent('remove_merge', unit, callback))
  }

  if (events.includes('add_pin_to_merge')) {
    all.push(watchGraphPinMergeEvent('add_pin_to_merge', unit, callback))
  }

  if (events.includes('remove_pin_from_merge')) {
    all.push(watchGraphPinMergeEvent('remove_pin_from_merge', unit, callback))
  }

  if (events.includes('expose_pin')) {
    all.push(watchGraphExposedPinEvent('expose_pin', unit, callback))
  }

  if (events.includes('cover_pin')) {
    all.push(watchGraphExposedPinEvent('cover_pin', unit, callback))
  }

  if (events.includes('expose_pin_set')) {
    all.push(watchGraphExposedPinSetEvent('expose_pin_set', unit, callback))
  }

  if (events.includes('cover_pin_set')) {
    all.push(watchGraphExposedPinSetEvent('cover_pin_set', unit, callback))
  }

  if (events.includes('plug_pin')) {
    all.push(watchGraphPlugEvent('plug_pin', unit, callback))
  }

  if (events.includes('unplug_pin')) {
    all.push(watchGraphPlugEvent('unplug_pin', unit, callback))
  }

  const unlisten = callAll(all)

  return unlisten
}
