import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphPinsSpec,
  GraphSpec,
  GraphSubPinSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '..'
import { Graph } from '../../Class/Graph'
import Merge from '../../Class/Merge'
import { Unit } from '../../Class/Unit'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { State } from '../../State'
import { BundleSpec } from '../BundleSpec'
import { Dict } from '../Dict'
import { GraphState } from '../GraphState'
import { IO } from '../IO'
import { IOOf, _IOOf } from '../IOOf'
import { UnitBundleSpec } from '../UnitBundleSpec'
import { U } from './U'

export interface G<I = any, O = any> {
  exposeOutputSets(outputs: GraphPinsSpec): void
  exposeOutputSet(input: GraphPinSpec, id: string): void
  exposeOutput(subPinId: string, pinSpec: GraphSubPinSpec, id: string): void
  exposeInputSets(inputs: GraphPinsSpec): void
  exposeInputSet(input: GraphPinSpec, pinId: string, emit?: boolean): void
  exposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    emit?: boolean
  ): void
  exposePin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void
  exposeInput(subPinId: string, pinSpec: GraphSubPinSpec, pinId: string): void
  coverPin(type: IO, id: string, subPinId: string, emit?: boolean): void
  coverInputSet(id: string): void
  coverInput(subPinId: string, id: string): void
  coverPinSet(type: IO, id: string, emit?: boolean): void
  coverOutputSet(id: string): void
  coverOutput(subPinId: string, id: string): void
  plugPin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void
  plugInput(subPinId: string, subPin: GraphSubPinSpec, id: string): void
  plugOutput(subPinId: string, subPin: GraphSubPinSpec, id: string): void
  unplugOutput(subPinId: string, id: string): void
  unplugInput(subPinId: string, id: string): void
  unplugPin(type: IO, pinId: string, subPinId: string): void
  getSpec(): GraphSpec
  getBundleSpec(): BundleSpec
  getSubPinSpec(type: IO, pinId: string, subPinId: string): GraphSubPinSpec
  getExposedInputPin(id: string): Pin<I[keyof I]>
  getExposedOutputPin(id: string): Pin<O[keyof O]>
  getExposedPinSpec(type: IO, pinId: string): GraphPinSpec
  getExposedInputSpec(pinId: string): GraphPinSpec
  getExposedOutputSpec(pinId: string): GraphPinSpec
  getGraphUnitSpec(id: string): GraphUnitSpec
  getUnitByPath(path: string[]): Unit<any, any>
  getUnitPin(id: string, type: IO, pinId: string): Pin<any>
  getUnitPinData(
    id: string,
    type: IO,
    pinId: string
  ): { input: Dict<any>; output: Dict<any> }
  getUnitInput(id: string, pinId: string): Pin<any>
  getUnitOutput(id: string, pinId: string): Pin<any>
  getUnitState(unitId: string): State
  getGraphState(): GraphState
  getGraphChildren(): Dict<any>
  getGraphPinData(): object
  getUnitInputData(unitId: string): Dict<any>
  getGraphMergeInputData(): Dict<any>
  getGraphErr(): Dict<string | null>
  getMergeCount(): number
  getMergeUnitCount(mergeId: string): number
  getMergePinCount(mergeId: string): number
  getMergeSpec(mergeId: string): GraphMergeSpec
  addUnitSpecs(units: GraphUnitsSpec): void
  addUnitSpec(unitId: string, unit: UnitBundleSpec, emit?: boolean): U
  removeUnit(unitId: string): Unit
  removeRoot(subComponentId: string): void
  removeMerge(mergeId: string): void
  removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void
  removeUnitGhost(
    unitId: string,
    nextUnitId: string,
    spec: GraphSpec
  ): {
    spec_id: string
    state: {
      input: Dict<any>
      output: Dict<any>
      memory: Dict<any>
    }
  }
  swapUnitGhost(unitId: string, nextUnitId: string, spec: UnitBundleSpec): void
  addMerges(merges: GraphMergesSpec): void
  addMerge(mergeSpec: GraphMergeSpec, mergeId: string, emit: boolean): void
  addPinToMerge(mergeId: string, unitId: string, type: IO, pinId: string): void
  takeUnitErr(unitId: string): string | null
  mergeMerges(mergeIds: string[]): void
  setGraphState(state: any): void
  setPinSetId(type: IO, pinId: string, nextPinId: string): void
  setPinSetFunctional(type: IO, name: string, functional: boolean): void
  setUnitErr(unitId: string, err: string): void
  setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean
  ): void
  setUnitInputConstant(unitId: string, pinId: string, constant: boolean): void
  setUnitOutputConstant(unitId: string, pinId: string, constant: boolean): void
  setUnitInputIgnored(unitId: string, pinId: string, ignored: boolean): void
  setUnitOutputIgnored(unitId: string, pinId: string, ignored: boolean): void
  setUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ): void
  setUnitPinData(unitId: string, type: IO, pinId: string, data: any): void
  setUnitName(unitId: string, newUnitId: string, name: string): void
  setUnitInputData(unitId: string, pinId: string, data: any): void
  setUnitOutputData(unitId: string, pinId: string, data: any): void
  setMetadata(path: string[], data: any): void
  appendParentRoot(
    subComponentId: string,
    childId: string,
    slotName: string
  ): void
  appendParentRootChildren(
    subComponentId: string,
    children: string[],
    slotMap: Dict<string>
  ): void
  appendRoot(subComponentId): void
  moveUnit(id: string, unitId: string, inputId: string): void
  injectGraph(graph: Graph): void
  moveSubgraphInto(
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
      plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
      unit: Dict<string>
    },
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    nextMergePinId: Dict<{
      input: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
      output: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
    }>,
    nextPlugSpec: {
      input: Dict<Dict<GraphSubPinSpec>>
      output: Dict<Dict<GraphSubPinSpec>>
    },
    nextSubComponentParentMap: Dict<string | null>,
    nextSubComponentChildrenMap: Dict<string[]>
  ): void
  moveUnitInto(
    graphId: string,
    unitId: string,
    nextUnitId: string,
    ignoredPin: { input: Set<string>; output: Set<string> },
    ignoredMerge: Set<string>,
    nextPinMap: {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    },
    nextSubComponentParent: string | null,
    nextSubComponentChildren: string[]
  ): void
  moveLinkPinInto(
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    mergeId: string | null,
    oppositePinId: string | null,
    emit: boolean,
    graph?: Graph
  ): void
  moveMergeInto(
    graphId: string,
    mergeId: string,
    nextInputMergeId: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    },
    nextOutputMergeId: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    }
  ): void
  movePlugInto(
    graphId: string,
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void
  explodeUnit(
    unitId: string,
    mapUnitId: Dict<string>,
    mapMergeId: Dict<string>
  ): void
  hasUnit(id: string): boolean
  hasMerge(id: string): boolean
  isExposedInput(pin: GraphSubPinSpec): boolean
  isExposedOutput(pin: GraphSubPinSpec): boolean
  isPinMergedTo(mergeId: string, unitId: string, type: IO, pinId: string): void
  isExposedInputPinId(pinId: string): boolean
  isExposedOutputPinId(pinId: string): boolean
  isElement(): boolean
  refUnits(): Dict<Unit>
  refUnit(id: string): Unit<any, any>
  refMerges(): { [id: string]: U<any> }
  refMerge(mergeId: string): U<any>
  refMergePin(mergeId: string, type: IO): Pin<any>
}

export type G_J = {}

export type G_EE = {
  fork: [string, string[]]
  element: [string[]]
  not_element: [string[]]
  set_exposed_sub_pin: [IO, string, string, Pin, PinOpt, string[]]
  expose_pin_set: [IO, string, GraphPinSpec, any, string[]]
  cover_pin_set: [IO, string, GraphPinSpec, any, string[]]
  expose_pin: [IO, string, string, GraphSubPinSpec, string[]]
  plug_pin: [IO, string, string, GraphSubPinSpec, string[]]
  cover_pin: [IO, string, string, GraphSubPinSpec, string[]]
  unplug_pin: [IO, string, string, GraphSubPinSpec, string[]]
  before_remove_unit: [string, Unit, string[]]
  before_add_unit: [string, Unit, string[]]
  add_unit: [string, Unit, string[]]
  clone_unit: [string, string, Unit, string[]]
  remove_unit: [string, Unit, string[]]
  move_unit: [string, string, string, string[]]
  remove_unit_from_merge: [string, string, string[]]
  before_add_merge: [string, GraphMergeSpec, Merge, string[]]
  add_merge: [string, GraphMergeSpec, Merge, string[]]
  add_pin_to_merge: [string, string, string, string, string[]]
  before_remove_merge: [string, GraphMergeSpec, Merge, string[]]
  remove_merge: [string, GraphMergeSpec, Merge, string[]]
  remove_pin_from_merge: [string, string, string, string, string[]]
  merge_merges: [string[], string[]]
  append_root: [string, string[]]
  move_subgraph_into: [
    string,
    {
      merge: string[]
      link: {
        unitId: string
        type: IO
        pinId: string
      }[]
      unit: string[]
    },
    {
      merge: Dict<string>
      link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
      plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
      unit: Dict<string>
    },
    Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    Dict<{
      input: { mergeId: string; pinId: string }
      output: { mergeId: string; pinId: string }
    }>,
    {
      input: Dict<Dict<GraphSubPinSpec>>
      output: Dict<Dict<GraphSubPinSpec>>
    },
    Dict<string | null>,
    Dict<string[]>,
    string[]
  ]
  move_unit_into: [
    string,
    string,
    string,
    { input: Set<string>; output: Set<string> },
    Set<string>,
    {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    },
    string | null,
    string[],
    string[]
  ]
  move_link_pin_into: [
    string,
    string,
    IO,
    string,
    string | null,
    string | null,
    string[]
  ]
  move_merge_into: [
    string,
    string,
    { mergeId: string; pinId: string },
    { mergeId: string; pinId: string },
    string[]
  ]
  explode_unit: [string, Dict<string>, Dict<string>, string[]]
  set_unit_pin_constant: [string, IO, string, boolean, string[]]
  set_unit_pin_data: [string, IO, string, any, string[]]
  inject_graph: [BundleSpec, string[]]
  metadata: [{ path: string[]; data: any }, string[]]
  component_append: [string, GraphUnitSpec, string[]]
  component_remove: [string, string[]]
  set_pin_set_id: [IO, string, string, string[]]
  set_unit_id: [string, string, string, string[]]
}
