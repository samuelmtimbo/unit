import { GraphPinsSpec, GraphSubPinSpec } from '..'
import { GraphMoveSubGraphData } from '../../Class/Graph/interface'
import Merge from '../../Class/Merge'
import { SnapshotOpt, Unit } from '../../Class/Unit'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Action } from '../Action'
import { BundleSpec } from '../BundleSpec'
import { Dict } from '../Dict'
import { GraphMergeSpec } from '../GraphMergeSpec'
import { GraphMergesSpec } from '../GraphMergesSpec'
import { GraphPinSpec } from '../GraphPinSpec'
import { GraphSpec } from '../GraphSpec'
import { GraphUnitSpec } from '../GraphUnitSpec'
import { GraphUnitsSpec } from '../GraphUnitsSpec'
import { IO } from '../IO'
import { IOOf } from '../IOOf'
import { UnitBundleSpec } from '../UnitBundleSpec'

export type GraphSelection = {
  merge?: string[]
  link?: {
    unitId: string
    type: IO
    pinId: string
  }[]
  unit?: string[]
  plug?: {
    type: IO
    pinId: string
    subPinId: string
  }[]
  data?: string[]
}

export type GraphSelectionSpec = {
  units: GraphUnitsSpec
  merges: GraphMergesSpec
  inputs: GraphPinsSpec
  outputs: GraphPinsSpec
}

export type G_MoveSubgraphIntoArgs = [
  string,
  UnitBundleSpec,
  GraphSpec,
  string,
  GraphSelection,
  GraphMoveSubGraphData['nextIdMap'],
  GraphMoveSubGraphData['nextPinIdMap'],
  GraphMoveSubGraphData['nextMergePinId'],
  GraphMoveSubGraphData['nextPlugSpec'],
  GraphMoveSubGraphData['nextSubComponentParentMap'],
  GraphMoveSubGraphData['nextSubComponentChildrenMap'],
  GraphMoveSubGraphData['nextSubComponentIndexMap'],
  GraphMoveSubGraphData['nextUnitPinMergeMap'],
  GraphMoveSubGraphData['nextSubComponentSlot'],
  GraphMoveSubGraphData['nextSubComponentParentSlot'],
]

export interface G<
  I extends Dict<any> = Dict<any>,
  O extends Dict<any> = Dict<any>,
  U_ = any,
> {
  exposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    ...flags: any[]
  ): void
  exposePin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    ...flags: any[]
  ): void
  coverPin(type: IO, pinId: string, subPinId: string, ...extra: any[]): void
  coverPinSet(type: IO, pinId: string, ...extra: any): void
  plugPin(
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    ...extra: any[]
  ): void
  unplugPin(type: IO, pinId: string, subPinId: string, ...extra: any[]): void
  getSpec(): GraphSpec
  getBundleSpec(opt: SnapshotOpt): BundleSpec
  getSubPinSpec(type: IO, pinId: string, subPinId: string): GraphSubPinSpec
  getExposedInputPin<K extends keyof I>(pinId: K): Pin<I[K]>
  getExposedOutputPin<K extends keyof O>(pinId: K): Pin<O[K]>
  getExposedPinSpec(type: IO, pinId: string): GraphPinSpec
  getExposedInputSpec(pinId: string): GraphPinSpec
  getExposedOutputSpec(pinId: string): GraphPinSpec
  getGraphUnitSpec(unitId: string): GraphUnitSpec
  getUnitByPath(path: string[]): U_
  getUnitPin(unitId: string, type: IO, pinId: string): Pin<any>
  getUnitData(
    unitId: string,
    type: IO,
    pinId: string
  ): { input: Dict<any>; output: Dict<any> }
  getUnitInput(unitId: string, pinId: string): Pin<any>
  getUnitOutput(unitId: string, pinId: string): Pin<any>
  getGraphChildren(): Dict<any>
  getGraphPinData(): object
  getUnitInputData(unitId: string): Dict<any>
  getGraphMergeInputData(): Dict<any>
  getGraphErr(): Dict<string | null>
  getMergeData(mergeId: string): any
  getMergeCount(): number
  getMergeUnitCount(mergeId: string): number
  getMergePinCount(mergeId: string): number
  getMergesSpec(): GraphMergesSpec
  getMergeSpec(mergeId: string): GraphMergeSpec
  addUnitSpec(unitId: string, unit: UnitBundleSpec, ...extra: any[]): void
  addUnit(
    unitId: string,
    unit: U_,
    bundle?: UnitBundleSpec,
    ...extra: any[]
  ): void
  cloneUnit(unitId: string, newUnitId: string, ...extra: any[]): void
  removeUnit(unitId: string, destroy: boolean, ...extra: any[]): void
  removeRoot(subComponentId: string): void
  removeMerge(mergeId: string, ...extra: any[]): void
  removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    ...extra: any[]
  ): void
  removeUnitGhost(
    unitId: string,
    nextUnitId: string,
    spec: GraphSpec,
    ...extra: any[]
  ): { specId: string; bundle: UnitBundleSpec }
  addUnitGhost(
    unitId: string,
    nextUnitId: string,
    nextUnitBundle: UnitBundleSpec,
    nextUnitPinMap: IOOf<Dict<string>>
  ): void
  addMerge(mergeSpec: GraphMergeSpec, mergeId: string, ...extra: any[]): void
  addPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    ...extra: any[]
  ): void
  takeUnitErr(unitId: string): string | null
  setPinSetId(type: IO, pinId: string, nextPinId: string): void
  setPinSetFunctional(type: IO, name: string, functional: boolean): void
  setPinSetDefaultIgnored(type: IO, name: string, ignored: boolean): void
  setUnitSize(unitId: string, width: number, height: number): void
  setSubComponentSize(unitId: string, width: number, height: number): void
  setComponentSize(unitId: string, width: number, height: number): void
  setUnitPinSetId(
    unitId: string,
    type: IO,
    pinId: string,
    newPinId: string,
    ...extra: any[]
  ): void
  setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean,
    ...extra: any[]
  ): void
  setUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ): void
  setUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    data: any,
    ...extra: any[]
  ): void
  getUnitPinData(unitId: string, type: IO, pinId: string): any
  isUnitPinRef(unitId: string, type: IO, pinId: string): boolean
  isUnitPinConstant(unitId: string, type: IO, pinId: string): boolean
  removeUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    ...extra: any[]
  ): any
  removeMergeData(mergeId: string): any
  setUnitId(
    unitId: string,
    newUnitId: string,
    name: string,
    specId: string
  ): void
  setMetadata(path: string[], data: any): void
  getExposedPinSpecs(): IOOf<GraphPinsSpec>
  moveSubComponentRoot(
    subComponentId: string | null,
    children: string[],
    slotMap: Dict<string>,
    index: number
  ): void
  moveSubgraphInto(...args: G_MoveSubgraphIntoArgs): void
  moveSubgraphOutOf(...args: G_MoveSubgraphIntoArgs): void
  reorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number
  ): void
  hasUnit(unitId: string): boolean
  hasMerge(mergeId: string): boolean
  hasMergePin(mergeId: string, unitId: string, type: IO, pinId: string): boolean
  isExposedInput(pin: GraphSubPinSpec): boolean
  isExposedOutput(pin: GraphSubPinSpec): boolean
  isExposedInputPinId(pinId: string): boolean
  isExposedOutputPinId(pinId: string): boolean
  isElement(): boolean
  getUnits(): Dict<U_>
  getUnit(unitId: string): U_
  getMerges(): { [unitId: string]: U_ }
  getPinPlugCount(type: IO, pinId: string): number
  getPlugSpecs(): IOOf<Dict<Dict<GraphSubPinSpec>>>
  getMerge(mergeId: string): U_
  bulkEdit(actions: Action[]): void
  moveRoot(
    parentId: string | null,
    childId: string,
    to: number,
    slotName: string
  ): void
  hasPlug(type: IO, pinId: string, subPinId: string): boolean
  removePinOrMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    ...extra: any[]
  ): void
  fork(): void
  setName(name: string): void
  setSlot(slotName: string, subComponentId: string): void
  getSlot(slotName: string): string
}

export type G_J = {}

export type G_EE = {
  fork: [string, GraphSpec, boolean, string[]]
  set_name: [string, string[]]
  element: [string[]]
  not_element: [string[]]
  set_exposed_sub_pin: [IO, string, string, Pin, PinOpt, string[]]
  expose_pin_set: [IO, string, GraphPinSpec, any, string[]]
  cover_pin_set: [IO, string, GraphPinSpec, any, string[]]
  expose_pin: [IO, string, string, GraphSubPinSpec, string[]]
  plug_pin: [IO, string, string, GraphSubPinSpec, string[]]
  cover_pin: [IO, string, string, GraphSubPinSpec, string[]]
  unplug_pin: [IO, string, string, GraphSubPinSpec, string[]]
  set_pin_set_functional: [IO, string, boolean, string[]]
  set_pin_set_default_ignored: [IO, string, boolean, string[]]
  before_remove_unit: [string, Unit, string[]]
  before_add_unit: [string, Unit, string[]]
  add_unit: [string, UnitBundleSpec, Unit, string[]]
  clone_unit: [string, string, Unit, string[]]
  remove_unit: [string, UnitBundleSpec, Unit, string[]]
  move_unit: [string, string, string, string[]]
  remove_unit_from_merge: [string, string, string[]]
  before_add_merge: [string, GraphMergeSpec, Merge, string[]]
  add_merge: [string, GraphMergeSpec, Merge, string[]]
  add_pin_to_merge: [string, string, string, string, string[]]
  before_remove_merge: [string, GraphMergeSpec, Merge, string[]]
  remove_merge: [string, GraphMergeSpec, Merge, string[]]
  remove_pin_from_merge: [string, string, string, string, string[]]
  merge_merges: [string[], string[]]
  move_sub_component_root: [
    string | null,
    Dict<string>,
    string[],
    number,
    Dict<string>,
    Dict<string>,
    string[],
  ]
  reorder_sub_component: [string | null, string, number, string[]]
  move_subgraph_into: [...G_MoveSubgraphIntoArgs, string[]]
  move_subgraph_out_of: [...G_MoveSubgraphIntoArgs, string[]]
  explode_unit: [string, Dict<string>, Dict<string>, string[]]
  set_unit_pin_constant: [string, IO, string, boolean, any, string[]]
  set_unit_pin_ignored: [string, IO, string, boolean, string[]]
  set_unit_pin_data: [string, IO, string, any, string[]]
  set_unit_pin_set_id: [string, IO, string, string, string[]]
  remove_unit_pin_data: [string, IO, string, string[]]
  set_unit_pin_functional: [string, IO, string, boolean, string[]]
  set_metadata: [{ path: string[]; data: any }, string[]]
  component_append: [string, GraphUnitSpec, string[]]
  component_remove: [string, string[]]
  set_pin_set_id: [IO, string, string, string[]]
  set_unit_id: [string, string, string, string[]]
  add_unit_ghost: [string, string, BundleSpec, string[]]
  remove_unit_ghost: [string, string, BundleSpec, string[]]
  bulk_edit: [Action[], boolean, string[]]
  edit: any[]
}
