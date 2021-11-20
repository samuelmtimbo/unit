import { Callback } from '../../Callback'
import { Moment } from '../../debug/Moment'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../Unlisten'
import { $PO } from './$PO'
import { $U, $U_C, $U_R, $U_W } from './$U'

export const AsyncUCall = (unit: $U): $U_C => {
  return {
    $getGlobalId(data: {}, callback: Callback<string>) {
      return unit.$getGlobalId(data, callback)
    },

    $getListeners(data: {}, callback: Callback<string[]>) {
      return unit.$getListeners(data, callback)
    },

    $emit(_data: { type: string; data: any }) {
      return unit.$emit(_data)
    },

    $play(data: {}) {
      unit.$play(data)
    },

    $pause(data: {}) {
      unit.$pause(data)
    },

    $reset(data: {}): void {
      unit.$reset(data)
    },

    $destroy(data: {}) {
      unit.$destroy(data)
    },

    $push(_data: { path: string[]; id: string; data: any }): void {
      unit.$push(_data)
    },

    $takeInput(data: { path: string[]; id: string }): void {
      unit.$takeInput(data)
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
      unit.$setPinData(data)
    },

    $removePinData(data: { type: 'input' | 'output'; pinId: string }) {
      unit.$removePinData(data)
    },

    $err(data: { err: string }): void {
      unit.$err(data)
    },

    $getPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      unit.$getPinData(data, callback)
    },

    $getInputData(data: {}, callback: (data: Dict<any>) => void): void {
      unit.$getInputData(data, callback)
    },

    $getRefInputData(
      data: {},
      callback: Callback<Dict<{ globalId: string; _: string[] }>>
    ): void {
      unit.$getRefInputData(data, callback)
    },

    $pullInput(data: { id: string }): void {
      unit.$pullInput(data)
    },
  }
}

export const AsyncUWatch = (unit: $U): $U_W => {
  return {
    $watch(
      data: { events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return unit.$watch(data, callback)
    },
  }
}

export const AsyncURef = (unit: $U): $U_R => {
  return {
    $refGlobalObj(data: { id: string; _: string[] }): $U {
      return unit.$refGlobalObj(data)
    },
    $refPod(data: {}): $PO {
      return unit.$refPod({})
    },
  }
}

export const AsyncU: (unit: $U) => $U = (unit: $U) => {
  return {
    ...AsyncUCall(unit),
    ...AsyncUWatch(unit),
    ...AsyncURef(unit),
  }
}
