import { GraphMoveSubGraphIntoData } from '../Class/Graph/interface'
import { Action } from '../types/Action'
import {
  makeMoveSubComponentRootAction,
  makeReorderSubComponentAction,
  MOVE_SUB_COMPONENT_ROOT,
  REORDER_SUB_COMPONENT,
} from './actions/C'
import {
  ADD_DATUM,
  ADD_DATUM_LINK,
  makeAddDatumAction,
  makeAddDatumLinkAction,
  makeRemoveDatumAction,
  makeRemoveDatumLinkAction,
  makeSetDatumAction,
  REMOVE_DATUM,
  REMOVE_DATUM_LINK,
  SET_DATUM,
} from './actions/D'
import {
  ADD_MERGE,
  ADD_PIN_TO_MERGE,
  ADD_UNIT,
  BULK_EDIT,
  COVER_PIN,
  COVER_PIN_SET,
  COVER_UNIT_PIN_SET,
  EXPOSE_PIN,
  EXPOSE_PIN_SET,
  EXPOSE_UNIT_PIN_SET,
  makeAddMergeAction,
  makeAddPinToMergeAction,
  makeAddUnitAction,
  makeBulkEditAction,
  makeCoverPinAction,
  makeCoverPinSetAction,
  makeCoverUnitPinSetAction,
  makeExposePinAction,
  makeExposePinSetAction,
  makeExposeUnitPinSetAction,
  makeMoveSubgraphIntoAction,
  makeMoveSubgraphOutOfAction,
  makePlugPinAction,
  makeRemoveMergeAction,
  makeRemoveMergeDataAction,
  makeRemovePinFromMergeAction,
  makeRemovePlugDataAction,
  makeRemoveUnitAction,
  makeRemoveUnitPinDataAction,
  makeSetComponentSizeAction,
  makeSetMergeDataAction,
  makeSetPinSetFunctionalAction,
  makeSetPinSetIdAction,
  makeSetPlugDataAction,
  makeSetSubComponentSizeAction,
  makeSetUnitIdAction,
  makeSetUnitPinConstantAction,
  makeSetUnitPinDataAction,
  makeSetUnitPinIgnoredAction,
  makeSetUnitSizeAction,
  makeUnplugPinAction,
  MOVE_SUBGRAPH_INTO,
  MOVE_SUBGRAPH_OUT_OF,
  PLUG_PIN,
  REMOVE_MERGE,
  REMOVE_MERGE_DATA,
  REMOVE_PIN_FROM_MERGE,
  REMOVE_PLUG_DATA,
  REMOVE_UNIT,
  REMOVE_UNIT_PIN_DATA,
  SET_COMPONENT_SIZE,
  SET_MERGE_DATA,
  SET_PIN_SET_DEFAULT_IGNORED,
  SET_PIN_SET_FUNCTIONAL,
  SET_PIN_SET_ID,
  SET_PLUG_DATA,
  SET_SUB_COMPONENT_SIZE,
  SET_UNIT_ID,
  SET_UNIT_PIN_CONSTANT,
  SET_UNIT_PIN_DATA,
  SET_UNIT_PIN_IGNORED,
  SET_UNIT_SIZE,
  UNPLUG_PIN,
} from './actions/G'
import { makeSetPinDataAction, SET_PIN_DATA } from './actions/U'
import { reverseSelection } from './reverseSelection'

export const reverseAction = ({ type, data }: Action): Action => {
  switch (type) {
    case ADD_UNIT:
      return makeRemoveUnitAction(
        data.unitId,
        data.bundle,
        data.merges,
        data.plugs,
        data.parentId,
        data.parentIndex,
        data.children,
        data.childrenSlot,
        data.position,
        data.pinPosition,
        data.layoutPosition
      )
    case REMOVE_UNIT:
      return makeAddUnitAction(
        data.unitId,
        data.bundle,
        data.merges,
        data.plugs,
        data.parentId,
        data.parentIndex,
        data.children,
        data.childrenSlot,
        data.position,
        data.pinPosition,
        data.layoutPosition
      )
    case ADD_MERGE:
      return makeRemoveMergeAction(data.mergeId, data.mergeSpec, data.position)
    case ADD_PIN_TO_MERGE:
      return makeRemovePinFromMergeAction(
        data.mergeId,
        data.unitId,
        data.type,
        data.pinId
      )
    case REMOVE_MERGE:
      return makeAddMergeAction(data.mergeId, data.mergeSpec, data.position)
    case REMOVE_PIN_FROM_MERGE:
      return makeAddPinToMergeAction(
        data.mergeId,
        data.unitId,
        data.type,
        data.pinId
      )
    case EXPOSE_PIN_SET:
      return makeCoverPinSetAction(data.type, data.pinId, data.pinSpec)
    case EXPOSE_PIN:
      return makeCoverPinAction(
        data.type,
        data.pinId,
        data.subPinId,
        data.subPinSpec,
        data.pinSpec
      )
    case COVER_PIN_SET:
      return makeExposePinSetAction(data.type, data.pinId, data.pinSpec)
    case COVER_PIN:
      return makeExposePinAction(
        data.type,
        data.pinId,
        data.subPinId,
        data.subPinSpec
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
      return makeRemoveUnitPinDataAction(
        data.unitId,
        data.type,
        data.pinId,
        data.data
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

      const { selection, mapping } = reverseSelection(
        data_.selection,
        data_.mapping
      )

      const moves = [...data_.moves].reverse().map((move) => ({
        in: !move.in,
        action: reverseAction(move.action),
      }))

      return makeMoveSubgraphOutOfAction(
        data_.graphId,
        data_.spec,
        selection,
        mapping,
        moves
      )
    }
    case MOVE_SUBGRAPH_OUT_OF: {
      const data_ = data as GraphMoveSubGraphIntoData

      const { selection, mapping } = reverseSelection(
        data_.selection,
        data_.mapping
      )

      const moves = [...data_.moves].reverse().map((move) => ({
        in: !move.in,
        action: reverseAction(move.action),
      }))

      return makeMoveSubgraphIntoAction(
        data_.graphId,
        data_.spec,
        selection,
        mapping,
        moves
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
      return makeRemoveDatumLinkAction(data.id, data.value, data.nodeSpec)
    case REMOVE_DATUM_LINK:
      return makeAddDatumLinkAction(data.id, data.value, data.nodeSpec)
    case SET_MERGE_DATA:
      return makeRemoveMergeDataAction(data.mergeId, data.data)
    case REMOVE_MERGE_DATA:
      return makeSetMergeDataAction(data.mergeId, data.data)
    case SET_PLUG_DATA:
      return makeRemovePlugDataAction(
        data.type,
        data.pinId,
        data.subPinId,
        data.data
      )
    case REMOVE_PLUG_DATA:
      return makeSetPlugDataAction(
        data.type,
        data.pinId,
        data.subPinId,
        data.data,
        undefined
      )
    case SET_PIN_SET_ID:
      return makeSetPinSetIdAction(data.type, data.nextPinId, data.pinId)
    case SET_PIN_SET_FUNCTIONAL:
      return makeSetPinSetFunctionalAction(
        data.type,
        data.pinId,
        !data.functional
      )
    case SET_PIN_SET_DEFAULT_IGNORED:
      return makeSetPinSetFunctionalAction(
        data.type,
        data.pinId,
        !data.defaultIgnored
      )
    case SET_UNIT_ID:
      return makeSetUnitIdAction(
        data.newUnitId,
        data.unitId,
        data.lastName,
        data.name,
        data.lastSpecId,
        data.specId
      )
    case SET_PIN_DATA:
      return makeSetPinDataAction(
        data.type,
        data.pinId,
        data.lastData,
        data.data
      )
    default:
      throw new Error('irreversible')
  }
}
