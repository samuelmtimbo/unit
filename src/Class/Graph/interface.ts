import { Position } from '../../client/util/geometry'
import {
  Action,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphSpec,
  GraphSubPinSpec,
  GraphUnitsSpec,
} from '../../types'
import { Dict } from '../../types/Dict'
import { IO } from '../../types/IO'
import { IOOf, _IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'

export type GraphMoveSubGraphIntoData = {
  graphId: string
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
  }
  nextIdMap: {
    merge: Dict<string>
    link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
    plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO; subPinId: string }>>>
    unit: Dict<string>
  }
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
  }>
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
  }>
  nextPlugSpec: {
    input: Dict<Dict<GraphSubPinSpec>>
    output: Dict<Dict<GraphSubPinSpec>>
  }
  nextSubComponentParentMap: Dict<string | null>
  nextSubComponentChildrenMap: Dict<string[]>
}

export type GraphAddUnitData = {
  unitId: string
  bundle: UnitBundleSpec
  position?: Position | undefined
  pinPosition?: IOOf<Dict<Position>> | undefined
  layoutPositon?: Position | undefined
  parentId?: string | null | undefined
  merges?: GraphMergesSpec | undefined
}

export type GraphCloneUnitData = {
  unitId: string
  newUnitId: string
}

export type GraphSetUnitPinDataData = {
  unitId: string
  pinId: string
  type: IO
  data: string
}

export type GraphRemoveMergeDataData = {
  id: string
}

export type GraphSetUnitNameData = {
  unitId: string
  newUnitId: string
  name: string
}

export type GraphRemoveUnitPinDataData = {
  unitId: string
  type: IO
  pinId: string
}

export type GraphMoveUnitData = {
  id: string
  unitId: string
  inputId: string
}

export type GraphAddUnitsData = {
  units: GraphUnitsSpec
}

export type GraphRemoveUnitData = {
  unitId: string
  bundle?: UnitBundleSpec
  position?: Position
  pinPosition?: { input: Dict<Position>; output: Dict<Position> }
  layoutPositon?: Position
  parentId?: string | null
  merges?: GraphMergesSpec
}

export type GraphExposePinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
}

export type GraphExposePinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
}

export type GraphCoverPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
}

export type GraphPlugPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
}

export type GraphUnplugPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
}

export type GraphCoverPinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
}

export type GraphCoverUnitPinSetData = {
  unitId: string
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  position?: Position | undefined
}

export type GraphExposeUnitPinSetData = {
  unitId: string
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  position?: Position | undefined
}

export type GraphSetPinSetIdData = {
  type: IO
  pinId: string
  nextPinId: string
}

export type GraphSetPinSetFunctionalData = {
  type: IO
  pinId: string
  functional: boolean
}

export type GraphSetUnitPinConstant = {
  unitId: string
  type: IO
  pinId: string
  constant: boolean
}

export type GraphSetUnitPinIgnoredData = {
  unitId: string
  type: IO
  pinId: string
  ignored: boolean
}

export type GraphAddMergeData = {
  mergeId: string
  mergeSpec: GraphMergeSpec
  position?: Position | undefined
}

export type GraphRemoveMergeData = {
  mergeId: string
  mergeSpec: GraphMergeSpec
  position: Position
}

export type GraphAddMergesData = {
  merges: GraphMergesSpec
}

export type GraphSetMergeDataData = {
  id: string
  data: string
}

export type GraphAddPinToMergeData = {
  mergeId: string
  unitId: string
  type: IO
  pinId: string
}

export type GraphRemovePinFromMergeData = {
  mergeId: string
  unitId: string
  type: IO
  pinId: string
}

export type GraphTakeUnitErrData = {
  unitId: string
}

export type GraphRemoveUnitGhostData = {
  unitId: string
  nextUnitId: string
  nextUnitSpec: GraphSpec
}

export type GraphAddUnitGhostData = {
  unitId: string
  nextUnitId: string
  nextUnitBundle: UnitBundleSpec
  nextUnitPinMap: IOOf<Dict<string>>
}

export type GraphMoveUnitIntoData = {
  graphId: string
  unitId: string
  nextUnitId: string
  ignoredPin: {
    input: Set<string>
    output: Set<string>
  }
  ignoredMerge: Set<string>
  nextPinMap: {
    input: Dict<{
      pinId: string
      subPinId: string
    }>
    output: Dict<{
      pinId: string
      subPinId: string
    }>
  }
  nextUnitSubComponentParent: string | null
  nextSubComponentChildren: string[]
}

export type GraphMoveLinkPinIntoData = {
  graphId: string
  unitId: string
  type: IO
  pinId: string
}

export type GraphMoveMergeIntoData = {
  graphId: string
  mergeId: string
  nextInputMergeId: {
    mergeId: string
    pinId: string
    subPinSpec: GraphSubPinSpec
  }
  nextOutputMergeId: {
    mergeId: string
    pinId: string
    subPinSpec: GraphSubPinSpec
  }
}

export type GraphMovePlugIntoData = {
  graphId: string
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
}

export type GraphExplodeUnitData = {
  unitId: string
  mapUnitId: Dict<string>
  mapMergeId: Dict<string>
}

export type GraphMoveSubComponentRootData = {
  parentId: string | null
  children: string[]
  slotMap: Dict<string>
}

export type GraphBulkEditData = {
  actions: Action[]
  transaction?: boolean
}