import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphPlugOuterSpec,
  GraphSpec,
  GraphSubPinSpec,
  GraphUnitPinOuterSpec,
  GraphUnitsSpec,
} from '../..'
import { State } from '../../../State'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { IO } from '../../IO'
import { IOOf, _IOOf } from '../../IOOf'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $Component } from './$Component'
import { $Graph } from './$Graph'
import { $U } from './$U'

export const $G_METHOD_CALL_GET = [
  'getPinData',
  'getInputData',
  'getUnitPinData',
  'getUnitState',
  'getGraphState',
  'getGraphChildren',
  'getGraphPinData',
  'getGraphErr',
  'getGraphMergeInputData',
  'getUnitInputData',
  'getSpec',
  'getBundle',
]

export const $G_METHOD_CALL_SET_THIS = [
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
]

export const $G_METHOD_CALL_SET_THAT = [
  'setUnitPinData',
  'removeUnitPinData',
  'setUnitPinConstant',
  'setUnitPinIgnored',
  'setMergeData',
  'removeMergeData',
  'takeUnitErr',
]

export const $G_METHOD_CALL_SET = [
  ...$G_METHOD_CALL_SET_THIS,
  ...$G_METHOD_CALL_SET_THAT,
]

export const $G_METHOD_CALL = [...$G_METHOD_CALL_GET, ...$G_METHOD_CALL_SET]

export const $G_METHOD_WATCH = [
  'watchGraph',
  'watchUnit',
  'watchGraphUnit',
  'watchUnitPath',
  'watchGraphUnitPath',
]

export const $G_METHOD_REF = ['transcend', 'refSubComponent', 'refUnit']

export const $G_METHOD = [
  ...$G_METHOD_CALL,
  ...$G_METHOD_WATCH,
  ...$G_METHOD_REF,
]

export interface $G_C {
  $setUnitPinData(data: {
    unitId: string
    pinId: string
    type: IO
    data: string
  }): void
  $setUnitName(data: { unitId: string; name: string }): void
  $removeUnitPinData(data: { unitId: string; type: IO; pinId: string }): void
  $addUnit(data: { id: string; unit: UnitBundleSpec }): void
  $addUnits(data: { units: GraphUnitsSpec }): void
  $cloneUnit(data: { unitId: string; newUnitId: string }): void
  $removeUnit(data: { id: string }): void
  $moveUnit(data: { id: string; unitId: string; inputId: string }): void
  $exposePinSet(data: { type: IO; id: string; pin: GraphPinSpec }): void
  $coverPinSet(data: { type: IO; id: string }): void
  $exposePin(data: {
    type: IO
    id: string
    subPinId: string
    subPin: GraphSubPinSpec
  }): void
  $coverPin(data: { type: IO; id: string; subPinId: string }): void
  $plugPin(data: {
    type: IO
    id: string
    subPinId: string
    subPin: GraphSubPinSpec
  }): void
  $unplugPin(data: { type: IO; id: string; subPinId: string }): void
  $exposeUnitPinSet(data: {
    unitId: string
    type: IO
    id: string
    pin: GraphPinSpec
  }): void
  $coverUnitPinSet(data: { unitId: string; type: IO; id: string }): void
  $setPinSetId(data: { type: IO; pinId: string; nextPinId: string }): void
  $setPinSetFunctional(data: {
    type: IO
    pinId: string
    functional: boolean
  }): void
  $addMerge(data: { id: string; merge: GraphMergeSpec }): void
  $removeMerge(data: { id: string })
  $setUnitPinConstant(data: {
    unitId: string
    type: IO
    pinId: string
    constant: boolean
  }): void
  $setUnitPinIgnored(data: {
    unitId: string
    type: IO
    pinId: string
    ignored: boolean
  }): void
  $addMerges(data: { merges: GraphMergesSpec }): void
  $setMergeData(data: { id: string; data: string }): void
  $removeMergeData(data: { id: string }): void
  $addPinToMerge(data: {
    mergeId: string
    unitId: string
    type: IO
    pinId: string
  }): void
  $removePinFromMerge(data: {
    mergeId: string
    unitId: string
    type: IO
    pinId: string
  }): void
  $mergeMerges(data: { mergeIds: string[] }): void
  $takeUnitErr(data: { unitId: string }): void
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
    data: {
      unitId: string
      nextUnitId: string
      nextUnitSpec: GraphSpec
    },
    callback: (data: {
      spec_id: string
      state: {
        input: Dict<any>
        output: Dict<any>
        memory: Dict<any>
      }
    }) => void
  ): void
  $getGraphData(
    callback: Callback<{
      state: Dict<any>
      children: Dict<any>
      pinData: Dict<any>
      err: Dict<string | null>
      mergeData: Dict<any>
    }>
  ): Promise<void>
  $getGraphState(data: {}, callback: (state: Dict<any>) => void): void
  $getGraphChildren(data: {}, callback: (state: Dict<any>) => void)
  $getGraphPinData(data: {}, callback: (data: Dict<any>) => void): void
  $getGraphErr(data: {}, callback: (data: Dict<string | null>) => void): void
  $getGraphMergeInputData(data: {}, callback: (data: Dict<any>) => void): void
  $getUnitInputData(
    data: { unitId: string },
    callback: (data: Dict<any>) => void
  ): void
  $getSpec(data: {}, callback: Callback<GraphSpec>): void
  $getBundle(data: {}, callback: Callback<BundleSpec>): void
  $setMetadata(data: { path: string[]; data: any }): void
  $moveSubComponentChild(data: {
    subComponentId: string
    childId: string
    slotName: string
  }): void
  $moveSubComponentChildren(data: {
    subComponentId: string
    children: string[]
    slotMap: Dict<string>
  }): void
  $appendSubComponent(data: { subComponentId: string }): void
  $moveSubgraphInto(data: {
    graphId: string
    nodeIds: {
      merge: string[]
      link: GraphUnitPinOuterSpec[]
      unit: string[]
      plug: GraphPlugOuterSpec[]
    }
    nextIdMap: {
      merge: Dict<string>
      link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
      plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
      unit: Dict<string>
    }
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>
    nextMergePinId: Dict<{
      input: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
      output: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
    }>
    nextPlugSpec: {
      input: Dict<Dict<GraphSubPinSpec>>
      output: Dict<Dict<GraphSubPinSpec>>
    }
    nextSubComponentParentMap: Dict<string | null>
    nextSubComponentChildrenMap: Dict<string[]>
  }): void
  $moveUnitInto(data: {
    graphId: string
    unitId: string
    nextUnitId: string
  }): void
  $moveLinkPinInto(data: {
    graphId: string
    unitId: string
    type: IO
    pinId: string
  }): void
  $moveMergePinInto(data: {
    graphId: string
    mergeId: string
    nextInputMergeId: { mergeId: string; pinId: string }
    nextOutputMergeId: { mergeId: string; pinId: string }
  }): void
  $movePlugInto(data: {
    graphId: string
    type: IO
    pinId: string
    subPinId: string
    subPinSpec: GraphSubPinSpec
  }): void
  $explodeUnit(data: {
    unitId: string
    mapUnitId: Dict<string>
    mapMergeId: Dict<string>
  }): void
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
