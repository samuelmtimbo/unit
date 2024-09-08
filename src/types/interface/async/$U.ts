import {
  UnitGetAllInputDataData,
  UnitGetAllPinDataData,
  UnitGetAllRefInputDataData,
  UnitGetGlobalIdData,
  UnitGetPinDataData,
  UnitGetUnitBundleSpecData,
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

export const U_METHOD_GET = [
  'getGlobalId',
  'getListeners',
  'getPinData',
  'getAllPinData',
  'getAllInputData',
  'getAllRefInputData',
  'getInputData',
  'getRefInputData',
  'setPinData',
  'removePinData',
]
export const U_METHOD_CALL = [
  'call',
  'play',
  'pause',
  'push',
  'pullInput',
  'takeInput',
  'renamePin',
]
export const U_METHOD_WATCH = ['watch']
export const U_METHOD_REF = ['refGlobalObj']

export interface $U_G {
  $getGlobalId(data: UnitGetGlobalIdData, callback: Callback<string>): void
  $paused(data: UnitPauseData, callback: Callback<boolean>): void
  $getPinData(data: UnitGetPinDataData, callback: (data: any) => void): void
  $getAllPinData(
    data: UnitGetAllPinDataData,
    callback: (data: { input: Dict<any>; output: Dict<any> }) => void
  ): void
  $getAllInputData(
    {}: UnitGetAllInputDataData,
    callback: (data: Dict<any>) => void
  ): void
  $getAllRefInputData(
    {}: UnitGetAllRefInputDataData,
    callback: (data: Dict<GlobalRefSpec>) => void
  ): void
  $getUnitBundleSpec(
    {}: UnitGetUnitBundleSpecData,
    callback: (data: UnitBundleSpec) => void
  ): void
  $reset(data: UnitResetData): void
}

export interface $U_C {
  $play(data: UnitPlayData): void
  $pause(data: UnitPauseData): void
  $push({ pinId, data }: UnitPushData): void
  $pullInput({ pinId }: UnitPullInputData): void
  $takeInput({ pinId }: UnitTakeInputData): void
  $setPinData({ pinId, type, data }: UnitSetPinDataData): void
  $removePinData({ type, pinId }: UnitRemovePinDataData): void
  $reset(data: UnitResetData): void
}

export interface $U_W {
  $watch(data: { events: string[] }, callback: (moment: any) => void): Unlisten
}

export interface $U_R {
  $refGlobalObj(data: { globalId: string; __?: string[] }): any
}

export interface $U extends $U_G, $U_C, $U_W, $U_R {}
