import { GraphState } from '../GraphState'
import { Pin } from '../Pin'
import { State } from '../State'
import {
  GraphExposedPinSpec,
  GraphExposedPinsSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  UnitsSpec,
} from '../types'
import { Dict } from '../types/Dict'
import { Units } from '../Units'
import { U } from './U'

export interface G<I = any, O = any> extends U {
  stateful: boolean

  element: boolean

  getSpec(): GraphSpec

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
    type: 'input' | 'output',
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    emit?: boolean
  ): void

  setGraphState(state: any): void

  setPinSetFunctional(
    type: 'input' | 'output',
    name: string,
    functional: boolean
  ): void

  exposePin(
    type: 'input' | 'output',
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

  coverPinSet(type: 'input' | 'output', id: string): void

  plugPin(
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void

  plugInput(subPinId: string, subPin: GraphExposedSubPinSpec, id: string): void

  unplugInput(subPinId: string, id: string): void

  coverPin(type: 'input' | 'output', id: string, subPinId: string): void

  getSubPinSpec(
    type: 'input' | 'output',
    pinId: string,
    subPinId: string
  ): GraphExposedSubPinSpec

  unplugPin(type: 'input' | 'output', pinId: string, subPinId: string): void

  isExposedInput(pin: GraphExposedSubPinSpec): boolean

  getExposedInputPin(id: string): Pin<I[keyof I]>

  getExposedOutputPin(id: string): Pin<O[keyof O]>

  getExposedPinSpec(
    pinId: string,
    type: 'input' | 'output'
  ): GraphExposedPinSpec

  isExposedInputPinId(pinId: string): boolean

  isExposedOutputPinId(pinId: string): boolean

  getExposedInputSpec(pinId: string): GraphExposedPinSpec

  getExposedOutputSpec(pinId: string): GraphExposedPinSpec

  hasUnit(id: string): boolean

  refUnit(id: string): U<any, any>

  getUnitSpec(id: string): GraphUnitSpec

  getUnitByPath(path: string[]): U<any, any>

  getUnitPin(id: string, type: 'input' | 'output', pinId: string): Pin<any>

  getUnitPinData(id: string, type: 'input' | 'output', pinId: string): any

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

  addUnits(units: UnitsSpec): void

  addUnit(unit: GraphUnitSpec, unitId: string, _unit?: U, emit?: boolean): U

  removeUnit(unitId: string): U

  moveUnit(id: string, unitId: string, inputId: string): void

  addMerges(merges: GraphMergesSpec): void

  addMerge(mergeSpec: GraphMergeSpec, mergeId: string): void

  addPinToMerge(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ): void

  removeMerge(mergeId: string): void

  removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ): void

  mergeMerges(mergeIds: string[]): void

  isPinMergedTo(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ): void

  togglePinMerge(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ): void

  setUnitPinConstant(
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    constant: boolean
  ): void

  setUnitInputConstant(unitId: string, pinId: string, constant: boolean): void

  setUnitOutputConstant(unitId: string, pinId: string, constant: boolean): void

  setUnitInputIgnored(unitId: string, pinId: string, ignored: boolean): void

  setUnitOutputIgnored(unitId: string, pinId: string, ignored: boolean): void

  setUnitPinIgnored(
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    ignored: boolean
  ): void

  setUnitPinData(
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    data: any
  ): void

  setUnitInputData(unitId: string, pinId: string, data: any): void

  setUnitOutputData(unitId: string, pinId: string, data: any): void

  setMetadata(path: string[], data: any): void

  moveUnitInto(graphId: string, unitId: string, nextUnitId: string): void

  moveLinkPinInto(
    graphId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    nextPinId: string
  ): void

  moveMergeInto(graphId: string, mergeId: string, nextMergeId: string): void

  explodeUnit(
    unitId: string,
    mapUnitId: Dict<string>,
    mapMergeId: Dict<string>
  ): void

  refUnits(): Units

  refMergePin(mergeId: string, type: 'input' | 'output'): Pin<any>
}
