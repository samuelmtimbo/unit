import { IO } from '../../types/IO'

export type UnitGetGlobalIdData = {}

export type UnitPlayData = {}

export type UnitPauseData = {}

export type UnitPushData = {
  id: string
  data: any
}

export type UnitPullInputData = {
  id: string
}

export type UnitTakeInputData = {
  id: string
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

export type UnitGetBundleSpecData = {}

export type UnitResetData = {}
