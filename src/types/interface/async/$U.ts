import {
  UnitGetBundleSpecData,
  UnitGetGlobalIdData,
  UnitGetInputDataData,
  UnitGetPinDataData,
  UnitGetRefInputDataData,
  UnitPauseData,
  UnitPlayData,
  UnitPullInputData,
  UnitPushData,
  UnitRemovePinDataData,
  UnitResetData,
  UnitSetPinDataData,
  UnitTakeInputData,
} from '../../../Class/Unit/interface'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GlobalRefSpec } from '../../GlobalRefSpec'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'

export const U_METHOD_CALL = [
  'getGlobalId',
  'getListeners',
  'call',
  'play',
  'pause',
  'push',
  'pullInput',
  'takeInput',
  'renamePin',
  'setPinData',
  'removePinData',
  'getPinData',
  'getInputData',
  'getRefInputData',
  'err',
]
export const U_METHOD_WATCH = ['watch']
export const U_METHOD_REF = ['refGlobalObj']

export const U_METHOD = [...U_METHOD_CALL, ...U_METHOD_WATCH, ...U_METHOD_REF]

export interface $U_C {
  $getGlobalId(data: UnitGetGlobalIdData, callback: Callback<string>): void
  $play(data: UnitPlayData): void
  $pause(data: UnitPauseData): void
  $push({ id, data }: UnitPushData): void
  $pullInput({ id }: UnitPullInputData): void
  $takeInput({ id }: UnitTakeInputData): void
  $setPinData({ pinId, type, data }: UnitSetPinDataData)
  $removePinData({ type, pinId }: UnitRemovePinDataData)
  $getPinData(
    data: UnitGetPinDataData,
    callback: (data: { input: Dict<any>; output: Dict<any> }) => void
  ): void
  $getInputData(
    {}: UnitGetInputDataData,
    callback: (data: Dict<any>) => void
  ): void
  $getRefInputData(
    {}: UnitGetRefInputDataData,
    callback: (data: Dict<GlobalRefSpec>) => void
  ): void
  $getBundleSpec(
    {}: UnitGetBundleSpecData,
    callback: (data: UnitBundleSpec) => void
  ): void
  $reset(data: UnitResetData): void
}

export interface $U_W {
  $watch(data: { events: string[] }, callback: (moment: any) => void): Unlisten
}

export interface $U_R {
  $refGlobalObj(data: { globalId: string }): $U
}

export interface $U extends $U_C, $U_W, $U_R {}
