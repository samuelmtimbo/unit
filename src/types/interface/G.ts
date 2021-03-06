import Merge from '../../Class/Merge'
import { Unit } from '../../Class/Unit'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { State } from '../../State'
import {
  GraphPinSpec,
  GraphExposedPinsSpec,
  GraphSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
  Specs,
} from '..'
import { Dict } from '../Dict'
import { GraphState } from '../GraphState'
import { IO } from '../IO'
import { U } from './U'
import { BundleSpec } from '../BundleSpec'
import { UnitBundleSpec } from '../UnitBundleSpec'

export interface G<I = any, O = any> {
  exposeOutputSets(outputs: GraphExposedPinsSpec): void
  exposeOutputSet(input: GraphPinSpec, id: string): void
  exposeOutput(
    subPinId: string,
    pinSpec: GraphSubPinSpec,
    id: string
  ): void
  exposeInputSets(inputs: GraphExposedPinsSpec): void
  exposeInputSet(
    input: GraphPinSpec,
    pinId: string,
    emit?: boolean
  ): void
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
  exposeInput(
    subPinId: string,
    pinSpec: GraphSubPinSpec,
    pinId: string
  ): void

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
  getSpecs(): Specs
  getSubPinSpec(
    type: IO,
    pinId: string,
    subPinId: string
  ): GraphSubPinSpec
  getExposedInputPin(id: string): Pin<I[keyof I]>
  getExposedOutputPin(id: string): Pin<O[keyof O]>
  getExposedPinSpec(type: IO, pinId: string): GraphPinSpec
  getExposedInputSpec(pinId: string): GraphPinSpec
  getExposedOutputSpec(pinId: string): GraphPinSpec
  getUnitSpec(id: string): GraphUnitSpec
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

  addUnits(units: GraphUnitsSpec): void
  addUnit(unit: UnitBundleSpec, unitId: string, _unit?: Unit, emit?: boolean): U

  removeUnit(unitId: string): Unit
  removeRoot(subComponentId: string): void
  removeMerge(mergeId: string): void
  removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void
  removeUnitGhost(unitId: string, nextUnitId: string, spec: GraphSpec): {
    spec_id: string
    state: {
      input: Dict<any>
      output: Dict<any>
      memory: Dict<any>
    }
  }
  swapUnitGhost(unitId: string, nextUnitId: string, spec: UnitBundleSpec): void

  memExposePin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void
  memExposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge
  )
  memAddUnit(unitId: string, unitSpec: UnitBundleSpec, unit: Unit): void
  memAddMerge(mergeId: string, mergeSpec: GraphMergesSpec, merge: Merge): void
  memRemoveUnit(unitId: string): void
  memRemoveMerge(mergeId: string): void

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
      link: Dict<{
        input: Dict<{ mergeId: string; oppositePinId: string }>
        output: Dict<{ mergeId: string; oppositePinId: string }>
      }>
      unit: Dict<string>
    },
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    nextMergePinId: Dict<{
      input: { mergeId: string, pinId: string }
      output: { mergeId: string, pinId: string }
    }>,
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
    pinId: string
  ): void
  moveMergeInto(
    graphId: string,
    mergeId: string,
    nextInputMergeId: { mergeId: string, pinId: string },
    nextOutputMergeId: { mergeId: string, pinId: string },
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>
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
  element: []
  not_element: []
  set_exposed_sub_pin: [IO, string, string, Pin, PinOpt]
  expose_pin_set: [IO, string, GraphPinSpec]
  cover_pin_set: [IO, string, GraphPinSpec]
  leaf_expose_pin_set: [string[], IO, string, GraphPinSpec]
  leaf_cover_pin_set: [string[], IO, string, GraphPinSpec]
  expose_pin: [IO, string, string, GraphSubPinSpec]
  plug_pin: [IO, string, string, GraphSubPinSpec]
  cover_pin: [IO, string, string, GraphSubPinSpec]
  unplug_pin: [IO, string, string]
  before_add_unit: [string, Unit]
  add_unit: [string, Unit]
  clone_unit: [string, string]
  remove_unit: [string, Unit]
  leaf_add_unit: [Unit, string[]]
  leaf_remove_unit: [Unit, string[]]
  move_unit: [string, string, string]
  before_remove_unit: [string]
  remove_unit_from_merge: [string, string]
  before_add_merge: [string, GraphMergeSpec, Merge]
  add_merge: [string, GraphMergeSpec]
  before_remove_merge: [string]
  add_pin_to_merge: [string, string, string, string]
  remove_merge: [string]
  remove_pin_from_merge: [string, string, string, string]
  merge_merges: [string[]]
  append_root: [string]
  move_sugraph_into: [
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
      link: Dict<{
        input: Dict<{ mergeId: string; oppositePinId: string }>
        output: Dict<{ mergeId: string; oppositePinId: string }>
      }>
      unit: Dict<string>
    },
    Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    Dict<{
      input: { mergeId: string, pinId: string }
      output: { mergeId: string, pinId: string }
    }>,
    Dict<string | null>,
    Dict<string[]>
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
    string[]
  ]
  move_link_pin_into: [string, string, IO, string, string | null, string | null]
  move_merge_into: [
    string,
    string,
    { mergeId: string, pinId: string },
    { mergeId: string, pinId: string },
  ]
  explode_unit: [string, Dict<string>, Dict<string>]
  metadata: [{ path: string[]; data: any }]
  component_append: [string, GraphUnitSpec]
  component_remove: [string]
}
