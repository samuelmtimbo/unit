import {
  UnitRemovePinDataData,
  UnitSetPinDataData,
} from '../../Class/Unit/interface'
import { IO } from '../../types/IO'

export const SET_PIN_DATA = 'setPinData'
export const REMOVE_PIN_DATA = 'removePinData'

export const wrapRemovePinDataAction = (data: UnitRemovePinDataData) => {
  return {
    type: REMOVE_PIN_DATA,
    data,
  }
}

export const makeRemovePinDataAction = (
  type: IO,
  pinId: string,
  data: string
) => {
  return wrapRemovePinDataAction({ type, pinId, data })
}

export const makeSetPinDataAction = (
  type: IO,
  pinId: string,
  data: string,
  lastData: string
) => {
  return wrapSetPinDataAction({
    type,
    pinId,
    data,
    lastData,
  })
}

export const wrapSetPinDataAction = (data: UnitSetPinDataData) => {
  return {
    type: SET_PIN_DATA,
    data,
  }
}
