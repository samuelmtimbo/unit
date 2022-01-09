import { Element } from '../Class/Element'
import { Graph } from '../Class/Graph'
import { Stateful } from '../Class/Stateful'
import { Unit } from '../Class/Unit'
import { DEFAULT_EVENTS } from '../constant/DEFAULT_EVENTS'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { Unlisten } from '../types/Unlisten'
import callAll from '../util/call/callAll'
import { Moment } from './Moment'
import { watchGraphLeafSetEvent } from './watchGraphLeafSetEvent'
import { watchDataInput } from './watchInput'
import { watchDataOutput } from './watchOutput'
import { watchRefInput } from './watchRefInput'
import { watchRefOutput } from './watchRefOutput'
import { watchUnitErr } from './watchUnitErr'
import {
  watchComponentAppendEvent,
  watchComponentLeafAppendEvent,
  watchComponentLeafRemoveEvent,
  watchComponentRemoveEvent,
  watchStatefulLeafSetEvent,
} from './watchUnitEvent'
import { watchUnitIOSpec } from './watchUnitIOSpec'
import { watchUnitLeafEvent } from './watchUnitLeafEvent'
import { watchUnitLeafExposedPinSetEvent } from './watchUnitLeafExposedPinSetEvent'

export function watchUnitIO<T extends Unit>(
  unit: T,
  events: string[] = DEFAULT_EVENTS,
  callback: (moment: Moment) => void
): Unlisten {
  let all: Unlisten[] = []

  const watch_data_input = events.includes('input')
  const watch_ref_input = events.includes('ref_input')

  const watch_data_output = events.includes('output')
  const watch_ref_output = events.includes('ref_output')

  if (watch_data_input) {
    forEachKeyValue(unit.getDataInputs(), (pin, pinId) => {
      all.push(watchDataInput(pinId, pin, callback))
    })
  }

  if (watch_ref_input) {
    forEachKeyValue(unit.getRefInputs(), (pin, pinId) => {
      all.push(watchRefInput(pinId, pin, callback))
    })
  }

  if (watch_data_input || watch_ref_input) {
    all.push(
      unit.addListener('set_input', (pinId, pin, { ref }) => {
        if (ref && watch_ref_input) {
          all.push(watchRefInput(pinId, pin, callback))
        } else if (!ref && watch_data_input) {
          all.push(watchDataInput(pinId, pin, callback))
        }
      })
    )
  }

  if (watch_data_output) {
    forEachKeyValue(unit.getDataOutputs(), (pin, pinId) => {
      all.push(watchDataOutput(pinId, pin, callback))
    })
  }

  if (watch_ref_output) {
    forEachKeyValue(unit.getRefOutputs(), (pin, pinId) => {
      all.push(watchRefOutput(pinId, pin, callback))
    })
  }

  if (watch_data_output || watch_ref_output) {
    all.push(
      unit.addListener('set_output', (pinId, pin, { ref }) => {
        if (ref && watch_ref_output) {
          all.push(watchRefOutput(pinId, pin, callback))
        } else if (!ref && watch_data_output) {
          all.push(watchDataOutput(pinId, pin, callback))
        }
      })
    )
  }

  if (unit instanceof Stateful) {
    if (events.includes('leaf_set')) {
      all.push(watchStatefulLeafSetEvent('leaf_set', unit, callback))
    }
  }

  if (unit instanceof Graph) {
    if (events.includes('leaf_set')) {
      all.push(watchGraphLeafSetEvent('leaf_set', unit, callback))
    }
  }

  if (unit instanceof Graph) {
    if (events.includes('leaf_add_unit')) {
      all.push(watchUnitLeafEvent('leaf_add_unit', unit, callback))
    }

    if (events.includes('leaf_remove_unit')) {
      all.push(watchUnitLeafEvent('leaf_remove_unit', unit, callback))
    }

    if (events.includes('leaf_expose_pin_set')) {
      all.push(
        watchUnitLeafExposedPinSetEvent('leaf_expose_pin_set', unit, callback)
      )
    }

    if (events.includes('leaf_cover_pin_set')) {
      all.push(
        watchUnitLeafExposedPinSetEvent('leaf_cover_pin_set', unit, callback)
      )
    }
  }

  if (unit instanceof Graph || unit instanceof Element) {
    if (events.includes('append_child')) {
      all.push(watchComponentAppendEvent('append_child', unit, callback))
    }

    if (events.includes('remove_child_at')) {
      all.push(watchComponentRemoveEvent('remove_child_at', unit, callback))
    }

    if (events.includes('leaf_append_child')) {
      all.push(
        watchComponentLeafAppendEvent('leaf_append_child', unit, callback)
      )
    }

    if (events.includes('leaf_remove_child_at')) {
      all.push(
        watchComponentLeafRemoveEvent('leaf_remove_child_at', unit, callback)
      )
    }
  }

  all.push(watchUnitErr(unit, callback, events))

  all.push(watchUnitIOSpec(unit, callback, events))

  let unlisten = callAll(all)

  return unlisten
}
