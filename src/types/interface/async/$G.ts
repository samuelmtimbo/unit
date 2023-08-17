import {
  GraphAddMergeData,
  GraphAddMergesData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphAddUnitsData,
  GraphBulkEditData,
  GraphCloneUnitData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExplodeUnitData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphExposeUnitPinSetData,
  GraphMoveSubComponentRootData,
  GraphMoveSubGraphIntoData,
  GraphMoveUnitData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemoveMergeDataData,
  GraphRemovePinFromMergeData,
  GraphRemoveUnitData,
  GraphRemoveUnitGhostData,
  GraphRemoveUnitPinDataData,
  GraphSetMergeDataData,
  GraphSetMetadataData,
  GraphSetPinSetFunctionalData,
  GraphSetPinSetIdData,
  GraphSetUnitNameData,
  GraphSetUnitPinConstant,
  GraphSetUnitPinDataData,
  GraphSetUnitPinIgnoredData,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from '../../../Class/Graph/interface'
import { State } from '../../../State'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { IOOf } from '../../IOOf'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $Component } from './$Component'
import { $Graph } from './$Graph'
import { $U } from './$U'

export const G_METHOD_CALL_GET = [
  'getPinData',
  'getInputData',
  'getUnitPinData',
  'getUnitState',
  'getGraphState',
  'getGraphChildren',
  'getGraphPinData',
  'getGraphData',
  'getGraphErr',
  'getGraphMergeInputData',
  'getUnitInputData',
  'getSpec',
  'getBundle',
]

export const G_METHOD_CALL_SET = [
  'addUnit',
  'addUnits',
  'removeUnit',
  'cloneUnit',
  'moveUnit',
  'exposePinSet',
  'coverPinSet',
  'exposePin',
  'coverPin',
  'plugPin',
  'unplugPin',
  'exposeUnitPinSet',
  'coverUnitPinSet',
  'setPinSetFunctional',
  'setUnitPinData',
  'setUnitPinConstant',
  'setUnitPinIgnored',
  'setPinSetId',
  'addMerge',
  'removeMerge',
  'addMerges',
  'addPinToMerge',
  'removePinFromMerge',
  'mergeMerges',
  'setMetadata',
  'moveUnitInto',
  'explodeUnit',
  'appendRoot',
  'removeRoot',
  'appendParentRoot',
  'appendParentRootChildren',
  'reorderSubComponent',
  'removeUnitPinData',
  'setMergeData',
  'removeMergeData',
  'takeUnitErr',
  'setUnitName',
  'moveSubgraphInto',
  'bulkEdit',
]

export const G_METHOD_CALL = [...G_METHOD_CALL_GET, ...G_METHOD_CALL_SET]

export const G_METHOD_WATCH = [
  'watchGraph',
  'watchUnit',
  'watchGraphUnit',
  'watchUnitPath',
  'watchGraphUnitPath',
]

export const G_METHOD_REF = ['transcend', 'refSubComponent', 'refUnit']

export const G_METHOD = [...G_METHOD_CALL, ...G_METHOD_WATCH, ...G_METHOD_REF]

export interface $G_C {
  $setUnitPinData(data: GraphSetUnitPinDataData): void
  $setUnitName(data: GraphSetUnitNameData): void
  $removeUnitPinData(data: GraphRemoveUnitPinDataData): void
  $addUnit(data: GraphAddUnitData): void
  $addUnits(data: GraphAddUnitsData): void
  $cloneUnit(data: GraphCloneUnitData): void
  $removeUnit(data: GraphRemoveUnitData): void
  $moveUnit(data: GraphMoveUnitData): void
  $exposePinSet(data: GraphExposePinSetData): void
  $coverPinSet(data: GraphCoverPinSetData): void
  $exposePin(data: GraphExposePinData): void
  $coverPin(data: GraphCoverPinData): void
  $plugPin(data: GraphPlugPinData): void
  $unplugPin(data: GraphUnplugPinData): void
  $exposeUnitPinSet(data: GraphExposeUnitPinSetData): void
  $coverUnitPinSet(data: GraphCoverUnitPinSetData): void
  $setPinSetId(data: GraphSetPinSetIdData): void
  $setPinSetFunctional(data: GraphSetPinSetFunctionalData): void
  $addMerge(data: GraphAddMergeData): void
  $removeMerge(data: GraphRemoveMergeData): void
  $setUnitPinConstant(data: GraphSetUnitPinConstant): void
  $setUnitPinIgnored(data: GraphSetUnitPinIgnoredData): void
  $addMerges(data: GraphAddMergesData): void
  $setMergeData(data: GraphSetMergeDataData): void
  $removeMergeData(data: GraphRemoveMergeDataData): void
  $addPinToMerge(data: GraphAddPinToMergeData): void
  $removePinFromMerge(data: GraphRemovePinFromMergeData): void
  $takeUnitErr(data: GraphTakeUnitErrData): void
  $getUnitPinData(
    data: {},
    callback: (data: { input: Dict<any>; output: Dict<any> }) => void
  ): void
  $getUnitState(
    data: { unitId: string },
    callback: (state: State) => void
  ): void
  $snapshot(
    data: {},
    callback: (state: {
      input: Dict<any>
      output: Dict<any>
      memory: Dict<any>
    }) => void
  ): void
  $snapshotUnit(
    data: {
      unitId: string
    },
    callback: (state: {
      input: Dict<any>
      output: Dict<any>
      memory: Dict<any>
    }) => void
  ): void
  $removeUnitGhost(
    data: GraphRemoveUnitGhostData,
    callback: (data: { specId: string; bundle: UnitBundleSpec }) => void
  ): void
  $addUnitGhost(data: {
    unitId: string
    nextUnitId: string
    nextUnitBundle: UnitBundleSpec
    nextUnitPinMap: IOOf<Dict<string>>
  }): void
  $getGraphData(
    data: {},
    callback: Callback<{
      state: Dict<any>
      children: Dict<any>
      pinData: Dict<any>
      err: Dict<string | null>
      mergeData: Dict<any>
    }>
  ): void
  $getGraphState(data: {}, callback: (state: Dict<any>) => void): void
  $getGraphChildren(data: {}, callback: (state: Dict<any>) => void)
  $getGraphPinData(data: {}, callback: (data: Dict<any>) => void): void
  $getGraphErr(data: {}, callback: (data: Dict<string | null>) => void): void
  $getGraphMergeInputData(data: {}, callback: (data: Dict<any>) => void): void
  $getUnitInputData(
    data: { unitId: string },
    callback: (data: Dict<any>) => void
  ): void
  $getBundle(data: {}, callback: Callback<BundleSpec>): void
  $setMetadata(data: GraphSetMetadataData): void
  $reorderSubComponent(data: {
    parentId: string | null
    childId: string
    to: number
  })
  $moveSubComponentRoot(data: GraphMoveSubComponentRootData): void
  $moveSubgraphInto(data: GraphMoveSubGraphIntoData): void
  $moveSubgraphOutOf(data: GraphMoveSubGraphIntoData): void
  $explodeUnit(data: GraphExplodeUnitData): void
  $bulkEdit(data: GraphBulkEditData): void
}

export interface $G_W {
  $watchGraph(data: { events: string[] }, callback: Callback<any>): Unlisten
  $watchUnit(
    data: { unitId: string; events: string[] },
    callback: Callback<any>
  ): Unlisten
  $watchGraphUnit(
    data: { unitId: string },
    callback: (moment: any) => void
  ): Unlisten
  $watchUnitPath(
    data: { path: string[]; events: string[] },
    callback: Callback<any>
  ): Unlisten
  $watchGraphUnitPath(
    data: { path: string[]; events: string[] },
    callback: Callback<any>
  ): Unlisten
}

export interface $G_R {
  $compose(data: { id: string; unitId: string; _: string[] }): $Graph
  $refSubComponent(data: { unitId: string; _: string[] }): $Component
  $refUnit(data: { unitId: string; _: string[] }): $U
}

export interface $G extends $G_C, $G_W, $G_R {}
