import {
  GraphAddMergeData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphAddUnitGhostData,
  GraphBulkEditData,
  GraphCloneUnitData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphExposeUnitPinSetData,
  GraphMoveSubComponentRootData,
  GraphMoveSubGraphIntoData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemoveMergeDataData,
  GraphRemovePinFromMergeData,
  GraphRemoveUnitData,
  GraphRemoveUnitGhostData,
  GraphRemoveUnitPinDataData,
  GraphReorderSubComponentData,
  GraphSetMergeDataData,
  GraphSetMetadataData,
  GraphSetPinSetDefaultIgnoredData,
  GraphSetPinSetFunctionalData,
  GraphSetPinSetIdData,
  GraphSetUnitIdData,
  GraphSetUnitPinConstant,
  GraphSetUnitPinDataData,
  GraphSetUnitPinIgnoredData,
  GraphSetUnitPinSetId,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from '../../../Class/Graph/interface'
import { Memory } from '../../../Class/Unit/Memory'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $Component } from './$Component'
import { $U } from './$U'

export const G_METHOD_GET = [
  'getPinData',
  'getInputData',
  'getUnitPinData',
  'getGraphChildren',
  'getGraphPinData',
  'getGraphData',
  'getGraphErr',
  'getGraphMergeInputData',
  'getUnitInputData',
  'getUnitBundleSpec',
  'getSpec',
  'getBundle',
]

export const G_METHOD_CALL = [
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
  'setUnitId',
  'setUnitPinData',
  'setUnitPinConstant',
  'setUnitPinIgnored',
  'setUnitPinSetId',
  'setPinSetId',
  'addMerge',
  'removeMerge',
  'addMerges',
  'addPinToMerge',
  'removePinFromMerge',
  'mergeMerges',
  'setMetadata',
  'moveUnitInto',
  'appendRoot',
  'removeRoot',
  'appendParentRoot',
  'moveSubComponentRoot',
  'reorderSubComponent',
  'removeUnitPinData',
  'setMergeData',
  'removeMergeData',
  'takeUnitErr',
  'setUnitId',
  'moveSubgraphInto',
  'bulkEdit',
]

export const G_METHOD_WATCH = [
  'watchGraph',
  'watchUnit',
  'watchGraphUnit',
  'watchUnitPath',
  'watchGraphUnitPath',
]

export const G_METHOD_REF = ['refSubComponent', 'refUnit']

export interface $G_G {
  $getUnitPinData(
    data: {},
    callback: (data: { input: Dict<any>; output: Dict<any> }) => void
  ): void
  $snapshot(data: {}, callback: (state: Memory) => void): void
  $snapshotUnit(
    data: {
      unitId: string
    },
    callback: (state: Memory) => void
  ): void
  $getGraphData(
    data: {},
    callback: Callback<{
      children: Dict<any>
      pinData: Dict<any>
      err: Dict<string | null>
      mergeData: Dict<any>
    }>
  ): void
  $getGraphChildren(data: {}, callback: (state: Dict<any>) => void)
  $getGraphPinData(data: {}, callback: (data: Dict<any>) => void): void
  $getGraphErr(data: {}, callback: (data: Dict<string | null>) => void): void
  $getGraphMergeInputData(data: {}, callback: (data: Dict<any>) => void): void
  $getUnitInputData(
    data: { unitId: string },
    callback: (data: Dict<any>) => void
  ): void
  $getBundle(
    data: { deep?: boolean; prune?: boolean },
    callback: Callback<BundleSpec>
  ): void
}

export interface $G_C {
  $setUnitPinData(data: GraphSetUnitPinDataData): void
  $setUnitId(data: GraphSetUnitIdData): void
  $removeUnitPinData(data: GraphRemoveUnitPinDataData): void
  $addUnit(data: GraphAddUnitData): void
  $cloneUnit(data: GraphCloneUnitData): void
  $removeUnit(data: GraphRemoveUnitData): void
  $exposePinSet(data: GraphExposePinSetData): void
  $coverPinSet(data: GraphCoverPinSetData): void
  $exposePin(data: GraphExposePinData): void
  $coverPin(data: GraphCoverPinData): void
  $plugPin(data: GraphPlugPinData): void
  $unplugPin(data: GraphUnplugPinData): void
  $exposeUnitPinSet(data: GraphExposeUnitPinSetData): void
  $coverUnitPinSet(data: GraphCoverUnitPinSetData): void
  $setPinSetId(data: GraphSetPinSetIdData): void
  $setPinSetDefaultIgnored(data: GraphSetPinSetDefaultIgnoredData): void
  $setPinSetFunctional(data: GraphSetPinSetFunctionalData): void
  $addMerge(data: GraphAddMergeData): void
  $removeMerge(data: GraphRemoveMergeData): void
  $setUnitPinSetId(data: GraphSetUnitPinSetId): void
  $setUnitPinConstant(data: GraphSetUnitPinConstant): void
  $setUnitPinIgnored(data: GraphSetUnitPinIgnoredData): void
  $setMergeData(data: GraphSetMergeDataData): void
  $removeMergeData(data: GraphRemoveMergeDataData): void
  $addPinToMerge(data: GraphAddPinToMergeData): void
  $removePinFromMerge(data: GraphRemovePinFromMergeData): void
  $takeUnitErr(data: GraphTakeUnitErrData): void
  $removeUnitGhost(
    data: GraphRemoveUnitGhostData,
    callback: (data: { specId: string; bundle: UnitBundleSpec }) => void
  ): void
  $addUnitGhost(data: GraphAddUnitGhostData): void
  $setMetadata(data: GraphSetMetadataData): void
  $reorderSubComponent(data: GraphReorderSubComponentData): void
  $moveSubComponentRoot(data: GraphMoveSubComponentRootData): void
  $moveSubgraphInto(data: GraphMoveSubGraphIntoData): void
  $moveSubgraphOutOf(data: GraphMoveSubGraphIntoData): void
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
  $refSubComponent(data: { unitId: string; _: string[] }): $Component
  $refUnit(data: { unitId: string; _: string[]; detached?: boolean }): $U
}

export interface $G extends $G_G, $G_C, $G_W, $G_R {}
