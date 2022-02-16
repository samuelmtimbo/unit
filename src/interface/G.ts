import Merge from '../Class/Merge'
import { Unit } from '../Class/Unit'
import { Pin } from '../Pin'
import { PinOpt } from '../PinOpt'
import { State } from '../State'
import {
  GraphExposedPinSpec,
  GraphExposedPinsSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
  Specs,
} from '../types'
import { Dict } from '../types/Dict'
import { GraphState } from '../types/GraphState'
import { IO } from '../types/IO'
import { U } from './U'

export interface G<I = any, O = any> {
  element: boolean

  getSpec(): GraphSpec

  getSpecs(): Specs

  exposeOutputSets(outputs: GraphExposedPinsSpec): void

  exposeOutputSet(input: GraphExposedPinSpec, id: string): void

  exposeOutput(
    subPinId: string,
    pinSpec: GraphExposedSubPinSpec,
    id: string
  ): void

  coverOutputSet(id: string): void

  coverOutput(subPinId: string, id: string): void

  plugOutput(subPinId: string, subPin: GraphExposedSubPinSpec, id: string): void

  unplugOutput(subPinId: string, id: string): void

  isExposedOutput(pin: GraphExposedSubPinSpec): boolean

  exposeInputSets(inputs: GraphExposedPinsSpec): void

  exposeInputSet(
    input: GraphExposedPinSpec,
    pinId: string,
    emit?: boolean
  ): void

  exposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    emit?: boolean
  ): void

  memExposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge
  )

  setGraphState(state: any): void

  setPinSetFunctional(type: IO, name: string, functional: boolean): void

  exposePin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void

  memExposePin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void

  exposeInput(
    subPinId: string,
    pinSpec: GraphExposedSubPinSpec,
    pinId: string
  ): void

  coverInputSet(id: string): void

  coverInput(subPinId: string, id: string): void

  coverPinSet(type: IO, id: string, emit?: boolean): void

  plugPin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void

  plugInput(subPinId: string, subPin: GraphExposedSubPinSpec, id: string): void

  unplugInput(subPinId: string, id: string): void

  coverPin(type: IO, id: string, subPinId: string, emit?: boolean): void

  getSubPinSpec(
    type: IO,
    pinId: string,
    subPinId: string
  ): GraphExposedSubPinSpec

  unplugPin(type: IO, pinId: string, subPinId: string): void

  isExposedInput(pin: GraphExposedSubPinSpec): boolean

  getExposedInputPin(id: string): Pin<I[keyof I]>

  getExposedOutputPin(id: string): Pin<O[keyof O]>

  getExposedPinSpec(type: IO, pinId: string): GraphExposedPinSpec

  isExposedInputPinId(pinId: string): boolean

  isExposedOutputPinId(pinId: string): boolean

  getExposedInputSpec(pinId: string): GraphExposedPinSpec

  getExposedOutputSpec(pinId: string): GraphExposedPinSpec

  hasUnit(id: string): boolean

  refUnit(id: string): U<any, any>

  getUnitSpec(id: string): GraphUnitSpec

  getUnitByPath(path: string[]): U<any, any>

  getUnitPin(id: string, type: IO, pinId: string): Pin<any>

  getUnitPinData(
    id: string,
    type: IO,
    pinId: string
  ): { input: Dict<any>; output: Dict<any> }

  getUnitInput(id: string, pinId: string): Pin<any>

  getUnitOutput(id: string, pinId: string): Pin<any>

  getUnitState(unitId: string): Promise<State>

  getGraphState(): Promise<GraphState>

  getGraphChildren(): Dict<any>

  setUnitErr(unitId: string, err: string): void

  takeUnitErr(unitId: string): string | null

  getGraphPinData(): object

  getUnitInputData(unitId: string): Dict<any>

  getGraphMergeInputData(): Dict<any>

  getGraphErr(): Dict<string | null>

  refMerges(): { [id: string]: U<any> }

  refMerge(mergeId: string): U<any>

  getMergeCount(): number

  getMergeUnitCount(mergeId: string): number

  getMergePinCount(mergeId: string): number

  getMergeSpec(mergeId: string): GraphMergeSpec

  addUnits(units: GraphUnitsSpec): void

  addUnit(unit: GraphUnitSpec, unitId: string, _unit?: U, emit?: boolean): U

  memAddUnit(unitId: string, unitSpec: GraphUnitSpec, unit: U): void

  removeUnit(unitId: string): U

  memRemoveUnit(unitId: string): void

  moveUnit(id: string, unitId: string, inputId: string): void

  addMerges(merges: GraphMergesSpec): void

  addMerge(mergeSpec: GraphMergeSpec, mergeId: string, emit: boolean): void

  memAddMerge(mergeId: string, mergeSpec: GraphMergesSpec, merge: U): void

  addPinToMerge(mergeId: string, unitId: string, type: IO, pinId: string): void

  removeMerge(mergeId: string): void

  memRemoveMerge(mergeId: string): void

  removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void

  mergeMerges(mergeIds: string[]): void

  isPinMergedTo(mergeId: string, unitId: string, type: IO, pinId: string): void

  togglePinMerge(mergeId: string, unitId: string, type: IO, pinId: string): void

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

  removeRoot(subComponentId: string): void

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
      nextInputMergePinId: string
      nextOutputMergePinId: string
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
    nextInputMergeId: string | null,
    nextOutputMergeId: string | null,
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

  refUnits(): Dict<Unit>

  refMergePin(mergeId: string, type: IO): Pin<any>
}

export type G_J = {}

export type G_EE = {
  element: []
  not_element: []
  set_exposed_sub_pin: [IO, string, string, Pin, PinOpt]
  expose_pin_set: [IO, string, GraphExposedPinSpec]
  cover_pin_set: [IO, string, GraphExposedPinSpec]
  leaf_expose_pin_set: [string[], IO, string, GraphExposedPinSpec]
  leaf_cover_pin_set: [string[], IO, string, GraphExposedPinSpec]
  expose_pin: [IO, string, string, GraphExposedSubPinSpec]
  plug_pin: [IO, string, string, GraphExposedSubPinSpec]
  cover_pin: [IO, string, string, GraphExposedSubPinSpec]
  unplug_pin: [IO, string, string]
  before_add_unit: [string, Unit]
  add_unit: [string, Unit]
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
      nextInputMergePinId: string
      nextOutputMergePinId: string
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
    string | null,
    string | null,
    Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>
  ]
  explode_unit: [string, Dict<string>, Dict<string>]
  metadata: [{ path: string[]; data: any }]
  component_append: [string, GraphUnitSpec]
  component_remove: [string]
}
