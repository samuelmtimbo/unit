import {
  GraphAddMergeData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphBulkEditData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExplodeUnitData,
  GraphExposePinSetData,
  GraphExposeUnitPinSetData,
  GraphMoveSubGraphIntoData,
  GraphMoveSubGraphOutOfData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemoveMergeDataData,
  GraphRemovePinFromMergeData,
  GraphRemoveUnitData,
  GraphRemoveUnitPinDataData,
  GraphSetComponentSizeData,
  GraphSetSubComponentSizeData,
  GraphSetUnitMetadataData,
  GraphSetUnitPinDataData,
  GraphSetUnitSizeData,
  GraphUnplugPinData,
} from '../../Class/Graph/interface'
import { Position } from '../../client/util/geometry'
import { keys } from '../../system/f/object/Keys/f'
import {
  Action,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphSubPinSpec,
  GraphUnitsSpec,
} from '../../types'
import { AllKeys } from '../../types/AllKeys'
import { Dict } from '../../types/Dict'
import { G } from '../../types/interface/G'
import { U } from '../../types/interface/U'
import { IO } from '../../types/IO'
import { _IOOf, IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import {
  makeMoveSubComponentRootAction,
  makeReorderSubComponentAction,
  MOVE_SUB_COMPONENT_ROOT,
  REORDER_SUB_COMPONENT,
} from './C'

export const ADD_UNIT = 'addUnitSpec'
export const ADD_UNITS = 'addUnits'
export const REMOVE_UNIT = 'removeUnit'
export const REMOVE_UNITS = 'removeUnits'
export const ADD_MERGE = 'addMerge'
export const ADD_MERGES = 'addMerges'
export const ADD_PIN_TO_MERGE = 'addPinToMerge'
export const REMOVE_PIN_FROM_MERGE = 'removePinFromMerge'
export const REMOVE_MERGE = 'removeMerge'
export const REMOVE_MERGE_DATA = 'removeMergeData'
export const REMOVE_MERGES = 'removeMerges'
export const EXPOSE_PIN = 'exposePin'
export const EXPOSE_PIN_SET = 'exposePinSet'
export const COVER_PIN_SET = 'coverPinSet'
export const COVER_PIN = 'coverPin'
export const UNPLUG_PIN = 'unplugPin'
export const PLUG_PIN = 'plugPin'
export const SET_UNIT_PIN_DATA = 'setUnitPinData'
export const REMOVE_UNIT_PIN_DATA = 'removeUnitPinData'
export const SET_UNIT_PIN_CONSTANT = 'setUnitPinConstant'
export const SET_UNIT_PIN_IGNORED = 'setUnitPinIgnored'
export const EXPOSE_UNIT_PIN_SET = 'exposeUnitPinSet'
export const COVER_UNIT_PIN_SET = 'coverUnitPinSet'
export const SET_UNIT_ERR = 'setUnitErr'
export const SET_PIN_SET_NAME = 'setPinSetName'
export const SET_PIN_SET_FUNCTIONAL = 'setPinSetFunctional'
export const SET_PIN_SET_REF = 'setPinSetRef'
export const SET_METADATA = 'setMetadata'
export const SET_UNIT_METADATA = 'setUnitMetadata'
export const BULK_EDIT = 'bulkEdit'
export const REMOVE_UNIT_MERGES = 'removeUnitMerges'
export const EXPAND_UNIT = 'expandUnit'
export const COLLAPSE_UNITS = 'collapseUnits'
export const MOVE_SUBGRAPH_INTO = 'moveSubgraphInto'
export const MOVE_SUBGRAPH_OUT_OF = 'moveSubgraphOutOf'
export const EXPLODE_UNIT = 'explodeUnit'
export const SET_UNIT_SIZE = 'setUnitSize'
export const SET_COMPONENT_SIZE = 'setComponentSize'
export const SET_SUB_COMPONENT_SIZE = 'setSubComponentSize'

export const wrapAddUnitAction = (data: GraphAddUnitData) => {
  return {
    type: ADD_UNIT,
    data,
  }
}

export const makeAddUnitAction = (
  unitId: string,
  bundle: UnitBundleSpec,
  position?: Position | undefined,
  pinPosition?: _IOOf<Dict<Position>> | undefined,
  layoutPositon?: Position | undefined,
  parentId?: string | null | undefined,
  merges?: GraphMergesSpec | undefined
) => {
  return wrapAddUnitAction({
    unitId,
    bundle,
    position,
    pinPosition,
    layoutPositon,
    parentId,
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
  nodeIds: {
    merge: string[]
    link: {
      unitId: string
      type: IO
      pinId: string
    }[]
    unit: string[]
    plug: {
      type: IO
      pinId: string
      subPinId: string
    }[]
  },
  nextIdMap: {
    merge: Dict<string>
    link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
    plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO; subPinId: string }>>>
    unit: Dict<string>
  },
  nextPinIdMap: Dict<{
    input: Dict<{
      pinId: string
      subPinId: string
      ref?: boolean
      defaultIgnored?: boolean
    }>
    output: Dict<{
      pinId: string
      subPinId: string
      ref?: boolean
      defaultIgnored?: boolean
    }>
  }>,
  nextUnitPinMergeMap: Dict<IOOf<Dict<string>>>,
  nextMergePinId: Dict<{
    input: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      ref?: boolean
    }
    output: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      ref?: boolean
    }
  }>,
  nextPlugSpec: {
    input: Dict<Dict<GraphSubPinSpec>>
    output: Dict<Dict<GraphSubPinSpec>>
  },
  nextSubComponentParentMap: Dict<string | null>,
  nextSubComponentChildrenMap: Dict<string[]>,
  nextSubComponentIndexMap: Dict<number>
) => {
  return wrapMoveSubgraphIntoData({
    graphId,
    nextSpecId: null,
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextUnitPinMergeMap,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
    nextSubComponentIndexMap,
  })
}

export const makeMoveSubgraphOutOfAction = (
  graphId: string,
  nodeIds: {
    merge: string[]
    link: {
      unitId: string
      type: IO
      pinId: string
    }[]
    unit: string[]
    plug: {
      type: IO
      pinId: string
      subPinId: string
    }[]
  },
  nextIdMap: {
    merge: Dict<string>
    link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
    plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO; subPinId: string }>>>
    unit: Dict<string>
  },
  nextUnitPinMergeMap: Dict<IOOf<Dict<string>>>,
  nextPinIdMap: Dict<{
    input: Dict<{
      pinId: string
      subPinId: string
      ref?: boolean
      defaultIgnored?: boolean
    }>
    output: Dict<{
      pinId: string
      subPinId: string
      ref?: boolean
      defaultIgnored?: boolean
    }>
  }>,
  nextMergePinId: Dict<{
    input: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      ref?: boolean
    }
    output: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      ref?: boolean
    }
  }>,
  nextPlugSpec: {
    input: Dict<Dict<GraphSubPinSpec>>
    output: Dict<Dict<GraphSubPinSpec>>
  },
  nextSubComponentParentMap: Dict<string | null>,
  nextSubComponentChildrenMap: Dict<string[]>,
  nextSubComponentIndexMap: Dict<number>
) => {
  return wrapMoveSubgraphOutOfData({
    graphId,
    nextSpecId: null,
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
    nextSubComponentIndexMap,
    nextUnitPinMergeMap,
  })
}

export const makeAddUnitsAction = (units: GraphUnitsSpec) => {
  return {
    type: ADD_UNITS,
    data: {
      units,
    },
  }
}

export const wrapMakeRemoveUnitAction = (data: GraphRemoveUnitData) => {
  return {
    type: REMOVE_UNIT,
    data,
  }
}

export const makeRemoveUnitAction = (
  unitId: string,
  bundle: UnitBundleSpec,
  position?: Position,
  pinPosition?: _IOOf<Dict<Position>>,
  layoutPositon?: Position,
  parentId?: string | null,
  merges?: GraphMergesSpec
) => {
  return wrapMakeRemoveUnitAction({
    unitId,
    bundle,
    position,
    pinPosition,
    layoutPositon,
    parentId,
    merges,
  })
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
  pinSpec: GraphPinSpec
) => {
  return wrapExposePinSetAction({ type, pinId, pinSpec })
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
  subPinSpec: GraphPinSpec
) => {
  return wrapUnplugPinAction({ type, pinId, subPinId, subPinSpec })
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
  subPinSpec: GraphSubPinSpec
) => {
  return wrapCoverPinAction({ type, pinId, subPinId, subPinSpec })
}

export const wrapSetUnitPinDataAction = (data: GraphSetUnitPinDataData) => {
  return {
    type: SET_UNIT_PIN_DATA,
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
    lastData: undefined,
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
  pinId: string
) => {
  return wrapRemoveUnitPinDataAction({
    unitId,
    type,
    pinId,
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
    path,
    data,
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
  height: number
) => {
  return wrapSetUnitSizeAction({
    unitId,
    width,
    height,
  })
}

export const makeSetSubComponentSizeAction = (
  unitId: string,
  width: number,
  height: number
) => {
  return wrapSetUnitSizeAction({
    unitId,
    width,
    height,
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

export const makeSetSubComponentSize = (
  unitId: string,
  width: number,
  height: number
) => {
  return wrapSetSubComponentSizeAction({
    unitId,
    width,
    height,
  })
}

export const wrapSetComponentSizeAction = (data: GraphSetComponentSizeData) => {
  return {
    type: SET_COMPONENT_SIZE,
    data,
  }
}

export const makeSetComponentSizeAction = (width: number, height: number) => {
  return wrapSetComponentSizeAction({
    width,
    height,
  })
}

export const makeSetMetadataAction = (path: string[], value: any) => {
  return {
    type: SET_METADATA,
    data: {
      path,
      value,
    },
  }
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

export const wrapRemoveMergeDataAction = (data: GraphRemoveMergeDataData) => {
  return {
    type: REMOVE_MERGE_DATA,
    data,
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

export const wrapAddPinToMergeData = (data: GraphAddPinToMergeData) => {
  return {
    type: ADD_PIN_TO_MERGE,
    data,
  }
}

export const makeAddPinToMergeAction = (
  mergeId: string,
  type: IO,
  unitId: string,
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
  type: IO,
  unitId: string,
  pinId: string
): Action => {
  return wrapRemovePinFromMergeData({
    mergeId,
    unitId,
    type,
    pinId,
  })
}

export const makeRemoveUnitMergesAction = (id: string): Action => {
  return {
    type: REMOVE_UNIT_MERGES,
    data: {
      id,
    },
  }
}

export const wrapExplodeUnitData = (data: GraphExplodeUnitData) => {
  return {
    type: EXPLODE_UNIT,
    data,
  }
}

export const makeExplodeUnitAction = (
  unitId: string,
  mapUnitId: Dict<string>,
  mapMergeId: Dict<string>
) => {
  return wrapExplodeUnitData({
    unitId,
    mapUnitId,
    mapMergeId,
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

export const reverseAction = ({ type, data }: Action): Action => {
  switch (type) {
    case ADD_UNIT:
      return makeRemoveUnitAction(
        data.unitId,
        data.bundle,
        data.position,
        data.pinPosition,
        data.layoutPosition,
        data.parentId,
        data.merges
      )
    case ADD_UNITS:
      return makeRemoveUnitsAction(keys(data.units))
    case REMOVE_UNIT:
      return makeAddUnitAction(
        data.unitId,
        data.bundle,
        data.position,
        data.pinPosition,
        data.layoutPosition,
        data.parentId,
        data.merges
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
      return makeRemoveMergeAction(data.mergeId, data.mergeSpec, data.position)
    case ADD_MERGES:
      return makeRemoveMergesAction(keys(data.merges))
    case ADD_PIN_TO_MERGE:
      return makeRemovePinFromMergeAction(
        data.mergeId,
        data.type,
        data.unitId,
        data.pinId
      )
    case REMOVE_MERGE:
      return makeAddMergeAction(data.mergeId, data.mergeSpec, data.position)
    case REMOVE_PIN_FROM_MERGE:
      return makeAddPinToMergeAction(
        data.mergeId,
        data.type,
        data.unitId,
        data.pinId
      )
    case EXPOSE_PIN_SET:
      return makeCoverPinSetAction(data.type, data.pinId, data.pin)
    case COVER_PIN_SET:
      return makeExposePinSetAction(data.type, data.pinId, data.plug)
    case PLUG_PIN:
      return makeUnplugPinAction(
        data.type,
        data.pinId,
        data.subPinId,
        data.subPinSpec
      )
    case UNPLUG_PIN:
      return makePlugPinAction(
        data.type,
        data.pinId,
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
    case SET_UNIT_PIN_DATA:
      return makeSetUnitPinDataAction(
        data.unitId,
        data.type,
        data.pinId,
        undefined
      )
    case SET_UNIT_PIN_IGNORED:
      return makeSetUnitPinIgnoredAction(
        data.unitId,
        data.type,
        data.pinId,
        !data.ignored
      )
    case EXPOSE_UNIT_PIN_SET:
      return makeCoverUnitPinSetAction(
        data.unitId,
        data.type,
        data.pinId,
        data.pinSpec
      )
    case COVER_UNIT_PIN_SET:
      return makeExposeUnitPinSetAction(
        data.unitId,
        data.type,
        data.pinId,
        data.pinSpec
      )
    case MOVE_SUB_COMPONENT_ROOT:
      return makeMoveSubComponentRootAction(
        data.nextParentId,
        data.parentId,
        data.children,
        data.nextSlotMap,
        data.slotMap
      )
    case REORDER_SUB_COMPONENT:
      return makeReorderSubComponentAction(
        data.parentId,
        data.childId,
        data.to,
        data.from
      )
    case MOVE_SUBGRAPH_INTO:
      return makeMoveSubgraphOutOfAction(
        data.graphId,
        data.nodeIds,
        data.nextIdMap,
        data.nextUnitPinMergeMap,
        data.nextPinIdMap,
        data.nextMergePinId,
        data.nextPlugSpec,
        data.nextSubComponentParentMap,
        data.nextSubComponentChildrenMap,
        data.nextSubComponentIndexMap
      )
    case MOVE_SUBGRAPH_OUT_OF:
      return makeMoveSubgraphIntoAction(
        data.graphId,
        data.nodeIds,
        data.nextIdMap,
        data.nextUnitPinMergeMap,
        data.nextPinIdMap,
        data.nextMergePinId,
        data.nextPlugSpec,
        data.nextSubComponentParentMap,
        data.nextSubComponentChildrenMap,
        data.nextSubComponentIndexMap
      )
    case BULK_EDIT:
      return makeBulkEditAction([...data.actions].reverse().map(reverseAction))
    default:
      throw new Error('Irreversible')
  }
}

export const processAction = (
  action: Action,
  method: Partial<AllKeys<G & U, Function>>,
  fallback?: (data) => void
): void => {
  const { type, data } = action

  if (!method[type] && fallback) {
    throw new Error(`No method for ${type}`)
  }

  ;(method[type] ?? fallback)(data)
}

export const processActions = (
  actions: Action[],
  method: Partial<AllKeys<G, Function>>,
  fallback?: (data: any) => void
): void => {
  actions.forEach((action) => processAction(action, method, fallback))
}
