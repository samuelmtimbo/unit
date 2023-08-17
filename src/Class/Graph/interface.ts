import { Position } from '../../client/util/geometry/types'
import {
  Action,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphSubPinSpec,
  GraphUnitsSpec,
} from '../../types'
import { Dict } from '../../types/Dict'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitMerges } from '../../types/GraphUnitMerges'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { GraphSelection } from '../../types/interface/G'

export type GraphMoveSubGraphData = {
  nodeIds: GraphSelection
  nextSpecId: string
  nextIdMap: {
    merge?: Dict<string>
    link?: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string } | null>>>
    plug?: IOOf<
      Dict<Dict<{ mergeId: string; type: IO; subPinId: string } | null>>
    >
    unit?: Dict<string>
    data?: Dict<string>
  }
  nextPinIdMap: Dict<
    IOOf<
      Dict<{
        pinId: string
        subPinId: string
        ref?: boolean
        defaultIgnored?: boolean
        mergeId?: string
        merge?: GraphMergeSpec
      }>
    >
  >
  nextUnitPinMergeMap: Dict<IOOf<Dict<string>>>
  nextMergePinId: Dict<
    IOOf<{
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      oppositeMerge?: GraphMergeSpec
      ref?: boolean
    }>
  >
  nextPlugSpec: IOOf<Dict<Dict<GraphSubPinSpec>>>
  nextSubComponentIndexMap: Dict<number>
  nextSubComponentParentMap: Dict<string | null>
  nextSubComponentChildrenMap: Dict<string[]>
  position?: Position
}

export type GraphMoveSubGraphIntoData = GraphMoveSubGraphData & {
  graphId: string
}

export type GraphMoveSubGraphOutOfData = GraphMoveSubGraphIntoData

export type GraphAddUnitData = {
  unitId: string
  bundle: UnitBundleSpec
  position?: Position | undefined
  pinPosition?: IOOf<Dict<Position>> | undefined
  layoutPositon?: Position | undefined
  parentId?: string | null | undefined
  merges?: GraphUnitMerges | undefined
  plugs?: GraphUnitPlugs | undefined
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
  lastData: string
}

export type GraphRemoveMergeDataData = {
  mergeId: string
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
  pinPosition?: IOOf<Dict<Position>>
  layoutPositon?: Position
  parentId?: string | null
  merges?: GraphMergesSpec
  plugs?: GraphUnitPlugs
}

export type GraphExposePinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  data: any
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
  mergeId: string
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

export type GraphExplodeUnitData = {
  unitId: string
  mapUnitId: Dict<string>
  mapMergeId: Dict<string>
  mapPlugId: IOOf<Dict<Dict<string>>>
}

export type GraphMoveSubComponentRootData = {
  parentId: string | null
  children: string[]
  slotMap: Dict<string>
}

export type GraphReorderSubComponentData = {
  parentId: string | null
  childId: string
  to: number
}

export type GraphSetUnitSizeData = {
  unitId: string
  width: number
  height: number
  prevHeight: number
  prevWidth: number
}

export type GraphSetComponentSizeData = {
  width: number
  height: number
  prevHeight: number
  prevWidth: number
}

export type GraphSetSubComponentSizeData = {
  unitId: string
  width: number
  height: number
  prevWidth: number
  prevHeight: number
}

export type GraphSetMetadataData = {
  path: string[]
  data: any
}

export type GraphSetUnitMetadataData = {
  unitId: string
  path: string[]
  data: any
}

export type GraphBulkEditData = {
  actions: Action[]
  transaction?: boolean
}
