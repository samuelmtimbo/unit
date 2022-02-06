import { State } from '../../State'
import {
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '../../types'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { IO } from '../../types/IO'
import { Unlisten } from '../../types/Unlisten'
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
]

export const $G_METHOD_CALL_SET_THIS = [
  'addUnit',
  'addUnits',
  'removeUnit',
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

  $removeUnitPinData(data: { unitId: string; type: IO; pinId: string }): void

  $addUnit(data: { id: string; unit: GraphUnitSpec }): void

  $addUnits(data: { units: GraphUnitsSpec }): void

  $removeUnit(data: { id: string }): void

  $moveUnit(data: { id: string; unitId: string; inputId: string }): void

  $exposePinSet(data: { type: IO; id: string; pin: GraphExposedPinSpec }): void

  $coverPinSet(data: { type: IO; id: string }): void

  $exposePin(data: {
    type: IO
    id: string
    subPinId: string
    subPin: GraphExposedSubPinSpec
  }): void

  $coverPin(data: { type: IO; id: string; subPinId: string }): void

  $plugPin(data: {
    type: IO
    id: string
    subPinId: string
    subPin: GraphExposedSubPinSpec
  }): void

  $unplugPin(data: { type: IO; id: string; subPinId: string }): void

  $exposeUnitPinSet(data: {
    unitId: string
    type: IO
    id: string
    pin: GraphExposedPinSpec
  }): void

  $coverUnitPinSet(data: { unitId: string; type: IO; id: string }): void

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

  $setMetadata(data: { path: string[]; data: any }): void

  $appendSubComponentChild(data: {
    subComponentId: string
    childId: string
    slotName: string
  }): void

  $appendSubComponentChildren(data: {
    subComponentId: string
    children: string[]
    slotMap: Dict<string>
  }): void

  $appendSubComponent(data: { subComponentId: string }): void

  $moveSubgraphInto(data: {
    graphId: string
    nodeIds: {
      merge: string[]
      link: {
        unitId: string
        type: IO
        pinId: string
      }[]
      unit: string[]
    }
    nextIdMap: {
      merge: Dict<string>
      link: Dict<{
        input: Dict<{ mergeId: string; oppositePinId: string }>
        output: Dict<{ mergeId: string; oppositePinId: string }>
      }>
      unit: Dict<string>
    }
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>
    nextMergePinId: Dict<{
      nextInputMergePinId: string
      nextOutputMergePinId: string
    }>
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
    nextInputMergeId: string | null
    nextOutputMergeId: string | null
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>
  }): void

  // $moveDatumInto(data: { graphId: string, datumId: string }): void

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
  $transcend(data: { id: string; unitId: string; _: string[] }): $Graph

  $refSubComponent(data: { unitId: string; _: string[] }): $Component

  $refUnit(data: { unitId: string; _: string[] }): $U
}

export interface $G extends $G_C, $G_W, $G_R {}
