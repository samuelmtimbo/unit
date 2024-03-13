import { Position } from '../../client/util/geometry/types'
import { CodePathNotImplementedError } from '../../exception/CodePathNotImplemented'
import { keys } from '../../system/f/object/Keys/f'
import { GraphSubPinSpec } from '../../types'
import { Action } from '../../types/Action'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'

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
export const SET_UNIT_PIN_CONSTANT = 'setUnitPinConstant'
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

export const makeAddUnitAction = (
  id: string,
  unit: GraphUnitSpec,
  position: Position,
  pinPosition: IOOf<Dict<Position>>,
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

export const makeAddUnitsAction = (units: GraphUnitsSpec) => {
  return {
    type: ADD_UNITS,
    data: {
      units,
    },
  }
}

export const makeRemoveUnitAction = (
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

export const makeRemoveUnitsAction = (ids: string[]) => {
  return {
    type: REMOVE_UNITS,
    data: { ids },
  }
}

export const exposePinAction = (
  type: IO,
  id: string,
  subPinId: string,
  subPin: GraphSubPinSpec
) => {
  return {
    type: EXPOSE_PIN,
    data: { type, id, subPinId, subPin },
  }
}

export const setPinSetNameAction = (
  type: IO,
  id: string,
  functional: boolean
) => {
  return {
    type: SET_PIN_SET_NAME,
    data: { type, id, functional },
  }
}

export const setPinSetFunctionalAction = (
  type: IO,
  id: string,
  functional: boolean
) => {
  return {
    type: SET_PIN_SET_FUNCTIONAL,
    data: { type, id, functional },
  }
}

export const makeExposePinSetAction = (
  type: IO,
  id: string,
  pin: GraphPinSpec
) => {
  return {
    type: EXPOSE_PIN_SET,
    data: { type, id, pin },
  }
}

export const makeCoverPinSetAction = (type: IO, id: string) => {
  return {
    type: COVER_PIN_SET,
    data: { type, id },
  }
}

export const makePlugPinAction = (
  type: IO,
  id: string,
  subPinId: string,
  subPinSpec: GraphSubPinSpec
) => {
  return {
    type: PLUG_PIN,
    data: { type, id, subPinId, subPinSpec },
  }
}

export const makeUnplugPinAction = (type: IO, id: string, subPinId: string) => {
  return {
    type: UNPLUG_PIN,
    data: { type, id, subPinId },
  }
}

export const coverPinAction = (id: string, type: IO, subPinId: string) => {
  return {
    type: COVER_PIN,
    data: { type, id, subPinId },
  }
}

export const setUnitPinDataAction = (
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

export const setUnitOutputConstantAction = (
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

export const makeSetUnitPinConstantAction = (
  unitId: string,
  type: IO,
  pinId: string,
  constant: boolean
) => {
  return {
    type: SET_UNIT_PIN_CONSTANT,
    data: {
      unitId,
      type,
      pinId,
      constant,
    },
  }
}

export const makeSetUnitInputConstantAction = (
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

export const makeSetUnitOutputConstantAction = (
  unitId: string,
  pinId: string,
  constant: boolean
) => {
  return {
    type: SET_UNIT_OUTPUT_CONSTANT,
    data: {
      unitId,
      pinId,
      constant,
    },
  }
}

export const setUnitPinIgnoredAction = (
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

export const makeSetUnitPinIgnoredAction = (
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

export const makeSetUnitInputIgnoredAction = (
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

export const makeSetUnitOutputIgnoredAction = (
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

export const removeUnitPinDataAction = (
  unitId: string,
  type: IO,
  pinId: string
) => {
  return {
    type: REMOVE_UNIT_PIN_DATA,
    data: {
      unitId,
      type,
      pinId,
    },
  }
}

export const setUnitMetadataAction = (
  id: string,
  path: string[],
  value: any
) => {
  return {
    type: SET_UNIT_METADATA,
    data: {
      id,
      path,
      value,
    },
  }
}

export const setMetadataAction = (path: string[], value: any) => {
  return {
    type: SET_METADATA,
    data: {
      path,
      value,
    },
  }
}

export const makeAddMergeAction = (
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

export const makeRemoveMergeAction = (
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

export const makeAddMergesAction = (merges: GraphMergesSpec): Action => {
  return {
    type: ADD_MERGES,
    data: {
      merges,
    },
  }
}

export const makeRemoveMergesAction = (ids: string[]): Action => {
  return {
    type: REMOVE_MERGES,
    data: {
      ids,
    },
  }
}

export const makeAddPinToMergeAction = (
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

export const makeRemovePinFromMergeAction = (
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

export const makeMergeMergesAction = (a: string, b: string): Action => {
  return {
    type: MERGE_MERGES,
    data: {
      a,
      b,
    },
  }
}

export const makeRemoveUnitMergesAction = (id: string): Action => {
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
      return makeRemoveUnitAction(
        data.id,
        data,
        data.position,
        data.pinPosition,
        data.layoutPosition,
        data.parentId
      )
    case ADD_UNITS:
      return makeRemoveUnitsAction(keys(data.units))
    case REMOVE_UNIT:
      return makeAddUnitAction(
        data.id,
        data.unit,
        data.position,
        data.pinPosition,
        data.layoutPosition,
        data.parentId
      )
    case REMOVE_UNITS:
      return makeAddUnitsAction(
        data.ids.reduce((acc, id) => {
          acc[id] = data.units[id]
          return acc
        }, {})
      )
    case REMOVE_UNIT_MERGES:
      return makeAddMergesAction(data.merges)
    case ADD_MERGE:
      return makeRemoveMergeAction(data.id, data.merge, data.position)
    case ADD_MERGES:
      return makeRemoveMergesAction(keys(data.merges))
    case ADD_PIN_TO_MERGE:
      return makeRemovePinFromMergeAction(
        data.id,
        data.type,
        data.unitId,
        data.pinId
      )
    case REMOVE_MERGE:
      return makeAddMergeAction(data.id, data.merge, data.position)
    case REMOVE_PIN_FROM_MERGE:
      return makeAddPinToMergeAction(
        data.id,
        data.type,
        data.unitId,
        data.pinId
      )
    case MERGE_MERGES:
      return makeMergeMergesAction(data.a, data.b)
    case EXPOSE_PIN_SET:
      return makeCoverPinSetAction(data.type, data.id)
    case COVER_PIN_SET:
      return makeExposePinSetAction(data.type, data.id, data.plug)
    case PLUG_PIN:
      return makeUnplugPinAction(data.type, data.id, data.subPinId)
    case UNPLUG_PIN:
      return makePlugPinAction(
        data.type,
        data.id,
        data.subPinId,
        data.subPinSpec
      )
    case SET_UNIT_PIN_CONSTANT:
      return makeSetUnitPinConstantAction(
        data.unitId,
        data.type,
        data.pinId,
        !data.constant
      )
    case SET_UNIT_INPUT_CONSTANT:
      return makeSetUnitInputConstantAction(
        data.unitId,
        data.pinId,
        !data.constant
      )
    case SET_UNIT_OUTPUT_CONSTANT:
      return makeSetUnitOutputConstantAction(
        data.unitId,
        data.pinId,
        !data.constant
      )
    case SET_UNIT_INPUT_IGNORED:
      return makeSetUnitInputIgnoredAction(
        data.unitId,
        data.pinId,
        !data.ignored
      )
    case SET_UNIT_OUTPUT_IGNORED:
      return makeSetUnitOutputIgnoredAction(
        data.unitId,
        data.pinId,
        !data.ignored
      )
    case SET_UNIT_PIN_IGNORED:
      return makeSetUnitPinIgnoredAction(
        data.unitId,
        data.type,
        data.pinId,
        !data.ignored
      )
    default:
      throw new CodePathNotImplementedError()
  }
}
