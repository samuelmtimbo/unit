import { MoveMapping } from '../../Class/Graph/buildMoveMap'
import { Moves } from '../../Class/Graph/buildMoves'
import {
  Flags,
  GraphAddMergeData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphBulkEditData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphExposeUnitPinSetData,
  GraphMoveSubComponentRootData,
  GraphMoveSubGraphIntoData,
  GraphMoveSubGraphOutOfData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemoveMergeDataData,
  GraphRemovePinFromMergeData,
  GraphRemovePlugDataData,
  GraphRemoveUnitData,
  GraphRemoveUnitPinDataData,
  GraphSetComponentSizeData,
  GraphSetMergeDataData,
  GraphSetMetadataData,
  GraphSetPinMetadataData,
  GraphSetPinSetDefaultIgnoredData,
  GraphSetPinSetFunctionalData,
  GraphSetPinSetIdData,
  GraphSetPlugDataData,
  GraphSetSubComponentSizeData,
  GraphSetUnitIdData,
  GraphSetUnitMetadataData,
  GraphSetUnitPinConstantData,
  GraphSetUnitPinDataData,
  GraphSetUnitPinMetadataData,
  GraphSetUnitPinSetIdData,
  GraphSetUnitSizeData,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from '../../Class/Graph/interface'
import { Position } from '../../client/util/geometry/types'
import { GraphSubPinSpec, Specs } from '../../types'
import { Action } from '../../types/Action'
import { AllKeys } from '../../types/AllKeys'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitMerges } from '../../types/GraphUnitMerges'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { G, GraphSelection } from '../../types/interface/G'
import { U } from '../../types/interface/U'
import { clone } from '../../util/clone'
import { weakMerge } from '../../weakMerge'
import {
  appendRoot,
  moveSubComponentRoot,
  setSubComponent,
  setSubComponentSize,
} from '../reducers/component'
import {
  addMerge,
  addPinToMerge,
  addUnitSpec,
  coverPin,
  coverPinSet,
  exposePin,
  exposePinSet,
  plugPin,
  removeMerge,
  removePinFromMerge,
  removeUnit,
  removeUnitPinData,
  setComponentSize,
  setUnitPinConstant,
  setUnitPinData,
  setUnitSize,
  unplugPin,
} from '../reducers/spec'
import { getSpec, isComponentSpec } from '../util'
import { getPinSpec, getPlugCount, getSubPinSpec } from '../util/spec'

export const ADD_UNIT_SPEC = 'addUnitSpec'
export const ADD_UNIT = 'addUnit'
export const REMOVE_UNIT = 'removeUnit'
export const TAKE_UNIT_ERR = 'takeUnitErr'
export const ADD_MERGE = 'addMerge'
export const ADD_PIN_TO_MERGE = 'addPinToMerge'
export const REMOVE_PIN_FROM_MERGE = 'removePinFromMerge'
export const REMOVE_MERGE = 'removeMerge'
export const SET_MERGE_DATA = 'setMergeData'
export const REMOVE_MERGE_DATA = 'removeMergeData'
export const REMOVE_MERGES = 'removeMerges'
export const EXPOSE_PIN = 'exposePin'
export const EXPOSE_PIN_SET = 'exposePinSet'
export const COVER_PIN_SET = 'coverPinSet'
export const COVER_PIN = 'coverPin'
export const UNPLUG_PIN = 'unplugPin'
export const PLUG_PIN = 'plugPin'
export const SET_PLUG_DATA = 'setPlugData'
export const REMOVE_PLUG_DATA = 'removePlugData'
export const SET_UNIT_PIN_DATA = 'setUnitPinData'
export const SET_UNIT_PIN_SET_ID = 'setUnitPinSetId'
export const REMOVE_UNIT_PIN_DATA = 'removeUnitPinData'
export const SET_UNIT_PIN_CONSTANT = 'setUnitPinConstant'
export const SET_UNIT_PIN_IGNORED = 'setUnitPinIgnored'
export const EXPOSE_UNIT_PIN_SET = 'exposeUnitPinSet'
export const COVER_UNIT_PIN_SET = 'coverUnitPinSet'
export const SET_UNIT_ERR = 'setUnitErr'
export const SET_UNIT_ID = 'setUnitId'
export const SET_PIN_SET_ID = 'setPinSetId'
export const SET_PIN_SET_FUNCTIONAL = 'setPinSetFunctional'
export const SET_PIN_SET_DEFAULT_IGNORED = 'setPinSetDefaultIgnored'
export const SET_PIN_SET_REF = 'setPinSetRef'
export const SET_NAME = 'setName'
export const SET_METADATA = 'setMetadata'
export const SET_UNIT_METADATA = 'setUnitMetadata'
export const SET_PIN_METADATA = 'setPinMetadata'
export const SET_UNIT_PIN_METADATA = 'setUnitPinMetadata'
export const BULK_EDIT = 'bulkEdit'
export const EXPAND_UNIT = 'expandUnit'
export const COLLAPSE_UNITS = 'collapseUnits'
export const MOVE_SUBGRAPH_INTO = 'moveSubgraphInto'
export const MOVE_SUBGRAPH_OUT_OF = 'moveSubgraphOutOf'
export const SET_UNIT_SIZE = 'setUnitSize'
export const SET_COMPONENT_SIZE = 'setComponentSize'
export const SET_SUB_COMPONENT_SIZE = 'setSubComponentSize'

export const wrapAddUnitAction = (data: GraphAddUnitData) => {
  return {
    type: ADD_UNIT_SPEC,
    data,
  }
}

export const makeAddUnitAction = (
  unitId: string,
  bundle: UnitBundleSpec,
  merges?: GraphUnitMerges | null,
  plugs?: GraphUnitPlugs | null,
  parentId?: string | null | null,
  parentSlot?: string | null,
  parentIndex?: number | null,
  children?: string[] | null,
  childrenSlot?: Dict<string> | null,
  position?: Position | null,
  pinPosition?: IOOf<Dict<Position>> | null,
  layoutPosition?: Position | null
) => {
  return wrapAddUnitAction({
    unitId,
    bundle,
    position,
    pinPosition,
    layoutPosition,
    parentId,
    parentSlot,
    parentIndex,
    children,
    childrenSlot,
    merges,
    plugs,
  })
}

export const wrapMoveSubgraphIntoData = (data: GraphMoveSubGraphIntoData) => {
  return {
    type: MOVE_SUBGRAPH_INTO,
    data,
  }
}

export const wrapMoveSubgraphOutOfData = (data: GraphMoveSubGraphOutOfData) => {
  return {
    type: MOVE_SUBGRAPH_OUT_OF,
    data,
  }
}

export const makeMoveSubgraphIntoAction = (
  graphId: string,
  spec: GraphSpec,
  selection: GraphSelection,
  mapping: MoveMapping,
  moves: Moves
) => {
  return wrapMoveSubgraphIntoData({
    graphId,
    spec,
    selection,
    moves,
    mapping,
  })
}

export const makeMoveSubgraphOutOfAction = (
  graphId: string,
  spec: GraphSpec,
  selection: GraphSelection,
  mapping: MoveMapping,
  moves: Moves
) => {
  return wrapMoveSubgraphOutOfData({
    graphId,
    spec,
    selection,
    moves,
    mapping,
  })
}

export const wrapMakeRemoveUnitAction = (data: GraphRemoveUnitData) => {
  return {
    type: REMOVE_UNIT,
    data,
  }
}

export const wrapMakeTakeUnitErrAction = (data: GraphTakeUnitErrData) => {
  return {
    type: TAKE_UNIT_ERR,
    data,
  }
}

export const makeRemoveUnitAction = (
  unitId: string,
  bundle: UnitBundleSpec,
  merges?: GraphMergesSpec,
  plugs?: GraphUnitPlugs,
  parentId?: string | null,
  parentSlot?: string | null,
  parentIndex?: number,
  children?: string[],
  childrenSlot?: Dict<string>,
  position?: Position,
  pinPosition?: IOOf<Dict<Position>>,
  layoutPosition?: Position
) => {
  return wrapMakeRemoveUnitAction({
    unitId,
    bundle,
    position,
    pinPosition,
    layoutPosition,
    parentId,
    parentSlot,
    parentIndex,
    children,
    childrenSlot,
    merges,
    plugs,
  })
}

export const makeTakeUnitErrAction = (unitId: string) => {
  return wrapMakeTakeUnitErrAction({
    unitId,
  })
}

export const wrapExposePinAction = (data: GraphExposePinData) => {
  return {
    type: EXPOSE_PIN,
    data,
  }
}

export const makeExposePinAction = (
  type: IO,
  pinId: string,
  subPinId: string,
  subPinSpec: GraphSubPinSpec
) => {
  return wrapExposePinAction({ type, pinId, subPinId, subPinSpec })
}

export const makeSetPinSetIdAction = (
  type: IO,
  pinId: string,
  newPinId: string
) => {
  return wrapSetPinSetIdAction({ type, pinId, newPinId })
}

export const wrapSetPinSetIdAction = (data: GraphSetPinSetIdData) => {
  return {
    type: SET_PIN_SET_ID,
    data,
  }
}

export const makeSetPinSetFunctionalAction = (
  type: IO,
  pinId: string,
  functional: boolean
) => {
  return wrapSetPinSetFunctionalAction({ type, pinId, functional })
}

export const makeSetUnitIdAction = (
  unitId: string,
  newUnitId: string,
  name: string,
  lastName: string,
  specId: string,
  lastSpecId: string
) => {
  return wrapSetUnitIdAction({
    unitId,
    newUnitId,
    name,
    lastName,
    specId,
    lastSpecId,
  })
}

export const wrapSetUnitIdAction = (data: GraphSetUnitIdData) => {
  return {
    type: SET_UNIT_ID,
    data,
  }
}

export const wrapSetPinSetFunctionalAction = (
  data: GraphSetPinSetFunctionalData
) => {
  return {
    type: SET_PIN_SET_DEFAULT_IGNORED,
    data,
  }
}

export const makeSetPinSetDefaultIgnoredAction = (
  type: IO,
  pinId: string,
  defaultIgnored: boolean
) => {
  return wrapSetPinSetDefaultIgnoredAction({ type, pinId, defaultIgnored })
}

export const wrapSetPinSetDefaultIgnoredAction = (
  data: GraphSetPinSetDefaultIgnoredData
) => {
  return {
    type: SET_PIN_SET_DEFAULT_IGNORED,
    data,
  }
}

export const wrapExposeUnitPinSet = (data: GraphExposeUnitPinSetData) => {
  return {
    type: EXPOSE_UNIT_PIN_SET,
    data,
  }
}

export const makeExposeUnitPinSetAction = (
  unitId: string,
  type: IO,
  pinId: string,
  pinSpec: GraphPinSpec,
  position?: Position
) => {
  return wrapExposeUnitPinSet({ type, unitId, pinId, pinSpec, position })
}

export const wrapExposePinSetAction = (data: GraphExposePinSetData) => {
  return {
    type: EXPOSE_PIN_SET,
    data,
  }
}

export const wrapCoverUnitPinSet = (data: GraphCoverUnitPinSetData) => {
  return {
    type: COVER_UNIT_PIN_SET,
    data,
  }
}

export const makeCoverUnitPinSetAction = (
  unitId: string,
  type: IO,
  pinId: string,
  pinSpec: GraphPinSpec,
  position?: Position
) => {
  return wrapCoverUnitPinSet({ type, unitId, pinId, pinSpec, position })
}

export const makeExposePinSetAction = (
  type: IO,
  pinId: string,
  pinSpec: GraphPinSpec,
  data?: string,
  flags?: Flags
) => {
  return wrapExposePinSetAction({ type, pinId, pinSpec, data, ...flags })
}

export const wrapCoverPinSetAction = (data: GraphCoverPinSetData) => {
  return {
    type: COVER_PIN_SET,
    data,
  }
}

export const makeCoverPinSetAction = (
  type: IO,
  pinId: string,
  pinSpec: GraphPinSpec
) => {
  return wrapCoverPinSetAction({ type, pinId, pinSpec })
}

export const wrapPlugPinAction = (data: GraphPlugPinData) => {
  return {
    type: PLUG_PIN,
    data,
  }
}

export const makePlugPinAction = (
  type: IO,
  pinId: string,
  subPinId: string,
  subPinSpec: GraphSubPinSpec
) => {
  return wrapPlugPinAction({ type, pinId, subPinId, subPinSpec })
}

export const wrapUnplugPinAction = (data: GraphUnplugPinData) => {
  return {
    type: UNPLUG_PIN,
    data,
  }
}

export const makeUnplugPinAction = (
  type: IO,
  pinId: string,
  subPinId: string,
  subPinSpec: GraphSubPinSpec,
  take?: boolean
) => {
  return wrapUnplugPinAction({ type, pinId, subPinId, subPinSpec, take })
}

export const wrapCoverPinAction = (data: GraphCoverPinData) => {
  return {
    type: COVER_PIN,
    data,
  }
}

export const makeCoverPinAction = (
  type: IO,
  pinId: string,
  subPinId: string,
  subPinSpec: GraphSubPinSpec,
  pinSpec?: GraphPinSpec
) => {
  return wrapCoverPinAction({ type, pinId, subPinId, subPinSpec, pinSpec })
}

export const makeCoverPinOrSetAction = (
  spec: GraphSpec,
  type: IO,
  pinId: string,
  subPinId: string
) => {
  const pin = getPinSpec(spec, type, pinId)
  const subPin = getSubPinSpec(spec, type, pinId, subPinId)
  const subPinCount = getPlugCount(spec, type, pinId)

  if (subPinCount > 1) {
    return makeCoverPinAction(type, pinId, subPinId, subPin)
  } else {
    return makeCoverPinSetAction(type, pinId, pin)
  }
}

export const makeSetPlugDataAction = (
  type: IO,
  pinId: string,
  subPinId: string,
  data: string,
  lastData: string
) => {
  return wrapSetPlugDataAction({
    type,
    pinId,
    subPinId,
    data,
    lastData,
  })
}

export const wrapSetPlugDataAction = (data: GraphSetPlugDataData) => {
  return {
    type: SET_PLUG_DATA,
    data,
  }
}

export const makeRemovePlugDataAction = (
  type: IO,
  pinId: string,
  subPinId: string,
  data: any
) => {
  return wrapSetPlugDataAction({
    type,
    pinId,
    subPinId,
    data,
  })
}

export const wrapRemovePlugDataAction = (data: GraphRemovePlugDataData) => {
  return {
    type: REMOVE_PLUG_DATA,
    data,
  }
}

export const wrapSetUnitPinDataAction = (data: GraphSetUnitPinDataData) => {
  return {
    type: SET_UNIT_PIN_DATA,
    data,
  }
}

export const makeSetUnitPinSetIdAction = (
  unitId: string,
  type: IO,
  pinId: string,
  newPinId: string
) => {
  return wrapSetUnitPinSetIdAction({
    unitId,
    type,
    pinId,
    newPinId,
  })
}

export const wrapSetUnitPinSetIdAction = (data: GraphSetUnitPinSetIdData) => {
  return {
    type: SET_UNIT_PIN_SET_ID,
    data,
  }
}

export const makeSetUnitPinDataAction = (
  unitId: string,
  type: IO,
  pinId: string,
  data: any
) => {
  return wrapSetUnitPinDataAction({
    unitId,
    type,
    pinId,
    data,
  })
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

export const wrapRemoveUnitPinDataAction = (
  data: GraphRemoveUnitPinDataData
) => {
  return {
    type: REMOVE_UNIT_PIN_DATA,
    data,
  }
}

export const makeRemoveUnitPinDataAction = (
  unitId: string,
  type: IO,
  pinId: string,
  data: string
) => {
  return wrapRemoveUnitPinDataAction({
    unitId,
    type,
    pinId,
    data,
  })
}

export const wrapSetUnitMetadataAction = (data: GraphSetUnitMetadataData) => {
  return {
    type: SET_UNIT_METADATA,
    data,
  }
}

export const makeSetUnitMetadataAction = (
  unitId: string,
  path: string[],
  data: any
) => {
  return wrapSetUnitMetadataAction({
    unitId,
    path_: path,
    value: data,
  })
}

export const wrapSetUnitSizeAction = (data: GraphSetUnitSizeData) => {
  return {
    type: SET_UNIT_SIZE,
    data,
  }
}

export const makeSetUnitSizeAction = (
  unitId: string,
  width: number,
  height: number,
  prevWidth: number,
  prevHeight: number
) => {
  return wrapSetUnitSizeAction({
    unitId,
    width,
    height,
    prevWidth,
    prevHeight,
  })
}

export const makeSetSubComponentSizeAction = (
  unitId: string,
  width: number,
  height: number,
  prevWidth: number,
  prevHeight: number
) => {
  return wrapSetSubComponentSizeAction({
    unitId,
    width,
    height,
    prevWidth,
    prevHeight,
  })
}

export const wrapSetSubComponentSizeAction = (
  data: GraphSetSubComponentSizeData
) => {
  return {
    type: SET_SUB_COMPONENT_SIZE,
    data,
  }
}

export const wrapSetComponentSizeAction = (data: GraphSetComponentSizeData) => {
  return {
    type: SET_COMPONENT_SIZE,
    data,
  }
}

export const makeSetComponentSizeAction = (
  width: number,
  height: number,
  prevWidth: number,
  prevHeight: number
) => {
  return wrapSetComponentSizeAction({
    width,
    height,
    prevWidth,
    prevHeight,
  })
}

export const makeSetNameAction = (path: string[], name: string) => {
  return {
    type: SET_METADATA,
    data: {
      path,
      name,
    },
  }
}

export const wrapSetMetadataAction = (data: GraphSetMetadataData) => {
  return {
    type: SET_METADATA,
    data,
  }
}

export const makeSetMetadataAction = (path_: string[], value: any) => {
  return wrapSetMetadataAction({ path_, value })
}

export const wrapSetPinMetadataAction = (data: GraphSetPinMetadataData) => {
  return {
    type: SET_PIN_METADATA,
    data,
  }
}

export const makeSetPinMetadataAction = (
  type: IO,
  pinId: string,
  path_: string[],
  value: any
) => {
  return wrapSetPinMetadataAction({
    type,
    pinId,
    path_,
    value,
  })
}

export const wrapSetUnitPinMetadataAction = (
  data: GraphSetUnitPinMetadataData
) => {
  return {
    type: SET_UNIT_PIN_METADATA,
    data,
  }
}

export const makeSetUnitPinMetadataAction = (
  unitId: string,
  type: IO,
  pinId: string,
  path_: string[],
  value: any
) => {
  return wrapSetUnitPinMetadataAction({
    unitId,
    type,
    pinId,
    path_,
    value,
  })
}

export const wrapAddMergeActionData = (data: GraphAddMergeData) => {
  return {
    type: ADD_MERGE,
    data,
  }
}

export const makeAddMergeAction = (
  mergeId: string,
  mergeSpec: GraphMergeSpec,
  position?: Position | undefined
): Action => {
  return wrapAddMergeActionData({
    mergeId,
    mergeSpec,
    position,
  })
}

export const wrapRemoveMergeActionData = (data: GraphRemoveMergeData) => {
  return {
    type: REMOVE_MERGE,
    data,
  }
}

export const makeRemoveMergeAction = (
  mergeId: string,
  mergeSpec: GraphMergeSpec,
  position?: Position | undefined
): Action => {
  return wrapRemoveMergeActionData({
    mergeId,
    mergeSpec,
    position,
  })
}

export const makeSetMergeDataAction = (mergeId: string, data: string) => {
  return wrapSetMergeDataAction({
    mergeId,
    data,
  })
}

export const wrapSetMergeDataAction = (data: GraphSetMergeDataData) => {
  return {
    type: SET_MERGE_DATA,
    data,
  }
}

export const makeRemoveMergeDataAction = (mergeId: string, data: string) => {
  return wrapRemoveMergeDataAction({
    mergeId,
    data,
  })
}

export const wrapRemoveMergeDataAction = (data: GraphRemoveMergeDataData) => {
  return {
    type: REMOVE_MERGE_DATA,
    data,
  }
}

export const wrapAddPinToMergeData = (data: GraphAddPinToMergeData) => {
  return {
    type: ADD_PIN_TO_MERGE,
    data,
  }
}

export const makeAddPinToMergeAction = (
  mergeId: string,
  unitId: string,
  type: IO,
  pinId: string
): Action => {
  return wrapAddPinToMergeData({
    mergeId,
    unitId,
    type,
    pinId,
  })
}

export const wrapRemovePinFromMergeData = (
  data: GraphRemovePinFromMergeData
) => {
  return {
    type: REMOVE_PIN_FROM_MERGE,
    data,
  }
}

export const makeRemovePinFromMergeAction = (
  mergeId: string,
  unitId: string,
  type: IO,
  pinId: string
): Action => {
  return wrapRemovePinFromMergeData({
    mergeId,
    unitId,
    type,
    pinId,
  })
}

export const wrapBulkEditData = (data: GraphBulkEditData) => {
  return {
    type: BULK_EDIT,
    data,
  }
}

export const makeBulkEditAction = (actions: Action[]): Action => {
  return wrapBulkEditData({
    actions,
  })
}

export const processAction = (
  self: any,
  action: Action,
  method: Partial<AllKeys<G & U, Function>>,
  fallback?: (data: any) => void
): void => {
  const { type, data } = action

  if (!method[type] && !fallback) {
    throw new Error(`no method for ${type}`)
  }

  ;(method[type] ?? fallback).call(self, data)
}

export const act = (
  specs: Specs,
  spec: GraphSpec,
  type: string,
  data: object
) => {
  ;({
    coverPinSet: (data: GraphCoverPinSetData) => {
      coverPinSet(data, spec)
    },
    exposePinSet: (data: GraphExposePinSetData) => {
      exposePinSet(data, spec)
    },
    addUnitSpec: (data: GraphAddUnitData) => {
      addUnitSpec(data, spec)

      const { unitId } = data

      const specs_ = weakMerge(specs, data.bundle.specs ?? {})

      const unitSpec = getSpec(specs_, data.bundle.unit.id)

      if (isComponentSpec(unitSpec)) {
        setSubComponent({ unitId, subComponent: {} }, spec.component)
        appendRoot({ childId: unitId }, spec.component)
      }
    },
    removeUnit: (data: GraphRemoveUnitData) => {
      removeUnit(data, spec)
    },
    addMerge: (data: GraphAddMergeData) => {
      addMerge(data, spec)
    },
    removeMerge: (data: GraphRemoveMergeData) => {
      removeMerge(data, spec)
    },
    removeUnitPinData: (data: GraphRemoveUnitPinDataData) => {
      removeUnitPinData(data, spec)
    },
    addPinToMerge: (data: GraphAddPinToMergeData) => {
      addPinToMerge(data, spec)
    },
    coverPin: (data: GraphCoverPinData) => {
      coverPin(data, spec)
    },
    exposePin: (data: GraphExposePinData) => {
      exposePin(data, spec)
    },
    unplugPin: (data: GraphUnplugPinData) => {
      unplugPin(data, spec)
    },
    plugPin: (data: GraphPlugPinData) => {
      plugPin(data, spec)
    },
    setSubComponentSize: (data: GraphSetSubComponentSizeData) => {
      setSubComponentSize(data, spec.component)
    },
    setUnitSize: (data: GraphSetUnitSizeData) => {
      setUnitSize(data, spec)
    },
    setUnitPinData: (data: GraphSetUnitPinDataData) => {
      setUnitPinData(data, spec, {}, {})
    },
    setComponentSize: (data: GraphSetComponentSizeData) => {
      setComponentSize(data, spec)
    },
    moveSubComponentRoot: (data: GraphMoveSubComponentRootData) => {
      moveSubComponentRoot(data, spec.component)
    },
    removePinFromMerge: (data: GraphRemovePinFromMergeData) => {
      removePinFromMerge(data, spec)
    },
    setUnitPinConstant: (data: GraphSetUnitPinConstantData) => {
      setUnitPinConstant(data, spec)
    },
    setPlugData: (data: GraphSetPlugDataData) => {
      //
    },
  })[type](data)
}

export const processActions = (
  self: any,
  actions: Action[],
  method: Partial<AllKeys<G, Function>>,
  fallback?: (data: any) => void
): void => {
  actions.forEach((action) => processAction(self, action, method, fallback))
}

export const bulkEdit = (spec_: GraphSpec, actions: Action[]): GraphSpec => {
  const spec = clone(spec_)

  bulkEdit(spec, actions)

  return spec
}

export const bulkEdit_ = (
  specs: Specs,
  spec: GraphSpec,
  actions: Action[]
): void => {
  for (const action of actions) {
    act(specs, spec, action.type, clone(action.data))
  }
}
