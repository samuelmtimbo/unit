import { $ } from '../$'
import { bundleSpec, unitBundleSpec } from '../../bundle'
import { emptySpec } from '../../client/spec'
import {
  appendChild,
  appendParentChild,
  hasChild,
  insertChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  refSlot,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  reorderParentRoot,
  reorderRoot,
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { GRAPH_DEFAULT_EVENTS } from '../../constant/GRAPH_DEFAULT_EVENTS'
import { SELF } from '../../constant/SELF'
import { MergeNotFoundError } from '../../exception/MergeNotFoundError'
import { UnitNotFoundError } from '../../exception/UnitNotFoundError'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Pins } from '../../Pins'
import { Primitive } from '../../Primitive'
import {
  makeAddMergeAction,
  makeAddUnitAction,
  makeCoverPinSetAction,
  makeExposePinSetAction,
  makePlugPinAction,
  makeRemoveMergeAction,
  makeRemoveUnitAction,
  makeUnplugPinAction,
  processAction,
} from '../../spec/actions/G'
import { cloneUnit } from '../../spec/cloneUnit'
import { emptyIO } from '../../spec/emptyIO'
import { fromId } from '../../spec/fromId'
import {
  setPinSetFunctional,
  setUnitPinData,
  setUnitSize,
  setComponentSize,
  setSubComponentSize,
  plugPin,
  addPinToMerge,
  coverPin,
  unplugPin,
  coverPinSet,
} from '../../spec/reducers/spec_'
import { stringify } from '../../spec/stringify'
import { unitFromBundleSpec } from '../../spec/unitFromSpec'
import {
  forEachGraphSpecPinOfType,
  forEachPinOnMerge,
  forEachPinOnMerges,
  getExposedPinId,
  getMergePinCount,
  getMergePinNodeId,
  getMergeUnitPinCount,
  getOutputNodeId,
  getPinNodeId,
  getPlugSpecs,
  getUnitPlugs,
  hasMerge,
  hasMergePin,
  makeFullSpecCollapseMap,
  opposite,
} from '../../spec/util'
import { State } from '../../State'
import { System } from '../../system'
import pathGet from '../../system/core/object/DeepGet/f'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keyCount } from '../../system/core/object/KeyCount/f'
import deepMerge from '../../system/f/object/DeepMerge/f'
import { isObjNotNull } from '../../system/f/object/DeepMerge/isObjNotNull'
import { keys } from '../../system/f/object/Keys/f'
import {
  Action,
  GraphComponentSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphPinsSpec,
  GraphPlugOuterSpec,
  GraphSubComponentSpec,
  GraphSubPinSpec,
  GraphUnitOuterSpec,
  GraphUnitPinOuterSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
  Spec,
  Specs,
} from '../../types'
import { GraphSpec } from '../../types/GraphSpec'
import { BundleSpec } from '../../types/BundleSpec'
import { Dict } from '../../types/Dict'
import { GraphState } from '../../types/GraphState'
import { C, C_EE } from '../../types/interface/C'
import { ComponentEvents, Component_ } from '../../types/interface/Component'
import { G, G_EE, G_MoveSubgraphIntoArgs } from '../../types/interface/G'
import { U } from '../../types/interface/U'
import { IO } from '../../types/IO'
import { forIO, forIOObjKV, IOOf, _IOOf } from '../../types/IOOf'
import { UnitBundle } from '../../types/UnitBundle'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { weakMerge } from '../../types/weakMerge'
import { forEach, insert, remove } from '../../util/array'
import { callAll } from '../../util/call/callAll'
import {
  clone,
  filterObj,
  forEachObjKV,
  getObjSingleKey,
  isEmptyObject,
  mapObjKV,
  omit,
  pathDelete,
  pathOrDefault,
  pathSet as pathSet,
  reduceObj,
  someObj,
  _keyCount,
} from '../../util/object'
import { Element_ } from '../Element'
import Merge from '../Merge'
import { Stateful_EE } from '../Stateful'
import { Unit, UnitEvents } from '../Unit'
import { UnitRemovePinDataData } from '../Unit/interface'
import { WaitAll } from '../WaitAll'
import {
  GraphAddMergeData,
  GraphAddMergesData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphAddUnitGhostData,
  GraphAddUnitsData,
  GraphBulkEditData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphExplodeUnitData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphMoveSubGraphData,
  GraphMoveSubGraphIntoData,
  GraphMoveSubGraphOutOfData,
  GraphMoveUnitData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemovePinFromMergeData,
  GraphRemoveUnitData,
  GraphRemoveUnitGhostData,
  GraphRemoveUnitPinDataData,
  GraphReorderSubComponentData,
  GraphSetComponentSizeData,
  GraphSetPinSetFunctionalData,
  GraphSetPinSetIdData,
  GraphSetUnitNameData,
  GraphSetUnitPinConstant,
  GraphSetUnitPinDataData,
  GraphSetUnitPinIgnoredData,
  GraphSetUnitSizeData,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from './interface'
import { moveSubgraph } from './moveSubgraph'
import { GraphConnectUnitPlugsOpt } from '../../system/platform/component/app/Editor/Component'

export type Graph_EE = G_EE & C_EE & Stateful_EE

export type GraphEvents = UnitEvents<Graph_EE> & Graph_EE

export class Graph<I = any, O = any>
  extends Primitive<I, O, GraphEvents>
  implements G, C, U
{
  __ = ['U', 'C', 'G', 'EE']

  private _element: boolean = false

  private _spec: GraphSpec

  private _unit: Dict<Unit> = {}

  private _merge: { [mergeId: string]: Merge } = {}

  private _pipedFrom: {
    [output: string]: string
  } = {}

  private _pipedTo: {
    [input: string]: string
  } = {}

  private _errUnitIds: string[] = []

  private _pin: {
    [id: string]: Pin
  } = {}
  private _unitPins: {
    [id: string]: Pin
  } = {}

  private _exposedPin: Dict<Pin> = {}
  private _exposedMerge: Dict<Merge> = {}
  private _exposedEmptySubPin: Dict<Pin> = {}

  private _mergeToSelfUnit: Dict<string> = {}
  private _selfUniToMerge: Dict<string> = {}

  private _pinToMerge: Dict<IOOf<Dict<string>>> = {}

  private _branch: Dict<true> = {}

  private _mergePinCount: Dict<number> = {}

  private _unitToMerge: Dict<Set<string>> = {}
  private _unitToMergeCount: Dict<Dict<number>> = {}

  // E

  private _children: Component_[] = []

  private _waitAll: WaitAll

  private _specs: Specs

  constructor(
    spec: GraphSpec,
    branch: Dict<true> = {},
    system: System,
    id?: string
  ) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      id ?? spec.id
    )

    this._spec = spec

    const specs = { ...(spec.specs ?? {}), [id]: spec }

    this._specs = weakMerge(this.__system.specs, specs)

    const {
      inputs = {},
      outputs = {},
      units = {},
      merges = {},
      component = {},
      render = false,
    } = this._spec

    this._branch = branch

    this._initAddUnits(units)
    this._initMerges(merges)
    this._initInputSets(inputs)
    this._initOutputSets(outputs)
    this._initSetComponent(component)

    this._element = render

    this.addListener('reset', this._reset)
    this.addListener('play', this._play)
    this.addListener('pause', this._pause)
    this.addListener('destroy', this._destroy)
    this.addListener('take_err', this._takeErr)
    this.addListener('take_caught_err', this._takeErr)

    const fInputs = filterObj(inputs, ({ functional }) => !!functional)
    const fInputNames = keys(fInputs)

    const waitAll = new WaitAll<any>(this.__system)

    this._waitAll = waitAll

    forEach(fInputNames, (name) => {
      this._plugToWaitAll(name)
    })
  }

  isUnitPinRef(unitId: string, type: IO, pinId: string): boolean {
    const unit = this.getUnit(unitId)

    const data = unit.isPinRef(type, pinId)

    return data
  }

  getUnitPinData(unitId: string, type: IO, pinId: string): any {
    const unit = this.getUnit(unitId)

    const data = unit.getPinData(type, pinId)

    return data
  }

  removeUnitPinData(unitId: string, type: IO, pinId: string) {
    this._removeUnitPinData(unitId, type, pinId)

    // this.emit('remove_unit_pin_data', unitId, type, pinId, [])
  }

  removeMergeData(mergeId: string) {
    this._removeMergeData(mergeId)
  }

  setMergeData(mergeId: string, data: any) {
    this._setMergeData(mergeId, data)
  }

  private _refMergePin = (mergeId: string, type: IO): Pin => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    const mergePin = this._pin[mergePinNodeId]

    return mergePin
  }

  private _setMergeData(mergeId: string, data: any) {
    const mergePin = this._refMergePin(mergeId, 'input')

    mergePin.push(data)
  }

  private _removeMergeData(mergeId: string) {
    const mergePin = this._refMergePin(mergeId, 'input')

    mergePin.take()
  }

  private _plugToWaitAll = (inputName: string): void => {
    const inputPin = new Pin()

    const outputPin = this.getExposedInputPin(inputName)

    this._waitAll.addInput(inputName, inputPin)
    this._waitAll.setOutput(inputName, outputPin)

    this.setInput(inputName, inputPin, {})
  }

  private _unplugFromWaitAll = (inputName: string): void => {
    const inputPin = this.getExposedInputPin(inputName)

    this._waitAll.removeInput(inputName)
    this._waitAll.removeOutput(inputName)

    this.setInput(inputName, inputPin, {})
  }

  private _getExposedSubPinNodeId = (
    type: IO,
    pin: GraphSubPinSpec
  ): string => {
    const { unitId, pinId, mergeId } = pin

    if (mergeId) {
      return getMergePinNodeId(mergeId, type)
    } else {
      return getPinNodeId(unitId!, type, pinId!)
    }
  }

  private _removeUnitPinData(unitId: string, type: IO, pinId: string) {
    const unit = this.getUnit(unitId)

    unit.removePinData(type, pinId)
  }

  private _setBranch(
    mergeId: string,
    type: IO,
    pinNodeId: string,
    propagate: boolean
  ) {
    this._memSetBranch(mergeId, type, pinNodeId)
    this._simSetBranch(mergeId, type, pinNodeId, propagate)
  }

  private _memSetBranch(mergeId: string, type: IO, pinNodeId: string) {
    if (type === 'input') {
      this._pipedTo[pinNodeId] = mergeId
    } else {
      this._pipedFrom[pinNodeId] = mergeId
    }
  }

  private _simSetBranch(
    mergeId: string,
    type: IO,
    pinNodeId: string,
    propagate: boolean
  ) {
    // console.log('Graph', '_simSetBranch', mergeId, type, pinNodeId)

    const merge = this._merge[mergeId]
    if (type === 'input') {
      const input = this._pin[pinNodeId]

      merge.setOutput(pinNodeId, input, {}, propagate)
    } else {
      const output = this._pin[pinNodeId]

      merge.setInput(pinNodeId, output, {}, propagate)
    }
  }

  private _memRemoveBranch(mergeId: string, type: IO, pinNodeId: string): void {
    if (type === 'input') {
      delete this._pipedTo[pinNodeId]
    } else {
      delete this._pipedFrom[pinNodeId]
    }
  }

  private _simRemoveBranch(mergeId: string, type: IO, pinNodeId: string): void {
    // console.log('Graph', '_simRemoveBranch', mergeId, type, pinNodeId)

    if (type === 'input') {
      this._merge[mergeId].removeOutput(pinNodeId)
    } else {
      this._merge[mergeId].removeInput(pinNodeId)
    }
  }

  private _removeBranch(mergeId: string, type: IO, pinNodeId: string): void {
    this._simRemoveBranch(mergeId, type, pinNodeId)
    this._memRemoveBranch(mergeId, type, pinNodeId)
  }

  private _ensureMergePin = (
    type: IO,
    mergeId: string,
    propagate: boolean = false
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    if (!this._pin[mergePinNodeId]) {
      const oppositeType = opposite(type)

      const mergePin = new Pin()

      this._pin[mergePinNodeId] = mergePin

      this._setBranch(mergeId, oppositeType, mergePinNodeId, propagate)
    }
  }

  private _memEnsureMergePin = (type: IO, mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    if (!this._pin[mergePinNodeId]) {
      const oppositeType = opposite(type)

      const mergePin = new Pin()

      this._pin[mergePinNodeId] = mergePin

      this._memSetBranch(mergeId, oppositeType, mergePinNodeId)
    }
  }

  private _removeMergeOutput = (mergeId: string): void => {
    this._simRemoveMergeOutput(mergeId)
    this._memRemoveMergeOutput(mergeId)
  }

  private _memRemoveMergeOutput = (mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, 'output')

    if (this._pin[mergePinNodeId]) {
      this._memRemoveBranch(mergeId, 'input', mergePinNodeId)

      delete this._pin[mergePinNodeId]
    }
  }

  private _simRemoveMergeOutput = (mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, 'output')

    if (this._pin[mergePinNodeId]) {
      this._simRemoveBranch(mergeId, 'input', mergePinNodeId)
    }
  }

  private _plugPinToMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string,
    opt: PinOpt,
    propagate: boolean = true
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    this._ensureMergePin(type, mergeId)

    const subPin = this._pin[mergePinNodeId]

    this._setExposedSubPin(type, name, subPinId, subPin, opt, propagate)
  }

  private _memPlugPinToMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string
  ): void => {
    // TODO
  }

  private _simPlugPinToMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string,
    propagate: boolean = true
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    this._ensureMergePin(type, mergeId, propagate)

    const subPin = this._pin[mergePinNodeId]

    this._simSetExposedSubPin(type, name, subPinId, subPin, propagate)
  }

  private _simUnplugPinFromMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string
  ): void => {
    this._simRemoveExposedSubPin(type, name, subPinId)
  }

  private _simUnplugPinFromUnitPin = (
    type,
    pinId,
    subPinId,
    _unitId,
    _pinId
  ) => {
    this._simRemoveExposedSubPin(type, pinId, subPinId)
  }

  private _plugPinToUnitPin = (
    type: IO,
    name: string,
    subPinId: string,
    unitId: string,
    pinId: string,
    opt: PinOpt,
    propagate: boolean = false
  ): void => {
    this._memPlugPinToUnitPin(type, name, subPinId, unitId, pinId)
    this._simPlugPinToUnitPin(type, name, subPinId, unitId, pinId, propagate)
  }

  private _memPlugPinToUnitPin = (
    type: IO,
    name: string,
    subPinId: string,
    unitId: string,
    pinId: string
  ): void => {
    const subPin = this.getUnitPin(unitId, type, pinId)

    this._memSetExposedSubPin(type, name, subPinId, subPin)
  }

  private _simPlugPinToUnitPin = (
    type: IO,
    name: string,
    subPinId: string,
    unitId: string,
    pinId: string,
    propagate: boolean = true
  ): void => {
    const subPin = this.getUnitPin(unitId, type, pinId)

    this._simSetExposedSubPin(type, name, subPinId, subPin, propagate)
  }

  private setExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin,
    opt: PinOpt
  ) {
    this._setExposedSubPin(type, name, subPinId, subPin, opt)

    this.emit('set_exposed_sub_pin', type, name, subPinId, subPin, opt, [])
  }

  private _setExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin,
    opt: PinOpt,
    propagate: boolean = true
  ) {
    const oppositeType = opposite(type)
    const exposedPinId = getExposedPinId(name, type)

    const exposedMerge = this._exposedMerge[exposedPinId]

    exposedMerge.setPin(subPinId, oppositeType, subPin, opt, propagate)
  }

  private _memSetExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin
  ) {
    // TODO
  }

  private _simSetExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin,
    propagate: boolean = true
  ) {
    // console.log(
    //   'Graph',
    //   '_simSetExposedSubPin',
    //   type,
    //   name,
    //   subPinId,
    //   subPin,
    //   propagate
    // )

    const oppositeType = opposite(type)
    const exposedPinId = getExposedPinId(name, type)

    const exposedMerge = this._exposedMerge[exposedPinId]

    exposedMerge.setPin(subPinId, oppositeType, subPin, {}, propagate)
  }

  private _simRemoveExposedSubPin(type: IO, name: string, subPinId: string) {
    const oppositeType = opposite(type)
    const exposedPinId = getExposedPinId(name, type)

    const exposedMerge = this._exposedMerge[exposedPinId]

    exposedMerge.removePin(oppositeType, subPinId)
  }

  private _takeErr = (): void => {
    if (this._errUnitIds.length > 0) {
      const errUnitId = this._errUnitIds[0]
      const errUnit = this._unit[errUnitId]
      errUnit.takeErr()
    }
  }

  private _nextErr = (): void => {
    if (this._errUnitIds.length > 0) {
      const errUnitId = this._errUnitIds[0]
      const errUnit = this.getUnit(errUnitId)
      const err = errUnit.getErr()
      this.err(err)
    } else {
      this.takeErr()
    }
  }

  private _destroy = () => {
    forEachValueKey(this._unit, (u) => u.destroy())
    forEachValueKey(this._merge, (m) => m.destroy())
  }

  private _reset = (): void => {
    // TODO
  }

  private _play(): void {
    forEachValueKey(this._unit, (u) => u.play())

    forEach(this._children, (c) => c.play())
  }

  private _pause(): void {
    forEachValueKey(this._unit, (u) => u.pause())

    forEach(this._children, (c) => c.pause())
  }

  private _removeErrUnit(unitId: string): void {
    // unit.takeErr()
    const index = this._errUnitIds.indexOf(unitId)
    this._errUnitIds.splice(index, 1)
    if (index === 0) {
      this._nextErr()
    }
  }

  public specHasMerge = (mergeId: string): boolean => {
    return !!this._spec.merges![mergeId]
  }

  private _validateMergeId(mergeId: string) {
    if (!this._spec.merges![mergeId]) {
      throw new MergeNotFoundError()
    }
  }

  private _validateUnitId(unitId: string) {
    if (!this._spec.units![unitId]) {
      throw new UnitNotFoundError()
    }
  }

  public isElement(): boolean {
    return this._element
  }

  public setElement(): void {
    this._element = true
    this.emit('element', [])
  }

  public setNotElement(): void {
    this._element = false
    this.emit('not_element', [])
  }

  public getSpec = (): GraphSpec => {
    return this._spec
  }

  public getComponentSpec = (): GraphComponentSpec => {
    return this._spec.component
  }

  public getBundleSpec(deep: boolean = false): BundleSpec {
    const { spec, specs } = bundleSpec(this._spec, this.__system.specs)

    let memory

    if (deep) {
      memory = this.snapshot()

      forEachObjKV(this._unit, (unitId, unit) => {
        const unitMemory = unit.snapshot()

        pathSet(spec, ['units', unitId, 'memory'], unitMemory)
      })
    }

    return { spec, specs }
  }

  public getBundle(deep: boolean = false): UnitBundleSpec {
    const { id } = this

    const inputPins = this.getInputs()
    const outputPins = this.getOutputs()

    const mapPins = (pins: Pins) => {
      return mapObjKV(pins, (name: string, pin: Pin) => {
        const data = pin.peak()

        let _data = data

        if (_data instanceof $) {
          _data = null
        }

        return {
          constant: pin.constant(),
          ignored: pin.ignored(),
          data: _data === undefined ? undefined : stringify(_data),
        }
      })
    }

    const input = mapPins(inputPins)
    const output = mapPins(outputPins)

    let memory = undefined

    if (deep) {
      memory = this.snapshot()
    }

    const unit = { id, input, output, memory }

    const bundle = unitBundleSpec(unit, this._specs)

    return bundle
  }

  public snapshotSelf(): Dict<any> {
    const state = { unit: {}, merge: {}, exposedMerge: {}, waitAll: null }

    for (const unitId in this._unit) {
      const unit = this._unit[unitId]

      const unit_state = unit.snapshot()

      state.unit[unitId] = unit_state
    }

    for (const mergeId in this._merge) {
      const merge = this._merge[mergeId]

      const merge_state = merge.snapshot()

      state.merge[mergeId] = merge_state
    }

    for (const pinId in this._exposedMerge) {
      const merge = this._exposedMerge[pinId]

      const merge_state = merge.snapshot()

      state.exposedMerge[pinId] = merge_state
    }

    state.waitAll = this._waitAll.snapshot()

    return state
  }

  public restoreSelf(state: Dict<any>): void {
    super.restoreSelf(state)

    for (const unitId in this._unit) {
      const unit = this._unit[unitId]

      const unit_state = state.unit?.[unitId]

      if (unit_state) {
        unit.restore(unit_state)
      }
    }

    for (const mergeId in this._merge) {
      const merge = this._merge[mergeId]

      const merge_state = state.merge?.[mergeId]

      if (merge_state) {
        merge.restore(merge_state)
      }
    }

    for (const exposedPinId in this._exposedMerge) {
      const [type, pinId] = exposedPinId.split('/') as [IO, string]

      if (this.hasDataPinNamed(type, pinId)) {
        const merge = this._exposedMerge[exposedPinId]

        const merge_state = state.exposedMerge?.[exposedPinId]

        if (merge_state) {
          merge.restore(merge_state)
        }
      }
    }

    const wait_all_state = state.waitAll

    if (wait_all_state) {
      this._waitAll.restore(wait_all_state)
    }
  }

  public getGraphUnitSpec(id: string): GraphUnitSpec {
    return this._spec.units[id]
  }

  public getUnits = (): Dict<Unit> => {
    return this._unit
  }

  public exposeOutputSets = (outputs: GraphPinsSpec): void => {
    this._exposeOutputSets(outputs)
  }

  private _exposeOutputSets = (outputs: GraphPinsSpec): void => {
    forEachValueKey(outputs, this._exposeOutputSet)
  }

  public exposeOutputSet = (
    input: GraphPinSpec,
    pinId: string,
    data?: any
  ): void => {
    this.exposePinSet('output', pinId, input, data)
  }

  private _exposeOutputSet = (
    input: GraphPinSpec,
    pinId: string,
    data?: any
  ): void => {
    this._exposePinSet('output', pinId, input, data)
  }

  public exposeOutput = (
    subPinId: string,
    pinSpec: GraphSubPinSpec,
    id: string
  ): void => {
    this.exposePin('output', id, subPinId, pinSpec)
  }

  public coverOutputSet = (id: string): void => {
    this.coverPinSet('output', id)
  }

  public coverOutput = (subPinId: string, id: string): void => {
    this.coverPin('output', id, subPinId)
  }

  public plugOutput = (
    subPinId: string,
    subPin: GraphSubPinSpec,
    id: string
  ): void => {
    this.plugPin('input', id, subPinId, subPin)
  }

  public unplugOutput = (subPinId: string, id: string): void => {
    this.unplugPin('output', id, subPinId)
  }

  public _unplugOutput = (subPinId: string, id: string): void => {
    this._unplugPin('output', id, subPinId)
  }

  public isExposedOutput(pin: GraphSubPinSpec): boolean {
    const outputs = this._spec.outputs || {}
    const nodeId = this._getExposedSubPinNodeId('output', pin)
    return someObj(outputs, ({ plug }) => {
      return someObj(
        plug,
        (o) => this._getExposedSubPinNodeId('output', o) === nodeId
      )
    })
  }

  public getExposedOutput(pin: GraphSubPinSpec): string {
    const outputs = this._spec.outputs || {}
    const nodeId = this._getExposedSubPinNodeId('output', pin)
    for (const outputId in outputs) {
      const output = outputs[outputId]
      const { plug } = output
      for (const subPinId in plug) {
        const subPin = plug[subPinId]
        if (this._getExposedSubPinNodeId('output', subPin) === nodeId) {
          return outputId
        }
      }
    }
  }

  public exposeInputSets = (inputs: GraphPinsSpec): void => {
    forEachValueKey(inputs, this.exposeInputSet)
  }

  private _exposeInputSets = (inputs: GraphPinsSpec): void => {
    forEachValueKey(inputs, this._exposeInputSet)
  }

  private _initInputSets = (inputs: GraphPinsSpec): void => {
    forEachObjKV(inputs, this._initPinSet.bind(this, 'input'))
  }

  private _initOutputSets = (outputs: GraphPinsSpec): void => {
    forEachObjKV(outputs, this._initPinSet.bind(this, 'output'))
  }

  public exposeInputSet = (
    input: GraphPinSpec,
    pinId: string,
    data?: any
  ): void => {
    this.exposePinSet('input', pinId, input, data)
  }

  private _exposeInputSet = (
    input: GraphPinSpec,
    pinId: string,
    data?: any
  ): void => {
    this._exposePinSet('input', pinId, input, data)
  }

  public exposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    data: any = undefined,
    emit: boolean = true,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', 'exposePinSet', type, pinId, pinSpec)

    this._exposePinSet(type, pinId, pinSpec, data, propagate)

    data = this.getPin(type, pinId).peak()

    emit && this.emit('expose_pin_set', type, pinId, pinSpec, data, [])

    if (this._transacting) {
      this._transaction.push(makeExposePinSetAction(type, pinId, pinSpec))
    }
  }

  setUnitSize(unitId: string, width: number, height: number): void {
    throw new Error('Method not implemented.')
  }

  setSubComponentSize(unitId: string, width: number, height: number): void {
    throw new Error('Method not implemented.')
  }

  setComponentSize(unitId: string, width: number, height: number): void {
    throw new Error('Method not implemented.')
  }

  public _exposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    data?: any,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_exposePinSet', type, pinId, pinSpec, data, propagage)

    const exposedPin = new Pin({ data })
    const exposedMerge = new Merge(this.__system)

    this._fork()

    this._specExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
    this._memExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
    this._simExposePinSet(
      type,
      pinId,
      pinSpec,
      exposedPin,
      exposedMerge,
      propagate
    )
  }

  public _initPinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    exposedPin,
    exposedMerge = new Merge(this.__system),
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_initPinSet', type, pinId, pinSpec, exposedPin)

    const { ref } = pinSpec

    exposedPin = exposedPin || new Pin({ ref })

    this._memExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
    this._simExposePinSet(
      type,
      pinId,
      pinSpec,
      exposedPin,
      exposedMerge,
      propagate
    )
  }

  public _specExposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge,
    propagate: boolean = true
  ): void => {
    // console.log(
    //   'Graph',
    //   '_specExposePinSet',
    //   this._spec.name,
    //   type,
    //   pinId,
    //   pinSpec
    // )

    pathSet(this._spec, [`${type}s`, pinId], pinSpec)

    const { plug } = pinSpec

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._specExposePin(type, pinId, subPinId, subPinSpec)
    })
  }

  private _memExposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge
  ) => {
    // console.log('Graph', '_memExposePinSet', type, pinId, pinSpec)

    const { plug } = pinSpec

    const exposedNodeId = getExposedPinId(pinId, type)

    this._exposedPin[exposedNodeId] = exposedPin
    this._exposedMerge[exposedNodeId] = exposedMerge

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._memExposePin(type, pinId, subPinId, subPinSpec)
    })
  }

  private _simExposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge,
    propagate: boolean = true
  ) {
    const { plug, ref } = pinSpec

    exposedMerge.setPin(pinId, type, exposedPin)

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._simExposePin(type, pinId, subPinId, subPinSpec, propagate)
    })

    this.setPin(pinId, type, exposedPin, { ref }, propagate)
  }

  public isPinSetFunctional = (type: IO, pinId: string): boolean => {
    return !!this._spec[`${type}s`][pinId].functional
  }

  public setPinSetFunctional(
    type: IO,
    pinId: string,
    functional: boolean,
    emit: boolean = true
  ): void {
    if (type === 'output') {
      throw new Error('Cannot set output pin set functional')
    }

    const isPinFunctional = this.isPinSetFunctional(type, pinId)

    this._setPinSetFunctional(type, pinId, functional)

    if (!isPinFunctional && functional) {
      this._plugToWaitAll(pinId)
    } else if (isPinFunctional && !functional) {
      this._unplugFromWaitAll(pinId)
    }

    emit && this.emit('set_pin_set_functional', type, pinId, functional, [])
  }

  private _setPinSetFunctional(
    type: IO,
    name: string,
    functional: boolean
  ): void {
    this._specSetPinSetFunctional(type, name, functional)
  }

  private _specSetPinSetFunctional(
    type: IO,
    pinId: string,
    functional: boolean
  ): void {
    setPinSetFunctional(
      {
        type,
        pinId,
        functional,
      },
      this._spec
    )
  }

  public setPinSetId(type: IO, pinId: string, nextPinId: string): void {
    this._setPinSetId(type, pinId, nextPinId)

    this.renamePin(type, pinId, nextPinId)

    this.emit('set_pin_set_id', type, pinId, nextPinId, [])
  }

  public _setPinSetId(type: IO, pinId: string, nextPinId: string): void {
    // console.log('Graph', '_setPinSetId', type, pinId, nextPinId)

    const exposedPinId = getExposedPinId(pinId, type)
    const nextExposedPinId = getExposedPinId(nextPinId, type)

    const pinSpec = this._spec[`${type}s`][pinId]

    delete this._spec[`${type}s`][pinId]

    this._spec[`${type}s`][nextPinId] = pinSpec

    const exposedMerge = this._exposedMerge[exposedPinId]

    delete this._exposedMerge[exposedPinId]

    this._exposedMerge[nextExposedPinId] = exposedMerge
  }

  public exposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    emit: boolean = true
  ): void => {
    this._exposePin(type, pinId, subPinId, subPinSpec)

    emit && this.emit('expose_pin', type, pinId, subPinId, subPinSpec, [])

    if (this._transacting) {
      this._transaction.push(
        makePlugPinAction(type, pinId, subPinId, subPinSpec)
      )
    }
  }

  private _exposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void => {
    this._specExposePin(type, pinId, subPinId, subPinSpec)
    this._memExposePin(type, pinId, subPinId, subPinSpec)
    this._simExposePin(type, pinId, subPinId, subPinSpec)
  }

  private _specExposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void => {
    this._specPlugPin(type, pinId, subPinId, subPinSpec)
  }

  private _memExposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void => {
    this._memPlugPin(type, pinId, subPinId, subPinSpec)
  }

  private _simExposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    propagate: boolean = true
  ): void => {
    // console.log(
    //   'Graph',
    //   '_simExposePin',
    //   type,
    //   pinId,
    //   subPinId,
    //   subPinSpec,
    //   propagate
    // )

    const { unitId, pinId: _pinId, mergeId } = subPinSpec

    if (mergeId || (unitId && _pinId)) {
      this._simPlugPin(type, pinId, subPinId, subPinSpec, propagate)
    } else {
      this._simPlugEmptyPin(type, pinId, subPinId, propagate)
    }
  }

  public exposeInput = (
    subPinId: string,
    pinSpec: GraphSubPinSpec,
    pinId: string,
    emit: boolean = true
  ): void => {
    this.exposePin('input', pinId, subPinId, pinSpec, emit)
  }

  public coverInputSet = (id: string): void => {
    this.coverPinSet('input', id)
  }

  public coverInput = (subPinId: string, id: string): void => {
    this.coverPin('input', id, subPinId)
  }

  public coverPinSet = (type: IO, id: string, emit: boolean = true): void => {
    const pinSpec = this.getExposedPinSpec(type, id)

    this._coverPinSet(type, id)

    emit && this.emit('cover_pin_set', type, id, pinSpec, undefined, [])

    if (this._transacting) {
      this._transaction.push(makeCoverPinSetAction(type, id, pinSpec))
    }
  }

  public _coverPinSet = (type: IO, id: string): void => {
    // console.log('Graph', '_coverPinSet', type, id)

    this._fork()

    this._simCoverPinSet(type, id)
    this._memCoverPinSet(type, id)
    this._specCoverPinSet(type, id)
  }

  private _memCoverPinSet = (type: IO, pinId: string): void => {
    const pinSpec = this.getExposedPinSpec(type, pinId)

    const { plug } = pinSpec

    const exposedNodeId = getExposedPinId(pinId, type)

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._memCoverPin(type, pinId, subPinId)
    })

    delete this._exposedPin[exposedNodeId]
    delete this._exposedMerge[exposedNodeId]
  }

  private _specCoverPinSet = (type: IO, pinId: string): void => {
    // console.log('Graph', '_specCoverPinSet', type, pinId)

    const pinSpec = this.getExposedPinSpec(type, pinId)

    const { plug } = pinSpec

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._specCoverPin(type, pinId, subPinId)
    })

    coverPinSet({ type, pinId }, this._spec)
  }

  private _simCoverPinSet = (type: IO, pinId: string): void => {
    const pinSpec = this.getExposedPinSpec(type, pinId)

    const { plug } = pinSpec

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._simCoverPin(type, pinId, subPinId)
    })

    this.removePin(type, pinId)
  }

  private _specSetPinRef = (type: IO, pinId: string, ref: boolean) => {
    pathSet(this._spec, [`${type}s`, pinId, 'ref'], ref)
  }

  private _memPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void => {
    const { mergeId, unitId: _unitId, pinId: _pinId } = subPinSpec

    let ref = undefined

    if (_unitId && _pinId) {
      if (this.isUnitRefPin(_unitId, type, _pinId) || _pinId === SELF) {
        ref = true
      }
    } else if (mergeId) {
      const merge = this.getMergeSpec(mergeId)

      forEachPinOnMerge(merge, (unitId, type, pinId) => {
        const unit = this.getUnit(unitId)
        if (unit.hasRefPinNamed(type, pinId)) {
          ref = true
        }
      })

      if (this._mergeToSelfUnit[mergeId]) {
        ref = true
      }
    } else {
      this._memPlugEmptyPin(type, pinId, subPinId)
    }

    if (ref !== undefined) {
      this.setPinRef(type, pinId, ref)
    }

    pathSet(this._spec, [`${type}s`, pinId, 'plug', subPinId], subPinSpec)
  }

  private _specPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void => {
    // console.log('Graph', '_specPlugPin', type, pinId, subPinId, subPinSpec)

    const { mergeId: _mergeId, unitId: _unitId, pinId: _pinId } = subPinSpec

    let ref = undefined

    if (_unitId && _pinId) {
      if (this.isUnitRefPin(_unitId, type, _pinId) || _pinId === SELF) {
        ref = true
      }
    } else if (_mergeId) {
      const merge = this.getMergeSpec(_mergeId)

      forEachPinOnMerge(merge, (unitId, type, pinId) => {
        const unit = this.getUnit(unitId)

        if (unit.isPinRef(type, pinId)) {
          ref = true
        }
      })

      if (this._mergeToSelfUnit[_mergeId]) {
        ref = true
      }
    }

    if (ref !== undefined) {
      this._specSetPinRef(type, pinId, ref)
    }

    plugPin({ type, pinId, subPinId, subPinSpec }, this._spec)
  }

  public plugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    emit: boolean = true,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', 'plugPin', pinId, subPinId, subPinSpec)

    this._plugPin(type, pinId, subPinId, subPinSpec, propagate)

    emit && this.emit('plug_pin', type, pinId, subPinId, subPinSpec, [])
  }

  private _plugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_plugPin', type, pinId, subPinId, subPinSpec)

    const { mergeId, unitId, pinId: _pinId } = subPinSpec

    const pinSpec = this.getExposedPinSpec(type, pinId)

    this._specPlugPin(type, pinId, subPinId, subPinSpec)
    this._memPlugPin(type, pinId, subPinId, subPinSpec)

    const { ref } = pinSpec

    const opt = { ref: !!ref }

    if (mergeId) {
      this._plugPinToMerge(type, pinId, subPinId, mergeId, opt, propagate)
    } else if (unitId && _pinId) {
      this._plugPinToUnitPin(
        type,
        pinId,
        subPinId,
        unitId,
        _pinId,
        opt,
        propagate
      )
    } else {
      //
    }
  }

  private _simPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_simPlugPin', pinId, subPinId, subPinSpec)

    const { mergeId, unitId, pinId: _pinId } = subPinSpec

    if (mergeId) {
      this._simPlugPinToMerge(type, pinId, subPinId, mergeId, propagate)
    } else {
      this._simPlugPinToUnitPin(
        type,
        pinId,
        subPinId,
        unitId!,
        _pinId!,
        propagate
      )
    }
  }

  public plugInput = (
    subPinId: string,
    subPin: GraphSubPinSpec,
    id: string
  ): void => {
    this.plugPin('input', id, subPinId, subPin)
  }

  public unplugInput = (subPinId: string, id: string): void => {
    this.unplugPin('input', id, subPinId)
  }

  public _unplugInput = (subPinId: string, id: string): void => {
    this._unplugPin('input', id, subPinId)
  }

  public coverPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    emit: boolean = true
  ): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._coverPin(type, pinId, subPinId)

    emit && this.emit('cover_pin', type, pinId, subPinId, subPinSpec, [])

    if (this._transacting) {
      this._transaction.push(
        makeUnplugPinAction(type, pinId, subPinId, subPinSpec)
      )
    }
  }

  private _coverPin = (type: IO, pinId: string, subPinId: string): void => {
    this._fork()

    this._simCoverPin(type, pinId, subPinId)
    this._memCoverPin(type, pinId, subPinId)
    this._specCoverPin(type, pinId, subPinId)
  }

  private _specCoverPin = (type: IO, pinId: string, subPinId: string): void => {
    // console.log('Graph', '_specCoverPin', type, pinId, subPinId)

    coverPin({ type, pinId, subPinId }, this._spec)
  }

  private _memCoverPin = (type: IO, pinId: string, subPinId: string): void => {
    const pinSpec = this._spec[`${type}s`][pinId] as GraphPinSpec
    const subPinSpec = pinSpec['plug'][subPinId] as GraphSubPinSpec

    const { mergeId } = subPinSpec

    if (type === 'output') {
      if (mergeId) {
        this._memRemoveMergeOutput(mergeId)
      }
    }

    this._memUnplugPin(type, pinId, subPinId)
  }

  private _simCoverPin = (type: IO, id: string, subPinId: string): void => {
    const subPinSpec = this.getSubPinSpec(type, id, subPinId)

    const { mergeId, unitId, pinId } = subPinSpec

    if (type === 'output') {
      if (mergeId) {
        // this._simRemoveMergeOutput(mergeId)
      }
    }

    this._simUnplugPin(type, id, subPinId)

    if (mergeId || (unitId && pinId)) {
      this._simRemoveExposedSubPin(type, id, subPinId)
    }
  }

  public getSubPinSpec = (
    type: IO,
    pinId: string,
    subPinId: string
  ): GraphSubPinSpec => {
    return this._spec[`${type}s`]?.[pinId]?.['plug']?.[subPinId]
  }

  public unplugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    emit?: false,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', 'unplugPin', pinId, subPinId)

    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._unplugPin(type, pinId, subPinId, propagate)

    emit && this.emit('unplug_pin', type, pinId, subPinId, subPinSpec, [])
  }

  private _unplugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', 'unplugPin', pinId, subPinId)

    this._fork()

    this._memPlugEmptyPin(type, pinId, subPinId)

    this._specUnplugPin(type, pinId, subPinId)
    this._simUnplugPin(type, pinId, subPinId, propagate)
    this._memUnplugPin(type, pinId, subPinId)
  }

  private _specUnplugPin = (
    type: IO,
    pinId: string,
    subPinId: string
  ): void => {
    // console.log('Graph', '_specUnplugPin', type, pinId, subPinId)

    unplugPin({ type, pinId, subPinId }, this._spec)
  }

  private _memUnplugPin = (type: IO, pinId: string, subPinId: string): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    const isOutput = type === 'output'

    if (isOutput) {
      const { mergeId } = subPinSpec

      if (mergeId) {
        this._memRemoveMergeOutput(mergeId)
      }
    }
  }

  private _ensureEmptySubPin = (
    type: IO,
    pinId: string,
    subPinId: string
  ): Pin => {
    const emptySubPinId = `${type}/${pinId}/${subPinId}`

    let emptySubPin = this._exposedEmptySubPin[emptySubPinId]

    if (!emptySubPin) {
      emptySubPin = new Pin()

      this._exposedEmptySubPin[emptySubPinId] = emptySubPin
    }

    return emptySubPin
  }

  private _memPlugEmptyPin = (
    type: IO,
    pinId: string,
    subPinId: string
  ): void => {
    const emptySubPin = this._ensureEmptySubPin(type, pinId, subPinId)

    this._memSetExposedSubPin(type, pinId, subPinId, emptySubPin)
  }

  private _simUnplugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_simUnplugPin', pinId, subPinId)

    this.__simUnplugPin(type, pinId, subPinId, propagate)
    this._simPlugEmptyPin(type, pinId, subPinId)
  }

  private __simUnplugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean = true
  ): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    const { mergeId: _mergeId, unitId: _unitId, pinId: _pinId } = subPinSpec

    const isOutput = type === 'output'

    if (isOutput) {
      if (_mergeId) {
        this._simRemoveMergeOutput(_mergeId)
      }
    }

    const pin = this.getPin(type, pinId)
    const isRef = this.hasRefPinNamed(type, pinId)

    if (_mergeId) {
      this._simUnplugPinFromMerge(type, pinId, subPinId, _mergeId)
    } else if (_unitId && _pinId) {
      const unit = this.getUnit(_unitId)

      const isUnitPinRef = unit.isPinRef(type, _pinId)

      this._simUnplugPinFromUnitPin(type, pinId, subPinId, _unitId, _pinId)

      if (isUnitPinRef) {
        unit.takePin(type, _pinId)
      }
    }

    if (isRef) {
      const exposedPinId = getExposedPinId(pinId, type)

      const exposedMerge = this._exposedMerge[exposedPinId]

      exposedMerge.reset()

      // pin.take()
    }
  }

  private _simPlugEmptyPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean = true
  ): void => {
    const emptySubPin = this._ensureEmptySubPin(type, pinId, subPinId)

    this._simSetExposedSubPin(type, pinId, subPinId, emptySubPin, propagate)
  }

  private _memUnplugInput = (pinId: string, subPinId: string): void => {
    return this._memUnplugPin('input', pinId, subPinId)
  }

  private _memUnplugOutput = (pinId: string, subPinId: string): void => {
    return this._memUnplugPin('output', pinId, subPinId)
  }

  private _simUnplugInput = (pinId: string, subPinId: string): void => {
    return this._simUnplugPin('input', pinId, subPinId)
  }

  private _simUnplugOutput = (pinId: string, subPinId: string): void => {
    return this._simUnplugPin('output', pinId, subPinId)
  }

  public isExposedInput(pin: GraphSubPinSpec): boolean {
    const inputs = this._spec.inputs || {}
    const pinNodeId = this._getExposedSubPinNodeId('input', pin)
    return someObj(inputs, ({ plug }) => {
      return someObj(plug, (i) => {
        const exposedSubPinNodeId = this._getExposedSubPinNodeId('input', i)
        return exposedSubPinNodeId === pinNodeId
      })
    })
  }

  public getExposedInputPin = (id: string): Pin<I[keyof I]> => {
    const exposedInputId = getExposedPinId(id, 'input')

    return this._exposedPin[exposedInputId]
  }

  public getExposedOutputPin = (id: string): Pin<O[keyof O]> => {
    const exposedOutputId = getExposedPinId(id, 'output')

    return this._exposedPin[exposedOutputId]
  }

  public getExposedPinSpecs(): IOOf<GraphPinsSpec> {
    return {
      input: this.getExposedInputSpecs(),
      output: this.getExposedOutputSpecs(),
    }
  }

  public getExposedPinSpec(type: IO, pinId: string): GraphPinSpec {
    if (type === 'input') {
      return this.getExposedInputSpec(pinId)
    } else {
      return this.getExposedOutputSpec(pinId)
    }
  }

  public isExposedInputPinId(pinId: string): boolean {
    const inputs = this._spec.inputs || {}
    return !!inputs[pinId]
  }

  public isExposedOutputPinId(pinId: string): boolean {
    const outputs = this._spec.outputs || {}
    return !!outputs[pinId]
  }

  public getExposedInputSpec(pinId: string): GraphPinSpec {
    const inputs = this._spec.inputs || {}

    return inputs[pinId]
  }

  public getPlugSpec(type: IO, pinId: string, subPinId: string): GraphPinSpec {
    return this._spec[`${type}s`][pinId]['plug'][subPinId]
  }

  public getExposedInputSpecs(): GraphPinsSpec {
    const inputs = this._spec.inputs || {}

    return inputs
  }

  public getExposedOutputSpec(pinId: string): GraphPinSpec {
    const outputs = this._spec.outputs || {}

    return outputs[pinId]
  }

  public getExposedOutputSpecs(): GraphPinsSpec {
    const outputs = this._spec.outputs || {}

    return outputs
  }

  public hasUnit(unitId: string): boolean {
    return !!this._unit[unitId]
  }

  public hasMerge(mergeId: string): boolean {
    return hasMerge(this._spec, mergeId)
  }

  public hasMergePin(
    mergeId: string,
    unitId: string,
    type: IO,
    pin_id: string
  ): boolean {
    return hasMergePin(this._spec, mergeId, unitId, type, pin_id)
  }

  public hasPlug(type: IO, pinId: string, subPinId: string): boolean {
    const pin = this.getSubPinSpec(type, pinId, subPinId)

    return !!pin
  }

  public getUnit(unitId: string): Unit<any, any> {
    if (!this._unit[unitId]) {
      throw new Error('cannot find unit')
    }
    return this._unit[unitId]
  }

  public getGraph(unitId: string): Graph {
    const graph = this.getUnit(unitId) as Graph
    return graph
  }

  public removeUnitGhost(
    unitId: string,
    nextUnitId: string,
    spec: GraphSpec,
    emit: boolean = true
  ): { specId: string; bundle: UnitBundleSpec } {
    const data = this._removeUnitGhost(unitId, nextUnitId, spec)

    emit && this.emit('remove_unit_ghost', unitId, nextUnitId, spec, [])

    return data
  }

  public addUnitGhost(
    unitId: string,
    nextUnitId: string,
    nextUnitBundle: UnitBundleSpec,
    nextUnitPinMap: _IOOf<Dict<string>>,
    emit: boolean = true
  ): void {
    // console.log(
    //   'addUnitGhost',
    //   unitId,
    //   nextUnitId,
    //   nextUnitBundle,
    //   nextUnitPinMap
    // )

    this._addUnitGhost(unitId, nextUnitId, nextUnitBundle, nextUnitPinMap)

    emit && this.emit('add_unit_ghost', unitId, nextUnitId, nextUnitBundle, [])
  }

  public getUnitOuterSpec = (unitId: string): GraphUnitOuterSpec => {
    const outerSpec: GraphUnitOuterSpec = {
      merges: {
        input: {},
        output: {},
      },
      exposed: {
        input: {},
        output: {},
      },
    }

    const unitToMerge = this._unitToMerge[unitId] || new Set()
    const unitToMergeCount = this._unitToMergeCount[unitId] || 0

    for (const mergeId of unitToMerge) {
      const unitMergeCount = unitToMergeCount[mergeId]

      this._forEachUnitPinOnMerge(unitId, mergeId, (type, pinId) => {
        const mergePinCount = this.getMergePinCount(mergeId)

        if (mergePinCount - unitMergeCount < 2) {
          const merge = this.getMergeSpec(mergeId)

          const otherUnitId = getObjSingleKey(omit(merge, unitId))

          const otherUnitMerge = merge[otherUnitId]

          let otherUnitPinType
          let otherUnitPinId

          if (otherUnitMerge.input) {
            otherUnitPinType = 'input'
            otherUnitPinId = getObjSingleKey(otherUnitMerge.input)
          } else {
            otherUnitPinType = 'output'
            otherUnitPinId = getObjSingleKey(otherUnitMerge.output)
          }

          pathSet(outerSpec.merges, [type, pinId], {
            mergeId,
            otherPin: {
              unitId: otherUnitId,
              type: otherUnitPinType,
              pinId: otherUnitPinId,
            },
          })
        } else {
          pathSet(outerSpec.merges, [type, pinId], { mergeId, otherPin: null })
        }
      })
    }

    // TODO exposed

    return outerSpec
  }

  private _addUnitGhost(
    unitId: string,
    nextUnitId: string,
    nextUnitBundle: UnitBundleSpec,
    nextUnitPinMap: _IOOf<Dict<string>>
  ) {
    const { unit, specs } = nextUnitBundle

    this.__system.injectSpecs(specs)

    if (!this.__system.hasSpec(unit.id)) {
      throw new Error('TODO')
    }

    const outerSpec = this.getUnitOuterSpec(unitId)

    this._removeUnit(unitId, false)

    this._addUnitBundleSpec(nextUnitId, nextUnitBundle)

    forIOObjKV(
      outerSpec.merges,
      (type, pinId, { mergeId, otherPin, exposedPin }) => {
        const nextPinId = pathOrDefault(nextUnitPinMap, [type, pinId], pinId)

        if (otherPin) {
          this._addMerge(
            {
              [otherPin.unitId]: {
                [otherPin.type]: {
                  [otherPin.pinId]: true,
                },
              },
              [nextUnitId]: {
                [type]: {
                  [nextPinId]: true,
                },
              },
            },
            mergeId,
            null
          )
        } else {
          this._addPinToMerge(mergeId, nextUnitId, type, nextPinId)
        }

        if (exposedPin) {
          this._plugPin(
            exposedPin.type,
            exposedPin.pinId,
            exposedPin.subPinId,
            { mergeId }
          )
        }
      }
    )

    forIOObjKV(outerSpec.exposed, (type, pinId, outerPin) => {
      const nextPinId = pathOrDefault(nextUnitPinMap, [type, pinId], pinId)

      this._plugPin(outerPin.type, outerPin.pinId, outerPin.subPinId, {
        unitId: nextUnitId,
        pinId: nextPinId,
      })
    })
  }

  private _removeUnitGhost(
    unitId: string,
    nextUnitId: string,
    spec: GraphSpec,
    snapshot: boolean = true
  ): { specId: string; bundle: UnitBundleSpec } {
    const { specs } = this.__system

    const { id: specId } = this.__system.newSpec(spec)

    const outerSpec = this.getUnitOuterSpec(unitId)

    const unitSpec = this.getGraphUnitSpec(unitId)

    const unit = this._removeUnit(unitId)

    const bundle = unitBundleSpec(unitSpec, specs)

    this._addUnitBundleSpec(nextUnitId, { unit: { id: specId } })

    forIOObjKV(
      outerSpec.merges,
      (type, pinId, { mergeId, otherPin, exposedPin }) => {
        if (otherPin) {
          this._addMerge(
            {
              [otherPin.unitId]: {
                [otherPin.type]: {
                  [otherPin.pinId]: true,
                },
              },
              [nextUnitId]: {
                [type]: {
                  [pinId]: true,
                },
              },
            },
            mergeId,
            null
          )
        } else {
          this._addPinToMerge(mergeId, nextUnitId, type, pinId)
        }

        if (exposedPin) {
          this._plugPin(
            exposedPin.type,
            exposedPin.pinId,
            exposedPin.subPinId,
            { mergeId }
          )
        }
      }
    )

    forIOObjKV(outerSpec.exposed, (type, pinId, outerPin) => {
      this._plugPin(outerPin.type, outerPin.pinId, outerPin.subPinId, {
        unitId: nextUnitId,
        pinId,
      })
    })

    if (snapshot) {
      bundle.unit.memory = unit.snapshot()
    }

    return { specId, bundle }
  }

  public swapUnitGhost(
    unitId: string,
    nextUnitId: string,
    nextUnitBundle: UnitBundleSpec
  ): {
    spec_id: string
    state: {
      input: Dict<any>
      output: Dict<any>
      memory: Dict<any>
    }
  } {
    // TODO merges and plugs

    this._removeUnit(unitId)

    this._addUnitBundleSpec(nextUnitId, nextUnitBundle)

    const unit = this.getUnit(unitId)

    const state = unit.snapshot()

    const spec = emptySpec({})

    const { id: spec_id } = this.__system.newSpec({})

    return { spec_id, state }
  }

  public getUnitByPath(path: string[]): Unit<any, any> {
    let unit: Unit<any, any> = this

    for (const id of path) {
      unit = (unit as Graph).getUnit(id)
    }

    return unit
  }

  public read(): State {
    return this.getGraphState()
  }

  public write(state: State): void {
    this.setGraphState(state)
  }

  public async setGraphState(state: State): Promise<void> {
    for (const unit_id in state) {
      const unit = this.getUnit(unit_id)
      // TODO
    }
  }

  public getUnitState(unitId: string): State {
    const unit = this.getUnit(unitId)
    // TODO
    return null
  }

  public getGraphState(): GraphState {
    // TODO
    const state = {}
    return state
  }

  public getGraphChildren(): Dict<any> {
    const children = {}
    for (const unitId in this._unit) {
      const unit = this.getUnit(unitId)
      if (
        unit instanceof Element_ ||
        (unit instanceof Graph && unit.isElement())
      ) {
        const unitChildren = (unit as C).refChildren()
        if (unitChildren !== undefined) {
          children[unitId] = unitChildren
        }
      }
    }
    return children
  }

  public getUnitPin(unitId: string, type: IO, pinId: string): Pin {
    return this.getUnit(unitId).getPin(type, pinId)
  }

  getUnitData(
    unitId: string,
    type: IO,
    pinId: string
  ): { input: Dict<any>; output: Dict<any> } {
    return this.getUnit(unitId).getPinsData()
  }

  public getUnitInput(unitId: string, pinId: string): Pin {
    return this.getUnit(unitId).getInput(pinId)
  }

  public getUnitOutput(unitId: string, pinId: string): Pin {
    return this.getUnit(unitId).getOutput(pinId)
  }

  public setUnitErr(unitId: string, err: string): void {
    const unit = this.getUnit(unitId)
    unit.err(err)
  }

  public takeUnitErr(unitId: string): string | null {
    const err = this._takeUnitErr(unitId)

    // this.emit('take_unit_err', unitId, [])

    return err
  }

  private _takeUnitErr(unitId: string): string | null {
    const unit = this.getUnit(unitId)

    const err = unit.takeErr()

    return err
  }

  public getGraphPinData = (): object => {
    const state = {}

    forEachValueKey(this._unit, (unit: Unit, unitId: string) => {
      const unitPinData = unit.getPinsData()

      state[unitId] = unitPinData
    })

    return state
  }

  public getGraphMergeInputData = (): Dict<any> => {
    const state = {}

    forEachValueKey(this._merge, (merge: Merge<any>, mergeId: string) => {
      const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

      const mergeInputPin = this._pin[mergeInputPinId]

      if (mergeInputPin) {
        if (this.getMergePinCount(mergeId) === 0) {
          return
        }

        const mergeInputData = mergeInputPin.peak()

        state[mergeId] = mergeInputData
      }
    })

    return state
  }

  public getGraphErr = (): Dict<string | null> => {
    const unit_err: Dict<string | null> = {}
    forEachValueKey(this._unit, (unit: Unit, unit_id: string) => {
      const err = unit.getErr()
      unit_err[unit_id] = err
    })
    return unit_err
  }

  public getUnitInputData = (unitId: string): Dict<any> => {
    const unit = this.getUnit(unitId)
    const data = unit.getInputData()
    return data
  }

  public getMerges(): Dict<Merge> {
    return this._merge
  }

  public refPins(): IOOf<Dict<Pin>> {
    return {
      input: this._input,
      output: this._output,
    }
  }

  public getPlugs(): IOOf<Dict<Dict<Pin>>> {
    const plugs = {
      input: {},
      output: {},
    }

    this._forEachSpecPinPlug((type, pinId, subPinId, subPinSpec) => {
      const plug = this.getPlug(type, pinId, subPinId)

      pathSet(plugs, [type, pinId, subPinId], plug)
    })

    return plugs
  }

  public getPlugSpecs(): IOOf<Dict<Dict<GraphSubPinSpec>>> {
    return getPlugSpecs(this._spec)
  }

  public getPlug(type: IO, pinId: string, subPinId: string): Pin {
    const oppositeType = opposite(type)
    const exposedPinId = getExposedPinId(pinId, type)

    const exposedMerge = this._exposedMerge[exposedPinId]

    const plug = exposedMerge.getPin(oppositeType, subPinId)

    return plug
  }

  public getMerge(mergeId: string): Merge {
    return this._merge[mergeId]
  }

  public refExposedMerges(): Dict<Merge> {
    return this._exposedMerge
  }

  public getUnitCount(): number {
    return keys(this._unit).length
  }

  public getMergeCount(): number {
    return keys(this._merge).length
  }

  public findMergeExposedSubPin(
    type: IO,
    mergeId: string
  ): { pinId: string; subPinId: string } | null {
    let pinSpec = null

    this._forEachSpecPinOfType(type, (pinId, subPinId, subPinSpec) => {
      const { mergeId } = subPinSpec

      if (subPinSpec.mergeId === mergeId) {
        pinSpec = { pinId, subPinId }
      }
    })

    return pinSpec
  }

  public getUnitsSpec(): GraphUnitsSpec {
    const { units } = this._spec
    return units
  }

  public getMergesSpec(): GraphMergesSpec {
    const { merges = {} } = this._spec
    return merges
  }

  public getMergeSpec(mergeId: string): GraphMergeSpec {
    const { merges } = this._spec
    const merge = merges[mergeId]
    return merge
  }

  public getMergeUnitCount(mergeId: string): number {
    const merge = this.getMergeSpec(mergeId)
    return keys(merge).length
  }

  public getMergePinCount(mergeId: string): number {
    return this._mergePinCount[mergeId] ?? 0
  }

  public getPinPlugCount(type: IO, pinId: string): number {
    const pinSpec = this.getExposedPinSpec(type, pinId)

    const count = _keyCount(pinSpec.plug || {})

    return count
  }

  public addUnit = (
    unitId: string,
    unit: Unit,
    bundle?: BundleSpec,
    emit: boolean = true
  ): void => {
    this._addUnit(unitId, unit)

    const unitSpec = unit.getBundle()

    emit && this.emit('add_unit', unitId, unit, [])

    if (this._transacting) {
      this._transaction.push(makeAddUnitAction(unitId, unitSpec))
    }
  }

  public fork(specId?: string) {
    this._fork(specId)
  }

  private _fork(specId?: string) {
    if (this._spec.system || (this.__system.specsCount[this.id] ?? 0) > 1) {
      const [id, spec] = this.__system.forkSpec(this._spec, specId)

      this.__system.unregisterUnit(this.id)
      this.__system.registerUnit(id)

      this.id = id
      this._spec = spec

      this.emit('fork', id, [])
    }
  }

  private _initAddUnit(unitId: string, unit: GraphUnitSpec): void {
    const bundle = unitBundleSpec(unit, this.__system.specs)

    const _unit = unitFromBundleSpec(
      this.__system,
      bundle,
      this._specs,
      this._branch
    )

    this._memAddUnit(unitId, _unit)
    this._simAddUnit(unitId, unit, _unit)
  }

  private _initAddUnits(units: GraphUnitsSpec): void {
    forEachValueKey(units, (unit: Unit, unitId: string) => {
      this._initAddUnit(unitId, unit)
    })
  }

  private _addUnit = (
    unitId: string,
    unit: Unit,
    bundle: UnitBundleSpec = null
  ) => {
    // console.log('_addUnit', unitId, unit, bundle)

    this._fork()

    if (this._unit[unitId]) {
      throw new Error('duplicated unit id ' + unitId)
    }

    if (!bundle) {
      bundle = unit.getBundle(false)
    }

    this.__system.injectSpecs(bundle.specs)

    this.emit('before_add_unit', unitId, unit, [])

    this._specAddUnit(unitId, unit)
    this._memAddUnit(unitId, unit, bundle)
    this._simAddUnit(unitId, bundle, unit)

    return unit
  }

  public addUnitSpecs = (units: GraphUnitsSpec): void => {
    this._addUnitSpecs(units)

    // this.emit('add_units', units)
  }

  private _addUnitSpecs = (units: GraphUnitsSpec): void => {
    forEachValueKey(units, (unit, unitId) => {
      this._addUnitBundleSpec(unitId, { unit })
    })
  }

  private injectSubComponent = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: Component_
  ): void => {
    this._specInjectSubComponent(unitId)
    this._simInjectSubComponent(unitId, unitSpec, unit)
  }

  private _simInjectSubComponent = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: Component_
  ): void => {
    const { classes } = this.__system

    const { children = [] } = unitSpec

    for (const child of children) {
      const { id } = child

      const ChildBundle = fromId<Component_>(id, this.__system.specs, classes)

      unit.appendChild(ChildBundle)
    }
  }

  private _injectSubComponent = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: C
  ): void => {
    const { classes } = this.__system

    const { children = [] } = unitSpec

    for (const child of children) {
      const { id } = child

      const ChildBundle = fromId<Component_>(id, this.__system.specs, classes)

      unit.appendChild(ChildBundle)
      // TODO state
    }

    this._specInjectSubComponent(unitId)
  }

  private _specInjectSubComponent = (unitId: string): void => {
    // console.log('Graph', '_specInjectSubComponent', unitId)

    pathSet(this._spec, ['component', 'subComponents', unitId], {
      children: [],
    })
  }

  private componentAppend = (unitId: string, bundle: GraphUnitSpec): void => {
    this._specAppendRoot(unitId)

    this.emit('component_append', unitId, bundle, [])
  }

  private _specAppendRoot = (unitId: string): void => {
    // console.log('Graph', '_specAppendRoot', unitId)

    this._spec.component.children = this._spec.component.children || []
    this._spec.component.children.push(unitId)
  }

  private componentRemove = (unitId: string): void => {
    this._specComponentRemoveChild(unitId)

    this.emit('component_remove', unitId, [])
  }

  private _specComponentRemoveChild = (unitId: string): void => {
    const i = this._spec.component.children.indexOf(unitId)

    this._spec.component.children.splice(i, 1)
  }

  public removeSubComponent = (unitId: string): void => {
    // console.log('Graph', 'removeSubComponent', unitId)

    this._specRemoveSubComponent(unitId)
  }

  private _specRemoveSubComponent = (unitId: string): void => {
    // console.log('Graph', '_specRemoveSubComponent', unitId)

    const { subComponents } = this._spec.component

    const subComponent = subComponents[unitId]

    const { children = [] } = subComponent

    for (const chlid_id of children) {
      this._spec.component.children.push(chlid_id)
    }

    delete subComponents[unitId]
  }

  private _getSubComponentParentId = (unitId: string): string | null => {
    const componentSpec = this._spec.component

    const { subComponents } = componentSpec

    for (const subComponentId in subComponents) {
      const sub_component = subComponents[subComponentId]

      const { children = [] } = sub_component

      for (const childId of children) {
        if (childId === unitId) {
          return subComponentId
        }
      }
    }

    return null
  }

  private _getSubComponentSlotName = (unitId: string): string | null => {
    const parentId = this._getSubComponentParentId(unitId)

    return pathOrDefault(
      this._spec,
      ['component', 'subComponents', parentId, 'childSlot', unitId],
      'default'
    )
  }

  private _appendSubComponentChild = (
    subComponentId: string,
    childId: string,
    slot: string
  ): void => {
    // console.log('Graph', '_appendSubComponentChild', subComponentId, childId, slot)

    this._fork()

    this._specSubComponentAppendChild(subComponentId, childId, slot)
    this._simSubComponentAppendChild(subComponentId, childId, slot)
  }

  private _simRemoveSubComponentFromParent = (subComponentId: string): void => {
    // console.log('Graph', '_simRemoveSubComponentFromParent', subComponentId)

    const currentParentId = this._getSubComponentParentId(subComponentId)

    if (currentParentId) {
      this._simSubComponentRemoveChild(currentParentId, subComponentId)
    } else {
      this._simRemoveRoot(subComponentId)
    }
  }

  private _specRemoveSubComponentChild = (
    currentParentId: string,
    subComponentId: string
  ) => {
    const parentComponent = this._spec.component.subComponents[currentParentId]

    const { children = [], childSlot = {} } = parentComponent

    const i = children.indexOf(subComponentId)

    children.splice(i, 1)

    delete childSlot[subComponentId]

    parentComponent.children = children
    parentComponent.childSlot = childSlot
  }

  private _specRemoveSubComponentFromParent = (
    subComponentId: string
  ): void => {
    // console.log('Graph', '_specRemoveSubComponentFromParent', subComponentId)

    const currentParentId = this._getSubComponentParentId(subComponentId)

    if (currentParentId) {
      this._specRemoveSubComponentChild(currentParentId, subComponentId)
    } else {
      this._specRemoveRoot(subComponentId)
    }
  }

  private _simSubComponentRemoveChild = (
    parentId: string,
    subComponentId: string
  ) => {
    const parentComponent = this.getUnit(parentId) as Component_
    const subComponent = this.getUnit(subComponentId) as Component_

    parentComponent.removeParentChild(subComponent)

    this.registerRoot(subComponent)
  }

  private _specSubComponentAppendChild = (
    subComponentId: string,
    childId: string,
    slot: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_specSubComponentAppendChild',
    //   subComponentId,
    //   childId
    // )

    const subComponent = this._spec.component.subComponents[subComponentId]

    const { children = [], childSlot = {} } = subComponent

    children.push(childId)

    childSlot[childId] = slot

    subComponent.children = children
    subComponent.childSlot = childSlot
  }

  private _simSubComponentAppendChild = (
    subComponentId: string,
    childId: string,
    slotName: string
  ): void => {
    const subComponentUnit = this.getUnit(subComponentId) as Element_ | Graph
    const childUnit = this.getUnit(childId) as Element_ | Graph

    subComponentUnit.registerParentRoot(childUnit, slotName)

    this.unregisterRoot(childUnit)
  }

  private _unitUnlisten: Dict<Unlisten> = {}

  public addUnitSpec(
    unitId: string,
    bundle: UnitBundleSpec,
    emit: boolean = true
  ): Unit {
    // console.log('Graph', 'addUnit', unitSpec, unitId)

    const unit = unitFromBundleSpec(
      this.__system,
      bundle,
      this._specs,
      this._branch
    )

    this.addUnit(unitId, unit, bundle, emit)

    return unit
  }

  private _addUnitSpec(
    unitId: string,
    bundle: UnitBundleSpec,
    emit: boolean = true
  ): Unit {
    // console.log('Graph', 'addUnit', unitSpec, unitId)

    const unit = unitFromBundleSpec(
      this.__system,
      bundle,
      this._specs,
      this._branch
    )

    this._addUnit(unitId, unit, bundle)

    return unit
  }

  public addUnitBundle = (unitId: string, unitBundle: UnitBundle) => {
    this._addUnitBundle(unitId, unitBundle)
  }

  public _addUnitBundle = (unitId: string, unitBundle: UnitBundle) => {}

  public _addUnitBundleSpec(unitId: string, unitBundle: UnitBundleSpec): Unit {
    // console.log('Graph', '_addUnitBundleSpec', unitId, unitBundle)

    const unit = unitFromBundleSpec(
      this.__system,
      unitBundle,
      this._specs,
      this._branch
    )

    this._addUnit(unitId, unit)

    return unit
  }

  private _onUnitErr(unitId: string, err: string): void {
    // console.log('Graph', '_onUnitErr', unitId, err)

    const index = this._errUnitIds.indexOf(unitId)
    if (index > -1) {
      if (index === 0) {
        this.err(err)
      }
    } else {
      this._errUnitIds.push(unitId)
      if (this._errUnitIds.length === 1) {
        this.err(err)
      }
    }
  }

  private _specAddUnit(
    unitId: string,
    unit: Unit,
    bundle: UnitBundleSpec = null
  ): void {
    // console.log('Graph', '_specAddUnit', unitId, unit)

    bundle = bundle ?? unit.getBundle()

    const { unit: unitSpec } = bundle

    pathSet(this._spec, ['units', unitId], unitSpec)

    if (
      unit instanceof Element_ ||
      (unit instanceof Graph && unit.isElement())
    ) {
      this._specInjectSubComponent(unitId)
      this._specAppendRoot(unitId)
    }
  }

  private _memAddUnit(
    unitId: string,
    unit: Unit,
    bundle: UnitBundleSpec = null
  ): void {
    // console.log('Graph', '_memAddUnit', unitId, unit)

    bundle = bundle ?? unit.getBundle()

    const { unit: unitSpec } = bundle

    const all_unlisten: Unlisten[] = []

    unit.setParent(this)

    this._unit[unitId] = unit

    const set_unit_pin = (type: IO, pinId: string) => {
      const pinNodeId = getPinNodeId(unitId, type, pinId)
      const pin = unit.getPin(type, pinId)

      this._pin[pinNodeId] = pin
      this._unitPins[pinNodeId] = pin
    }

    const set_unit_input = (pinId: string): void => {
      set_unit_pin('input', pinId)
    }

    const set_unit_output = (pinId: string): void => {
      set_unit_pin('output', pinId)
    }

    const remove_unit_pin = (type: IO, pinId: string) => {
      const pinNodeId = getPinNodeId(unitId, type, pinId)

      const mergeId = this._pipedTo[pinNodeId] || this._pipedFrom[pinNodeId]

      if (mergeId) {
        this._removePinOrMerge(mergeId, unitId, type, pinId)
      }

      delete this._pin[pinNodeId]
      delete this._unitPins[pinNodeId]

      pathDelete(this._spec, ['units', unitId, type, pinId])
      pathDelete(this._spec, ['units', unitId, 'memory', type, pinId])
    }

    const remove_unit_input = (pinId: string): void => {
      remove_unit_pin('input', pinId)
    }

    const remove_unit_output = (pinId: string): void => {
      remove_unit_pin('output', pinId)
    }

    const inputs = unit.getInputNames()

    forEach(inputs, set_unit_input)

    all_unlisten.push(unit.addListener('set_input', set_unit_input))
    all_unlisten.push(unit.addListener('remove_input', remove_unit_input))

    const outputs = unit.getOutputNames()

    forEach(outputs, set_unit_output)

    all_unlisten.push(unit.addListener('set_output', set_unit_output))
    all_unlisten.push(unit.addListener('remove_output', remove_unit_output))

    const selfPinNodeId = getOutputNodeId(unitId, SELF)

    const selfPin = unit.getSelfPin()

    this._pin[selfPinNodeId] = selfPin

    const on_unit_err = (err: string): void => {
      this._onUnitErr(unitId, err)
    }

    all_unlisten.push(unit.addListener('err', on_unit_err))

    const on_unit_err_removed = () => {
      const index = this._errUnitIds.indexOf(unitId)

      if (index > -1) {
        this._errUnitIds.splice(index, 1)

        if (index === 0) {
          this._nextErr()
        }
      }
    }

    all_unlisten.push(unit.prependListener('take_err', on_unit_err_removed))
    all_unlisten.push(unit.prependListener('catch_err', on_unit_err_removed))

    if (unit instanceof Graph) {
      all_unlisten.push(
        unit.addListener('fork', (forkId: string, path: string[]) => {
          if (path.length === 0) {
            pathSet(this._spec, ['units', unitId, 'id'], forkId)
          }
        })
      )

      for (const DEFAULT_EVENT of GRAPH_DEFAULT_EVENTS) {
        all_unlisten.push(
          unit.addListener(DEFAULT_EVENT as keyof G_EE, (...args) => {
            this.emit(
              DEFAULT_EVENT as keyof G_EE,
              // @ts-ignore
              ...args.slice(0, -1).concat([[unitId, ...args[args.length - 1]]])
            )
          })
        )
      }
    }

    if (unit instanceof Graph) {
      if (unit.isElement()) {
        all_unlisten.push(
          unit.addListener('element', () => {
            this._on_unit_element(unitId, unitSpec, unit)
          })
        )
        all_unlisten.push(
          unit.addListener('not_element', () => {
            this._on_unit_not_element(unitId)
          })
        )

        all_unlisten.push(
          unit.addListener('append_child', (bundle, path) => {
            this.emit('append_child', bundle, [unitId, ...path])
          })
        )
        all_unlisten.push(
          unit.addListener('insert_child', (bundle, at, path) => {
            this.emit('insert_child', bundle, at, [unitId, ...path])
          })
        )
        all_unlisten.push(
          unit.addListener('remove_child', (at, path) => {
            this.emit('remove_child', at, [unitId, ...path])
          })
        )
      }
    }

    const unlisten = callAll(all_unlisten)

    this._unitUnlisten[unitId] = unlisten
  }

  private _simAddUnit(unitId: string, unitSpec, unit: Unit): void {
    if (
      unit instanceof Element_ ||
      (unit instanceof Graph && unit.isElement())
    ) {
      this.registerRoot(unit)
      this._simInjectSubComponent(unitId, unitSpec, unit)
    }

    if (unit.hasErr()) {
      this._onUnitErr(unitId, unit.getErr())
    }

    if (!this._paused) {
      unit.play()
    }
  }

  private _on_unit_element = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: Component_
  ): void => {
    this.injectSubComponent(unitId, unitSpec, unit)
  }

  private _on_unit_not_element = (unitId: string): void => {
    this._specRemoveSubComponent(unitId)
  }

  public removeUnit(
    unitId: string,
    emit: boolean = true,
    take: boolean = true,
    destroy: boolean = true
  ): U {
    const unit = this.getUnit(unitId)

    const bundle = unit.getBundle()

    this._removeUnit(unitId, take, destroy)

    emit && this.emit('remove_unit', unitId, unit, [])

    if (this._transacting) {
      this._transaction.push(makeRemoveUnitAction(unitId, bundle))
    }

    return unit
  }

  public cloneUnit(unitId: string, newUnitId: string): Unit {
    const newUnit = this._cloneUnit(unitId, newUnitId)

    this.emit('clone_unit', unitId, newUnitId, newUnit, [])

    return newUnit
  }

  private _cloneUnit(unitId: string, newUnitId: string): Unit {
    const unit = this.getUnit(unitId)

    const [newUnit, bundle] = cloneUnit(unit, true)

    this._addUnit(newUnitId, newUnit, bundle)

    if (!this._paused) {
      newUnit.play()
    }

    return newUnit
  }

  private _moveUnit(unitId: string, toUnitId: string, toInputId: string): void {
    const fromUnit = this.getUnit(unitId)

    const isUnitComponent = this._isUnitComponent(unitId)

    this._simRemoveUnit(unitId)
    this._memRemoveUnit(unitId)
    this._specRemoveUnit(unitId, isUnitComponent)

    const toUnit = this.getUnit(toUnitId)

    toUnit.push(toInputId, fromUnit)
  }

  public moveUnit(id: string, unitId: string, inputId: string): void {
    this._moveUnit(id, unitId, inputId)

    this.emit('move_unit', id, unitId, inputId, [])
  }

  private removeUnitFromMerge(unitId: string, mergeId: string): void {
    this._removeUnitFromMerge(unitId, mergeId)

    this.emit('remove_unit_from_merge', unitId, mergeId, [])
  }

  private _removeUnitFromMerges(unitId: string): void {
    this._simRemoveUnitFromMerges(unitId)
    this._memRemoveUnitFromMerges(unitId)
  }

  private _memRemoveUnitFromMerges(unitId: string): void {
    const merges = this._unitToMerge[unitId]

    for (const mergeId of merges) {
      this._memRemoveUnitFromMerge(unitId, mergeId)
    }
  }

  private _simRemoveUnitFromMerges(unitId: string): void {
    const merges = this._unitToMerge[unitId]

    for (const mergeId of merges) {
      this._simRemoveUnitFromMerge(unitId, mergeId)
    }
  }

  private _removeUnitFromMerge(unitId: string, mergeId: string): void {
    this._simRemoveUnitFromMerge(unitId, mergeId)
    this._memRemoveUnitFromMerge(unitId, mergeId)
  }

  private _memRemoveUnitFromMerge(unitId: string, mergeId: string): void {
    this._forEachUnitPinOnMerge(unitId, mergeId, (type, pinId) => {
      this._memRemovePinFromMerge(mergeId, unitId, type, pinId)
    })
  }

  private _simRemoveUnitFromMerge(
    unitId: string,
    mergeId: string,
    take: boolean = true
  ): void {
    this._forEachUnitPinOnMerge(unitId, mergeId, (type, pinId) => {
      this._simRemovePinFromMerge(mergeId, unitId, type, pinId, take)
    })
  }

  private _specRemoveUnitFromMerge(unitId: string, mergeId: string): void {
    this._forEachUnitPinOnMerge(unitId, mergeId, (type, pinId) => {
      this._specRemovePinFromMerge(mergeId, unitId, type, pinId)
    })
  }

  private _forEachUnitPinOnMerge(
    unitId: string,
    mergeId: string,
    callback: (type: IO, pinId: string) => void
  ): void {
    const merge = this.getMergeSpec(mergeId)

    const mergeUnit = merge[unitId]

    forIOObjKV(mergeUnit, (type, pinId) => {
      callback(type, pinId)
    })
  }

  private _removeUnit(
    unitId: string,
    take: boolean = true,
    destroy: boolean = false
  ): Unit {
    this._fork()

    const unit = this.getUnit(unitId)

    this.emit('before_remove_unit', unitId, unit, [])

    const isComponent = this._isUnitComponent(unitId)

    this._simRemoveUnit(unitId, take)
    this._memRemoveUnit(unitId)
    this._specRemoveUnit(unitId, isComponent)

    destroy && unit.destroy()

    return unit
  }

  private _specRemoveUnit(unitId: string, removeComponent: boolean): void {
    // console.log('Graph', '_specRemoveUnit', unitId, removeComponent)

    if (removeComponent) {
      this._specRemoveSubComponentFromParent(unitId)
      this._specRemoveSubComponent(unitId)
    }

    this._specUnplugUnit(unitId)

    delete this._spec.units[unitId]
  }

  private _memRemoveUnit(
    unitId: string,
    removeFromMerge: boolean = true
  ): void {
    const unit = this.getUnit(unitId)

    const unlisten = this._unitUnlisten[unitId]

    unlisten()

    if (removeFromMerge) {
      this._memUnplugUnit(unitId)
    }

    unit.setParent(null)

    delete this._unitUnlisten[unitId]
    delete this._pinToMerge[unitId]
    delete this._unit[unitId]
  }

  private _simRemoveUnit = (unitId: string, take: boolean = true): void => {
    const unit = this.getUnit(unitId)

    if (unit.hasErr()) {
      this._removeErrUnit(unitId)
    }

    const exposedOutputId: string = this.getExposedOutput({
      unitId,
      pinId: SELF,
    })

    this._simUnplugUnit(unitId, take)

    if (exposedOutputId) {
      this.takeOutput(exposedOutputId)
    }

    if (
      unit instanceof Element_ ||
      (unit instanceof Graph && unit.isElement())
    ) {
      const subComponentSpec = this._spec.component?.subComponents[unitId]

      const { children = [] } = subComponentSpec

      for (const childId of children) {
        this._simSubComponentRemoveChild(unitId, childId)
      }

      this._simRemoveSubComponentFromParent(unitId)
    }
  }

  private _subComponentRemoveChild = (
    unitId: string,
    childId: string
  ): void => {
    this._simSubComponentRemoveChild(unitId, childId)
    this._specRemoveSubComponentChild(unitId, childId)
  }

  private _specUnplugUnit = (unitId: string): void => {
    const { merges } = this._spec

    const _merges = clone(merges)

    forEachPinOnMerges(clone(merges), (mergeId, mergeUnitId, type, pinId) => {
      const merge = clone(_merges[mergeId])

      if (mergeUnitId === unitId) {
        if (merge) {
          delete merge[unitId]

          const mergePinCount = getMergePinCount(merge)

          if (mergePinCount < 2) {
            this._specRemoveMerge(mergeId)
          } else {
            this._specRemoveUnitFromMerge(unitId, mergeId)
          }
        }
      }
    })

    this._forEachSpecPinPlug((type, pinId, subPinId, subPinSpec) => {
      if (subPinSpec.unitId === unitId) {
        this._specUnplugPin(type, pinId, subPinId)
      }
    })
  }

  private _unplugUnit = (unitId: string, take: boolean) => {
    this._simUnplugUnit(unitId, take)
    this._memUnplugUnit(unitId)
    this._specUnplugUnit(unitId)
  }

  private _simUnplugUnit = (unitId: string, take: boolean): void => {
    const unitToMerge = this._unitToMerge[unitId] || new Set()
    const unitToMergeCount = this._unitToMergeCount[unitId] || {}

    for (const mergeId of unitToMerge) {
      const unitMergeCount = unitToMergeCount[mergeId]

      const mergePinCount = this.getMergePinCount(mergeId)

      if (mergePinCount - unitMergeCount < 2) {
        this._simRemoveMerge(mergeId, take)
      } else {
        this._simRemoveUnitFromMerge(unitId, mergeId, take)
      }
    }

    this._forEachSpecPinPlug((type, pinId, subPinId, subPinSpec) => {
      if (subPinSpec.unitId === unitId) {
        this.__simUnplugPin(type, pinId, subPinId)
      }
    })
  }

  public addMerges = (merges: GraphMergesSpec): void => {
    forEachValueKey(merges, this.addMerge)
  }

  private _addMerges = (
    merges: GraphMergesSpec,
    propagate: boolean = true
  ): void => {
    forEachValueKey(merges, (merge, mergeId) => {
      this._addMerge(merge, mergeId, undefined, propagate)
    })
  }

  private _initMerges = (merges: GraphMergesSpec): void => {
    forEachObjKV(merges, this._initMerge)
  }

  private _initMerge = (mergeId: string, mergeSpec: GraphMergeSpec): void => {
    // console.log('Graph', '_initMerge', mergeId, mergeSpec)
    const merge = this._createMerge(mergeId)

    this._memAddMerge(mergeId, mergeSpec, merge)
    this._simAddMerge(mergeId, mergeSpec, merge)
  }

  public addMerge = (
    mergeSpec: GraphMergeSpec,
    mergeId: string,
    emit: boolean = true,
    propagate: boolean = true,
    merge?: Merge
  ): void => {
    // console.log('Graph', 'addMerge', mergeId, mergeSpec)

    merge = this._addMerge(mergeSpec, mergeId, merge, propagate)

    emit && this.emit('add_merge', mergeId, mergeSpec, merge, [])

    if (this._transacting) {
      this._transaction.push(makeAddMergeAction(mergeId, mergeSpec))
    }
  }

  private _memUnplugUnit(unitId: string) {
    const unitToMerge = clone(this._unitToMerge[unitId] || new Set<string>())
    const unitToMergeCount = clone(this._unitToMergeCount[unitId] || {})

    for (const mergeId of unitToMerge) {
      const unitMergeCount = unitToMergeCount[mergeId]

      const mergePinCount = this.getMergePinCount(mergeId)

      if (mergePinCount - unitMergeCount < 2) {
        this._memRemoveMerge(mergeId)
      } else {
        this._memRemoveUnitFromMerge(unitId, mergeId)
      }
    }
  }

  private _createMerge = (mergeId: string): Merge => {
    const merge = new Merge(this.__system)

    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

    const mergeInputPin = new Pin()

    merge.addInput(mergeInputPinId, mergeInputPin)

    return merge
  }

  private _addMerge = (
    mergeSpec: GraphMergeSpec,
    mergeId: string,
    merge: Merge = null,
    propagate: boolean = true
  ): Merge => {
    // console.log('Graph', '_addMerge', mergeId, mergeSpec, propagate)

    this._fork()

    merge = merge ?? this._createMerge(mergeId)

    this.emit('before_add_merge', mergeId, mergeSpec, merge, [])

    this._specAddMerge(mergeId, mergeSpec, merge)
    this._memAddMerge(mergeId, mergeSpec, merge)
    this._simAddMerge(mergeId, mergeSpec, merge, propagate)

    return merge
  }

  private _specAddMerge = (
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge
  ): void => {
    // console.log('Graph', '_specAddMerge', mergeId, mergeSpec)

    pathSet(this._spec, ['merges', mergeId], mergeSpec)

    forEachValueKey(mergeSpec, ({ input, output }, unitId) => {
      forEachValueKey(input || {}, (_, inputId) => {
        this._specAddPinToMerge(mergeId, unitId, 'input', inputId)
      })
      forEachValueKey(output || {}, (_, outputId) => {
        this._specAddPinToMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _memAddMerge = (
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge
  ): void => {
    // console.log('Graph', '_memAddMerge', mergeId)

    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

    const mergeInputPin = merge.getInput(mergeInputPinId)

    this._pin[mergeInputPinId] = mergeInputPin
    this._merge[mergeId] = merge

    forEachValueKey(mergeSpec, ({ input, output }, unitId) => {
      forEachValueKey(input || {}, (_, inputId) => {
        this._memAddPinToMerge(mergeId, unitId, 'input', inputId)
      })
      forEachValueKey(output || {}, (_, outputId) => {
        this._memAddPinToMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _simAddMerge(
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge<any>,
    propagate?: boolean
  ): void {
    // console.log('Graph', '_simAddMerge', mergeId, mergeSpec, propagate)

    forEachValueKey(mergeSpec, ({ input, output }, unitId) => {
      forEachValueKey(input || {}, (_, inputId) => {
        this._simAddPinToMerge(mergeId, unitId, 'input', inputId, propagate)
      })
      forEachValueKey(output || {}, (_, outputId) => {
        this._simAddPinToMerge(mergeId, unitId, 'output', outputId, propagate)
      })
    })
  }

  private _simAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    propagate: boolean = true
  ): void {
    // console.log('Graph', '_simAddPinToMerge', mergeId, unitId, type, pinId)

    forEachValueKey(
      (this._spec[`${type}s`] || {}) as GraphPinsSpec,
      ({ plug }, id) => {
        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            if (type === 'output' && pinId === SELF) {
              continue
            }

            this._simUnplugPin(type, id, subPinId)
            this._simPlugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._simSetBranch(mergeId, type, pinNodeId, propagate)
  }

  private _specAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    // console.log('Graph', '_specAddPinToMerge', mergeId, unitId, type, pinId)

    pathSet(this._spec, ['merges', mergeId, unitId, type, pinId], true)

    forEachValueKey(
      (this._spec[`${type}s`] || {}) as GraphPinsSpec,
      ({ plug }, id) => {
        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]

          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._specUnplugPin(type, id, subPinId)
            this._specPlugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )
  }

  private _memAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    // console.log('Graph', '_memAddPinToMerge', mergeId, unitId, type, pinId)

    if (type === 'output' && pinId === SELF) {
      this._mergeToSelfUnit[mergeId] = unitId
      this._selfUniToMerge[unitId] = mergeId
    }

    // TODO duplicated

    this._mergePinCount[mergeId] = this._mergePinCount[mergeId] || 0
    this._mergePinCount[mergeId]++

    this._unitToMerge[unitId] = this._unitToMerge[unitId] || new Set()
    this._unitToMerge[unitId].add(mergeId)

    this._unitToMergeCount[unitId] = this._unitToMergeCount[unitId] || {}
    this._unitToMergeCount[unitId][mergeId] =
      this._unitToMergeCount[unitId][mergeId] || 0
    this._unitToMergeCount[unitId][mergeId]++

    pathSet(this._pinToMerge, [unitId, type, pinId], mergeId)

    forEachValueKey(
      (this._spec[`${type}s`] || {}) as GraphPinsSpec,
      ({ plug }, id) => {
        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            if (type === 'output' && pinId === SELF) {
              continue
            }

            this._memUnplugPin(type, id, subPinId)
            this._memPlugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._memSetBranch(mergeId, type, pinNodeId)
  }

  private _memRemoveMerge(mergeId: string): void {
    // console.log('Graph', '_memRemoveMerge', mergeId)

    this._memRemoveAllMergePlug(mergeId)
    this._memRemoveAllMergePin(mergeId)
    this._memRemoveAllMergeRef(mergeId)
  }

  private _specRemoveMerge(mergeId: string): void {
    // console.log('Graph', '_specRemoveMerge', mergeId)

    this._specRemoveAllMergePlug(mergeId)
    this._specRemoveAllMergePin(mergeId)
    this._specRemoveAllMergeRef(mergeId)
  }

  private _memRemoveAllMergePlug(mergeId: string) {
    this._forEachSpecPinPlug((type, id, subPinId, subPinSpec) => {
      if (subPinSpec.mergeId === mergeId) {
        this._memUnplugPin(type, id, subPinId)
      }
    })
  }

  private _specRemoveAllMergePlug(mergeId: string) {
    this._forEachSpecPinPlug((type, id, subPinId, subPinSpec) => {
      if (subPinSpec.mergeId === mergeId) {
        this._specUnplugPin(type, id, subPinId)
      }
    })
  }

  private _memRemoveAllMergeRef(mergeId: string): void {
    const selfUnitId = this._mergeToSelfUnit[mergeId]

    if (selfUnitId) {
      delete this._mergeToSelfUnit[mergeId]
      delete this._selfUniToMerge[selfUnitId]
    }

    delete this._merge[mergeId]
    delete this._mergePinCount[mergeId]
  }

  private _specRemoveAllMergeRef(mergeId: string): void {
    delete this._spec.merges[mergeId]
  }

  private _memRemoveAllMergePin(mergeId: string): void {
    const merge = clone(this._spec.merges[mergeId])

    forEachValueKey(merge, ({ input, output }, unitId) => {
      forEachValueKey(input || {}, (_, inputId: string) => {
        this._memRemovePinFromMerge(mergeId, unitId, 'input', inputId)
      })
      forEachValueKey(output || {}, (_, outputId: string) => {
        this._memRemovePinFromMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _specRemoveAllMergePin(mergeId: string): void {
    const merge = clone(this._spec.merges[mergeId])

    forEachValueKey(merge, ({ input, output }, unitId) => {
      forEachValueKey(input || {}, (_, inputId: string) => {
        this._specRemovePinFromMerge(mergeId, unitId, 'input', inputId)
      })
      forEachValueKey(output || {}, (_, outputId: string) => {
        this._specRemovePinFromMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _memPostRemoveMerge(mergeId: string): void {
    this._forEachSpecPinPlug(
      (
        type: IO,
        pinId: string,
        subPinId: string,
        subPinSpec: GraphSubPinSpec
      ) => {
        if (subPinSpec.mergeId === mergeId) {
          this._memPlugEmptyPin(type, pinId, subPinId)
        }
      }
    )
  }

  public memIsUnitRefPin(unitId: string, type: IO, pinId: string): boolean {
    const unit = this.getUnit(unitId)

    const isRefPin = unit.hasRefPinNamed(type, pinId)

    return isRefPin
  }

  private _getUnitSpec(unitId: string): Spec {
    const graphUnitSpec = this.getGraphUnitSpec(unitId)

    const { id } = graphUnitSpec

    const unitSpec = this.__system.getSpec(id)

    return unitSpec
  }

  private getUnitSpecId(unitId: string): string {
    const graphUnitSpec = this.getGraphUnitSpec(unitId)

    const { id } = graphUnitSpec

    return id
  }

  private getUnitSpec(unitId: string): Spec {
    const { getSpec } = this.__system

    const graphUnitSpec = this.getGraphUnitSpec(unitId)

    const { id } = graphUnitSpec

    return getSpec(id)
  }

  public isUnitRefPin(unitId: string, type: IO, pinId: string): boolean {
    const unit = this.getUnit(unitId)

    const isRefPin = unit.isPinRef(type, pinId)

    return isRefPin
  }

  public isUnitRefInput(unitId: string, name: string): boolean {
    const unit = this.getUnit(unitId)
    const isRefPin = unit.hasRefInputNamed(name)
    return isRefPin
  }

  public addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    emit: boolean = true,
    propagate: boolean = true
  ): void => {
    this._addPinToMerge(mergeId, unitId, type, pinId, propagate)

    emit && this.emit('add_pin_to_merge', mergeId, unitId, type, pinId, [])
  }

  private _addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    propagate: boolean = true
  ): void => {
    // console.log(
    //   'Graph',
    //   '_addPinToMerge',
    //   mergeId,
    //   unitId,
    //   type,
    //   pinId,
    //   propagate
    // )

    this._validateMergeId(mergeId)
    this._validateUnitId(unitId)

    if (type === 'output' && pinId === SELF) {
      this._mergeToSelfUnit[mergeId] = unitId
      this._selfUniToMerge[unitId] = mergeId
    }

    addPinToMerge({ mergeId, unitId, type, pinId }, this._spec)

    this._mergePinCount[mergeId] = this._mergePinCount[mergeId] || 0
    this._mergePinCount[mergeId]++

    this._unitToMerge[unitId] = this._unitToMerge[unitId] || new Set()
    this._unitToMerge[unitId].add(mergeId)

    this._unitToMergeCount[unitId] = this._unitToMergeCount[unitId] || {}
    this._unitToMergeCount[unitId][mergeId] =
      this._unitToMergeCount[unitId][mergeId] || 0
    this._unitToMergeCount[unitId][mergeId]++

    forEachValueKey(
      (this._spec[`${type}s`] || {}) as GraphPinsSpec,
      ({ plug }, id) => {
        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]

          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._unplugPin(type, id, subPinId)
            this._plugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    pathSet(this._pinToMerge, [unitId, type, pinId], mergeId)

    this._setBranch(mergeId, type, pinNodeId, propagate)
  }

  public removeMerge(
    mergeId: string,
    emit: boolean = true,
    take: boolean = true
  ) {
    // console.log('Graph', 'removeMerge', mergeId)

    const mergeSpec = this.getMergeSpec(mergeId)

    const merge = this._removeMerge(mergeId, take)

    emit && this.emit('remove_merge', mergeId, mergeSpec, merge, [])

    if (this._transacting) {
      this._transaction.push(makeRemoveMergeAction(mergeId, mergeSpec))
    }
  }

  public _removeMerge(mergeId: string, propagate: boolean): Merge {
    // console.log('Graph', '_removeMerge', mergeId, propagate)

    this._fork()

    this._validateMergeId(mergeId)

    const merge = this.getMerge(mergeId)
    const mergeSpec = this.getMergeSpec(mergeId)

    this.emit('before_remove_merge', mergeId, mergeSpec, merge, [])

    this._simRemoveMerge(mergeId, propagate)
    this._memRemoveMerge(mergeId)
    this._specRemoveMerge(mergeId)

    this._memPostRemoveMerge(mergeId)
    this._simPostRemoveMerge(mergeId)

    return merge
  }

  private _simRemoveMerge(mergeId: string, take: boolean) {
    // console.log('Graph', '_simRemoveMerge', mergeId)

    this._simRemoveAllPlugsFromMerge(mergeId)
    this._simRemoveAllPinsFromMerge(mergeId, take)
  }

  private _simRemoveAllPlugsFromMerge = (mergeId: string) => {
    // console.log('Graph', '_simRemoveAllPlugsFromMerge', mergeId, this._spec.outputs)

    this._forEachSpecPinPlug(
      (
        type: IO,
        pinId: string,
        subPinId: string,
        subPinSpec: GraphSubPinSpec
      ) => {
        if (subPinSpec.mergeId === mergeId) {
          this.__simUnplugPin(type, pinId, subPinId)
        }
      }
    )
  }

  private __simRemoveAllPlugsFromMerge = (mergeId: string) => {
    this._forEachSpecPinPlug(
      (
        type: IO,
        pinId: string,
        subPinId: string,
        subPinSpec: GraphSubPinSpec
      ) => {
        if (subPinSpec.mergeId === mergeId) {
          this.__simUnplugPin(type, pinId, subPinId)
        }
      }
    )
  }

  private _forEachSpecPinPlug = (
    callback: (
      type: IO,
      pinId: string,
      subPinId: string,
      subPinSpec: GraphSubPinSpec
    ) => void
  ) => {
    this._forEachSpecPinOfType(
      'input',
      (pinId: string, subPinId: string, subPinSpec: GraphSubPinSpec) => {
        callback('input', pinId, subPinId, subPinSpec)
      }
    )
    this._forEachSpecPinOfType(
      'output',
      (pinId: string, subPinId: string, subPinSpec: GraphSubPinSpec) => {
        callback('output', pinId, subPinId, subPinSpec)
      }
    )
  }

  private _forEachSpecPinOfType = (
    type: IO,
    callback: (
      pinId: string,
      subPinId: string,
      subPinSpec: GraphSubPinSpec
    ) => void
  ) => {
    forEachValueKey(this._spec[`${type}s`] || {}, ({ plug }, pinId) => {
      for (const subPinId in plug) {
        const subPinSpec = plug[subPinId]

        callback(pinId, subPinId, subPinSpec)
      }
    })
  }

  private _simRemoveAllPinsFromMerge = (
    mergeId: string,
    take: boolean
  ): void => {
    const merge = clone(this._spec.merges[mergeId])

    forEachValueKey(merge, ({ input, output }, unitId) => {
      forEachValueKey(input || {}, (_, inputId: string) => {
        this._simRemovePinFromMerge(mergeId, unitId, 'input', inputId, take)
      })
      forEachValueKey(output || {}, (_, outputId: string) => {
        this._simRemovePinFromMerge(mergeId, unitId, 'output', outputId, take)
      })
    })
  }

  private _simPostRemoveMerge(mergeId: string) {
    this._forEachSpecPinPlug(
      (
        type: IO,
        pinId: string,
        subPinId: string,
        subPinSpec: GraphSubPinSpec
      ) => {
        if (subPinSpec.mergeId === mergeId) {
          this._simPlugEmptyPin(type, pinId, subPinId)
        }
      }
    )
  }

  public removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    emit: boolean = true,
    propagate: boolean = true
  ) {
    this._removePinFromMerge(mergeId, unitId, type, pinId, propagate)

    emit && this.emit('remove_pin_from_merge', mergeId, unitId, type, pinId, [])
  }

  private _removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    propagate: boolean = true
  ) {
    // console.log('Graph', '_removePinFromMerge', mergeId, unitId, type, pinId)

    this._validateMergeId(mergeId)
    this._validateUnitId(unitId)

    this._simRemovePinFromMerge(mergeId, unitId, type, pinId, propagate)
    this._memRemovePinFromMerge(mergeId, unitId, type, pinId)
    this._specRemovePinFromMerge(mergeId, unitId, type, pinId)
  }

  public removePinOrMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    emit: boolean = true,
    propagate: boolean = true
  ) {
    const mergePinCount = this._mergePinCount[mergeId]

    if (mergePinCount > 2) {
      this.removePinFromMerge(mergeId, unitId, type, pinId, emit, propagate)
    } else {
      this.removeMerge(mergeId, propagate, emit)
    }
  }

  private _removePinOrMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    propagate: boolean = true
  ) {
    const mergePinCount = this._mergePinCount[mergeId]

    if (mergePinCount > 2) {
      this._removePinFromMerge(mergeId, unitId, type, pinId, propagate)
    } else {
      this._removeMerge(mergeId, propagate)
    }
  }

  private _memRemovePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    // console.log('Graph', '_memRemovePinFromMerge', mergeId, unitId, type, pinId)

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._memRemoveBranch(mergeId, type, pinNodeId)

    if (type === 'input') {
      //
    } else {
      if (pinId === SELF) {
        delete this._mergeToSelfUnit[mergeId]
        delete this._selfUniToMerge[unitId]
      }
    }

    this._mergePinCount[mergeId]--
    this._unitToMergeCount[unitId][mergeId]--

    if (this._unitToMergeCount[unitId][mergeId] === 0) {
      delete this._unitToMergeCount[unitId][mergeId]

      this._unitToMerge[unitId].delete(mergeId)
    }

    delete this._pinToMerge[unitId]?.[type]?.[pinId]

    if (isEmptyObject(this._pinToMerge[unitId]?.[type] ?? {})) {
      delete this._pinToMerge[unitId]?.[type]
    }

    if (isEmptyObject(this._pinToMerge[unitId] ?? {})) {
      delete this._pinToMerge[unitId]
    }
  }

  private _specRemovePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    // console.log(
    //   'Graph',
    //   '_specRemovePinFromMerge',
    //   mergeId,
    //   unitId,
    //   type,
    //   pinId
    // )

    delete this._spec.merges[mergeId][unitId][type][pinId]

    if (isEmptyObject(this._spec.merges[mergeId][unitId][type])) {
      delete this._spec.merges[mergeId][unitId][type]
    }

    if (isEmptyObject(this._spec.merges[mergeId][unitId])) {
      delete this._spec.merges[mergeId][unitId]
    }
  }

  private _simRemovePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    take: boolean = true
  ): void {
    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._simRemoveBranch(mergeId, type, pinNodeId)

    if (take) {
      if (type === 'input') {
        if (
          this._mergeToSelfUnit[mergeId] ||
          this.isUnitRefInput(unitId, pinId)
        ) {
          const pin = this._pin[pinNodeId]
          pin.take()
        }
      } else {
        if (pinId === SELF) {
          const merge = this._merge[mergeId]

          forEachValueKey(merge.getOutputs(), (pin, name): void => {
            merge.takeOutput(name)
          })
        }
      }
    }
  }

  public isPinMergedTo(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ) {
    const merges = this._spec.merges || {}
    return (
      !!merges[mergeId] &&
      merges[mergeId][unitId] &&
      merges[mergeId][unitId][type] &&
      merges[mergeId][unitId][type][pinId]
    )
  }

  public setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean,
    emit: boolean = true
  ) {
    this._setUnitPinConstant(unitId, type, pinId, constant)

    emit &&
      this.emit('set_unit_pin_constant', unitId, type, pinId, constant, [])
  }

  private _setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean
  ) {
    pathSet(this._spec, ['units', unitId, type, pinId, 'constant'], constant)

    const unit = this.getUnit(unitId)

    unit.setPinConstant(type, pinId, constant)
  }

  public setUnitInputConstant(
    unitId: string,
    pinId: string,
    constant: boolean
  ) {
    this.setUnitPinConstant(unitId, 'input', pinId, constant)
  }

  public setUnitOutputConstant(
    unitId: string,
    pinId: string,
    constant: boolean
  ) {
    this.setUnitPinConstant(unitId, 'output', pinId, constant)
  }

  public setUnitInputIgnored(
    unitId: string,
    pinId: string,
    ignored: boolean
  ): void {
    this.setUnitPinIgnored(unitId, 'input', pinId, ignored)
  }

  public setUnitOutputIgnored(
    unitId: string,
    pinId: string,
    ignored: boolean
  ): void {
    this.setUnitPinIgnored(unitId, 'output', pinId, ignored)
  }

  public setUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ): void {
    this._setUnitPinIgnored(unitId, type, pinId, ignored)

    this.emit('set_unit_pin_ignored', unitId, type, pinId, ignored, [])
  }

  private _setUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ): void {
    this._specSetUnitPinIgnored(unitId, type, pinId, ignored)
    this._simSetUnitPinIgnored(unitId, type, pinId, ignored)
  }

  private _specSetUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ): void {
    pathSet(this._spec, ['units', unitId, type, pinId, 'ignored'], ignored)
  }

  private _simSetUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ) {
    const unit = this.getUnit(unitId)

    if (ignored) {
      forEachPinOnMerges(
        this._spec.merges ?? {},
        (mergeId, _unitId, _type, _pinId) => {
          if (_unitId === unitId && _type === type && _pinId === pinId) {
            this._removePinFromMerge(mergeId, unitId, type, pinId)
          }
        }
      )

      // TODO perf
      forEachValueKey(this._spec[`${type}s`] || {}, ({ plug }, id) => {
        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]

          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._unplugPin(type, id, subPinId)

            break
          }
        }
      })
    }

    unit.setPinIgnored(type, pinId, ignored)
  }

  public setUnitName(unitId: string, newUnitId: string, name: string): void {
    this._setUnitName(unitId, newUnitId, name)

    this.emit('set_unit_id', unitId, newUnitId, name, [])
  }

  public _setUnitName(unitId: string, newUnitId: string, name: string): void {
    const spec = this._getUnitSpec(unitId) as GraphSpec

    const unitMerges = this.getUnitMergesSpec(unitId)

    const renameUnitInMerges = (
      unitMerges: GraphMergesSpec
    ): GraphMergesSpec => {
      const newUnitMerges: GraphMergesSpec = {}

      forEachValueKey(unitMerges, (merge, mergeId) => {
        newUnitMerges[mergeId] = {}

        forEachValueKey(merge, (pins, _unitId) => {
          newUnitMerges[mergeId][unitId === _unitId ? newUnitId : _unitId] =
            pins
        })
      })

      return newUnitMerges
    }

    const newUnitMerges = renameUnitInMerges(clone(unitMerges))

    const unit = this._removeUnit(unitId)

    spec.name = name

    // AD HOC
    ;(unit as Graph)._spec.name = name

    // this.__system.setSpec(spec.id, spec)
    this._specs[spec.id] = spec

    this._addUnit(newUnitId, unit)
    this._addMerges(newUnitMerges, false)
  }

  public setPlugData(
    type: IO,
    pinId: string,
    subPinId: string,
    data: any,
    propagate: boolean = true
  ): void {
    const pin = this.getPlug(type, pinId, subPinId)

    pin.push(data)
  }

  public setUnitPinData(unitId: string, type: IO, pinId: string, data: any) {
    this._setUnitPinData(unitId, type, pinId, data)

    this.emit('set_unit_pin_data', unitId, type, pinId, data, [])
  }

  private _setUnitPinData(unitId: string, type: IO, pinId: string, data: any) {
    const unit = this.getUnit(unitId)

    if (unit.hasInputNamed(pinId) && unit.isPinConstant(type, pinId)) {
      this._fork()
    }

    this._specSetUnitPinData(unitId, type, pinId, data)
    this._simSetUnitPinData(unitId, type, pinId, data)
  }

  private _specSetUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    data: any
  ) {
    const unit = this.getUnit(unitId)

    if (unit.hasInputNamed(pinId) && unit.isPinConstant(type, pinId)) {
      setUnitPinData({ unitId, type, pinId, data: stringify(data) }, this._spec)
    }
  }

  private _simSetUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    data: any
  ) {
    const unit = this.getUnit(unitId)

    unit.setPinData(type, pinId, data)
  }

  public setUnitInputData(unitId: string, pinId: string, data: any): void {
    const unit = this.getUnit(unitId)
    unit.setPinData('input', pinId, data)
  }

  public setUnitOutputData(unitId: string, pinId: string, data: any): void {
    const unit = this.getUnit(unitId)
    unit.setPinData('output', pinId, data)
  }

  private _getUnitPinPlug = (
    unitId: string,
    type: IO,
    pinId: string
  ): GraphPlugOuterSpec => {
    let plugSpec: GraphPlugOuterSpec | undefined

    forEachGraphSpecPinOfType(this._spec, type, (pinId, pinSpec) => {
      const { plug } = pinSpec

      for (const subPinId in plug) {
        const subPin = plug[subPinId]

        if (subPin.unitId === unitId && subPin.pinId === pinId) {
          plugSpec = {
            type,
            pinId,
            subPinId,
          }
        }
      }
    })

    return plugSpec
  }

  public setMetadata(path: string[], data: any): void {
    let cursor = this._spec
    let i = 0
    while (i < path.length - 1) {
      const p = path[i]
      if (!cursor[p]) {
        cursor[p] = {}
      }
      cursor = cursor[p]
      i++
    }
    const p = path[i]
    if (isObjNotNull(cursor[p]) && isObjNotNull(data)) {
      cursor[p] = deepMerge(cursor[p], data)
    } else {
      cursor[p] = data
    }

    this.emit('metadata', { path, data }, [])
  }

  public getSubComponentsParentMap(
    sub_component_ids: string[]
  ): Dict<string | null> {
    const parentMap: Dict<string> = {}

    for (const sub_component_id of sub_component_ids) {
      const parentId = this._getSubComponentParentId(sub_component_id)

      parentMap[sub_component_id] = parentId
    }

    return parentMap
  }

  public getSubComponentsSlotMap(
    sub_component_ids: string[]
  ): Dict<string | null> {
    const slotMap: Dict<string> = {}

    for (const sub_component_id of sub_component_ids) {
      const slotName = this._getSubComponentSlotName(sub_component_id)

      slotMap[sub_component_id] = slotName
    }

    return slotMap
  }

  public moveSubComponentRoot(
    subComponentId: string | null,
    children: string[],
    slotMap: Dict<string>
  ): void {
    const prevParentMap = this.getSubComponentsParentMap(children)
    const prevSlotMap = this.getSubComponentsParentMap(children)

    for (const childId of children) {
      const slotName = slotMap[childId] || 'default'

      this._moveSubComponentRoot(subComponentId, childId, slotName)
    }

    this.emit(
      'move_sub_component_root',
      subComponentId,
      prevParentMap,
      children,
      slotMap,
      prevSlotMap,
      []
    )
  }

  private _appendRoot(subComponentId: string): void {
    this._specAppendRoot(subComponentId)
  }

  public removeRoot(subComponentId: string): void {
    this._removeRoot(subComponentId)
  }

  private _removeRoot(subComponentId: string): void {
    this._simRemoveRoot(subComponentId)
    this._specRemoveRoot(subComponentId)
  }

  private _specRemoveRoot(subComponentId: string): void {
    // console.log('Graph', '_specRemoveRoot', subComponentId)

    const index = this._spec.component.children.indexOf(subComponentId)

    if (index > -1) {
      this._spec.component.children.splice(index, 1)
    } else {
      throw new Error('root not found')
    }
  }

  private _simRemoveRoot(subComponentId: string): void {
    const subComponent = this.getUnit(subComponentId) as Component_

    this.unregisterRoot(subComponent)
  }

  public moveSubgraphInto(
    ...[
      graphId,
      specId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    ]: G_MoveSubgraphIntoArgs
  ): void {
    this._moveSubgraphInto(
      graphId,
      specId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap
    )

    this.emit(
      'move_subgraph_into',
      graphId,
      specId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      []
    )
  }

  private _moveSubgraphInto(
    graphId: string,
    specId: string,
    nodeIds: GraphMoveSubGraphData['nodeIds'],
    nextIdMap: GraphMoveSubGraphData['nextIdMap'],
    nextPinIdMap: GraphMoveSubGraphData['nextPinIdMap'],
    nextMergePinId: GraphMoveSubGraphData['nextMergePinId'],
    nextPlugSpec: GraphMoveSubGraphData['nextPlugSpec'],
    nextSubComponentParentMap: GraphMoveSubGraphData['nextSubComponentParentMap'],
    nextSubComponentChildrenMap: GraphMoveSubGraphData['nextSubComponentChildrenMap']
  ) {
    const graph = this.getUnit(graphId) as Graph

    graph.fork(specId)

    graph.startTransaction()

    const merges = clone(this.getUnitMergesSpec(graphId))

    moveSubgraph(
      this,
      graph,
      graphId,
      {
        nodeIds,
        nextSpecId: null,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextUnitPinMergeMap: {},
        nextSubComponentIndexMap: {},
      },
      {
        merges,
      },
      false
    )

    graph.endTransaction()
  }

  private _moveSubgraphInto__template(
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
      link: Dict<_IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
      unit: Dict<string>
    },
    nextPinIdMap: Dict<_IOOf<Dict<{ pinId: string; subPinId: string }>>>,
    nextMergePinId: Dict<
      _IOOf<{ mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }>
    >,
    nextPlugSpec: _IOOf<Dict<Dict<GraphSubPinSpec>>>,
    nextSubComponentParentMap: Dict<string | null>,
    nextSubComponentChildrenMap: Dict<string[]>,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: IOOf<GraphPinSpec>,
    plugs: IOOf<Dict<Dict<Pin>>>,
    pinToMerge: Dict<IOOf<Dict<string>>>,
    moveUnitInto,
    moveLinkPinInto,
    moveMergeInto,
    movePlugInto
  ): void {
    // console.log(
    //   'Graph',
    //   '_moveSubgraphInto',
    //   graphId,
    //   nodeIds,
    //   nextIdMap,
    //   nextPinIdMap,
    //   nextMergePinId,
    //   nextSubComponentParentMap,
    //   nextSubComponentChildrenMap
    // )

    const {
      merge: mergeIds,
      link: linkObjs,
      unit: unitIds,
      plug: plugObjs,
    } = nodeIds

    const unitIgnoredPin: Dict<{ input: Set<string>; output: Set<string> }> = {}

    const unitIgnored = new Set<string>(unitIds)
    const mergeIgnored = new Set<string>(mergeIds)

    const setUnitPinIgnored = (unitId: string, type: IO, pinId: string) => {
      // console.log('setUnitPinIgnored', unitId, type, pinId)

      unitIgnoredPin[unitId] = unitIgnoredPin[unitId] || {
        input: new Set(),
        output: new Set(),
      }

      unitIgnoredPin[unitId][type].add(pinId)
    }

    const findUnitPinPlug = (
      unitId: string,
      type: IO,
      pinId: string
    ): GraphPlugOuterSpec => {
      let plugSpec: GraphPlugOuterSpec | undefined

      forEachObjKV(pinSpecs[type], (_pinId, _pinSpec: GraphPinSpec) => {
        const { plug } = _pinSpec

        for (const subPinId in plug) {
          const subPin = plug[subPinId]

          if (subPin.unitId === unitId && subPin.pinId === pinId) {
            plugSpec = {
              type,
              pinId: _pinId,
              subPinId,
            }
          }
        }
      })

      return plugSpec
    }

    for (const { unitId, type, pinId } of linkObjs) {
      const pinPlug = findUnitPinPlug(unitId, type, pinId)

      if (
        pinPlug &&
        !plugObjs.find((plugObj) => {
          return (
            plugObj.type === pinPlug.type &&
            plugObj.pinId === pinPlug.pinId &&
            plugObj.subPinId === pinPlug.subPinId
          )
        })
      ) {
        continue
      }

      setUnitPinIgnored(unitId, type, pinId)
    }

    const nextMergeSpecs: GraphMergesSpec = {}

    for (const mergeId of mergeIds) {
      const mergeSpec = mergeSpecs[mergeId]

      nextMergeSpecs[mergeId] = mergeSpec

      forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
        setUnitPinIgnored(unitId, type, pinId)
      })
    }

    for (const { unitId, type, pinId } of linkObjs) {
      const { mergeId, oppositePinId } = nextIdMap.link[unitId][type][pinId]

      const plugPinSpec: { pinId: string; subPinId: string } | null = null

      moveLinkPinInto(
        graphId,
        unitId,
        type,
        pinId,
        mergeId,
        oppositePinId,
        plugPinSpec,
        unitIgnored,
        mergeIgnored,
        unitSpecs,
        units,
        mergeSpecs,
        merges,
        pinToMerge
      )
    }

    for (const unitId of unitIds) {
      const unit = units[unitId]

      const nextUnitId = nextIdMap.unit?.[unitId] || unitId
      const nextUnitSubComponentParent =
        nextSubComponentParentMap[unitId] || null
      const nextSubComponentChildren = nextSubComponentChildrenMap[unitId] || []

      const ignoredPins = unitIgnoredPin[unitId] || {
        input: new Set(),
        output: new Set(),
      }
      const unitPinIdMap = nextPinIdMap[unitId] || emptyIO({}, {})

      moveUnitInto(
        graphId,
        unitId,
        unit,
        nextUnitId,
        new Set(unitIds),
        ignoredPins,
        mergeIgnored,
        unitPinIdMap,
        nextUnitSubComponentParent,
        nextSubComponentChildren,
        unitSpecs,
        units,
        mergeSpecs,
        merges,
        pinSpecs,
        pinToMerge
      )
    }

    for (const mergeId of mergeIds) {
      const { input: nextInputMergePinId, output: nextOutputMergePinId } =
        nextMergePinId[mergeId] || {}

      const nextMergeSpec = nextMergeSpecs[mergeId]

      moveMergeInto(
        graphId,
        mergeId,
        nextMergeSpec,
        nextInputMergePinId,
        nextOutputMergePinId,
        unitIgnored,
        mergeIgnored,
        {},
        unitSpecs,
        units,
        mergeSpecs,
        merges,
        pinToMerge,
        pinSpecs
      )
    }

    for (const { type, pinId, subPinId } of plugObjs) {
      const subPinSpec = pathGet(pinSpecs, [type, pinId, 'plug', subPinId])

      movePlugInto(
        graphId,
        type,
        pinId,
        subPinId,
        subPinSpec,
        nextPlugSpec,
        nextPinIdMap,
        nextMergePinId,
        nextIdMap,
        plugs
      )
    }
  }

  private _moveSubgraphInto__remove = (
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
    nextSubComponentChildrenMap: Dict<string[]>,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: IOOf<GraphPinSpec>,
    plugs: IOOf<Dict<Dict<Pin>>>,
    pinToMerge: Dict<IOOf<Dict<string>>>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveSubgraphInto__',
    //   graphId,
    //   nodeIds,
    //   nextIdMap,
    //   nextPinIdMap,
    //   nextMergePinId,
    //   nextSubComponentParentMap,
    //   nextSubComponentChildrenMap
    // )

    this._moveSubgraphInto__template(
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      unitSpecs,
      units,
      mergeSpecs,
      merges,
      pinSpecs,
      plugs,
      pinToMerge,
      this._moveUnitInto__remove,
      this._moveLinkPinInto__remove,
      this._moveMergeInto__remove,
      this._movePlugInto__remove
    )
  }

  private _moveSubgraphInto__inject(
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
    nextSubComponentChildrenMap: Dict<string[]>,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: IOOf<GraphPinSpec>,
    pins,
    pinToMerge
  ): void {
    // console.log(
    //   'Graph',
    //   '_moveSubgraphInto__inject',
    //   graphId,
    //   nodeIds,
    //   nextIdMap,
    //   nextPinIdMap,
    //   nextMergePinId,
    //   nextSubComponentParentMap,
    //   nextSubComponentChildrenMap
    // )

    this._moveSubgraphInto__template(
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      unitSpecs,
      units,
      mergeSpecs,
      merges,
      pinSpecs,
      pins,
      pinToMerge,
      this._moveUnitInto__inject,
      this._moveLinkPinInto__inject,
      this._moveMergeInto__inject,
      this._movePlugInto__inject
    )
  }

  private _moveSubgraphInto__recconect(
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
    nextSubComponentChildrenMap: Dict<string[]>,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: IOOf<GraphPinSpec>,
    plugs,
    pinToMerge: Dict<IOOf<Dict<string>>>
  ): void {
    // console.log(
    //   'Graph',
    //   '_moveSubgraphInto__inject',
    //   graphId,
    //   nodeIds,
    //   nextIdMap,
    //   nextPinIdMap,
    //   nextMergePinId,
    //   nextSubComponentParentMap,
    //   nextSubComponentChildrenMap
    // )

    this._moveSubgraphInto__template(
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      unitSpecs,
      units,
      mergeSpecs,
      merges,
      pinSpecs,
      plugs,
      pinToMerge,
      this._moveUnitInto__reconnect,
      this._moveLinkPinInto__reconnect,
      this._moveMergeInto__reconnect,
      this._movePlugInto__reconnect
    )
  }

  public movePlugInto(
    graphId: string,
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    graph: Graph<any, any> | null = null
  ): void {
    graph = graph || this.getGraph(graphId)
    // console.log('Graph', 'movePlugInto', graphId, type, pinId, subPinId, subPinSpec)

    this._movePlugInto(graphId, type, pinId, subPinId, subPinSpec, graph)
  }

  private _movePlugInto(
    graphId: string,
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    graph: Graph
  ): void {
    // console.log('Graph', '_movePlugInto')

    const plugCount = this.getPinPlugCount(type, pinId)

    if (plugCount === 1) {
      this._coverPinSet(type, pinId)
    } else {
      this._coverPin(type, pinId, subPinId)
    }

    if (!graph.hasPinNamed(type, pinId)) {
      graph.exposePinSet(type, pinId, { plug: {} }, false)
    }

    graph.exposePin(type, pinId, subPinId, subPinSpec, false)
  }

  private _movePlugInto__remove = (
    graphId: string,
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    nextPlugSpec: {
      input: Dict<Dict<GraphSubPinSpec>>
      output: Dict<Dict<GraphSubPinSpec>>
    },
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    nextMergePinId: Dict<{
      input: { mergeId: string }
      output: { mergeId: string }
    }>,
    nextIdMap: {
      merge: Dict<string>
      link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
      unit: Dict<string>
    }
  ): void => {
    // console.log('Graph', '_movePlugInto')

    const plugCount = this.getPinPlugCount(type, pinId)

    if (plugCount === 1) {
      this._coverPinSet(type, pinId)
    } else {
      this._coverPin(type, pinId, subPinId)
    }
  }

  private _newMergeId = (): string => {
    let i = 0

    let mergeId = `${i}`

    while (this.hasMerge(mergeId)) {
      i++

      mergeId = `${i}`
    }

    return mergeId
  }

  private _movePlugInto__inject = (
    graphId: string,
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    nextPlugSpec: {
      input: Dict<Dict<GraphSubPinSpec>>
      output: Dict<Dict<GraphSubPinSpec>>
    },
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    nextMergePinId: Dict<{
      input: { mergeId: string }
      output: { mergeId: string }
    }>,
    nextIdMap: {
      merge: Dict<string>
      link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
      plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
      unit: Dict<string>
    }
  ): void => {
    // console.log('Graph', '_movePlugInto__inject')

    const graph = this.getGraph(graphId)

    const finalType = pathOrDefault(
      nextIdMap,
      ['plug', type, pinId, subPinId, 'type'],
      type
    )

    const nextSubPinSpec = pathOrDefault(
      nextPlugSpec,
      [type, pinId, subPinId],
      {}
    )

    // if (graph.hasPinNamed(finalType, pinId)) {
    //   graph.exposePin(finalType, pinId, subPinId, nextSubPinSpec, false)
    // } else {
    //   graph.exposePinSet(
    //     finalType,
    //     pinId,
    //     {
    //       plug: {
    //         [subPinId]: nextSubPinSpec,
    //       },
    //     },
    //     false
    //   )
    // }
  }

  private _movePlugInto__reconnect = (
    graphId: string,
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    nextPlugSpec: {
      input: Dict<Dict<GraphSubPinSpec>>
      output: Dict<Dict<GraphSubPinSpec>>
    },
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    nextMergePinId: Dict<{
      input: { mergeId: string }
      output: { mergeId: string }
    }>,
    nextIdMap: {
      merge: Dict<string>
      link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
      plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
      unit: Dict<string>
    },
    plugs
  ): void => {
    // console.log(
    //   'Graph',
    //   '_movePlugInto__reconnect',
    //   graphId,
    //   type,
    //   pinId,
    //   subPinId,
    //   subPinSpec,
    //   nextPlugSpec
    // )

    const oppositeType = opposite(type)

    const nextPinId = pathOrDefault(
      nextPlugSpec,
      [type, pinId, subPinId, 'pinId'],
      pinId
    )

    const plug = pathGet(plugs, [type, pinId, subPinId])

    const finalType = pathOrDefault(
      nextIdMap,
      ['plug', type, pinId, subPinId, 'type'],
      type
    )

    const graph = this.getGraph(graphId)

    const nextSubPinSpec = pathOrDefault(
      nextPlugSpec,
      [type, pinId, subPinId],
      {}
    )

    if (graph.hasPinNamed(finalType, pinId)) {
      graph.exposePin(finalType, pinId, subPinId, nextSubPinSpec, false)
    } else {
      graph.exposePinSet(
        finalType,
        pinId,
        {
          plug: {
            [subPinId]: nextSubPinSpec,
          },
        },
        false
      )

      if (plug.active()) {
        // TODO sub pin
        // graph.setPlugData(finalType, pinId, subPinId, plug.peak(), false)
        graph.setPinData(finalType, pinId, plug.peak())
      }
    }

    if (subPinSpec.unitId && subPinSpec.pinId) {
      let nextMergeId = pathOrDefault(
        nextIdMap,
        ['link', subPinSpec.unitId, subPinSpec.type, pinId, 'mergeId'],
        null
      )

      if (nextMergeId) {
        this._addPinToMerge(nextMergeId, graphId, finalType, nextPinId)
      } else {
        nextMergeId = pathOrDefault(
          nextIdMap,
          ['plug', type, pinId, subPinId, 'mergeId'],
          null
        )

        if (nextMergeId) {
          this._addMerge(
            {
              [graphId]: {
                [finalType]: {
                  [nextPinId]: true,
                },
              },
              [subPinSpec.unitId]: {
                [type]: {
                  [subPinSpec.pinId]: true,
                },
              },
            },
            nextMergeId,
            undefined,
            false
          )
        }
      }
    } else if (subPinSpec.mergeId) {
      const nextMergeId = pathOrDefault(
        nextMergePinId,
        ['merge', subPinSpec.mergeId, type],
        null
      )

      if (nextMergeId) {
        this._addPinToMerge(nextMergeId, graphId, finalType, nextPinId, false)
      } else {
        const nextMergeId = pathOrDefault(
          nextIdMap,
          ['plug', type, pinId, subPinId, 'mergeId'],
          null
        )

        if (nextMergeId) {
          this._addPinToMerge(nextMergeId, graphId, finalType, nextPinId)
        }
      }
    }
  }

  public getUnitMergesSpec(unitId: string): GraphMergesSpec {
    const merges = this.getMergesSpec()
    const unit_merges: GraphMergesSpec = {}
    for (const mergeId in merges) {
      const merge = merges[mergeId]
      if (merge[unitId]) {
        unit_merges[mergeId] = merge
      }
    }
    return unit_merges
  }

  public getPinMergeId(unitId: string, type: IO, pinId: string): string | null {
    const mergeId = this._pinToMerge[unitId][type][pinId]

    return mergeId
  }

  public getUnitPlugsSpec(unitId: string): GraphConnectUnitPlugsOpt {
    return getUnitPlugs(this._spec, unitId)
  }

  private _moveUnitInto__remove = (
    graphId: string,
    unitId: string,
    unit: Unit,
    nextUnitId: string,
    ignoredUnit: Set<string>,
    ignoredPin: { input: Set<string>; output: Set<string> },
    ignoredMerge: Set<string>,
    nextPinMap: {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    },
    nextSubComponentParent: string | null,
    nextSubComponentChildren: string[],
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: GraphPinsSpec,
    pinToMerge
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveUnitInto',
    //   graphId,
    //   unitId,
    //   nextUnitId,
    //   ignoredPin,
    //   ignoredMerge,
    //   nextPinMap,
    //   nextSubComponentParent,
    //   nextSubComponentChildren
    // )

    const graph = this.getGraph(graphId)

    if (nextSubComponentParent) {
      if (graph.hasUnit(nextSubComponentParent)) {
        this.removeRoot(nextUnitId)
      }
    }

    if (nextSubComponentChildren) {
      for (const nextSubComponentChildId of nextSubComponentChildren) {
        if (graph.hasUnit(nextSubComponentChildId)) {
          this.removeRoot(nextSubComponentChildId)
        }
      }
    }

    const movePinInto = (type: IO, pinId: string): void => {
      // console.log('movePinInto', unitId, type, pinId)

      if (!ignoredPin[type].has(pinId) && !unit.isPinIgnored(type, pinId)) {
        const nextPinId = pathOrDefault(
          nextPinMap,
          [type, pinId, 'pinId'],
          pinId
        )

        const mergeId = pathOrDefault(pinToMerge, [unitId, type, pinId], null)

        const swapMergePin = mergeId && !ignoredMerge.has(mergeId)

        if (swapMergePin) {
          //
        }

        if (graph.hasPinNamed(type, nextPinId)) {
          //
        } else {
          forEachValueKey(this._spec[`${type}s`] || {}, ({ plug }, id) => {
            for (const subPinId in plug) {
              const subPinSpec = plug[subPinId]

              if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
                this._unplugPin(type, id, subPinId)

                break
              }
            }
          })
        }
      }
    }

    const inputs = unit.getInputNames()
    for (const input_id of inputs) {
      movePinInto('input', input_id)
    }
    const outputs = unit.getOutputNames()
    for (const output_id of outputs) {
      movePinInto('output', output_id)
    }

    this._removeUnit(unitId, false)
  }

  private _moveUnitInto__reconnect = (
    graphId: string,
    unitId: string,
    unit: Unit,
    nextUnitId: string,
    ignoredUnit: Set<string>,
    ignoredPin: { input: Set<string>; output: Set<string> },
    ignoredMerge: Set<string>,
    nextPinMap: IOOf<
      Dict<{
        pinId: string
        subPinId: string
        mergeId: string
        merge: GraphUnitPinOuterSpec
      }>
    >,
    nextSubComponentParent: string | null,
    nextSubComponentChildren: string[],
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: IOOf<GraphPinsSpec>,
    pinToMerge: Dict<IOOf<Dict<string>>>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveUnitInto__reconnect',
    //   graphId,
    //   unitId,
    //   nextUnitId,
    //   ignoredPin,
    //   ignoredMerge,
    //   nextPinMap,
    //   nextSubComponentParent,
    //   nextSubComponentChildren
    // )

    const graph = this.getGraph(graphId)

    const movePinInto = (type: IO, pinId: string): void => {
      if (!ignoredPin[type].has(pinId) && !unit.isPinIgnored(type, pinId)) {
        const {
          pinId: nextPinId,
          subPinId: nextSubPinId,
          mergeId,
          merge,
        } = pathOrDefault(nextPinMap, [type, pinId], {
          pinId: undefined,
          subPinId: undefined,
        })

        const swapMergePin = mergeId && !ignoredMerge.has(mergeId)

        if (nextPinId && nextSubPinId) {
          if (graph.hasPinNamed(type, nextPinId)) {
            graph.exposePin(
              type,
              nextPinId,
              nextSubPinId,
              {
                unitId: nextUnitId,
                pinId,
              },
              false
            )
          } else {
            const unitPin = unit.getPin(type, pinId)
            const unitPinRef = unit.hasRefPinNamed(type, pinId)

            const unitPinData = unitPin.peak()

            graph.exposePinSet(
              type,
              nextPinId,
              {
                plug: {
                  '0': {
                    unitId: nextUnitId,
                    pinId,
                  },
                },
                ref: unitPinRef,
              },
              false,
              unitPinData,
              false
            )

            forEachValueKey(pinSpecs[type] || {}, ({ plug }, id) => {
              for (const subPinId in plug) {
                const subPinSpec = plug[subPinId]

                if (
                  subPinSpec.unitId === unitId &&
                  subPinSpec.pinId === pinId
                ) {
                  this._plugPin(type, id, subPinId, {
                    unitId: graphId,
                    pinId: nextPinId,
                  })

                  break
                }
              }
            })
          }

          const constant = unit.isPinConstant(type, pinId)

          if (constant) {
            graph.setUnitPinConstant(unitId, type, pinId, false)
            graph.setPinConstant(type, nextPinId, true)
          }

          if (swapMergePin) {
            if (!this.specHasMerge(mergeId)) {
              this.addMerge(merge ?? {}, mergeId, false, false)
            }

            this._addPinToMerge(mergeId, graphId, type, nextPinId, false)
          }
        }
      }
    }

    const inputs = unit.getInputNames()
    for (const input_id of inputs) {
      movePinInto('input', input_id)
    }
    const outputs = unit.getOutputNames()
    for (const output_id of outputs) {
      movePinInto('output', output_id)
    }
  }

  private _moveUnitInto__inject = (
    graphId: string,
    unitId: string,
    unit: Unit,
    nextUnitId: string,
    ignoredUnit: Set<string>,
    ignoredPin: { input: Set<string>; output: Set<string> },
    ignoredMerge: Set<string>,
    nextPinMap: {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    },
    nextSubComponentParent: string | null,
    nextSubComponentChildren: string[],
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinSpecs: IOOf<GraphPinSpec>,
    pinToMerge
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveUnitInto',
    //   graphId,
    //   unitId,
    //   nextUnitId,
    //   ignoredPin,
    //   ignoredMerge,
    //   nextPinMap,
    //   nextSubComponentParent,
    //   nextSubComponentChildren
    // )

    const graph = this.getGraph(graphId)

    graph.addUnit(nextUnitId, unit, undefined, false)

    if (nextSubComponentParent) {
      if (graph.hasUnit(nextSubComponentParent)) {
        graph.moveRoot(nextSubComponentParent, nextUnitId, 'default')
      }
    }

    if (nextSubComponentChildren) {
      for (const nextSubComponentChildId of nextSubComponentChildren) {
        if (graph.hasUnit(nextSubComponentChildId)) {
          graph.moveRoot(nextUnitId, nextSubComponentChildId, 'default')
        }
      }
    }

    const movePinInto = (type: IO, pinId: string): void => {
      if (!ignoredPin[type].has(pinId) && !unit.isPinIgnored(type, pinId)) {
        const { pinId: nextPinId, subPinId: nextSubPinId } = pathOrDefault(
          nextPinMap,
          [type, pinId],
          { pinId, subPinId: '0' }
        )

        if (graph.hasPinNamed(type, nextPinId)) {
        } else {
        }
      }
    }

    const inputs = unit.getInputNames()
    for (const input_id of inputs) {
      movePinInto('input', input_id)
    }
    const outputs = unit.getOutputNames()
    for (const output_id of outputs) {
      movePinInto('output', output_id)
    }
  }

  private _getMergeUnitPinCount = (mergeId: string, unitId: string): number => {
    const merge = this.getMergeSpec(mergeId)

    const mergeUnit = merge[unitId]

    const count = getMergeUnitPinCount(mergeUnit)

    return count
  }

  private _moveLinkPinInto(
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    oppositeMergeId: string | null,
    oppositePinId: string | null,
    subPinSpec: GraphSubPinSpec = {},
    graph: Graph
  ): void {
    // console.log(
    //   'Graph',
    //   '_moveLinkPinInto',
    //   graphId,
    //   unitId,
    //   type,
    //   pinId,
    //   oppositeMergeId,
    //   oppositePinId,
    //   subPinSpec
    // )

    if (graphId === unitId) {
      const mergeId = pathOrDefault(
        this._pinToMerge,
        [unitId, type, pinId],
        null
      )

      if (mergeId) {
        const unitMergePinCount = this._getMergeUnitPinCount(mergeId, unitId)

        if (unitMergePinCount > 0) {
          //
        } else {
          graph.coverPinSet(type, pinId, false)
        }
      } else {
        graph.coverPinSet(type, pinId, false)
      }
    } else {
      if (oppositeMergeId && oppositePinId) {
        const oppositeType = opposite(type)

        if (this.hasMerge(oppositeMergeId)) {
          this._addPinToMerge(oppositeMergeId, unitId, type, pinId)
        } else {
          const pin = this.getUnitPin(unitId, type, pinId)

          const data = pin.peak()

          const pinSpec = { plug: { '0': subPinSpec } }

          if (graph.hasPinNamed(oppositeType, oppositePinId)) {
            //
          } else {
            graph.exposePinSet(
              oppositeType,
              oppositePinId,
              pinSpec,
              data,
              false,
              false
            )
          }

          const merge = {
            [unitId]: {
              [type]: {
                [pinId]: true,
              },
            },
            [graphId]: {
              [oppositeType]: {
                [oppositePinId]: true,
              },
            },
          }

          this._addMerge(merge, oppositeMergeId, null, false)
        }
      } else {
        //
      }
    }
  }

  private _moveLinkPinInto__remove = (
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    oppositeMergeId: string | null,
    oppositePinId: string | null,
    subPinSpec: GraphSubPinSpec = {},
    ignoredUnit: Set<string> = new Set(),
    mergeIgnored,
    unitSpecs,
    units,
    mergeSpecs,
    merges,
    pinToMerge: Dict<IOOf<Dict<string>>>,
    graph: Graph
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveLinkPinInto__remove',
    //   graphId,
    //   unitId,
    //   type,
    //   pinId,
    //   oppositeMergeId,
    //   oppositePinId,
    //   subPinSpec
    // )
    //
  }

  private _moveLinkPinInto__inject = (
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    oppositeMergeId: string | null,
    oppositePinId: string | null,
    subPinSpec: { pinId: string; subPinId: string } | null,
    ignoredUnit: Set<string> = new Set(),
    mergeIgnored,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinToMerge: Dict<IOOf<Dict<string>>>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveLinkPinInto__inject',
    //   graphId,
    //   unitId,
    //   type,
    //   pinId,
    //   oppositeMergeId,
    //   oppositePinId,
    //   subPinSpec
    // )

    const graph = this.getGraph(graphId)

    if (ignoredUnit.has(unitId)) {
      return
    }

    const unit = this.getUnit(unitId)

    if (graphId === unitId) {
      //
    } else {
      if (oppositeMergeId && oppositePinId) {
        const oppositeType = opposite(type)

        const pin = this.getUnitPin(unitId, type, pinId)

        const data = pin.peak()

        const exposedPin = new Pin({ data })
        const exposedMerge = new Merge(this.__system)

        if (graph.hasPinNamed(oppositeType, oppositePinId)) {
          //
        } else {
          const ref = unit.isPinRef(type, pinId)

          const pinSpec = { plug: { '0': {} }, ref }

          graph.exposePinSet(
            oppositeType,
            oppositePinId,
            pinSpec,
            data,
            false,
            false
          )
        }

        if (this.hasMerge(oppositeMergeId)) {
          //
        } else {
        }
      } else {
        //
      }
    }
  }

  private _moveLinkPinInto__reconnect = (
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    oppositeMergeId: string | null,
    oppositePinId: string | null,
    plugPinSpec: { pinId: string; subPinId: string } | null,
    ignoredUnit: Set<string> = new Set(),
    ignoredMerge: Set<string>,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinToMerge: Dict<IOOf<Dict<string>>>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveLinkPinInto',
    //   graphId,
    //   unitId,
    //   type,
    //   pinId,
    //   oppositeMergeId,
    //   oppositePinId,
    //   subPinSpec
    // )

    const graph = this.getGraph(graphId)

    const mergeId = pathOrDefault(pinToMerge, [unitId, type, pinId], null)

    if (graphId === unitId) {
      if (mergeId) {
        const mergeSpec = mergeSpecs[mergeId]

        const mergeUnit = mergeSpec[unitId]

        const mergePinCount = getMergePinCount(mergeSpec)
        const unitMergePinCount = getMergeUnitPinCount(mergeUnit)

        if (mergePinCount - unitMergePinCount > 0) {
          //
        } else {
          graph.coverPinSet(type, pinId, false)
        }
      } else {
        graph.coverPinSet(type, pinId, false)
      }
    } else {
      if (oppositeMergeId && oppositePinId) {
        const oppositeType = opposite(type)

        if (this.hasMerge(oppositeMergeId)) {
          if (
            !this.isPinMergedTo(
              oppositeMergeId,
              graphId,
              oppositeType,
              oppositePinId
            )
          ) {
            this._addPinToMerge(
              oppositeMergeId,
              graphId,
              oppositeType,
              oppositePinId
            )
          } else {
            this._addPinToMerge(oppositeMergeId, unitId, type, pinId)
          }
        } else {
          const merge = {
            [unitId]: {
              [type]: {
                [pinId]: true,
              },
            },
            [graphId]: {
              [oppositeType]: {
                [oppositePinId]: true,
              },
            },
          }

          this._addMerge(merge, oppositeMergeId, null, false)
        }
      } else {
        //
      }
    }

    if (plugPinSpec) {
      const nextUnitId = unitId // TODO

      const newPinSpec =
        graphId !== unitId
          ? { plug: { '0': { unitId: nextUnitId, pinId } } }
          : { plug: { '0': {} } }

      graph.exposePinSet(type, plugPinSpec.pinId, newPinSpec, false)

      this._plugPin(type, plugPinSpec.pinId, plugPinSpec.subPinId, {
        unitId: graphId,
        pinId: plugPinSpec.pinId,
      })
    }
  }

  private _moveMergeInto__remove = (
    graphId: string,
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    nextInput: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    } | null,
    nextOutput: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    } | null,
    ignoredUnit: Set<string> = new Set(),
    mergeIgnored,
    nextExposedPin: { type: IO; pinId: string; subPinId: string } | null,
    graph: Graph,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    pinToMerge: Dict<IOOf<Dict<string>>>,
    pinSpecs: IOOf<GraphPinsSpec>,
    merges: Dict<Merge>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveMergeInto__remove',
    //   graphId,
    //   mergeId,
    //   mergeSpec,
    //   nextInput,
    //   nextOutput,
    //   ignoredUnit,
    //   nextExposedPin
    // )

    const moveLinkPinInto = (unitId: string, type: IO, pinId: string): void => {
      if (ignoredUnit.has(unitId) || unitId === graphId) {
        return
      }

      const isInput = type === 'input'

      const {
        mergeId: nextMergeId,
        pinId: nextPinId,
        subPinSpec: nextSubPinSpec,
      } = isInput ? nextOutput : nextInput

      if (this.specHasMerge(mergeId)) {
        this._removePinFromMerge(mergeId, unitId, type, pinId, false)
      }

      this._moveLinkPinInto__remove(
        graphId,
        unitId,
        type,
        pinId,
        nextMergeId,
        nextPinId,
        nextSubPinSpec,
        ignoredUnit,
        mergeIgnored,
        unitSpecs,
        units,
        mergeSpecs,
        merges,
        pinToMerge,
        graph
      )
    }

    forEachPinOnMerge(mergeSpec, moveLinkPinInto)

    if (this.specHasMerge(mergeId)) {
      this._removeMerge(mergeId, false)
    }
  }

  private _transacting = false
  private _transaction = []

  public startTransaction() {
    if (this._transacting) {
      throw new Error('transaction already started')
    }

    this._transacting = true
    this._transaction = []
  }

  public endTransaction = () => {
    if (!this._transacting) {
      throw new Error('transaction not started')
    }

    this.emit('bulk_edit', this._transaction, true, [])

    this._transacting = false
  }

  private _moveMergeInto__inject = (
    graphId: string,
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    nextInput: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    } | null,
    nextOutput: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    } | null,
    ignoredUnit: Set<string> = new Set(),
    mergeIgnored,
    nextExposedPin: { type: IO; pinId: string; subPinId: string } | null,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinToMerge: Dict<IOOf<Dict<string>>>,
    pinSpecs: IOOf<GraphPinsSpec>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveMergeInto',
    //   graphId,
    //   mergeId,
    //   mergeSpec,
    //   nextInput,
    //   nextOutput,
    //   ignoredUnit,
    //   nextExposedPin
    // )

    let pinIntoCount = 0

    const graph = this.getGraph(graphId)

    const nextMerge: GraphMergeSpec = {}

    const moveLinkPinInto = (unitId: string, type: IO, pinId: string): void => {
      if (ignoredUnit.has(unitId) || unitId === graphId) {
        if (unitId === graphId) {
          const pinSpec = graph.getExposedPinSpec(type, pinId)

          const { plug } = pinSpec

          for (const subPinId in plug) {
            const subPin = plug[subPinId]

            if (subPin.unitId && subPin.pinId) {
              pathSet(nextMerge, [subPin.unitId, type, subPin.pinId], true)
            } else if (subPin.mergeId) {
              const mergeSpec = graph.getMergeSpec(subPin.mergeId)

              forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
                pathSet(nextMerge, [unitId, type, pinId], true)
              })
            }
          }

          pinIntoCount++
        } else {
          pathSet(nextMerge, [unitId, type, pinId], true)

          pinIntoCount++

          return
        }
      }

      const isInput = type === 'input'

      const {
        mergeId: nextMergeId,
        pinId: nextPinId,
        subPinSpec: nextSubPinSpec, // TODO
      } = isInput ? nextOutput : nextInput

      this._moveLinkPinInto__inject(
        graphId,
        unitId,
        type,
        pinId,
        nextMergeId,
        nextPinId,
        null,
        ignoredUnit,
        mergeIgnored,
        unitSpecs,
        units,
        mergeSpecs,
        merges,
        pinToMerge
      )
    }

    forEachPinOnMerge(mergeSpec, moveLinkPinInto)

    if (pinIntoCount === 0 || pinIntoCount > 1) {
      graph.addMerge(nextMerge, mergeId, null, false)
    }
  }

  private _moveMergeInto__reconnect = (
    graphId: string,
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    nextInput: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    } | null,
    nextOutput: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
    } | null,
    ignoredUnit: Set<string> = new Set(),
    ignoredMerge: Set<string>,
    nextExposedPin: { type: IO; pinId: string; subPinId: string } | null,
    unitSpecs: GraphUnitsSpec,
    units: Dict<Unit>,
    mergeSpecs: GraphMergesSpec,
    merges: Dict<Merge>,
    pinToMerge: Dict<IOOf<Dict<string>>>,
    pinSpecs: IOOf<GraphPinsSpec>
  ): void => {
    // console.log(
    //   'Graph',
    //   '_moveMergeInto__reconnect',
    //   graphId,
    //   mergeId,
    //   mergeSpec,
    //   nextInput,
    //   nextOutput,
    //   ignoredUnit,
    //   nextExposedPin
    // )

    let pinIntoCount: number = 0

    const nextMerge: GraphMergeSpec = {}

    const graph = this.getGraph(graphId)

    const moveLinkPinInto = (unitId: string, type: IO, pinId: string): void => {
      if (ignoredUnit.has(unitId) || unitId === graphId) {
        if (unitId === graphId) {
          const pinSpec = graph.getExposedPinSpec(type, pinId)

          const { plug } = pinSpec

          for (const subPinId in plug) {
            const subPin = plug[subPinId]

            if (subPin.unitId && subPin.pinId) {
              pathSet(nextMerge, [subPin.unitId, type, subPin.pinId], true)
            } else if (subPin.mergeId) {
              const mergeSpec = graph.getMergeSpec(subPin.mergeId)

              forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
                pathSet(nextMerge, [unitId, type, pinId], true)
              })
            }
          }
        } else {
          pathSet(nextMerge, [unitId, type, pinId], true)
        }

        pinIntoCount++
      }

      const isInput = type === 'input'

      const {
        mergeId: nextMergeId,
        pinId: nextPinId,
        subPinSpec: nextSubPinSpec,
      } = (isInput ? nextOutput : nextInput) ?? {}

      this._moveLinkPinInto__reconnect(
        graphId,
        unitId,
        type,
        pinId,
        ignoredUnit.has(unitId) ? null : nextMergeId,
        ignoredUnit.has(unitId) ? null : nextPinId,
        ignoredUnit.has(unitId) ? null : null,
        ignoredUnit,
        ignoredMerge,
        unitSpecs,
        units,
        mergeSpecs,
        merges,
        pinToMerge
      )
    }

    forEachPinOnMerge(mergeSpec, moveLinkPinInto)

    if (pinIntoCount > 1) {
      const originalMergeCount = keyCount(mergeSpec)

      if (originalMergeCount === pinIntoCount) {
        const graphMerge = mergeSpec[graphId]

        if (graphMerge) {
          forIOObjKV(graphMerge, (type, pinId) => {
            graph.coverPinSet(type, pinId, false)
          })
        }
      }
    }

    const processMergePin = (
      type: IO,
      nextPin: {
        mergeId: string
        pinId: string
        subPinSpec: GraphSubPinSpec
      }
    ) => {
      const { pinId, subPinSpec } = nextPin

      if (pinId && subPinSpec) {
        if (graph.hasPinNamed(type, pinId)) {
          graph.exposePin(type, pinId, '0', subPinSpec, false)
        } else {
          graph.exposePinSet(
            type,
            pinId,
            {
              plug: {
                '0': subPinSpec,
              },
            },
            false
          )
        }
      }
    }

    nextInput && processMergePin('input', nextInput)
    nextOutput && processMergePin('output', nextOutput)

    forIO(pinSpecs, (type, pinsSpec) => {
      forEachObjKV(pinsSpec, (pinId, pinSpec) => {
        const { plug } = pinSpec

        for (const subPinId in plug) {
          const subPin = plug[subPinId]

          if (subPin.mergeId === mergeId) {
            const isInput = type === 'input'

            const { mergeId: nextMergeId } =
              (isInput ? nextOutput : nextInput) ?? {}

            if (this.hasPlug(type, pinId, subPinId)) {
              this._plugPin(type, pinId, subPinId, { mergeId: nextMergeId })
            }
          }
        }
      })
    })
  }

  private _isUnitComponent = (unitId: string): boolean => {
    const unit = this.getUnit(unitId)

    const isComponent =
      unit instanceof Element_ || (unit instanceof Graph && unit.isElement())

    return isComponent
  }

  public explodeUnit(
    graphId: string,
    mapUnitId: Dict<string>,
    mapMergeId: Dict<string>,
    ignorePins: boolean = false
  ): void {
    // console.log('Graph', 'explodeUnit', graphId, mapUnitId, mapMergeId)

    this._explodeUnit(graphId, mapUnitId, mapMergeId, ignorePins)

    this.emit('explode_unit', graphId, mapUnitId, mapMergeId, [])
  }

  public moveSubgraphOutOf(
    ...[
      graphId,
      specId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    ]: G_MoveSubgraphIntoArgs
  ): void {
    // console.log(
    //   'Graph',
    //   'moveSubgraphOutOf',
    //   specId,
    //   graphId,
    //   nodeIds,
    //   nextIdMap,
    //   nextPinIdMap,
    //   nextMergePinId,
    //   nextPlugSpec,
    //   nextSubComponentParentMap,
    //   nextSubComponentChildrenMap
    // )

    this._moveSubgraphOutOf(
      graphId,
      specId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap
    )

    this.emit(
      'move_subgraph_out_of',
      graphId,
      specId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      []
    )
  }

  private _moveSubgraphOutOf(
    ...[
      graphId,
      nextSpecId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    ]: G_MoveSubgraphIntoArgs
  ): void {
    // console.log(
    //   'Graph',
    //   '_moveSubgraphOutOf',
    //   graphId,
    //   nextSpecId,
    //   nodeIds,
    //   nextIdMap,
    //   nextPinIdMap,
    //   nextMergePinId,
    //   nextPlugSpec,
    //   nextSubComponentParentMap,
    //   nextSubComponentChildrenMap
    // )

    const graph = this.getUnit(graphId) as Graph

    const merges = clone(this.getUnitMergesSpec(graphId))
    const plugs = clone(this.getUnitPlugsSpec(graphId))

    const collapseMap = {
      nodeIds,
      nextSpecId: null,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      nextSubComponentIndexMap: {},
      nextUnitPinMergeMap: {},
    }

    const connectOpt = {
      merges,
      plugs,
    }

    graph.startTransaction()

    graph.fork()

    moveSubgraph(graph, this, graphId, collapseMap, connectOpt, true)

    graph.endTransaction()
  }

  public _explodeUnit(
    graphId: string,
    unitIdMap: Dict<string>,
    mergeIdMap: Dict<string>,
    ignorePins = true
  ): void {
    // console.log('Graph', '_explodeUnit', graphId, unitIdMap, mergeIdMap)

    this._fork()

    const spec = this.getUnitSpec(graphId) as GraphSpec

    const collapseMap = makeFullSpecCollapseMap(
      graphId,
      spec,
      unitIdMap,
      mergeIdMap,
      {
        getMerge: (mergeId) => this.getMergeSpec(mergeId),
        getUnitMerges: (unitId) => this.getUnitMergesSpec(unitId),
        getPinMergeId: (unitId, type, pinId) =>
          this.getPinMergeId(unitId, type, pinId),
      }
    )

    const {
      nodeIds,
      nextSpecId,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    } = collapseMap

    this._moveSubgraphOutOf(
      graphId,
      nextSpecId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap
    )

    this._removeUnit(graphId)
  }

  private _removeSubComponentFromParent(subComponentId) {
    this._simRemoveSubComponentFromParent(subComponentId)
    this._specRemoveSubComponentFromParent(subComponentId)
  }

  public reorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number,
    emit: boolean = true
  ): void {
    this._reorderSubComponent(parentId, childId, to)

    emit && this.emit('reorder_sub_component', parentId, childId, to, [])
  }

  private _reorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number
  ): void {
    this._simReorderSubComponent(parentId, childId, to)
    this._specReorderSubComponent(parentId, childId, to)
  }

  private _simReorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number
  ): void {
    const subComponent = this.getUnit(childId) as Component_

    if (parentId) {
      const parentComponent = this.getUnit(parentId) as Component_

      parentComponent.reorderParentRoot(subComponent, to)
    } else {
      this.reorderRoot(subComponent, to)
    }
  }

  private _specReorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number
  ): void {
    const subComponent = this.getUnit(childId) as Component_

    if (parentId) {
      remove(this._spec.component.subComponents[parentId].children, childId)
      insert(this._spec.component.subComponents[parentId].children, childId, to)
    } else {
      remove(this._spec.component.children, childId)
      insert(this._spec.component.children, childId, to)
    }
  }

  public moveRoot(
    parentId: string | null,
    childId: string,
    slotName: string
  ): void {
    this._moveSubComponentRoot(parentId, childId, slotName)
  }

  private _moveSubComponentRoot(
    parentId: string | null,
    childId: string,
    slotName: string
  ): void {
    this._removeSubComponentFromParent(childId)

    if (parentId) {
      this._appendSubComponentChild(parentId, childId, slotName)
    } else {
      this._appendRoot(childId)
    }
  }

  private _initSetComponent(component: GraphComponentSpec): void {
    const { slots = [], subComponents = {}, children = [] } = component

    for (const subComponentId in subComponents) {
      const subComponent = subComponents[subComponentId]

      this._initAddSubComponent(subComponentId, subComponent)
    }

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]

      const [unitId, slotName] = slot

      const slotUnit = this.getUnit(unitId) as Element_ | Graph

      const _slotName = i === 0 ? 'default' : `${i}`

      this._slot[_slotName] = slotUnit
    }
  }

  private _specSetComponent(component: GraphComponentSpec): void {
    const { slots = [], subComponents = {}, children = [] } = component

    for (const subComponentId in subComponents) {
      const subComponent = subComponents[subComponentId]

      this._specAddSubComponent(subComponentId, subComponent)
    }

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]
      const [unitId, slotName] = slot
      const slotUnit = this.getUnit(unitId) as Element_ | Graph
      const _slotName = i === 0 ? 'default' : `${i}`
      this._slot[_slotName] = slotUnit
    }

    // AD HOC
    if (slots.length > 0) {
      this._spec.component.slots = slots
    }

    // for (const child of children) {
    //   this.componentAppend(child)
    // }
  }

  private _initAddSubComponent(
    subComponentId: string,
    subComponent: GraphSubComponentSpec
  ): void {
    const { children = [], childSlot = {} } = subComponent

    for (const childId of children) {
      const slot = childSlot[childId] || 'default'

      this._simSubComponentAppendChild(subComponentId, childId, slot)
    }
  }

  private _specAddSubComponent(
    subComponentId: string,
    subComponent: GraphSubComponentSpec
  ): void {
    const { children = [], childSlot = {} } = subComponent

    for (const childId of children) {
      // AD HOC
      // should get parent from memory
      this._specComponentRemoveChild(childId)

      const slot = childSlot[childId] || 'default'

      this._specSubComponentAppendChild(subComponentId, childId, slot)
    }

    this._spec.component.subComponents[subComponentId] = subComponent

    this._spec.component.children = this._spec.component.children ?? []

    this._spec.component.children.push(subComponentId)
  }

  private _root: Component_[] = []
  private _parent_root: Component_[] = []
  private _parent_children: Component_[] = []
  private _slot: Dict<Component_> = {}

  appendParentChild(component: Component_, slotName: string): void {
    return appendParentChild(this, this._parent_children, component, slotName)
  }

  removeParentChild(component: Component_): void {
    return removeParentChild(this, this._parent_children, component)
  }

  registerRoot(component: Component_): void {
    return registerRoot(this, this._root, component)
  }

  unregisterRoot(component: Component_): void {
    return unregisterRoot(this, this._root, component)
  }

  registerParentRoot(component: Component_, slotName: string): void {
    return registerParentRoot(this, this._parent_root, component, slotName)
  }

  unregisterParentRoot(component: Component_): void {
    return unregisterParentRoot(this, this._parent_root, component)
  }

  reorderRoot(component: Component_<ComponentEvents>, to: number): void {
    reorderRoot(this, this._root, component, to)
  }

  reorderParentRoot(component: Component_<ComponentEvents>, to: number): void {
    reorderParentRoot(this, this._parent_root, component, to)
  }

  insertChild(Bundle: UnitBundle<Component_>, at: number): void {
    return insertChild(this, this._children, Bundle, at)
  }

  appendChild(Bundle: UnitBundle): number {
    return appendChild(this, this._children, Bundle)
  }

  pushChild(Bundle: UnitBundle): number {
    return pushChild(this, this._children, Bundle)
  }

  pullChild(at: number): Component_ {
    throw pullChild(this, this._children, at)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): Component_ {
    return removeChild(this, this._children, at)
  }

  refChild(at: number): Component_ {
    return refChild(this, this._children, at)
  }

  refChildren(): Component_[] {
    return refChildren(this, this._children)
  }

  refSlot(slotName: string): Component_ {
    return refSlot(this, slotName, this._slot)
  }

  bulkEdit(actions: Action[]): void {
    this._bulkEdit(actions)

    this.emit('bulk_edit', actions, false, [])
  }

  private _bulkEdit(actions: Action[]): void {
    // console.log('Graph', 'bulkEdit', actions)

    for (const action of actions) {
      processAction(action, {
        addUnitSpec: (data: GraphAddUnitData) => {
          const { unitId, bundle } = data

          this._addUnitSpec(unitId, bundle)
        },
        removeUnit: (data: GraphRemoveUnitData) => {
          const { unitId } = data

          this._removeUnit(unitId)
        },
        exposePinSet: (data: GraphExposePinSetData) => {
          const { type, pinId, pinSpec } = data

          this._exposePinSet(type, pinId, pinSpec)
        },
        exposePin: (data: GraphExposePinData) => {
          const { type, pinId, subPinId, subPinSpec } = data

          this._exposePin(type, pinId, subPinId, subPinSpec)
        },
        coverPin: (data: GraphCoverPinData) => {
          const { type, pinId, subPinId } = data

          this._coverPin(type, pinId, subPinId)
        },
        coverPinSet: (data: GraphCoverPinSetData) => {
          const { type, pinId } = data

          this._coverPinSet(type, pinId)
        },
        plugPin: (data: GraphPlugPinData) => {
          const { type, pinId, subPinId, subPinSpec } = data

          this._plugPin(type, pinId, subPinId, subPinSpec)
        },
        unplugPin: (data: GraphUnplugPinData) => {
          const { type, pinId, subPinId } = data

          this._unplugPin(type, pinId, subPinId)
        },
        addUnitSpecs: (data: GraphAddUnitsData) => {
          const { units } = data

          this._addUnitSpecs(units)
        },
        removeMerge: (data: GraphRemoveMergeData) => {
          const { mergeId } = data

          this._removeMerge(mergeId, true)
        },
        removePinFromMerge: (data: GraphRemovePinFromMergeData) => {
          const { mergeId, unitId, type, pinId } = data

          this._removePinFromMerge(mergeId, unitId, type, pinId)
        },
        removeUnitGhost: (data: GraphRemoveUnitGhostData) => {
          const { unitId, nextUnitId, nextUnitSpec } = data

          this._removeUnitGhost(unitId, nextUnitId, nextUnitSpec)
        },
        addUnitGhost: (data: GraphAddUnitGhostData) => {
          const { unitId, nextUnitId, nextUnitBundle, nextUnitPinMap } = data

          this._addUnitGhost(unitId, nextUnitId, nextUnitBundle, nextUnitPinMap)
        },
        addMerges: (data: GraphAddMergesData) => {
          const { merges } = data

          this._addMerges(merges)
        },
        addMerge: (data: GraphAddMergeData) => {
          const { mergeId, mergeSpec } = data

          this._addMerge(mergeSpec, mergeId)
        },
        addPinToMerge: (data: GraphAddPinToMergeData) => {
          const { mergeId, unitId, type, pinId } = data

          this._addPinToMerge(mergeId, unitId, type, pinId)
        },
        takeUnitErr: (data: GraphTakeUnitErrData) => {
          const { unitId } = data

          this.takeUnitErr(unitId)
        },
        setPinSetId: (data: GraphSetPinSetIdData) => {
          const { type, pinId, nextPinId } = data

          this._setPinSetId(type, pinId, nextPinId)
        },
        setPinSetFunctional: (data: GraphSetPinSetFunctionalData) => {
          const { type, pinId, functional } = data

          this._setPinSetFunctional(type, pinId, functional)
        },
        setUnitPinConstant: (data: GraphSetUnitPinConstant) => {
          const { unitId, type, pinId, constant } = data

          this._setUnitPinConstant(unitId, type, pinId, constant)
        },
        setUnitPinIgnored: (data: GraphSetUnitPinIgnoredData) => {
          const { unitId, type, pinId, ignored } = data

          this._setUnitPinIgnored(unitId, type, pinId, ignored)
        },
        setUnitPinData: (_data: GraphSetUnitPinDataData) => {
          const { unitId, type, pinId, data } = _data

          this._setUnitPinData(unitId, type, pinId, data)
        },
        setUnitName: (data: GraphSetUnitNameData) => {
          const { unitId, newUnitId, name } = data

          this._setUnitName(unitId, newUnitId, name)
        },
        removeUnitPinData: (data: GraphRemoveUnitPinDataData) => {
          const { unitId, type, pinId } = data

          this._removeUnitPinData(unitId, type, pinId)
        },
        removeMergeData: (data: GraphRemoveMergeData) => {
          const { mergeId } = data

          this._removeMergeData(mergeId)
        },
        moveSubComponentRoot: (data: GraphExposePinData) => {
          const {} = data

          // TODO
        },
        moveUnit: (data: GraphMoveUnitData) => {
          const {} = data

          // TODO
        },
        moveSubgraphInto: (data: GraphMoveSubGraphIntoData) => {
          const {
            graphId,
            nextSpecId,
            nodeIds,
            nextIdMap,
            nextPinIdMap,
            nextMergePinId,
            nextPlugSpec,
            nextSubComponentParentMap,
            nextSubComponentChildrenMap,
          } = data

          this._moveSubgraphInto(
            graphId,
            nextSpecId,
            nodeIds,
            nextIdMap,
            nextPinIdMap,
            nextMergePinId,
            nextPlugSpec,
            nextSubComponentParentMap,
            nextSubComponentChildrenMap
          )
        },
        moveSubgraphOutOf: (data: GraphMoveSubGraphOutOfData) => {
          const {
            graphId,
            nextSpecId,
            nodeIds,
            nextIdMap,
            nextPinIdMap,
            nextMergePinId,
            nextPlugSpec,
            nextSubComponentParentMap,
            nextSubComponentChildrenMap,
          } = data

          this._moveSubgraphOutOf(
            graphId,
            nextSpecId,
            nodeIds,
            nextIdMap,
            nextPinIdMap,
            nextMergePinId,
            nextPlugSpec,
            nextSubComponentParentMap,
            nextSubComponentChildrenMap
          )
        },
        reorderSubComponent: (data: GraphReorderSubComponentData) => {
          const { parentId, childId, to } = data

          this._reorderSubComponent(parentId, childId, to)
        },
        explodeUnit: (data: GraphExplodeUnitData) => {
          const { unitId, mapUnitId, mapMergeId } = data

          this._explodeUnit(unitId, mapUnitId, mapMergeId)
        },
        // TODO move removePinData to Unit's bulkEdit
        removePinData: (data: UnitRemovePinDataData) => {
          const { type, pinId } = data

          this.removePinData(type, pinId)
        },
        setUnitSize: (data: GraphSetUnitSizeData) => {
          const { unitId, width, height } = data

          this._setUnitSize(unitId, width, height)
        },
        setSubComponentSize: (data: GraphSetUnitSizeData) => {
          const { unitId, width, height } = data

          this._setSubComponentSize(unitId, width, height)
        },
        setComponentSize: (data: GraphSetComponentSizeData) => {
          const { width, height } = data

          this._setComponentSize(width, height)
        },
        bulkEdit: (data: GraphBulkEditData) => {
          const { actions } = data

          this.bulkEdit(actions)
        },
      })
    }
  }

  private _setUnitSize(unitId: string, width: number, height: number) {
    this._specSetUnitSize(unitId, width, height)
  }

  private _specSetUnitSize(unitId: string, width: number, height: number) {
    setUnitSize({ unitId, width, height }, this._spec)
  }

  private _setSubComponentSize(unitId: string, width: number, height: number) {
    this._specSetSubComponentSize(unitId, width, height)
  }

  private _specSetSubComponentSize(
    unitId: string,
    width: number,
    height: number
  ) {
    setSubComponentSize({ unitId, width, height }, this._spec)
  }

  private _setComponentSize(width: number, height: number) {
    this._specSetComponentSize(width, height)
  }

  private _specSetComponentSize(width: number, height: number) {
    setComponentSize({ width, height }, this._spec)
  }
}
