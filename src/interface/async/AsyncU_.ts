import { Callback } from '../../Callback'
import { getGlobalRef } from '../../client/globalUnit'
import { Moment } from '../../debug/Moment'
import { watchUnit } from '../../debug/watchUnit'
import { _proxy } from '../../proxyWrap'
import { evaluate } from '../../spec/evaluate'
import { stringifyPinData } from '../../stringifyPinData'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../Unlisten'
import { mapObjVK } from '../../util/object'
import { U } from '../U'
import { $PO } from './$PO'
import { $U, $U_C, $U_R, $U_W } from './$U'
import { Async } from './Async'

export const $$refGlobalObj = (id: string, _: string[]) => {
  const $ = getGlobalRef(id)
  const $unit = Async($, _)
  return $unit
}

export const AsyncUCall = (unit: U): $U_C => {
  return {
    $getGlobalId(data: {}, callback: Callback<string>) {
      const globalId = unit.getGlobalId()
      callback(globalId)
    },

    $getListeners(data: {}, callback: Callback<string[]>) {
      const events = unit.getListeners()
      callback(events)
    },

    $emit(_data: { type: string; data: any }) {
      const { type, data } = _data
      unit.emit(type, data)
    },

    $play(data: {}) {
      unit.play()
    },

    $pause(data: {}) {
      unit.pause()
    },

    $reset(data: {}): void {
      unit.reset()
    },

    $destroy(data: {}) {
      unit.destroy()
    },

    $push({ id, data }: { id: string; data: any }): void {
      const _data = evaluate(data)
      unit.push(id, _data)
    },

    $takeInput(data: { path: string[]; id: string }): void {
      const { id } = data
      unit.takeInput(id)
    },

    $setPinData({
      type,
      pinId,
      data,
    }: {
      type: 'input' | 'output'
      pinId: string
      data: any
    }) {
      const _data = evaluate(data)
      unit.setPinData(type, pinId, _data)
    },

    $removePinData(data: { type: 'input' | 'output'; pinId: string }) {
      const { type, pinId } = data
      unit.removePinData(type, pinId)
    },

    $err(data: { err: string }): void {
      const { err } = data
      unit.err(err)
    },

    $getPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      const _data = unit.getPinData()
      const __data = stringifyPinData(_data)
      callback(__data)
    },

    $getInputData(data: {}, callback: (data: Dict<any>) => void): void {
      const _data = unit.getInputData()
      callback(_data)
    },

    $getRefInputData(
      data: {},
      callback: Callback<Dict<{ globalId: string; _: string[] }>>
    ): void {
      const _data = unit.getRefInputData()
      const __data = mapObjVK(_data, (unit: U) => {
        const _ = unit.getInterface()
        const globalId = unit.getGlobalId()
        return { local: true, globalId, _ }
      })
      callback(__data)
    },

    $pullInput(data: { id: string }): void {
      const { id } = data
      const input = unit.getInput(id)
      input.pull()
    },
  }
}

export const AsyncUWatch = (unit: U): $U_W => {
  return {
    $watch(
      { events }: { events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return watchUnit(unit, callback, events)
    },
  }
}

export const AsyncURef = (unit: U): $U_R => {
  return {
    $refGlobalObj(data: { id: string; _: string[] }): $U {
      const { id, _ } = data
      const $ = $$refGlobalObj(id, _)
      return _proxy($, _)
    },
    $refPod(data: {}): $PO {
      const pod = unit.refPod()
      const $pod = Async(pod, ['$PO'])
      return $pod
    },
  }
}

export const AsyncU: (unit: U) => $U = (unit: U) => {
  return {
    ...AsyncUCall(unit),
    ...AsyncUWatch(unit),
    ...AsyncURef(unit),
  }
}
