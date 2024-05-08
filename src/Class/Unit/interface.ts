import { IO } from '../../types/IO'

export type UnitGetGlobalIdData = {}

export type UnitPlayData = {}

export type UnitPauseData = {}

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

export type UnitSetPinIgnoredData = {
  pinId: string
  type: IO
  ignored: boolean
}

export type UnitSetPinDataData = {
  pinId: string
  type: IO
  data: string
}

export type UnitRemovePinDataData = {
  type: IO
  pinId: string
}

export type UnitGetPinDataData = {}

export type UnitGetInputDataData = {}

export type UnitGetRefInputDataData = {}

export type UnitGetUnitBundleSpecData = {
  deep?: boolean
}

export type UnitResetData = {}
