import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { GlobalRefSpec } from '../../types/GlobalRefSpec'
import { IO } from '../../types/IO'
import { Unlisten } from '../../types/Unlisten'
import { $PO } from './$PO'

export const $U_METHOD_CALL = [
  'getGlobalId',
  'getListeners',
  'call',
  'play',
  'pause',
  'push',
  'pullInput',
  'takeInput',
  'setPinData',
  'removePinData',
  'getPinData',
  'getInputData',
  'getRefInputData',
  'err',
]

export const $U_METHOD_WATCH = ['watch']

export const $U_METHOD_REF = ['refGlobalObj']

export const $U_METHOD = [
  ...$U_METHOD_CALL,
  ...$U_METHOD_WATCH,
  ...$U_METHOD_REF,
]

export interface $U_C {
  $getGlobalId(data: {}, callback: Callback<string>): void

  $play(data: {}): void

  $pause(data: {}): void

  $push({ id, data }: { id: string; data: any }): void

  $pullInput({ id }: { id: string }): void

  $takeInput({ id }: { id: string }): void

  $setPinData({ pinId, type, data }: { pinId: string; type: IO; data: string })

  $removePinData({ type, pinId }: { type: IO; pinId: string })

  $getPinData(
    data: {},
    callback: (data: { input: Dict<any>; output: Dict<any> }) => void
  ): void

  $getInputData({}: {}, callback: (data: Dict<any>) => void): void

  $getRefInputData({}: {}, callback: (data: Dict<GlobalRefSpec>) => void): void

  $err({ err }: { err: string }): void

  $reset(data: {}): void

  $destroy(data: {}): void
}

export interface $U_W {
  $watch(data: { events: string[] }, callback: (moment: any) => void): Unlisten
}

export interface $U_R {
  $refGlobalObj(data: { __global_id: string; __: string[] }): $U
  $refPod(data: {}): $PO
}

export interface $U extends $U_C, $U_W, $U_R {}
