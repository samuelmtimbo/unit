import {
  UnitRemovePinDataData,
  UnitTakeInputData,
} from '../../Class/Unit/interface'
import { IO } from '../../types/IO'

export const TAKE_INPUT = 'takeInput'
export const REMOVE_PIN_DATA = 'removePinData'

export const wrapTakeInputAction = (data: UnitTakeInputData) => {
  return {
    type: TAKE_INPUT,
    data,
  }
}

export const makeTakeInputAction = (id: string) => {
  return wrapTakeInputAction({ pinId: id })
}

export const wrapRemovePinDataAction = (data: UnitRemovePinDataData) => {
  return {
    type: REMOVE_PIN_DATA,
    data,
  }
}

export const makeRemovePinDataAction = (type: IO, pinId: string) => {
  return wrapRemovePinDataAction({ type, pinId })
}
