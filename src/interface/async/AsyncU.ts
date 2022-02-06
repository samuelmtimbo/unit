import { Moment } from '../../debug/Moment'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { GlobalRefSpec } from '../../types/GlobalRefSpec'
import { IO } from '../../types/IO'
import { Unlisten } from '../../types/Unlisten'
import { $PO } from './$PO'
import { $U, $U_C, $U_R, $U_W } from './$U'

export const AsyncUCall = (unit: $U): $U_C => {
  return {
    $getGlobalId(data: {}, callback: Callback<string>) {
      return unit.$getGlobalId(data, callback)
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

    $setPinData({ type, pinId, data }: { type: IO; pinId: string; data: any }) {
      unit.$setPinData(data)
    },

    $removePinData(data: { type: IO; pinId: string }) {
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

    $getRefInputData(data: {}, callback: Callback<Dict<GlobalRefSpec>>): void {
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
    $refGlobalObj(data: GlobalRefSpec): $U {
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
