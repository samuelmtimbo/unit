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
  watchComponentRemoveEvent,
  watchUnitRenamePinEvent,
} from './watchUnitEvent'
import { watchUnitIOSpec } from './watchUnitIOSpec'

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

  const unlistenPin = (type: IO, pinId: string) => {
    const unlisten = pin_listener_map[type][pinId]
    if (unlisten) {
      unlisten()

      remove(all, unlisten)

      delete pin_listener_map.input[pinId]
    }
  }

  const listenPin = (type: IO, pinId: string) => {
    const pin = unit.getPin(type, pinId)
    const ref = unit.isPinRef(type, pinId)

    if (ref && watch_ref_input) {
      watchPin('ref', type, pinId, pin)
    } else if (!ref && watch_data_input) {
      watchPin('data', type, pinId, pin)
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
        listenPin('input', pinId)
      })
    )
  }

  all.push(
    unit.addListener('rename_input', (name, newName) => {
      unlistenPin('input', name)
      listenPin('input', newName)
    })
  )
  all.push(
    unit.addListener('rename_output', (name, newName) => {
      unlistenPin('output', name)
      listenPin('output', newName)
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

  if (unit instanceof Graph || unit instanceof Element_) {
    if (events.includes('append_child')) {
      all.push(watchComponentAppendEvent('append_child', unit, callback))
    }

    if (events.includes('remove_child')) {
      all.push(watchComponentRemoveEvent('remove_child', unit, callback))
    }
  }

  all.push(watchUnitErr(unit, callback, events))
  all.push(watchUnitIOSpec(unit, callback, events))

  let unlisten = callAll(all)

  return unlisten
}
