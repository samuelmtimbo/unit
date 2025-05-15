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
import { watchPin } from './watchPin'
import { watchUnitErr } from './watchUnitErr'
import {
  watchComponentAppendChildrenEvent,
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
  const watch_data_output = events.includes('output')

  const watch_rename_input = events.includes('rename_input')
  const watch_rename_output = events.includes('rename_output')

  const pin_listener_map: IOOf<Dict<Unlisten>> = emptyIO({}, {})

  const watchPin_ = (type: IO, pinId: string, pin: Pin<any>) => {
    const unlisten = watchPin(type, pinId, pin, callback)

    pin_listener_map[type][pinId] = unlisten

    all.push(unlisten)

    return unlisten
  }

  const makeWatchPin = (type: IO): ((pin, pinId) => void) => {
    return (pin: Pin<any>, pinId: string) => {
      watchPin_(type, pinId, pin)
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

    watchPin_(type, pinId, pin)
  }

  if (watch_data_input) {
    forEachValueKey(unit.getDataInputs(), makeWatchPin('input'))
    forEachValueKey(unit.getRefInputs(), makeWatchPin('input'))
  }

  if (watch_data_input) {
    all.push(
      unit.addListener('set_input', (pinId: string, pin, { ref }) => {
        listenPin('input', pinId)
      })
    )
  }

  all.push(
    unit.addListener('remove_input', (pinId: string, pin) => {
      const unlisten = pin_listener_map.input[pinId]

      if (unlisten) {
        unlisten()

        remove(all, unlisten)

        delete pin_listener_map.output[pinId]
      }
    })
  )

  all.push(
    unit.addListener('rename_input', (name: string, newName: string) => {
      unlistenPin('input', name)
      listenPin('input', newName)
    })
  )
  all.push(
    unit.addListener('rename_output', (name: string, newName: string) => {
      unlistenPin('output', name)
      listenPin('output', newName)
    })
  )

  if (watch_rename_input) {
    all.push(watchUnitRenamePinEvent('rename_input', unit, callback))
  }

  all.push(
    unit.addListener('remove_output', (pinId: string, pin) => {
      const unlisten = pin_listener_map.output[pinId]
      if (unlisten) {
        unlisten()

        remove(all, unlisten)

        delete pin_listener_map.output[pinId]
      }
    })
  )

  if (watch_data_output) {
    forEachValueKey(unit.getDataOutputs(), makeWatchPin('output'))
    forEachValueKey(unit.getRefOutputs(), makeWatchPin('output'))
  }

  if (watch_data_output) {
    all.push(
      unit.addListener('set_output', (pinId: string, pin) => {
        watchPin_('output', pinId, pin)
      })
    )
  }

  if (watch_rename_output) {
    all.push(watchUnitRenamePinEvent('rename_output', unit, callback))
  }

  if (unit.isElement()) {
    if (events.includes('append_child')) {
      // @ts-ignore
      all.push(watchComponentAppendEvent('append_child', unit, callback))
    }

    if (events.includes('append_children')) {
      all.push(
        // @ts-ignore
        watchComponentAppendChildrenEvent('append_children', unit, callback)
      )
    }

    if (events.includes('remove_child')) {
      // @ts-ignore
      all.push(watchComponentRemoveEvent('remove_child', unit, callback))
    }
  }

  all.push(watchUnitErr(unit, callback, events))
  all.push(watchUnitIOSpec(unit, callback, events))

  let unlisten = callAll(all)

  return unlisten
}
