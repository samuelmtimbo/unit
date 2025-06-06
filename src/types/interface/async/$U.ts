import {
  UnitDestroyData,
  UnitGetAllInputDataData,
  UnitGetAllPinDataData,
  UnitGetAllRefInputDataData,
  UnitGetPinDataData,
  UnitGetUnitBundleSpecData,
  UnitPauseData,
  UnitPlayData,
  UnitPullInputData,
  UnitPushData,
  UnitRemovePinDataData,
  UnitResetData,
  UnitRestoreData,
  UnitSetPinDataData,
  UnitTakeErrData,
  UnitTakeInputData,
} from '../../../Class/Unit/interface'
import { Memory } from '../../../Class/Unit/Memory'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GlobalRefSpec } from '../../GlobalRefSpec'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'

export const U_METHOD_GET = [
  'getPinData',
  'getAllPinData',
  'getAllInputData',
  'getAllRefInputData',
  'getInputData',
  'getRefInputData',
  'setPinData',
  'removePinData',
  'snapshot',
]
export const U_METHOD_CALL = [
  'call',
  'play',
  'pause',
  'push',
  'pullInput',
  'takeInput',
  'takeErr',
  'renamePin',
  'destroy',
  'reset',
]
export const U_METHOD_WATCH = ['watch']
export const U_METHOD_REF = ['refGlobalObj']

export interface $U_G {
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
  $snapshot(data: {}, callback: (state: Memory) => void): void
}

export interface $U_C {
  $play(data: UnitPlayData): void
  $pause(data: UnitPauseData): void
  $push(data: UnitPushData): void
  $pullInput(data: UnitPullInputData): void
  $takeInput(data: UnitTakeInputData): void
  $takeErr(data: UnitTakeErrData): void
  $setPinData(data: UnitSetPinDataData): void
  $removePinData(data: UnitRemovePinDataData): void
  $reset(data: UnitResetData): void
  $restore(data: UnitRestoreData): void
  $destroy(data: UnitDestroyData): void
}

export interface $U_W {
  $watch(data: { events: string[] }, callback: (moment: any) => void): Unlisten
}

export interface $U_R {
  $refGlobalObj(data: { globalId: string; __: string[] }): any
}

export interface $U extends $U_G, $U_C, $U_W, $U_R {}
