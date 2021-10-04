import { Callback } from '../Callback'
import { Unit } from '../Class/Unit'
import { Config } from '../Class/Unit/Config'
import { Component } from '../client/component'
import { GraphState } from '../GraphState'
import { C } from '../interface/C'
import { G } from '../interface/G'
import { U } from '../interface/U'
import Merge from '../Merge'
import { Pin } from '../Pin'
import { State } from '../State'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import {
  GraphClass,
  GraphExposedPinSpec,
  GraphExposedPinsSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  Specs,
  GraphUnitsSpec,
} from '../types'
import { Dict } from '../types/Dict'
import { UnitClass } from '../types/UnitClass'
import { Units } from '../Units'
import { Unlisten } from '../Unlisten'
import { fromSpec } from './fromSpec'

export function lazyFromSpec<I, O>(
  spec: GraphSpec,
  specs: Specs,
  branch: Dict<true> = {}
): GraphClass {
  const { inputs, outputs, id } = spec

  class Lazy<I, O> extends Unit implements G, C {
    _ = ['U', 'G']

    static id: string = id

    public stateful: boolean = false

    public element: boolean = false

    private _graph: U & C & G

    private _merge: { input: Dict<Merge<any>>; output: Dict<Merge<any>> } = {
      input: {},
      output: {},
    }

    constructor(config?: Config) {
      super(
        {
          i: Object.keys(inputs),
          o: Object.keys(outputs),
        },
        config,
        branch
      )

      for (const name in this._input) {
        const i = this._input[name]
        i.addListener('_data', (data) => {
          this._ensure()
        })
      }

      this.addListener('play', () => {
        if (this._graph) {
          this._graph.play()
        }
      })

      this.addListener('pause', () => {
        if (this._graph) {
          this._graph.pause()
        }
      })

      this.addListener('take_err', () => {
        this._graph.takeErr()
      })

      this.addListener('reset', () => {
        if (this._graph) {
          this._graph.reset()
        }
      })
    }

    private _load(): void {
      const Class = fromSpec(spec, specs, branch)
      this._graph = new Class(this._config)
      this._graph.addListener('err', (err) => {
        this.err(err)
      })
      this._graph.addListener('take_err', () => {
        this.takeErr()
      })
      forEachKeyValue(this._graph.getOutputs(), (output, name) => {
        const merge = new Merge()
        this._merge.output[name] = merge
        merge.setInput(name, output)
        merge.setOutput(name, this._output[name])
      })
      forEachKeyValue(this._graph.getInputs(), (input, name) => {
        const merge = new Merge()
        this._merge.input[name] = merge
        merge.setInput(name, this._input[name])
        merge.setOutput(name, input)
      })
      this._graph.play()
    }

    private _ensure() {
      if (!this._graph) {
        this._load()
      }
    }

    public getSpec = (): GraphSpec => {
      this._ensure()
      return this._graph.getSpec()
    }

    public async getUnitState(unitId: string): Promise<State> {
      this._ensure()
      return this._graph.getUnitState(unitId)
    }

    public async getGraphState(): Promise<GraphState> {
      this._ensure()
      return this._graph.getGraphState()
    }

    public getGraphChildren(): Dict<any> {
      this._ensure()
      return this._graph.getGraphChildren()
    }

    component(callback: Callback<Component>): Unlisten {
      this._ensure()
      return this._graph.component(callback)
    }

    public pushChild(Class: UnitClass): number {
      this._ensure()
      return this._graph.pushChild(Class)
    }

    public appendChild(Class: UnitClass): number {
      this._ensure()
      return this._graph.appendChild(Class)
    }

    public pullChild(at: number): UnitClass {
      this._ensure()
      return this._graph.pullChild(at)
    }

    public removeChild(at: number): UnitClass {
      this._ensure()
      return this._graph.removeChild(at)
    }

    public hasChild(at: number): boolean {
      this._ensure()
      return this._graph.hasChild(at)
    }

    public child(at: number): C<any, any> {
      this._ensure()
      return this._graph.child(at)
    }

    public children(): C[] {
      this._ensure()
      return this._graph.children()
    }

    public refUnits = (): Units => {
      this._ensure()
      return this._graph.refUnits()
    }

    public refMergePin = (
      mergeId: string,
      type: 'input' | 'output'
    ): Pin<any> => {
      this._ensure()
      return this._graph.refMergePin(mergeId, type)
    }

    public exposeOutputSets = (outputs: GraphExposedPinsSpec): void => {
      this._ensure()
      return this._graph.exposeOutputSets(outputs)
    }

    public exposeOutputSet = (input: GraphExposedPinSpec, id: string): void => {
      this._ensure()
      return this._graph.exposePinSet('output', id, input)
    }

    public exposeOutput = (
      subPinId: string,
      pinSpec: GraphExposedSubPinSpec,
      id: string
    ): void => {
      this._ensure()
      return this._graph.exposeOutput(subPinId, pinSpec, id)
    }

    public coverOutputSet = (id: string): void => {
      this._ensure()
      this._graph.coverOutputSet(id)
    }

    public coverOutput = (subPinId: string, id: string): void => {
      this._ensure()
      return this._graph.coverOutput(subPinId, id)
    }

    public plugOutput = (
      subPinId: string,
      subPin: GraphExposedSubPinSpec,
      id: string
    ): void => {
      this._ensure()
      return this._graph.plugOutput(subPinId, subPin, id)
    }

    public unplugOutput = (subPinId: string, id: string): void => {
      this._ensure()
      return this._graph.unplugOutput(subPinId, id)
    }

    public isExposedOutput(pin: GraphExposedSubPinSpec): boolean {
      this._ensure()
      return this._graph.isExposedOutput(pin)
    }

    public exposeInputSets = (inputs: GraphExposedPinsSpec): void => {
      this._ensure()
      return this._graph.exposeInputSets(inputs)
    }

    public exposeInputSet = (
      input: GraphExposedPinSpec,
      pinId: string
    ): void => {
      this._ensure()
      return this._graph.exposeInputSet(input, pinId)
    }

    public exposePinSet = (
      type: 'input' | 'output',
      pinId: string,
      pinSpec: GraphExposedPinSpec
    ): void => {
      this._ensure()
      return this.exposePinSet(type, pinId, pinSpec)
    }

    public setPinSetFunctional(
      type: 'input' | 'output',
      name: string,
      functional: boolean
    ): void {
      this._ensure()
      return this._graph.setPinSetFunctional(type, name, functional)
    }

    public exposePin = (
      type: 'input' | 'output',
      pinId: string,
      subPinId: string,
      subPinSpec: GraphExposedSubPinSpec
    ): void => {
      this._ensure()
      return this._graph.exposePin(type, pinId, subPinId, subPinSpec)
    }

    public exposeInput = (
      subPinId: string,
      pinSpec: GraphExposedSubPinSpec,
      pinId: string
    ): void => {
      this._ensure()
      return this._graph.exposeInput(subPinId, pinSpec, pinId)
    }

    public coverInputSet = (id: string): void => {
      this._ensure()
      return this._graph.coverInputSet(id)
    }

    public coverInput = (subPinId: string, id: string): void => {
      this._ensure()
      return this._graph.coverInput(subPinId, id)
    }

    public coverPinSet = (
      type: 'input' | 'output',
      id: string,
      emit: boolean = true
    ): void => {
      this._ensure()

      return this._graph.coverPinSet(type, id, emit)
    }

    public plugPin = (
      type: 'input' | 'output',
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

    public coverPin = (
      type: 'input' | 'output',
      id: string,
      subPinId: string
    ): void => {
      this._ensure()
      return this._graph.coverPin(type, id, subPinId)
    }

    public getSubPinSpec = (
      type: 'input' | 'output',
      pinId: string,
      subPinId: string
    ): GraphExposedSubPinSpec => {
      this._ensure()
      return this._graph.getSubPinSpec(type, pinId, subPinId)
    }

    public unplugPin = (
      type: 'input' | 'output',
      pinId: string,
      subPinId: string
    ): void => {
      this._ensure()
      return this._graph.unplugPin(type, pinId, subPinId)
    }

    public isExposedInput(pin: GraphExposedSubPinSpec): boolean {
      this._ensure()
      return this._graph.isExposedInput(pin)
    }

    public getExposedInputPin = (id: string): Pin<I[keyof I]> => {
      this._ensure()
      return this._graph.getExposedInputPin(id)
    }

    public getExposedOutputPin = (id: string): Pin<O[keyof O]> => {
      this._ensure()
      return this._graph.getExposedOutputPin(id)
    }

    public getExposedPinSpec(
      pinId: string,
      type: 'input' | 'output'
    ): GraphExposedPinSpec {
      this._ensure()
      return this._graph.getExposedPinSpec(type, pinId)
    }

    public isExposedInputPinId(pinId: string): boolean {
      this._ensure()
      return this._graph.isExposedInputPinId(pinId)
    }

    public isExposedOutputPinId(pinId: string): boolean {
      this._ensure()
      return this._graph.isExposedOutputPinId(pinId)
    }

    public getExposedInputSpec(pinId: string): GraphExposedPinSpec {
      this._ensure()
      return this._graph.getExposedInputSpec(pinId)
    }

    public getExposedOutputSpec(pinId: string): GraphExposedPinSpec {
      this._ensure()
      return this._graph.getExposedOutputSpec(pinId)
    }

    public hasUnit(id: string): boolean {
      this._ensure()
      return this._graph.hasUnit(id)
    }

    public getUnitSpec(unitId: string): GraphUnitSpec {
      this._ensure()
      return this._graph.getUnitSpec(unitId)
    }

    public refUnit(id: string): U<any, any> {
      this._ensure()
      return this._graph.refUnit(id)
    }

    public getUnitByPath(path: string[]): U<any, any> {
      this._ensure()
      return this._graph.getUnitByPath(path)
    }

    public getUnitPin(
      id: string,
      type: 'input' | 'output',
      pinId: string
    ): Pin<any> {
      this._ensure()
      return this._graph.getUnitPin(id, type, pinId)
    }

    public getUnitPinData(
      id: string,
      type: 'input' | 'output',
      pinId: string
    ): any {
      this._ensure()
      return this._graph.getUnitPinData(id, type, pinId)
    }

    public getUnitInput(id: string, pinId: string): Pin<any> {
      this._ensure()
      return this._graph.getUnitInput(id, pinId)
    }

    public getUnitOutput(id: string, pinId: string): Pin<any> {
      this._ensure()
      return this._graph.getUnitOutput(id, pinId)
    }

    public setUnitErr(unitId: string, err: string): void {
      this._ensure()
      return this._graph.setUnitErr(unitId, err)
    }

    public takeUnitErr(unitId: string): string | null {
      this._ensure()
      return this._graph.takeUnitErr(unitId)
    }

    public getGraphPinData = (): Dict<any> => {
      this._ensure()
      return this._graph.getGraphPinData()
    }

    public getGraphErr = (): Dict<string | null> => {
      this._ensure()
      return this._graph.getGraphErr()
    }

    public getUnitInputData = (unitId: string): Dict<any> => {
      this._ensure()
      return this._graph.getUnitInputData(unitId)
    }

    public refMerges(): { [id: string]: U<any> } {
      this._ensure()
      return this._graph.refMerges()
    }

    public refMerge(mergeId: string): U<any> {
      this._ensure()
      return this._graph.refMerge(mergeId)
    }

    public getMergeCount(): number {
      this._ensure()
      return this._graph.getMergeCount()
    }

    public getMergeUnitCount(mergeId: string): number {
      this._ensure()
      return this._graph.getMergeUnitCount(mergeId)
    }

    public getMergePinCount(mergeId: string): number {
      this._ensure()
      return this._graph.getMergePinCount(mergeId)
    }

    public addUnits = (units: GraphUnitsSpec): void => {
      this._ensure()
      return this._graph.addUnits(units)
    }

    public addUnit = (unit: GraphUnitSpec, unitId: string): U => {
      this._ensure()
      return this._graph.addUnit(unit, unitId)
    }

    public moveUnit(id: string, unitId: string, inputId: string): void {
      this._ensure()
      return this._graph.moveUnit(id, unitId, inputId)
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
      type: 'input' | 'output',
      pinId: string
    ): void {
      this._ensure()
      return this._graph.moveLinkPinInto(graphId, unitId, type, pinId)
    }

    public moveMergeInto(
      graphId: string,
      mergeId: string,
      nextMergeId: string
    ): void {
      this._ensure()
      return this._graph.moveMergeInto(graphId, mergeId, nextMergeId)
    }

    public removeUnit(unitId: string) {
      this._ensure()
      return this._graph.removeUnit(unitId)
    }

    public explodeUnit(
      unitId: string,
      mapUnitId: Dict<string>,
      mapMergeId: Dict<string>
    ): void {
      this._ensure()
      return this._graph.explodeUnit(unitId, mapUnitId, mapMergeId)
    }

    public addMerges = (merges: GraphMergesSpec): void => {
      this._ensure()
      return this._graph.addMerges(merges)
    }

    public addMerge = (mergeSpec: GraphMergeSpec, mergeId: string): void => {
      this._ensure()
      return this._graph.addMerge(mergeSpec, mergeId)
    }

    public addPinToMerge = (
      mergeId: string,
      unitId: string,
      type: 'input' | 'output',
      pinId: string
    ): void => {
      this._ensure()
      return this._graph.addPinToMerge(mergeId, unitId, type, pinId)
    }

    public removeMerge(mergeId: string): void {
      this._ensure()
      return this._graph.removeMerge(mergeId)
    }

    public removePinFromMerge(
      mergeId: string,
      unitId: string,
      type: 'input' | 'output',
      pinId: string
    ) {
      this._ensure()
      return this._graph.removePinFromMerge(mergeId, unitId, type, pinId)
    }

    public mergeMerges(mergeIds: string[]) {
      this._ensure()
      return this._graph.mergeMerges(mergeIds)
    }

    public isPinMergedTo(
      mergeId: string,
      unitId: string,
      type: 'input' | 'output',
      pinId: string
    ) {
      this._ensure()
      return this._graph.isPinMergedTo(mergeId, unitId, type, pinId)
    }

    public togglePinMerge(
      mergeId: string,
      unitId: string,
      type: 'input' | 'output',
      pinId: string
    ) {
      this._ensure()
      return this._graph.togglePinMerge(mergeId, unitId, type, pinId)
    }

    public setUnitPinConstant(
      unitId: string,
      type: 'input' | 'output',
      pinId: string,
      constant: boolean
    ) {
      this._ensure()
      return this._graph.setUnitPinConstant(unitId, type, pinId, constant)
    }

    public setUnitInputConstant(
      unitId: string,
      pinId: string,
      constant: boolean
    ) {
      this._ensure()
      return this._graph.setUnitInputConstant(unitId, pinId, constant)
    }

    public setUnitOutputConstant(
      unitId: string,
      pinId: string,
      constant: boolean
    ) {
      this._ensure()
      return this._graph.setUnitOutputConstant(unitId, pinId, constant)
    }

    public setUnitInputIgnored(
      unitId: string,
      pinId: string,
      ignored: boolean
    ): void {
      this._ensure()
      return this._graph.setUnitPinIgnored(unitId, 'input', pinId, ignored)
    }

    public setUnitOutputIgnored(
      unitId: string,
      pinId: string,
      ignored: boolean
    ): void {
      this._ensure()
      return this._graph.setUnitPinIgnored(unitId, 'output', pinId, ignored)
    }

    public setUnitPinIgnored(
      unitId: string,
      type: 'input' | 'output',
      pinId: string,
      ignored: boolean
    ): void {
      this._ensure()
      return this._graph.setUnitPinIgnored(unitId, type, pinId, ignored)
    }

    public setUnitPinData(
      unitId: string,
      type: 'input' | 'output',
      pinId: string,
      data: any
    ) {
      this._ensure()
      return this._graph.setUnitPinData(unitId, type, pinId, data)
    }

    public setUnitInputData(unitId: string, pinId: string, data: any): void {
      this._ensure()
      return this._graph.setUnitInputData(unitId, pinId, data)
    }

    public setUnitOutputData(unitId: string, pinId: string, data: any): void {
      this._ensure()
      return this._graph.setUnitOutputData(unitId, pinId, data)
    }

    getGraphMergeInputData(): Dict<any> {
      this._ensure()
      return this._graph.getGraphMergeInputData()
    }

    public setMetadata(path: string[], data: any): void {
      this._ensure()
      this._graph.setMetadata(path, data)
    }

    setGraphState(state: any): void {
      this._ensure()
      this._graph.setGraphState(state)
    }
  }

  return Lazy
}
