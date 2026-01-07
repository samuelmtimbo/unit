import { Position } from '../../client/util/geometry/types'
import { GraphSubComponentSpec, GraphSubPinSpec } from '../../types'
import { Action } from '../../types/Action'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitMerges } from '../../types/GraphUnitMerges'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
import { GraphSelection } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { MoveMapping } from './buildMoveMap'
import { Moves } from './buildMoves'

export type Flags = {
  fork?: boolean
  bubble?: boolean
}

export type GraphMoveSubGraphData = {
  graphId: string
  spec: GraphSpec
  selection: GraphSelection
  mapping: MoveMapping
  moves: Moves
} & Flags

export type GraphMoveSubGraphIntoData = GraphMoveSubGraphData

export type GraphMoveSubGraphOutOfData = GraphMoveSubGraphData

export type GraphAddUnitData = {
  unitId: string
  bundle: UnitBundleSpec
  position?: Position | undefined
  pinPosition?: IOOf<Dict<Position>> | undefined
  layoutPosition?: Position | undefined
  parentId?: string | null | undefined
  parentSlot?: string | null | undefined
  parentIndex?: number
  children?: string[]
  childrenSlot?: Dict<string>
  merges?: GraphUnitMerges | undefined
  plugs?: GraphUnitPlugs | undefined
  subComponent?: GraphSubComponentSpec
} & Flags

export type GraphSetUnitPinDataData = {
  unitId: string
  type: IO
  pinId: string
  data: string
  lastData?: string
} & Flags

export type GraphSetPlugDataData = {
  type: IO
  pinId: string
  subPinId: string
  data: string
  lastData?: string
} & Flags

export type GraphRemovePlugDataData = {
  type: IO
  pinId: string
  subPinId: string
  lastData?: string
} & Flags

export type GraphRemoveMergeDataData = {
  mergeId: string
  data?: string
} & Flags

export type GraphSetUnitIdData = {
  unitId: string
  newUnitId: string
  specId: string
  lastSpecId?: string
  name: string
  lastName?: string
  fork?: boolean
  bubble?: boolean
} & Flags

export type GraphRemoveUnitPinDataData = {
  unitId: string
  type: IO
  pinId: string
  data: string
} & Flags

export type GraphAddUnitsData = {
  units: GraphUnitsSpec
} & Flags

export type GraphRemoveUnitData = {
  unitId: string
  bundle?: UnitBundleSpec
  position?: Position
  pinPosition?: IOOf<Dict<Position>>
  layoutPosition?: Position
  parentId?: string | null
  parentSlot?: string | null
  parentIndex?: number
  children?: string[]
  childrenSlot?: Dict<string>
  merges?: GraphMergesSpec
  plugs?: GraphUnitPlugs
  take?: boolean
} & Flags

export type GraphExposePinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  data?: any
} & Flags

export type GraphExposePinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  pinSpec?: GraphPinSpec
} & Flags

export type GraphCoverPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec?: GraphSubPinSpec
  pinSpec?: GraphPinSpec
} & Flags

export type GraphPlugPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
} & Flags

export type GraphUnplugPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  take?: boolean
} & Flags

export type GraphCoverPinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
} & Flags

export type GraphCoverUnitPinSetData = {
  unitId: string
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  position?: Position | undefined
} & Flags

export type GraphExposeUnitPinSetData = {
  unitId: string
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  position?: Position | undefined
} & Flags

export type GraphSetPinSetIdData = {
  type: IO
  pinId: string
  newPinId: string
} & Flags

export type GraphSetPinSetDefaultIgnoredData = {
  type: IO
  pinId: string
  defaultIgnored: boolean
} & Flags

export type GraphSetPinSetFunctionalData = {
  type: IO
  pinId: string
  functional: boolean
} & Flags

export type GraphSetUnitPinSetIdData = {
  unitId: string
  type: IO
  pinId: string
  newPinId: string
} & Flags

export type GraphSetNameData = {
  name: string
} & Flags

export type GraphSetUnitPinConstantData = {
  unitId: string
  type: IO
  pinId: string
  constant: boolean
} & Flags

export type GraphSetUnitPinIgnoredData = {
  unitId: string
  type: IO
  pinId: string
  ignored: boolean
} & Flags

export type GraphAddMergeData = {
  mergeId: string
  mergeSpec: GraphMergeSpec
  position?: Position | undefined
} & Flags

export type GraphRemoveMergeData = {
  mergeId: string
  mergeSpec: GraphMergeSpec
  position?: Position
  take?: boolean
} & Flags

export type GraphAddMergesData = {
  merges: GraphMergesSpec
} & Flags

export type GraphSetMergeDataData = {
  mergeId: string
  data: string
} & Flags

export type GraphAddPinToMergeData = {
  mergeId: string
  unitId: string
  type: IO
  pinId: string
} & Flags

export type GraphRemovePinFromMergeData = {
  mergeId: string
  unitId: string
  type: IO
  pinId: string
  take?: boolean
} & Flags

export type GraphTakeUnitErrData = {
  unitId: string
} & Flags

export type GraphRemoveUnitGhostData = {
  unitId: string
  nextUnitId: string
  nextUnitSpec: GraphSpec
} & Flags

export type GraphAddUnitGhostData = {
  unitId: string
  nextUnitId: string
  nextUnitBundle: UnitBundleSpec
  nextUnitPinMap: IOOf<Dict<string>>
} & Flags

export type GraphMoveSubComponentRootData = {
  prevParentIdMap: Dict<string>
  prevSlotMap: Dict<string>
  parentId: string | null
  children: string[]
  slotMap?: Dict<string>
  index: number
} & Flags

export type GraphReorderSubComponentData = {
  parentId: string | null
  childId: string
  to: number
} & Flags

export type GraphSetUnitSizeData = {
  unitId: string
  width: number
  height: number
  prevHeight: number
  prevWidth: number
} & Flags

export type GraphSetComponentSizeData = {
  width: number
  height: number
  prevHeight: number
  prevWidth: number
} & Flags

export type GraphSetSubComponentSizeData = {
  unitId: string
  width: number
  height: number
  prevWidth: number
  prevHeight: number
} & Flags

export type GraphSetMetadataData = {
  path_: string[]
  value: any
} & Flags

export type GraphSetUnitMetadataData = {
  unitId: string
  path_: string[]
  value: any
} & Flags

export type GraphSetUnitPinMetadataData = {
  unitId: string
  type: IO
  pinId: string
  path_: string[]
  value: any
} & Flags

export type GraphSetPinMetadataData = {
  type: IO
  pinId: string
  path_: string[]
  value: any
} & Flags

export type GraphBulkEditData = {
  actions: Action[]
  transaction?: boolean
} & Flags

export type GraphSetForkData = {
  fork: boolean
  transaction?: boolean
} & Flags
