import {
  GraphAddMergeData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphBulkEditData,
  GraphCloneUnitData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExposePinData,
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
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from '../../Class/Graph/interface'
import { Position } from '../../client/util/geometry/types'
import { keys } from '../../system/f/object/Keys/f'
import { GraphSubPinSpec } from '../../types'
import { Action } from '../../types/Action'
import { AllKeys } from '../../types/AllKeys'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitMerges } from '../../types/GraphUnitMerges'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { G } from '../../types/interface/G'
import { U } from '../../types/interface/U'
import { deepSet, mapObjKeyKV, mapObjVK, revertObj } from '../../util/object'
import { forEachPinOnMerges, opposite } from '../util/spec'
import {
  MOVE_SUB_COMPONENT_ROOT,
  REORDER_SUB_COMPONENT,
  makeMoveSubComponentRootAction,
  makeReorderSubComponentAction,
} from './C'
import {
  ADD_DATUM,
  ADD_DATUM_LINK,
  REMOVE_DATUM,
  REMOVE_DATUM_LINK,
  SET_DATUM,
  makeAddDatumAction,
  makeAddDatumLinkAction,
  makeRemoveDatumAction,
  makeRemoveDatumLinkAction,
  makeSetDatumAction,
} from './D'

export const ADD_UNIT = 'addUnitSpec'
export const ADD_UNITS = 'addUnits'
export const REMOVE_UNIT = 'removeUnit'
export const TAKE_UNIT_ERR = 'takeUnitErr'
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
export const SET_UNIT_SIZE = 'setUnitSize'
export const SET_COMPONENT_SIZE = 'setComponentSize'
export const SET_SUB_COMPONENT_SIZE = 'setSubComponentSize'
export const CLONE_UNIT = 'cloneUnit'

export const wrapAddUnitAction = (data: GraphAddUnitData) => {
  return {
    type: ADD_UNIT,
    data,
  }
}

export const wrapCloneUnitAction = (data: GraphCloneUnitData) => {
  return {
    type: CLONE_UNIT,
    data,
  }
}

export const makeCloneUnitAction = (unitId: string, newUnitId: string) => {
  return wrapCloneUnitAction({
    unitId,
    newUnitId,
  })
}

export const makeAddUnitAction = (
  unitId: string,
  bundle: UnitBundleSpec,
  position?: Position | undefined,
  pinPosition?: IOOf<Dict<Position>> | undefined,
  layoutPosition?: Position | undefined,
  parentId?: string | null | undefined,
  merges?: GraphUnitMerges | undefined,
  plugs?: GraphUnitPlugs | undefined
) => {
  return wrapAddUnitAction({
    unitId,
    bundle,
    position,
    pinPosition,
    layoutPosition,
    parentId,
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
  graphBundle: UnitBundleSpec,
  graphSpec: GraphSpec,
  nextSpecId: string,
  nodeIds: GraphMoveSubGraphIntoData['nodeIds'],
  nextIdMap: GraphMoveSubGraphIntoData['nextIdMap'],
  nextUnitPinMergeMap: GraphMoveSubGraphIntoData['nextUnitPinMergeMap'],
  nextPinIdMap: GraphMoveSubGraphIntoData['nextPinIdMap'],
  nextMergePinId: GraphMoveSubGraphIntoData['nextMergePinId'],
  nextPlugSpec: GraphMoveSubGraphIntoData['nextPlugSpec'],
  nextSubComponentParentMap: GraphMoveSubGraphIntoData['nextSubComponentParentMap'],
  nextSubComponentChildrenMap: GraphMoveSubGraphIntoData['nextSubComponentChildrenMap'],
  nextSubComponentIndexMap: GraphMoveSubGraphIntoData['nextSubComponentIndexMap'],
  nextSubComponentSlot: GraphMoveSubGraphIntoData['nextSubComponentSlot'],
  nextSubComponentParentSlot: GraphMoveSubGraphIntoData['nextSubComponentParentSlot']
) => {
  return wrapMoveSubgraphIntoData({
    graphId,
    graphBundle,
    graphSpec,
    nextSpecId,
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextUnitPinMergeMap,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
    nextSubComponentIndexMap,
    nextSubComponentSlot,
    nextSubComponentParentSlot,
  })
}

export const makeMoveSubgraphOutOfAction = (
  graphId: string,
  graphBundle: UnitBundleSpec,
  graphSpec: GraphSpec,
  nextSpecId: string,
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
    plug: IOOf<Dict<Dict<{ mergeId: string; type: IO; subPinId: string }>>>
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
  nextSubComponentIndexMap: Dict<number>,
  nextSubComponentSlot: GraphMoveSubGraphIntoData['nextSubComponentSlot'],
  nextSubComponentParentSlot: GraphMoveSubGraphIntoData['nextSubComponentParentSlot']
) => {
  return wrapMoveSubgraphOutOfData({
    graphId,
    graphBundle,
    graphSpec,
    nextSpecId,
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
    nextSubComponentIndexMap,
    nextUnitPinMergeMap,
    nextSubComponentParentSlot,
    nextSubComponentSlot,
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

export const wrapMakeTakeUnitErrAction = (data: GraphTakeUnitErrData) => {
  return {
    type: TAKE_UNIT_ERR,
    data,
  }
}

export const makeRemoveUnitAction = (
  unitId: string,
  bundle: UnitBundleSpec,
  position?: Position,
  pinPosition?: IOOf<Dict<Position>>,
  layoutPosition?: Position,
  parentId?: string | null,
  merges?: GraphMergesSpec,
  plugs?: GraphUnitPlugs
) => {
  return wrapMakeRemoveUnitAction({
    unitId,
    bundle,
    position,
    pinPosition,
    layoutPosition,
    parentId,
    merges,
    plugs,
  })
}

export const makeTakeUnitErrAction = (unitId: string) => {
  return wrapMakeTakeUnitErrAction({
    unitId,
  })
}

export const makeRemoveUnitsAction = (ids: string[]) => {
  return {
    type: REMOVE_UNITS,
    data: { ids },
  }
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

export const makeSetPinSetNameAction = (
  type: IO,
  id: string,
  functional: boolean
) => {
  return {
    type: SET_PIN_SET_NAME,
    data: { type, id, functional },
  }
}

export const makeSetPinSetFunctionalAction = (
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
  pinSpec: GraphPinSpec,
  data: any
) => {
  return wrapExposePinSetAction({ type, pinId, pinSpec, data })
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
  subPinSpec: GraphPinSpec,
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
        data.merges,
        data.plugs
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
        data.merges,
        data.plugs
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
      return makeCoverPinSetAction(data.type, data.pinId, data.pinSpec)
    case COVER_PIN_SET:
      return makeExposePinSetAction(
        data.type,
        data.pinId,
        data.pinSpec,
        data.data
      )
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
    case REMOVE_UNIT_PIN_DATA:
      return makeSetUnitPinDataAction(
        data.unitId,
        data.type,
        data.pinId,
        data.data
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
        data.index,
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
    case MOVE_SUBGRAPH_INTO: {
      const data_ = data as GraphMoveSubGraphIntoData

      const nextNodeIds_ = {
        ...data.nodeIds,
        unit: data.nodeIds.unit.map(
          (unitId: string) => data.nextIdMap.unit[unitId] ?? unitId
        ),
        link: data.nodeIds.link.filter(({ unitId, type, pinId }) => {
          if (!data.nodeIds.unit.includes(unitId)) {
            return false
          }

          return true
        }),
        plug: data.nodeIds.plug.concat(
          data.nodeIds.link
            .filter(({ unitId, type, pinId }) => {
              if (!data.nodeIds.unit.includes(unitId)) {
                return true
              }

              return false
            })
            .map(({ unitId, type, pinId }) => {
              return {
                type: opposite(type),
                pinId,
                subPinId: '0',
              }
            })
        ),
      }

      const nextIdMap_ = {
        ...data.nextIdMap,
        unit: revertObj(data.nextIdMap.unit ?? {}),
        merge: revertObj(data.nextIdMap.merge ?? {}),
      }

      return makeMoveSubgraphOutOfAction(
        data.graphId,
        data.graphBundle,
        data.graphSpec,
        data.nextSpecId,
        nextNodeIds_,
        nextIdMap_,
        data.nextUnitPinMergeMap,
        data.nextPinIdMap,
        data.nextMergePinId,
        data.nextPlugSpec,
        data.nextSubComponentParentMap,
        data.nextSubComponentChildrenMap,
        data.nextSubComponentIndexMap,
        {},
        {}
      )
    }

    case MOVE_SUBGRAPH_OUT_OF: {
      const data_ = data as GraphMoveSubGraphIntoData

      const nextIdMap_ = {
        ...data_.nextIdMap,
        unit: revertObj(data_.nextIdMap.unit ?? {}),
        merge: revertObj(data_.nextIdMap.merge ?? {}),
      }

      const nextNodeIds_ = {
        ...data_.nodeIds,
        unit: data_.nodeIds.unit.map(
          (unitId: string) => data_.nextIdMap.unit[unitId] ?? unitId
        ),
        merge: data_.nodeIds.merge.map(
          (mergeId: string) => data_.nextIdMap.merge[mergeId] ?? mergeId
        ),
      }

      const nextUnitPinMergeMap_ = {}

      forEachPinOnMerges(
        data_.graphSpec.merges ?? {},
        (mergeId, unitId, type, pinId) => {
          const nextUnitId = nextIdMap_.unit[unitId] ?? unitId

          deepSet(nextUnitPinMergeMap_, [unitId, type, pinId], mergeId)
        }
      )

      const nextPinIdMap_ = mapObjVK(
        mapObjKeyKV(data_.nextPinIdMap, (unitId) => {
          return data_.nextIdMap.unit[unitId] ?? unitId
        }),
        (pinIdMap) => {
          return {
            input: mapObjVK(pinIdMap.input, (pin) => {
              return {
                ...pin,
                merge: mapObjKeyKV(pin.merge, (unitId) => {
                  return nextIdMap_.unit[unitId] ?? unitId
                }),
              }
            }),
            output: mapObjVK(pinIdMap.output, (pin) => {
              return {
                ...pin,
                merge: mapObjKeyKV(pin.merge, (unitId) => {
                  return nextIdMap_.unit[unitId] ?? unitId
                }),
              }
            }),
          }
        }
      )

      const nextPlugSpec_: IOOf<Dict<Dict<GraphSubPinSpec>>> = {
        input: mapObjVK(data_.nextPlugSpec.input, (pinSpec) => {
          return mapObjVK(pinSpec, (subPinSpec) => {
            const { mergeId, unitId } = subPinSpec

            if (mergeId) {
              return {
                ...subPinSpec,
                mergeId: nextIdMap_.merge[mergeId] ?? mergeId,
              }
            } else if (unitId) {
              return {
                ...subPinSpec,
                unitId: nextIdMap_.unit[unitId] ?? unitId,
              }
            }

            return subPinSpec
          }) as Dict<GraphSubPinSpec>
        }),
        output: mapObjVK(data_.nextPlugSpec.output, (nextPlug) => {
          return mapObjVK(nextPlug, (subPinSpec) => {
            const { mergeId, unitId } = subPinSpec

            if (mergeId) {
              return {
                ...subPinSpec,
                mergeId: nextIdMap_.merge[mergeId] ?? mergeId,
              }
            } else if (unitId) {
              return {
                ...subPinSpec,
                unitId: nextIdMap_.unit[unitId] ?? unitId,
              }
            }

            return subPinSpec
          }) as Dict<GraphSubPinSpec>
        }),
      }

      return makeMoveSubgraphIntoAction(
        data_.graphId,
        data_.graphBundle,
        data_.graphSpec,
        data_.nextSpecId,
        nextNodeIds_,
        nextIdMap_,
        nextUnitPinMergeMap_,
        nextPinIdMap_,
        data_.nextMergePinId,
        nextPlugSpec_,
        data_.nextSubComponentParentMap,
        data_.nextSubComponentChildrenMap,
        data_.nextSubComponentIndexMap,
        {},
        {}
      )
    }

    case BULK_EDIT:
      return makeBulkEditAction([...data.actions].reverse().map(reverseAction))
    case SET_COMPONENT_SIZE:
      return makeSetComponentSizeAction(
        data.prevWidth,
        data.prevHeight,
        data.width,
        data.height
      )
    case SET_SUB_COMPONENT_SIZE:
      return makeSetSubComponentSizeAction(
        data.unitId,
        data.prevWidth,
        data.prevHeight,
        data.width,
        data.height
      )
    case SET_UNIT_SIZE:
      return makeSetUnitSizeAction(
        data.unitId,
        data.prevWidth,
        data.prevHeight,
        data.width,
        data.height
      )
    case ADD_DATUM:
      return makeRemoveDatumAction(data.id, data.value)
    case SET_DATUM:
      return makeSetDatumAction(data.id, data.value, data.prevValue)
    case REMOVE_DATUM:
      return makeAddDatumAction(data.id, data.value)
    case ADD_DATUM_LINK:
      return makeRemoveDatumLinkAction(data.id, data.value, data.pinSpec)
    case REMOVE_DATUM_LINK:
      return makeAddDatumLinkAction(data.id, data.value, data.pinSpec)
    default:
      throw new Error('irreversible')
  }
}

export const processAction = (
  action: Action,
  method: Partial<AllKeys<G & U, Function>>,
  fallback?: (data) => void
): void => {
  const { type, data } = action

  if (!method[type] && !fallback) {
    throw new Error(`no method for ${type}`)
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
