import { Unit } from '../../Class/Unit'
import { Moment } from '../../debug/Moment'
import { watchUnit } from '../../debug/watchUnit'
import { getGlobalRef } from '../../global'
import { proxyWrap } from '../../proxyWrap'
import { evaluate } from '../../spec/evaluate'
import { System } from '../../system'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { GlobalRefSpec } from '../../types/GlobalRefSpec'
import { IO } from '../../types/IO'
import { stringifyPinData } from '../../types/stringifyPinData'
import { Unlisten } from '../../types/Unlisten'
import { mapObjVK } from '../../util/object'
import { $PO } from './$PO'
import { $U, $U_C, $U_R, $U_W } from './$U'
import { Async } from './Async'

export const $$refGlobalObj = (system: System, id: string, _: string[]) => {
  const $ = getGlobalRef(system, id)
  const $unit = Async($, _)
  return $unit
}

export const AsyncUCall = (unit: Unit<any, any, any>): $U_C => {
  return {
    $getGlobalId(data: {}, callback: Callback<string>) {
      const __global_id = unit.getGlobalId()

      callback(__global_id)
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
      const classes = unit.__system.classes
      const specs = { ...unit.__system.specs, ...unit.__pod.specs }
      const _data = evaluate(data, specs, classes)
      unit.push(id, _data)
    },

    $takeInput(data: { path: string[]; id: string }): void {
      const { id } = data
      unit.takeInput(id)
    },

    $setPinData({ type, pinId, data }: { type: IO; pinId: string; data: any }) {
      const classes = unit.__system.classes
      const specs = { ...unit.__system.specs, ...unit.__pod.specs }
      const _data = evaluate(data, specs, classes)
      unit.setPinData(type, pinId, _data)
    },

    $removePinData(data: { type: IO; pinId: string }) {
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

    $getRefInputData(data: {}, callback: Callback<Dict<GlobalRefSpec>>): void {
      const _data = unit.getRefInputData()
      const __data = mapObjVK(_data, (unit: Unit) => {
        const __ = unit.getInterface()
        const __global_id = unit.getGlobalId()
        return { __global_id, __ }
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

export const AsyncUWatch = (unit: Unit): $U_W => {
  return {
    $watch(
      { events }: { events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return watchUnit(unit, callback, events)
    },
  }
}

export const AsyncURef = (unit: Unit): $U_R => {
  return {
    $refGlobalObj(data: GlobalRefSpec): $U {
      const __system = unit.refSystem()
      const { __global_id, __ } = data
      const $ = $$refGlobalObj(__system, __global_id, __)
      return proxyWrap($, __)
    },
    $refPod(data: {}): $PO {
      const pod = unit.refPod()
      const $pod = Async(pod, ['$PO'])
      return $pod
    },
  }
}

export const AsyncU: (unit: Unit) => $U = (unit: Unit) => {
  return {
    ...AsyncUCall(unit),
    ...AsyncUWatch(unit),
    ...AsyncURef(unit),
  }
}
