import { Element_ } from '../Class/Element'
import { Graph } from '../Class/Graph'
import { Unit } from '../Class/Unit'
import { GRAPH_DEFAULT_EVENTS } from '../constant/GRAPH_DEFAULT_EVENTS'
import { Pin } from '../Pin'
import { emptyIO } from '../spec/emptyIO'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'
import { IOOf } from '../types/IOOf'
import { Unlisten } from '../types/Unlisten'
import { remove } from '../util/array'
import { callAll } from '../util/call/callAll'
import { Moment } from './Moment'
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
  watchUnitRenamePinEvent,
} from './watchUnitEvent'
import { watchUnitIOSpec } from './watchUnitIOSpec'
import { watchUnitLeafEvent } from './watchUnitLeafEvent'
import { watchUnitLeafExposedPinSetEvent } from './watchUnitLeafExposedPinSetEvent'
import { watchUnitLeafForkEvent } from './watchUnitLeafForkEvent'
import { watchUnitLeafInjectEvent } from './watchUnitLeafInjectEvent'
import { watchUnitLeafMoveSubgraphIntoEvent } from './watchUnitLeafMoveSubgraphIntoEvent'

export function watchUnitIO<T extends Unit>(
  unit: T,
  events: string[] = GRAPH_DEFAULT_EVENTS,
  callback: (moment: Moment) => void
): Unlisten {
  let all: Unlisten[] = []

  const watch_data_input = events.includes('input')
  const watch_ref_input = events.includes('ref_input')

  const watch_data_output = events.includes('output')
  const watch_ref_output = events.includes('ref_output')

  const watch_rename_input = events.includes('rename_input')
  const watch_rename_output = events.includes('rename_output')

  const pin_listener_map: IOOf<Dict<Unlisten>> = emptyIO({}, {})

  const watchPin = (
    kind: 'ref' | 'data',
    type: IO,
    pinId: string,
    pin: Pin<any>
  ) => {
    const unlisten = {
      ref: {
        input: watchRefInput,
        output: watchRefOutput,
      },
      data: {
        input: watchDataInput,
        output: watchDataOutput,
      },
    }[kind][type](pinId, pin, callback)

    pin_listener_map[type][pinId] = unlisten

    all.push(unlisten)

    return unlisten
  }

  const makeWatchPin = (
    type: IO,
    kind: 'ref' | 'data'
  ): ((pin, pinId) => void) => {
    return (pin: Pin<any>, pinId: string) => {
      watchPin(kind, type, pinId, pin)
    }
  }

  if (watch_data_input) {
    forEachValueKey(unit.getDataInputs(), makeWatchPin('input', 'data'))
  }

  if (watch_ref_input) {
    forEachValueKey(unit.getRefInputs(), makeWatchPin('input', 'ref'))
  }

  if (watch_data_input || watch_ref_input) {
    all.push(
      unit.addListener('set_input', (pinId, pin, { ref }) => {
        if (ref && watch_ref_input) {
          watchPin('ref', 'input', pinId, pin)
        } else if (!ref && watch_data_input) {
          watchPin('data', 'input', pinId, pin)
        }
      })
    )
  }

  all.push(
    unit.addListener('remove_input', (pinId, pin) => {
      const unlisten = pin_listener_map.input[pinId]
      if (unlisten) {
        unlisten()

        remove(all, unlisten)

        delete pin_listener_map.input[pinId]
      }
    })
  )

  if (watch_rename_input) {
    all.push(watchUnitRenamePinEvent('rename_input', unit, callback))
  }

  all.push(
    unit.addListener('remove_output', (pinId, pin) => {
      const unlisten = pin_listener_map.output[pinId]
      if (unlisten) {
        unlisten()

        remove(all, unlisten)

        delete pin_listener_map.output[pinId]
      }
    })
  )

  if (watch_data_output) {
    forEachValueKey(unit.getDataOutputs(), makeWatchPin('output', 'data'))
  }

  if (watch_ref_output) {
    forEachValueKey(unit.getRefOutputs(), makeWatchPin('output', 'ref'))
  }

  if (watch_data_output || watch_ref_output) {
    all.push(
      unit.addListener('set_output', (pinId, pin, { ref }) => {
        if (ref && watch_ref_output) {
          watchPin('ref', 'output', pinId, pin)
        } else if (!ref && watch_data_output) {
          watchPin('data', 'output', pinId, pin)
        }
      })
    )
  }

  if (watch_rename_output) {
    all.push(watchUnitRenamePinEvent('rename_output', unit, callback))
  }

  if (unit instanceof Graph) {
    if (events.includes('leaf_fork')) {
      all.push(watchUnitLeafForkEvent('leaf_fork', unit, callback))
    }

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

    if (events.includes('leaf_inject_graph')) {
      all.push(watchUnitLeafInjectEvent('leaf_inject_graph', unit, callback))
    }

    if (events.includes('leaf_move_subgraph_into')) {
      all.push(
        watchUnitLeafMoveSubgraphIntoEvent(
          'leaf_move_subgraph_into',
          unit,
          callback
        )
      )
    }
  }

  if (unit instanceof Graph || unit instanceof Element_) {
    if (events.includes('append_child')) {
      all.push(watchComponentAppendEvent('append_child', unit, callback))
    }

    if (events.includes('remove_child')) {
      all.push(watchComponentRemoveEvent('remove_child', unit, callback))
    }

    if (events.includes('leaf_append_child')) {
      all.push(
        watchComponentLeafAppendEvent('leaf_append_child', unit, callback)
      )
    }

    if (events.includes('leaf_remove_child')) {
      all.push(
        watchComponentLeafRemoveEvent('leaf_remove_child', unit, callback)
      )
    }
  }

  all.push(watchUnitErr(unit, callback, events))

  all.push(watchUnitIOSpec(unit, callback, events))

  let unlisten = callAll(all)

  return unlisten
}
