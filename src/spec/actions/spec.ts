export const ADD_UNIT = 'addUnit'
export const ADD_UNITS = 'addUnits'
export const REMOVE_UNIT = 'removeUnit'
export const REMOVE_UNITS = 'removeUnits'
export const ADD_MERGE = 'addMerge'
export const ADD_MERGES = 'addMerges'
export const ADD_PIN_TO_MERGE = 'addPinToMerge'
export const REMOVE_PIN_FROM_MERGE = 'removePinFromMerge'
export const REMOVE_MERGE = 'removeMerge'
export const REMOVE_MERGES = 'removeMerges'
export const MERGE_MERGES = 'mergeMerges'
export const EXPOSE_PIN = 'exposePin'
export const EXPOSE_PIN_SET = 'exposePinSet'
export const COVER_PIN_SET = 'coverPinSet'
export const COVER_PIN = 'coverPin'
export const UNPLUG_PIN = 'unplugPin'
export const PLUG_PIN = 'plugPin'
export const TOGGLE_EXPOSE_INPUT = 'toggleExposeInput'
export const TOGGLE_EXPOSE_OUTPUT = 'toggleExposeOutput'
export const SET_UNIT_INPUT = 'setUnitInput'
export const SET_UNIT_OUTPUT = 'setUnitOutput'
export const SET_UNIT_OUTPUT_CONSTANT = 'setUnitOutputConstant'
export const SET_UNIT_PIN_DATA = 'setUnitPinData'
export const REMOVE_UNIT_PIN_DATA = 'removeUnitPinData'
export const SET_UNIT_INPUT_CONSTANT = 'setUnitInputConstant'
export const SET_UNIT_PIN_IGNORED = 'setUnitPinIgnored'
export const SET_UNIT_INPUT_IGNORED = 'setUnitInputIgnored'
export const SET_UNIT_OUTPUT_IGNORED = 'setUnitOutputIgnored'
export const SET_UNIT_ERR = 'setUnitErr'
export const SET_PIN_SET_NAME = 'setPinSetName'
export const SET_PIN_SET_FUNCTIONAL = 'setPinSetFunctional'
export const SET_PIN_SET_REF = 'setPinSetRef'
export const SET_METADATA = 'setMetadata'
export const SET_UNIT_METADATA = 'setUnitMetadata'
export const REMOVE_UNIT_MERGES = 'removeUnitMerges'
export const EXPAND_UNIT = 'expandUnit'
export const COLLAPSE_UNITS = 'collapseUnits'
import { Position } from '../../client/util/geometry'
import {
  Action,
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '../../types'
import { Dict } from '../../types/Dict'
import { IO } from '../../types/IO'

export const addUnit = (
  id: string,
  unit: GraphUnitSpec,
  position: Position,
  pinPosition: { input: Dict<Position>; output: Dict<Position> },
  layoutPositon: Position,
  parentId: string | null
) => {
  return {
    type: ADD_UNIT,
    data: {
      id,
      unit,
      position,
      pinPosition,
      layoutPositon,
      parentId,
    },
  }
}

export const addUnits = (units: GraphUnitsSpec) => {
  return {
    type: ADD_UNITS,
    data: {
      units,
    },
  }
}

export const removeUnit = (
  id: string,
  unit: GraphUnitSpec,
  position: Position,
  pinPosition: { input: Dict<Position>; output: Dict<Position> },
  layoutPositon: Position,
  parentId: string | null
) => {
  return {
    type: REMOVE_UNIT,
    data: { id, unit, position, pinPosition, layoutPositon, parentId },
  }
}

export const removeUnits = (ids: string[]) => {
  return {
    type: REMOVE_UNITS,
    data: { ids },
  }
}

export const exposePin = (
  type: IO,
  id: string,
  subPinId: string,
  subPin: GraphExposedSubPinSpec
) => {
  return {
    type: EXPOSE_PIN,
    data: { type, id, subPinId, subPin },
  }
}

export const setPinSetName = (type: IO, id: string, functional: boolean) => {
  return {
    type: SET_PIN_SET_NAME,
    data: { type, id, functional },
  }
}

export const setPinSetFunctional = (
  type: IO,
  id: string,
  functional: boolean
) => {
  return {
    type: SET_PIN_SET_FUNCTIONAL,
    data: { type, id, functional },
  }
}

export const exposePinSet = (
  type: IO,
  id: string,
  pin: GraphExposedPinSpec
) => {
  return {
    type: EXPOSE_PIN_SET,
    data: { type, id, pin },
  }
}

export const coverPinSet = (type: IO, id: string) => {
  return {
    type: COVER_PIN_SET,
    data: { type, id },
  }
}

export const plugPin = (
  type: IO,
  id: string,
  subPinId: string,
  subPinSpec: GraphExposedSubPinSpec
) => {
  return {
    type: PLUG_PIN,
    data: { type, id, subPinId, subPinSpec },
  }
}

export const unplugPin = (type: IO, id: string, subPinId: string) => {
  return {
    type: UNPLUG_PIN,
    data: { type, id, subPinId },
  }
}

export const coverPin = (id: string, type: IO, subPinId: string) => {
  return {
    type: COVER_PIN,
    data: { type, id, subPinId },
  }
}

export const setUnitPinData = (
  unitId: string,
  type: IO,
  pinId: string,
  data: any
) => {
  return {
    type: SET_UNIT_PIN_DATA,
    data: {
      unitId,
      type,
      pinId,
      data,
    },
  }
}

export const setUnitOutputConstant = (
  unitId: string,
  pinId: string,
  constant: boolean
) => {
  return {
    type: SET_UNIT_OUTPUT,
    data: {
      unitId,
      pinId,
      constant,
    },
  }
}

export const setUnitInputConstant = (
  unitId: string,
  pinId: string,
  constant: boolean
) => {
  return {
    type: SET_UNIT_INPUT_CONSTANT,
    data: {
      unitId,
      pinId,
      constant,
    },
  }
}

export const setUnitPinIgnored = (
  unitId: string,
  type: IO,
  pinId: string,
  ignored: boolean
) => {
  return {
    type: SET_UNIT_PIN_IGNORED,
    data: {
      unitId,
      type,
      pinId,
      ignored,
    },
  }
}

export const setUnitInputIgnored = (
  unitId: string,
  pinId: string,
  ignored: boolean
) => {
  return {
    type: SET_UNIT_INPUT_IGNORED,
    data: {
      unitId,
      pinId,
      ignored,
    },
  }
}

export const setUnitOutputIgnored = (
  unitId: string,
  pinId: string,
  ignored: boolean
) => {
  return {
    type: SET_UNIT_OUTPUT_IGNORED,
    data: {
      unitId,
      pinId,
      ignored,
    },
  }
}

export const removeUnitPinData = (unitId: string, type: IO, pinId: string) => {
  return {
    type: REMOVE_UNIT_PIN_DATA,
    data: {
      unitId,
      type,
      pinId,
    },
  }
}

export const setUnitMetadata = (id: string, path: string[], value: any) => {
  return {
    type: SET_UNIT_METADATA,
    data: {
      id,
      path,
      value,
    },
  }
}

export const setMetadata = (path: string[], value: any) => {
  return {
    type: SET_METADATA,
    data: {
      path,
      value,
    },
  }
}

export const addMerge = (
  id: string,
  merge: GraphMergeSpec,
  position: Position
): Action => {
  return {
    type: ADD_MERGE,
    data: {
      id,
      merge,
      position,
    },
  }
}

export const removeMerge = (
  id: string,
  merge: GraphMergeSpec,
  position: Position
): Action => {
  return {
    type: REMOVE_MERGE,
    data: {
      id,
      merge,
      position,
    },
  }
}

export const addMerges = (merges: GraphMergesSpec): Action => {
  return {
    type: ADD_MERGES,
    data: {
      merges,
    },
  }
}

export const removeMerges = (ids: string[]): Action => {
  return {
    type: REMOVE_MERGES,
    data: {
      ids,
    },
  }
}

export const addPinToMerge = (
  id: string,
  type: IO,
  unitId: string,
  pinId: string
): Action => {
  return {
    type: ADD_PIN_TO_MERGE,
    data: {
      id,
      unitId,
      type,
      pinId,
    },
  }
}

export const removePinFromMerge = (
  id: string,
  type: IO,
  unitId: string,
  pinId: string
): Action => {
  return {
    type: REMOVE_PIN_FROM_MERGE,
    data: {
      id,
      unitId,
      type,
      pinId,
    },
  }
}

export const mergeMerges = (a: string, b: string): Action => {
  return {
    type: MERGE_MERGES,
    data: {
      a,
      b,
    },
  }
}

export const removeUnitMerges = (id: string): Action => {
  return {
    type: REMOVE_UNIT_MERGES,
    data: {
      id,
    },
  }
}

export const reverseAction = ({ type, data }: Action): Action => {
  switch (type) {
    case ADD_UNIT:
      return removeUnit(
        data.id,
        data,
        data.position,
        data.pinPosition,
        data.layoutPosition,
        data.parentId
      )
    case ADD_UNITS:
      return removeUnits(Object.keys(data.units))
    case REMOVE_UNIT:
      return addUnit(
        data.id,
        data.unit,
        data.position,
        data.pinPosition,
        data.layoutPosition,
        data.parentId
      )
    case REMOVE_UNITS:
      return addUnits(
        data.ids.reduce((acc, id) => {
          acc[id] = data.units[id]
          return acc
        }, {})
      )
    case REMOVE_UNIT_MERGES:
      return addMerges(data.merges)
    case ADD_MERGE:
      return removeMerge(data.id, data.merge, data.position)
    case ADD_MERGES:
      return removeMerges(Object.keys(data.merges))
    case ADD_PIN_TO_MERGE:
      return removePinFromMerge(data.id, data.type, data.unitId, data.pinId)
    case REMOVE_MERGE:
      return addMerge(data.id, data.merge, data.position)
    case REMOVE_PIN_FROM_MERGE:
      return addPinToMerge(data.id, data.type, data.unitId, data.pinId)
    case MERGE_MERGES:
      return mergeMerges(data.a, data.b)
    case EXPOSE_PIN_SET:
      return coverPinSet(data.type, data.id)
    case COVER_PIN_SET:
      return exposePinSet(data.type, data.id, data.pin)
    case PLUG_PIN:
      return unplugPin(data.type, data.id, data.subPinId)
    case UNPLUG_PIN:
      return plugPin(data.type, data.id, data.subPinId, data.subPinSpec)
    case SET_UNIT_INPUT_CONSTANT:
      return setUnitInputConstant(data.unitId, data.pinId, !data.constant)
    case SET_UNIT_OUTPUT_CONSTANT:
      return setUnitInputConstant(data.unitId, data.pinId, !data.constant)
    case SET_UNIT_INPUT_IGNORED:
      return setUnitInputIgnored(data.unitId, data.pinId, !data.ignored)
    case SET_UNIT_OUTPUT_IGNORED:
      return setUnitOutputIgnored(data.unitId, data.pinId, !data.ignored)
    default:
      throw new Error('Irreversible')
  }
}
