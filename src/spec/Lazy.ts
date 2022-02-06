import { Graph } from '../Class/Graph'
import Merge from '../Class/Merge'
import { Unit, UnitEvents } from '../Class/Unit'
import { C } from '../interface/C'
import { Component_ } from '../interface/Component'
import { EE } from '../interface/EE'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { Pin } from '../Pin'
import { Pod } from '../pod'
import { State } from '../State'
import { System } from '../system'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { UnitBundleSpec } from '../system/platform/method/process/UnitBundleSpec'
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
import { GraphClass } from '../types/GraphClass'
import { GraphState } from '../types/GraphState'
import { IO } from '../types/IO'
import { UnitClass } from '../types/UnitClass'
import { fromSpec } from './fromSpec'

export function lazyFromSpec(
  spec: GraphSpec,
  specs: Specs,
  branch: Dict<true> = {}
): GraphClass {
  const { inputs, outputs, id } = spec

  class Lazy<
      I extends Dict<any>,
      O extends Dict<any>,
      _EE extends UnitEvents<_EE> = UnitEvents<{}>
    >
    extends Unit<I, O, _EE>
    implements G, C
  {
    static __bundle: UnitBundleSpec = {
      unit: {
        id,
      },
      specs: {},
    }

    public __ = ['U', 'G']

    public stateful: boolean = false // RETURN __stateful
    public element: boolean = false // RETURN __element

    private __graph: Graph

    private _merge: { input: Dict<Merge<any>>; output: Dict<Merge<any>> } = {
      input: {},
      output: {},
    }

    constructor(system: System, pod: Pod) {
      super(
        {
          i: Object.keys(inputs),
          o: Object.keys(outputs),
        },
        branch,
        system,
        pod
      )

      for (const name in this._input) {
        const i = this._input[name]
        i.addListener('data', (data) => {
          this._ensure()
        })
      }

      this.addListener('play', () => {
        if (this.__graph) {
          this.__graph.play()
        }
      })

      this.addListener('pause', () => {
        if (this.__graph) {
          this.__graph.pause()
        }
      })

      this.addListener('take_err', () => {
        this.__graph.takeErr()
      })

      this.addListener('reset', () => {
        if (this.__graph) {
          this.__graph.reset()
        }
      })
    }

    memAddMerge(
      mergeId: string,
      mergeSpec: GraphMergesSpec,
      merge: Merge
    ): void {
      this._ensure()
      return this.__graph.memAddMerge(mergeId, mergeSpec, merge)
    }

    getMergeSpec(mergeId: string): GraphMergeSpec {
      this._ensure()
      return this.__graph.getMergeSpec(mergeId)
    }

    memRemoveUnit(unitId: string): void {
      this._ensure()
      return this.__graph.memRemoveUnit(unitId)
    }

    memRemoveMerge(mergeId: string): void {
      this._ensure()
      return this.__graph.memRemoveMerge(mergeId)
    }

    appendParentRoot(
      subComponentId: string,
      childId: string,
      slotName: string
    ): void {
      this._ensure()
      return this.__graph.appendParentRoot(subComponentId, childId, slotName)
    }

    appendParentRootChildren(
      subComponentId: string,
      children: string[],
      slotMap: Dict<string>
    ): void {
      this._ensure()
      return this.__graph.appendParentRootChildren(
        subComponentId,
        children,
        slotMap
      )
    }

    appendParentChild(component: Component_, slotName: string): void {
      this._ensure()
      return this.__graph.appendParentChild(component, slotName)
    }

    removeParentChild(component: Component_): void {
      this._ensure()
      return this.__graph.removeParentChild(component)
    }

    appendRoot(subComponentId: any): void {
      this._ensure()
      return this.__graph.appendRoot(subComponentId)
    }

    removeRoot(subComponentId: string): void {
      this._ensure()
      return this.__graph.removeRoot(subComponentId)
    }

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
      nextPinMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>,
      nextMergePinId: Dict<{
        nextInputMergePinId: string
        nextOutputMergePinId: string
      }>,
      nextSubComponentParent: Dict<string | null>,
      nextSubComponentChildrenMap: Dict<string[]>
    ): void {
      this._ensure()
      return this.__graph.moveSubgraphInto(
        graphId,
        nodeIds,
        nextIdMap,
        nextPinMap,
        nextMergePinId,
        nextSubComponentParent,
        nextSubComponentChildrenMap
      )
    }

    registerRoot(component: Component_): void {
      this._ensure()
      return this.__graph.registerRoot(component)
    }

    unregisterRoot(component: Component_): void {
      this._ensure()
      return this.__graph.unregisterRoot(component)
    }

    registerParentRoot(component: Component_, slotName: string): void {
      this._ensure()
      return this.__graph.registerParentRoot(component, slotName)
    }

    unregisterParentRoot(component: Component_): void {
      this._ensure()
      return this.__graph.unregisterParentRoot(component)
    }

    private _load(): void {
      // console.log('Lazy', '_load')
      const Class = fromSpec(spec, specs, branch)
      this.__graph = new Class(this.__system, this.__pod)
      this.__graph.addListener('err', (err) => {
        this.err(err)
      })
      this.__graph.addListener('take_err', () => {
        this.takeErr()
      })
      forEachKeyValue(this.__graph.getOutputs(), (output, name) => {
        const merge = new Merge(this.__system, this.__pod)
        merge.play()
        this._merge.output[name] = merge
        merge.setInput(name, output)
        merge.setOutput(name, this._output[name])
      })
      forEachKeyValue(this.__graph.getInputs(), (input, name) => {
        const merge = new Merge(this.__system, this.__pod)
        merge.play()
        this._merge.input[name] = merge
        merge.setInput(name, this._input[name])
        merge.setOutput(name, input)
      })
      this.__graph.play()
    }

    private _ensure() {
      // console.log('Lazy', '_ensure')
      if (!this.__graph) {
        this._load()
      }
    }

    public getSpec = (): GraphSpec => {
      this._ensure()
      return this.__graph.getSpec()
    }

    public getSpecs(): Specs {
      this._ensure()
      return this.__graph.getSpecs()
    }

    public async getUnitState(unitId: string): Promise<State> {
      this._ensure()
      return this.__graph.getUnitState(unitId)
    }

    public async getGraphState(): Promise<GraphState> {
      this._ensure()
      return this.__graph.getGraphState()
    }

    public getGraphChildren(): Dict<any> {
      this._ensure()
      return this.__graph.getGraphChildren()
    }

    public pushChild(Class: UnitClass): number {
      this._ensure()
      return this.__graph.pushChild(Class)
    }

    public appendChild(Class: UnitClass): number {
      this._ensure()
      return this.__graph.appendChild(Class)
    }

    public pullChild(at: number): UnitClass {
      this._ensure()
      return this.__graph.pullChild(at)
    }

    public removeChild(at: number): UnitClass {
      this._ensure()
      return this.__graph.removeChild(at)
    }

    public hasChild(at: number): boolean {
      this._ensure()
      return this.__graph.hasChild(at)
    }

    public refChild(at: number): Component_ {
      this._ensure()
      return this.__graph.refChild(at)
    }

    public refChildren(): Component_[] {
      this._ensure()
      return this.__graph.refChildren()
    }

    public refSlot(slotName: string): Component_ {
      this._ensure()
      return this.__graph.refSlot(slotName)
    }

    public refEmitter(): EE {
      this._ensure()
      return this.__graph.refEmitter()
    }

    public refUnits = (): Dict<Unit> => {
      this._ensure()
      return this.__graph.refUnits()
    }

    public refMergePin = (mergeId: string, type: IO): Pin<any> => {
      this._ensure()
      return this.__graph.refMergePin(mergeId, type)
    }

    public exposeOutputSets = (outputs: GraphExposedPinsSpec): void => {
      this._ensure()
      return this.__graph.exposeOutputSets(outputs)
    }

    public exposeOutputSet = (input: GraphExposedPinSpec, id: string): void => {
      this._ensure()
      return this.__graph.exposePinSet('output', id, input)
    }

    public exposeOutput = (
      subPinId: string,
      pinSpec: GraphExposedSubPinSpec,
      id: string
    ): void => {
      this._ensure()
      return this.__graph.exposeOutput(subPinId, pinSpec, id)
    }

    public coverOutputSet = (id: string): void => {
      this._ensure()
      this.__graph.coverOutputSet(id)
    }

    public coverOutput = (subPinId: string, id: string): void => {
      this._ensure()
      return this.__graph.coverOutput(subPinId, id)
    }

    public plugOutput = (
      subPinId: string,
      subPin: GraphExposedSubPinSpec,
      id: string
    ): void => {
      this._ensure()
      return this.__graph.plugOutput(subPinId, subPin, id)
    }

    public unplugOutput = (subPinId: string, id: string): void => {
      this._ensure()
      return this.__graph.unplugOutput(subPinId, id)
    }

    public isExposedOutput(pin: GraphExposedSubPinSpec): boolean {
      this._ensure()
      return this.__graph.isExposedOutput(pin)
    }

    public exposeInputSets = (inputs: GraphExposedPinsSpec): void => {
      this._ensure()
      return this.__graph.exposeInputSets(inputs)
    }

    public exposeInputSet = (
      input: GraphExposedPinSpec,
      pinId: string
    ): void => {
      this._ensure()
      return this.__graph.exposeInputSet(input, pinId)
    }

    public exposePinSet = (
      type: IO,
      pinId: string,
      pinSpec: GraphExposedPinSpec
    ): void => {
      this._ensure()
      return this.__graph.exposePinSet(type, pinId, pinSpec)
    }

    public memExposePinSet(
      type: IO,
      pinId: string,
      pinSpec: GraphExposedPinSpec,
      exposedPin: Pin<any>,
      exposedMerge: Merge<any>
    ) {
      this._ensure()
      this.__graph.memExposePinSet(
        type,
        pinId,
        pinSpec,
        exposedPin,
        exposedMerge
      )
    }
    memExposePin(
      type: IO,
      pinId: string,
      subPinId: string,
      subPinSpec: GraphExposedSubPinSpec
    ): void {
      throw new Error('Method not implemented.')
    }

    public setPinSetFunctional(
      type: IO,
      name: string,
      functional: boolean
    ): void {
      this._ensure()
      return this.__graph.setPinSetFunctional(type, name, functional)
    }

    public exposePin = (
      type: IO,
      pinId: string,
      subPinId: string,
      subPinSpec: GraphExposedSubPinSpec
    ): void => {
      this._ensure()
      return this.__graph.exposePin(type, pinId, subPinId, subPinSpec)
    }

    public exposeInput = (
      subPinId: string,
      pinSpec: GraphExposedSubPinSpec,
      pinId: string
    ): void => {
      this._ensure()
      return this.__graph.exposeInput(subPinId, pinSpec, pinId)
    }

    public coverInputSet = (id: string): void => {
      this._ensure()
      return this.__graph.coverInputSet(id)
    }

    public coverInput = (subPinId: string, id: string): void => {
      this._ensure()
      return this.__graph.coverInput(subPinId, id)
    }

    public coverPinSet = (type: IO, id: string, emit: boolean = true): void => {
      this._ensure()

      return this.__graph.coverPinSet(type, id, emit)
    }

    public plugPin = (
      type: IO,
      pinId: string,
      subPinId: string,
      subPinSpec: GraphExposedSubPinSpec
    ): void => {
      this._ensure()
      return this.plugPin(type, pinId, subPinId, subPinSpec)
    }

    public plugInput = (
      subPinId: string,
      subPin: GraphExposedSubPinSpec,
      id: string
    ): void => {
      this._ensure()
      return this.plugInput(subPinId, subPin, id)
    }

    public unplugInput = (subPinId: string, id: string): void => {
      this._ensure()
      return this.unplugInput(subPinId, id)
    }

    public coverPin = (type: IO, id: string, subPinId: string): void => {
      this._ensure()
      return this.__graph.coverPin(type, id, subPinId)
    }

    public getSubPinSpec = (
      type: IO,
      pinId: string,
      subPinId: string
    ): GraphExposedSubPinSpec => {
      this._ensure()
      return this.__graph.getSubPinSpec(type, pinId, subPinId)
    }

    public unplugPin = (type: IO, pinId: string, subPinId: string): void => {
      this._ensure()
      return this.__graph.unplugPin(type, pinId, subPinId)
    }

    public isExposedInput(pin: GraphExposedSubPinSpec): boolean {
      this._ensure()
      return this.__graph.isExposedInput(pin)
    }

    public getExposedInputPin = (id: string): Pin<I[keyof I]> => {
      this._ensure()
      return this.__graph.getExposedInputPin(id)
    }

    public getExposedOutputPin = (id: string): Pin<O[keyof O]> => {
      this._ensure()
      return this.__graph.getExposedOutputPin(id)
    }

    public getExposedPinSpec(pinId: string, type: IO): GraphExposedPinSpec {
      this._ensure()
      return this.__graph.getExposedPinSpec(type, pinId)
    }

    public isExposedInputPinId(pinId: string): boolean {
      this._ensure()
      return this.__graph.isExposedInputPinId(pinId)
    }

    public isExposedOutputPinId(pinId: string): boolean {
      this._ensure()
      return this.__graph.isExposedOutputPinId(pinId)
    }

    public getExposedInputSpec(pinId: string): GraphExposedPinSpec {
      this._ensure()
      return this.__graph.getExposedInputSpec(pinId)
    }

    public getExposedOutputSpec(pinId: string): GraphExposedPinSpec {
      this._ensure()
      return this.__graph.getExposedOutputSpec(pinId)
    }

    public hasUnit(id: string): boolean {
      this._ensure()
      return this.__graph.hasUnit(id)
    }

    public getUnitSpec(unitId: string): GraphUnitSpec {
      this._ensure()
      return this.__graph.getUnitSpec(unitId)
    }

    public refUnit(id: string): U<any, any> {
      this._ensure()
      return this.__graph.refUnit(id)
    }

    public getUnitByPath(path: string[]): U<any, any> {
      this._ensure()
      return this.__graph.getUnitByPath(path)
    }

    public getUnitPin(id: string, type: IO, pinId: string): Pin<any> {
      this._ensure()
      return this.__graph.getUnitPin(id, type, pinId)
    }

    public getUnitPinData(id: string, type: IO, pinId: string): any {
      this._ensure()
      return this.__graph.getUnitPinData(id, type, pinId)
    }

    public getUnitInput(id: string, pinId: string): Pin<any> {
      this._ensure()
      return this.__graph.getUnitInput(id, pinId)
    }

    public getUnitOutput(id: string, pinId: string): Pin<any> {
      this._ensure()
      return this.__graph.getUnitOutput(id, pinId)
    }

    public setUnitErr(unitId: string, err: string): void {
      this._ensure()
      return this.__graph.setUnitErr(unitId, err)
    }

    public takeUnitErr(unitId: string): string | null {
      this._ensure()
      return this.__graph.takeUnitErr(unitId)
    }

    public getGraphPinData = (): Dict<any> => {
      this._ensure()
      return this.__graph.getGraphPinData()
    }

    public getGraphErr = (): Dict<string | null> => {
      this._ensure()
      return this.__graph.getGraphErr()
    }

    public getUnitInputData = (unitId: string): Dict<any> => {
      this._ensure()
      return this.__graph.getUnitInputData(unitId)
    }

    public refMerges(): { [id: string]: U<any> } {
      this._ensure()
      return this.__graph.refMerges()
    }

    public refMerge(mergeId: string): U<any> {
      this._ensure()
      return this.__graph.refMerge(mergeId)
    }

    public getMergeCount(): number {
      this._ensure()
      return this.__graph.getMergeCount()
    }

    public getMergeUnitCount(mergeId: string): number {
      this._ensure()
      return this.__graph.getMergeUnitCount(mergeId)
    }

    public getMergePinCount(mergeId: string): number {
      this._ensure()
      return this.__graph.getMergePinCount(mergeId)
    }

    public addUnits = (units: GraphUnitsSpec): void => {
      this._ensure()
      return this.__graph.addUnits(units)
    }

    public addUnit = (unit: GraphUnitSpec, unitId: string): U => {
      this._ensure()
      return this.__graph.addUnit(unit, unitId)
    }

    memAddUnit(
      unitId: string,
      unitSpec: GraphUnitSpec,
      unit: Unit<any, any>
    ): void {
      this._ensure()
      return this.__graph.memAddUnit(unitId, unitSpec, unit)
    }

    public moveUnit(id: string, unitId: string, inputId: string): void {
      this._ensure()
      return this.__graph.moveUnit(id, unitId, inputId)
    }

    public moveUnitInto(
      graphId: string,
      unitId: string,
      nextUnitId: string
    ): void {
      throw new Error('Method not implemented.')
    }

    public moveLinkPinInto(
      graphId: string,
      unitId: string,
      type: IO,
      pinId: string
    ): void {
      this._ensure()
      return this.__graph.moveLinkPinInto(graphId, unitId, type, pinId)
    }

    public moveMergeInto(
      graphId: string,
      mergeId: string,
      nextInputMergeId: string | null,
      nextOutputMergeId: string | null,
      nextPinIdMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>
    ): void {
      this._ensure()
      return this.__graph.moveMergeInto(
        graphId,
        mergeId,
        nextInputMergeId,
        nextOutputMergeId,
        nextPinIdMap
      )
    }

    public removeUnit(unitId: string) {
      this._ensure()
      return this.__graph.removeUnit(unitId)
    }

    public explodeUnit(
      unitId: string,
      mapUnitId: Dict<string>,
      mapMergeId: Dict<string>
    ): void {
      this._ensure()
      return this.__graph.explodeUnit(unitId, mapUnitId, mapMergeId)
    }

    public addMerges = (merges: GraphMergesSpec): void => {
      this._ensure()
      return this.__graph.addMerges(merges)
    }

    public addMerge = (mergeSpec: GraphMergeSpec, mergeId: string): void => {
      this._ensure()
      return this.__graph.addMerge(mergeSpec, mergeId)
    }

    public addPinToMerge = (
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string
    ): void => {
      this._ensure()
      return this.__graph.addPinToMerge(mergeId, unitId, type, pinId)
    }

    public removeMerge(mergeId: string): void {
      this._ensure()
      return this.__graph.removeMerge(mergeId)
    }

    public removePinFromMerge(
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string
    ) {
      this._ensure()
      return this.__graph.removePinFromMerge(mergeId, unitId, type, pinId)
    }

    public mergeMerges(mergeIds: string[]) {
      this._ensure()
      return this.__graph.mergeMerges(mergeIds)
    }

    public isPinMergedTo(
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string
    ) {
      this._ensure()
      return this.__graph.isPinMergedTo(mergeId, unitId, type, pinId)
    }

    public togglePinMerge(
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string
    ) {
      this._ensure()
      return this.__graph.togglePinMerge(mergeId, unitId, type, pinId)
    }

    public setUnitPinConstant(
      unitId: string,
      type: IO,
      pinId: string,
      constant: boolean
    ) {
      this._ensure()
      return this.__graph.setUnitPinConstant(unitId, type, pinId, constant)
    }

    public setUnitInputConstant(
      unitId: string,
      pinId: string,
      constant: boolean
    ) {
      this._ensure()
      return this.__graph.setUnitInputConstant(unitId, pinId, constant)
    }

    public setUnitOutputConstant(
      unitId: string,
      pinId: string,
      constant: boolean
    ) {
      this._ensure()
      return this.__graph.setUnitOutputConstant(unitId, pinId, constant)
    }

    public setUnitInputIgnored(
      unitId: string,
      pinId: string,
      ignored: boolean
    ): void {
      this._ensure()
      return this.__graph.setUnitPinIgnored(unitId, 'input', pinId, ignored)
    }

    public setUnitOutputIgnored(
      unitId: string,
      pinId: string,
      ignored: boolean
    ): void {
      this._ensure()
      return this.__graph.setUnitPinIgnored(unitId, 'output', pinId, ignored)
    }

    public setUnitPinIgnored(
      unitId: string,
      type: IO,
      pinId: string,
      ignored: boolean
    ): void {
      this._ensure()
      return this.__graph.setUnitPinIgnored(unitId, type, pinId, ignored)
    }

    public setUnitPinData(unitId: string, type: IO, pinId: string, data: any) {
      this._ensure()
      return this.__graph.setUnitPinData(unitId, type, pinId, data)
    }

    public setUnitInputData(unitId: string, pinId: string, data: any): void {
      this._ensure()
      return this.__graph.setUnitInputData(unitId, pinId, data)
    }

    public setUnitOutputData(unitId: string, pinId: string, data: any): void {
      this._ensure()
      return this.__graph.setUnitOutputData(unitId, pinId, data)
    }

    public getGraphMergeInputData(): Dict<any> {
      this._ensure()
      return this.__graph.getGraphMergeInputData()
    }

    public setMetadata(path: string[], data: any): void {
      this._ensure()
      this.__graph.setMetadata(path, data)
    }

    public setGraphState(state: any): void {
      this._ensure()
      this.__graph.setGraphState(state)
    }
  }

  return Lazy
}
