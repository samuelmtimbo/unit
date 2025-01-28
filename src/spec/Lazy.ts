import { Graph } from '../Class/Graph'
import Merge from '../Class/Merge'
import { Unit, UnitEvents } from '../Class/Unit'
import { Pin } from '../Pin'
import { isComponentSpec } from '../client/spec'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { keys } from '../system/f/object/Keys/f'
import { Classes, GraphPinsSpec, GraphSubPinSpec, Specs } from '../types'
import { Action } from '../types/Action'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphBundle } from '../types/GraphClass'
import { GraphMergeSpec } from '../types/GraphMergeSpec'
import { GraphMergesSpec } from '../types/GraphMergesSpec'
import { GraphPinSpec } from '../types/GraphPinSpec'
import { GraphSpec } from '../types/GraphSpec'
import { GraphUnitSpec } from '../types/GraphUnitSpec'
import { GraphUnitsSpec } from '../types/GraphUnitsSpec'
import { IO } from '../types/IO'
import { IOOf } from '../types/IOOf'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'
import { Unlisten } from '../types/Unlisten'
import { AnimationSpec, C, ComponentSetup } from '../types/interface/C'
import { ComponentEvents, Component_ } from '../types/interface/Component'
import { G, G_MoveSubgraphIntoArgs } from '../types/interface/G'

export function lazyFromSpec(
  spec: GraphSpec,
  specs: Specs,
  branch: Dict<true> = {},
  fromSpec: (
    spec: GraphSpec,
    specs: Specs,
    classes: Classes,
    branch: Dict<true>
  ) => GraphBundle
): UnitClass {
  const { inputs = {}, outputs = {}, id } = spec

  class Lazy<
      I extends Dict<any> = Dict<any>,
      O extends Dict<any> = Dict<any>,
      _EE extends UnitEvents<_EE> = UnitEvents<{}>,
    >
    extends Unit<I, O, _EE>
    implements G, C
  {
    lazy = true

    static __bundle: UnitBundleSpec = {
      unit: {
        id,
      },
      specs: {},
    }

    public __ = ['U', 'G']

    public __element: boolean = false

    private __graph: Graph<I, O>

    private _merge: {
      input: Partial<Record<keyof I, Merge<any, I, I>>>
      output: Partial<Record<keyof O, Merge<any, O, O>>>
    } = {
      input: {},
      output: {},
    }

    constructor(system: System) {
      super(
        {
          i: keys(inputs),
          o: keys(outputs),
        },
        branch,
        system,
        spec.id
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

    setName(name: string, ...extra: any[]): void {
      this._ensure()
      this.__graph.setName(name, ...extra)
    }

    cloneUnit(unitId: string, newUnitId: string, ...extra: any[]): void {
      this._ensure()
      this.__graph.cloneUnit(unitId, newUnitId, ...extra)
    }

    stopPropagation(name: string): Unlisten {
      this._ensure()
      return this.__graph.stopPropagation(name)
    }

    getSetup(): ComponentSetup {
      this._ensure()
      return this.__graph.getSetup()
    }

    setUnitPinSetId(
      unitId: string,
      type: IO,
      pinId: string,
      newPinId: string,
      ...extra: any[]
    ): void {
      this._ensure()
      return this.__graph.setUnitPinSetId(
        unitId,
        type,
        pinId,
        newPinId,
        ...extra
      )
    }

    fork(): void {
      this._ensure()
      return this.__graph.fork()
    }

    startTransaction(): void {
      this._ensure()
      return this.__graph.startTransaction()
    }

    endTransaction(): void {
      this._ensure()
      return this.__graph.endTransaction()
    }

    getMergeData(mergeId: string) {
      this._ensure()
      return this.__graph.getPlugSpecs()
    }

    getPlugSpecs(): IOOf<Dict<Dict<GraphSubPinSpec>>> {
      this._ensure()
      return this.__graph.getPlugSpecs()
    }

    hasMergePin(
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string
    ): boolean {
      this._ensure()
      return this.__graph.hasMergePin(mergeId, unitId, type, pinId)
    }

    getMergesSpec(): GraphMergesSpec {
      this._ensure()
      return this.__graph.getMergesSpec()
    }

    getUnitPinData(unitId: string, type: IO, pinId: string): void {
      this._ensure()
      return this.__graph.getUnitPinData(unitId, type, pinId)
    }

    isUnitPinConstant(unitId: string, type: IO, pinId: string): boolean {
      this._ensure()
      return this.__graph.isUnitPinConstant(unitId, type, pinId)
    }

    isUnitPinRef(unitId: string, type: IO, pinId: string): boolean {
      this._ensure()
      return this.__graph.isUnitPinRef(unitId, type, pinId)
    }

    getExposedPinSpecs(): IOOf<GraphPinsSpec> {
      this._ensure()
      return this.__graph.getExposedPinSpecs()
    }

    getPinPlugCount(type: IO, pinId: string): number {
      this._ensure()
      return this.__graph.getPinPlugCount(type, pinId)
    }

    moveRoot(
      parentId: string,
      childId: string,
      to: number,
      slotName: string
    ): void {
      this._ensure()
      return this.__graph.moveRoot(parentId, childId, to, slotName)
    }

    hasPlug(type: IO, pinId: string, subPinId: string): boolean {
      this._ensure()
      return this.__graph.hasPlug(type, pinId, subPinId)
    }

    removePinOrMerge(
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string,
      ...extra: any[]
    ): void {
      this._ensure()
      return this.__graph.removePinOrMerge(
        mergeId,
        unitId,
        type,
        pinId,
        ...extra
      )
    }

    removeMergeData(mergeId: string) {
      this._ensure()
      return this.__graph.removeMergeData(mergeId)
    }

    setUnitSize(unitId: string, width: number, height: number): void {
      this._ensure()
      return this.__graph.setUnitSize(unitId, width, height)
    }

    setSubComponentSize(unitId: string, width: number, height: number): void {
      this._ensure()
      return this.__graph.setSubComponentSize(unitId, width, height)
    }

    setComponentSize(unitId: string, width: number, height: number): void {
      this._ensure()
      return this.__graph.setComponentSize(unitId, width, height)
    }

    moveSubgraphOutOf(
      ...[
        graphId,
        graphBundle,
        graphSpec,
        nextSpecId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentIndexMap,
        nextUnitPinMergeMap,
        nextSubComponentSlot,
        nextSubComponentParentSlot,
      ]: G_MoveSubgraphIntoArgs
    ): void {
      this._ensure()
      return this.__graph.moveSubgraphOutOf(
        graphId,
        graphBundle,
        graphSpec,
        nextSpecId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentIndexMap,
        nextUnitPinMergeMap,
        nextSubComponentSlot,
        nextSubComponentParentSlot
      )
    }

    removeUnitPinData(unitId: string, type: IO, pinId: string) {
      this._ensure()
      return this.__graph.removeUnitPinData(unitId, type, pinId)
    }

    addUnitSpecs(units: GraphUnitsSpec): void {
      this._ensure()
      return this.__graph.addUnitSpecs(units)
    }

    addUnitSpec(
      unitId: string,
      unit: UnitBundleSpec,
      parentId?: string | null,
      emit?: boolean
    ): Unit {
      this._ensure()
      return this.__graph.addUnitSpec(unitId, unit, parentId, emit)
    }

    bulkEdit(actions: Action[]): void {
      this._ensure()
      return this.__graph.bulkEdit(actions)
    }

    setUnitId(unitId: string, newUnitId: string, name: string): void {
      this._ensure()
      return this.__graph.setUnitId(unitId, newUnitId, name)
    }

    isElement(): boolean {
      return isComponentSpec(spec)
    }

    getMergeSpec(mergeId: string): GraphMergeSpec {
      this._ensure()
      return this.__graph.getMergeSpec(mergeId)
    }

    reorderRoot(component: Component_<ComponentEvents>, to: number): void {
      this._ensure()
      return this.__graph.reorderRoot(component, to)
    }

    reorderParentRoot(
      component: Component_<ComponentEvents>,
      to: number
    ): void {
      this._ensure()
      return this.__graph.reorderParentRoot(component, to)
    }

    reorderSubComponent(parentId: string, childId: string, to: number): void {
      this._ensure()
      return this.__graph.reorderSubComponent(parentId, childId, to)
    }

    moveSubComponentRoot(
      subComponentId: string,
      children: string[],
      slotMap: Dict<string>,
      index: number
    ): void {
      this._ensure()
      return this.__graph.moveSubComponentRoot(
        subComponentId,
        children,
        slotMap,
        index
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

    removeRoot(subComponentId: string): void {
      this._ensure()
      return this.__graph.removeRoot(subComponentId)
    }

    moveSubgraphInto(
      ...[
        graphId,
        graphBundle,
        graphSpec,
        nextSpecId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentIndexMap,
        nextUnitPinMergeMap,
        nextSubComponentSlot,
        nextSubComponentParentSlot,
      ]: G_MoveSubgraphIntoArgs
    ): void {
      this._ensure()
      return this.__graph.moveSubgraphInto(
        graphId,
        graphBundle,
        graphSpec,
        nextSpecId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentIndexMap,
        nextUnitPinMergeMap,
        nextSubComponentSlot,
        nextSubComponentParentSlot
      )
    }

    public registerRoot(component: Component_, emit?: boolean): void {
      this._ensure()
      return this.__graph.registerRoot(component, emit)
    }

    public unregisterRoot(component: Component_, emit?: boolean): void {
      this._ensure()
      return this.__graph.unregisterRoot(component, emit)
    }

    public registerParentRoot(component: Component_, slotName: string): void {
      this._ensure()
      return this.__graph.registerParentRoot(component, slotName)
    }

    public unregisterParentRoot(component: Component_): void {
      this._ensure()
      return this.__graph.unregisterParentRoot(component)
    }

    private _load(): void {
      // console.log('Lazy', '_load', spec.name)

      const Class = fromSpec(spec, specs, this.__system.classes, branch)

      this.__graph = new Class(this.__system)

      this.__graph.addListener('err', (err) => {
        this.err(err)
      })
      this.__graph.addListener('take_err', () => {
        this.takeErr()
      })

      forEachValueKey(this.__graph.getOutputs(), (output, name) => {
        const merge = new Merge<any, O, O>(this.__system)
        merge.play()
        this._merge.output[name] = merge
        merge.setInput(name, output)
        merge.setOutput(name, this._output[name])
      })
      forEachValueKey(this.__graph.getInputs(), (input, name) => {
        const merge = new Merge<any, I, I>(this.__system)
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

    public getBundleSpec(): BundleSpec {
      this._ensure()
      return this.__graph.getBundleSpec()
    }

    public getGraphChildren(): Dict<any> {
      this._ensure()
      return this.__graph.getGraphChildren()
    }

    public pushChild(Bundle: UnitBundle): number {
      this._ensure()
      return this.__graph.pushChild(Bundle)
    }

    public appendChild(Bundle: UnitBundle): number {
      this._ensure()
      return this.__graph.appendChild(Bundle)
    }

    public appendChildren(Classes: UnitBundle[]): number {
      this._ensure()
      return this.__graph.appendChildren(Classes)
    }

    public insertChild(Bundle: UnitBundle, at: number): void {
      this._ensure()
      return this.__graph.insertChild(Bundle, at)
    }

    public pullChild(at: number): Component_ {
      this._ensure()
      return this.__graph.pullChild(at)
    }

    public removeChild(at: number): Component_ {
      this._ensure()
      return this.__graph.removeChild(at)
    }

    public hasChild(at: number): boolean {
      this._ensure()
      return this.__graph.hasChild(at)
    }

    public refRoot(at: number): Component_ {
      this._ensure()
      return this.__graph.refRoot(at)
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

    public setSlot(slotName: string, subComponentId: string): void {
      this._ensure()
      return this.__graph.setSlot(slotName, subComponentId)
    }

    public getSlot(slotName: string): string {
      this._ensure()
      return this.__graph.getSlot(slotName)
    }

    public animate(keyframes: Keyframe[], opt: KeyframeAnimationOptions): void {
      this._ensure()
      return this.__graph.animate(keyframes, opt)
    }

    public cancelAnimation(id: string): void {
      this._ensure()
      return this.__graph.cancelAnimation(id)
    }

    public getAnimations(): AnimationSpec[] {
      this._ensure()
      return this.__graph.getAnimations()
    }

    public getUnits = (): Dict<Unit> => {
      this._ensure()
      return this.__graph.getUnits()
    }

    public exposeOutputSets = (outputs: GraphPinsSpec): void => {
      this._ensure()
      return this.__graph.exposeOutputSets(outputs)
    }

    public exposeOutputSet = (input: GraphPinSpec, id: string): void => {
      this._ensure()
      return this.__graph.exposePinSet('output', id, input)
    }

    public exposeOutput = (
      subPinId: string,
      pinSpec: GraphSubPinSpec,
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
      subPin: GraphSubPinSpec,
      id: string
    ): void => {
      this._ensure()
      return this.__graph.plugOutput(subPinId, subPin, id)
    }

    public unplugOutput = (subPinId: string, id: string): void => {
      this._ensure()
      return this.__graph.unplugOutput(subPinId, id)
    }

    public isExposedOutput(pin: GraphSubPinSpec): boolean {
      this._ensure()
      return this.__graph.isExposedOutput(pin)
    }

    public exposeInputSets = (inputs: GraphPinsSpec): void => {
      this._ensure()
      return this.__graph.exposeInputSets(inputs)
    }

    public exposeInputSet = (input: GraphPinSpec, pinId: string): void => {
      this._ensure()
      return this.__graph.exposeInputSet(input, pinId)
    }

    public exposePinSet = (
      type: IO,
      pinId: string,
      pinSpec: GraphPinSpec
    ): void => {
      this._ensure()
      return this.__graph.exposePinSet(type, pinId, pinSpec)
    }

    public setPinSetId(type: IO, pinId: string, nextPinId: string): void {
      this._ensure()
      return this.__graph.setPinSetId(type, pinId, nextPinId)
    }

    public setPinSetFunctional(
      type: IO,
      name: string,
      functional: boolean
    ): void {
      this._ensure()
      return this.__graph.setPinSetFunctional(type, name, functional)
    }

    setPinSetDefaultIgnored(type: IO, name: string, ignored: boolean): void {
      this._ensure()
      return this.__graph.setPinSetDefaultIgnored(type, name, ignored)
    }

    public exposePin = (
      type: IO,
      pinId: string,
      subPinId: string,
      subPinSpec: GraphSubPinSpec
    ): void => {
      this._ensure()
      return this.__graph.exposePin(type, pinId, subPinId, subPinSpec)
    }

    public exposeInput = (
      subPinId: string,
      pinSpec: GraphSubPinSpec,
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
      subPinSpec: GraphSubPinSpec
    ): void => {
      this._ensure()
      return this.plugPin(type, pinId, subPinId, subPinSpec)
    }

    public plugInput = (
      subPinId: string,
      subPin: GraphSubPinSpec,
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
    ): GraphSubPinSpec => {
      this._ensure()
      return this.__graph.getSubPinSpec(type, pinId, subPinId)
    }

    public unplugPin = (type: IO, pinId: string, subPinId: string): void => {
      this._ensure()
      return this.__graph.unplugPin(type, pinId, subPinId)
    }

    public isExposedInput(pin: GraphSubPinSpec): boolean {
      this._ensure()
      return this.__graph.isExposedInput(pin)
    }

    public getExposedInputPin = <K extends keyof I>(id: K): Pin<I[K]> => {
      this._ensure()

      return this.__graph.getExposedInputPin(id)
    }

    public getExposedOutputPin = (id: string): Pin<O[keyof O]> => {
      this._ensure()
      return this.__graph.getExposedOutputPin(id)
    }

    public getExposedPinSpec(pinId: string, type: IO): GraphPinSpec {
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

    public getExposedInputSpec(pinId: string): GraphPinSpec {
      this._ensure()
      return this.__graph.getExposedInputSpec(pinId)
    }

    public getExposedOutputSpec(pinId: string): GraphPinSpec {
      this._ensure()
      return this.__graph.getExposedOutputSpec(pinId)
    }

    public hasUnit(id: string): boolean {
      this._ensure()
      return this.__graph.hasUnit(id)
    }

    public hasMerge(id: string): boolean {
      this._ensure()
      return this.__graph.hasMerge(id)
    }

    public getGraphUnitSpec(unitId: string): GraphUnitSpec {
      this._ensure()
      return this.__graph.getGraphUnitSpec(unitId)
    }

    public getUnit(id: string): Unit<any, any> {
      this._ensure()
      return this.__graph.getUnit(id)
    }

    public getUnitByPath(path: string[]): Unit<any, any> {
      this._ensure()
      return this.__graph.getUnitByPath(path)
    }

    public getUnitPin(id: string, type: IO, pinId: string): Pin<any> {
      this._ensure()
      return this.__graph.getUnitPin(id, type, pinId)
    }

    public getUnitData(id: string, type: IO, pinId: string): any {
      this._ensure()
      return this.__graph.getUnitData(id, type, pinId)
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

    public getMerges(): { [id: string]: Unit<any> } {
      this._ensure()
      return this.__graph.getMerges()
    }

    public getMerge(mergeId: string): Unit {
      this._ensure()
      return this.__graph.getMerge(mergeId)
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
      return this.__graph.addUnitSpecs(units)
    }

    public addUnit = (unitId: string, unit: Unit, ...extra: any[]): void => {
      this._ensure()
      return this.__graph.addUnit(unitId, unit, ...extra)
    }

    public removeUnit(unitId: string, ...extra: any[]) {
      this._ensure()
      return this.__graph.removeUnit(unitId, ...extra)
    }

    public addUnitGhost(
      unitId: string,
      nextUnitId: string,
      nextUnitBundle: UnitBundleSpec,
      nextUnitPinMap: IOOf<Dict<string>>
    ): void {
      this._ensure()
      return this.__graph.addUnitGhost(
        unitId,
        nextUnitId,
        nextUnitBundle,
        nextUnitPinMap
      )
    }

    public removeUnitGhost(
      unitId: string,
      nextUnitId: string,
      nextUnitSpec: GraphSpec
    ): { specId: string; bundle: UnitBundleSpec } {
      this._ensure()
      return this.__graph.removeUnitGhost(unitId, nextUnitId, nextUnitSpec)
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

    public isPinMergedTo(
      mergeId: string,
      unitId: string,
      type: IO,
      pinId: string
    ) {
      this._ensure()
      return this.__graph.isPinMergedTo(mergeId, unitId, type, pinId)
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
  }

  return Lazy
}
