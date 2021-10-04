export const SET_SPEC = 'setSpec'
export const SET_NAME = 'setName'
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

import {
  Action,
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '../../types'
import { None } from '../../types/None'

export const setSpec = (spec: GraphSpec) => ({
  type: SET_SPEC,
  data: {
    spec,
  },
})

export const setName = (name: string) => {
  return {
    type: SET_NAME,
    data: { name },
  }
}

export const addUnit = (id: string, unit: GraphUnitSpec) => {
  return {
    type: ADD_UNIT,
    data: {
      id,
      unit,
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

export const removeUnit = (id: string) => {
  return {
    type: REMOVE_UNIT,
    data: { id },
  }
}

export const removeUnits = (ids: string[]) => {
  return {
    type: REMOVE_UNITS,
    data: { ids },
  }
}

export const exposePin = (
  type: 'input' | 'output',
  id: string,
  subPinId: string,
  subPin: GraphExposedSubPinSpec
) => {
  return {
    type: EXPOSE_PIN,
    data: { type, id, subPinId, subPin },
  }
}

export const setPinSetName = (
  type: 'input' | 'output',
  id: string,
  functional: boolean
) => {
  return {
    type: SET_PIN_SET_NAME,
    data: { type, id, functional },
  }
}

export const setPinSetFunctional = (
  type: 'input' | 'output',
  id: string,
  functional: boolean
) => {
  return {
    type: SET_PIN_SET_FUNCTIONAL,
    data: { type, id, functional },
  }
}

export const exposePinSet = (
  type: 'input' | 'output',
  id: string,
  pin: GraphExposedPinSpec
) => {
  return {
    type: EXPOSE_PIN_SET,
    data: { type, id, pin },
  }
}

export const coverPinSet = (type: 'input' | 'output', id: string) => {
  return {
    type: COVER_PIN_SET,
    data: { type, id },
  }
}

export const plugPin = (
  type: 'input' | 'output',
  id: string,
  subPinId: string,
  subPinSpec: GraphExposedSubPinSpec
) => {
  return {
    type: PLUG_PIN,
    data: { type, id, subPinId, subPinSpec },
  }
}

export const unplugPin = (
  type: 'input' | 'output',
  id: string,
  subPinId: string
) => {
  return {
    type: UNPLUG_PIN,
    data: { type, id, subPinId },
  }
}

export const coverPin = (
  id: string,
  type: 'input' | 'output',
  subPinId: string
) => {
  return {
    type: COVER_PIN,
    data: { type, id, subPinId },
  }
}

export const setUnitPinData = (
  unitId: string,
  type: 'input' | 'output',
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
  type: 'input' | 'output',
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

export const setUnitErr = (unitId: string, err: string | None) => {
  return {
    type: SET_UNIT_ERR,
    data: {
      unitId,
      err,
    },
  }
}

export const removeUnitPinData = (
  unitId: string,
  type: 'input' | 'output',
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

export const addMerge = (id: string, merge: GraphMergeSpec): Action => {
  return {
    type: ADD_MERGE,
    data: {
      id,
      merge,
    },
  }
}

export const removeMerge = (id: string): Action => {
  return {
    type: REMOVE_MERGE,
    data: {
      id,
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
  type: 'input' | 'output',
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
  type: 'input' | 'output',
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

// TODO
// export const reverseAction = (
//   { type, data }: Action,
//   spec: GraphSpec
// ): Action => {
//   switch (type) {
//     case SET_SPEC:
//       return setSpec(spec)
//     case SET_NAME:
//       return setName(spec.name)
//     case ADD_UNIT:
//       return removeUnit(data.id)
//     case ADD_UNITS:
//       return removeUnits(Object.keys(data.units))
//     case REMOVE_UNIT:
//       return addUnit(data.id, spec.units[data.id])
//     case REMOVE_UNITS:
//       return addUnits(
//         data.ids.reduce((acc, id) => {
//           acc[id] = spec.units[id]
//           return acc
//         }, {})
//       )
//     case REMOVE_UNIT_MERGES:
//       return addMerges(spec.merges)
//     case ADD_MERGE:
//       return removeMerge(data.id)
//     case ADD_MERGES:
//       return removeMerges(Object.keys(data.merges))
//     case ADD_PIN_TO_MERGE:
//       return removePinFromMerge(data.id, data.type, data.unitId, data.pinId)
//     case REMOVE_MERGE:
//       return addMerge(data.id, spec.merges[data.id])
//     case REMOVE_PIN_FROM_MERGE:
//       return addPinToMerge(data.id, data.type, data.unitId, data.pinId)
//     case MERGE_MERGES:
//       return mergeMerges(data)
//     case EXPOSE_INPUT:
//       return coverInput(data.id)
//     case COVER_INPUT:
//       return exposeInput(data.id, spec.inputs[data.id])
//     case EXPOSE_OUTPUT:
//       return coverOutput(data.id)
//     case COVER_OUTPUT:
//       return exposeOutput(data.id, spec.outputs[data.id])
//     case SET_UNIT_ERR:
//       return setUnitErr(data.unitId, spec.units[data.unitId].err)
//     case SET_UNIT_INPUT:
//       return setUnitInput(data)
//     case SET_UNIT_OUTPUT:
//       return setUnitOutput(data)
//     case SET_UNIT_PIN_DATA:
//       return setUnitPinData(data)
//     case REMOVE_UNIT_PIN_DATA:
//       return removeUnitPinData(data)
//     case SET_UNIT_INPUT_CONSTANT:
//       return setUnitInputConstant(data)
//     case SET_UNIT_OUTPUT_CONSTANT:
//       return setUnitOutputConstant(data)
//     case SET_UNIT_INPUT_IGNORED:
//       return setUnitInputIgnored(data)
//     case SET_UNIT_OUTPUT_IGNORED:
//       return setUnitOutputIgnored(data)
//     case SET_INPUT_NAME:
//       return setInputName(data)
//     case SET_OUTPUT_NAME:
//       return setOutputName(data)
//     case SET_METADATA:
//       return setMetadata(data)
//     case SET_UNIT_METADATA:
//       return setUnitMetadata(data)
//     case EXPAND_UNIT:
//       return expandUnit(data)
//     case COLLAPSE_UNITS:
//       return collapseUnits(data)
//   }
// }
