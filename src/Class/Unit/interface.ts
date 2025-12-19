import { DataRef } from '../../DataRef'
import { IO } from '../../types/IO'
import { Memory } from './Memory'

export type UnitGetGlobalIdData = {}

export type UnitGetSpecData = {}

export type UnitDestroyData = {}

export type UnitPlayData = {}

export type UnitPauseData = {}

export type UnitHasPinData = {
  type: IO
  pinId: string
}

export type UnitPushData = {
  pinId: string
  data: any
}

export type UnitPullInputData = {
  pinId: string
}

export type UnitTakeInputData = {
  pinId: string
}

export type UnitTakeErrData = {}

export type UnitSetPinIgnoredData = {
  pinId: string
  type: IO
  ignored: boolean
}

export type UnitSetPinDataData = {
  pinId: string
  type: IO
  data: string | DataRef
  lastData: string
}

export type UnitRemovePinDataData = {
  type: IO
  pinId: string
  data: string
}

export type UnitGetPinDataData = {
  pinId: string
  type: IO
}

export type UnitGetAllPinDataData = {}

export type UnitGetAllInputDataData = {}

export type UnitGetAllRefInputDataData = {}

export type UnitGetUnitBundleSpecData = {
  deep?: boolean
}

export type UnitResetData = {}

export type UnitRestoreData = { memory: Memory }
