import {
  appendChild,
  appendParentChild,
  hasChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  refSlot,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { SELF } from '../../constant/SELF'
import { UNTITLED } from '../../constant/STRING'
import { EventEmitter } from '../../EventEmitter'
import { MergeNotFoundError } from '../../exception/MergeNotFoundError'
import { UnitNotFoundError } from '../../exception/UnitNotFoundError'
import { C, C_EE } from '../../interface/C'
import { Component_ } from '../../interface/Component'
import { EE } from '../../interface/EE'
import { G, G_EE } from '../../interface/G'
import { U } from '../../interface/U'
import { V } from '../../interface/V'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Pod } from '../../pod'
import { Primitive } from '../../Primitive'
import { evaluate } from '../../spec/evaluate'
import { fromId } from '../../spec/fromId'
import {
  addPinToMerge,
  removeMerge,
  setUnitInputConstant,
  setUnitOutputConstant,
  _removePinFromMerge,
} from '../../spec/reducers/spec'
import { unitFromSpec } from '../../spec/unitFromSpec'
import {
  forEachPinOnMerge,
  forEachPinOnMerges,
  getExposedPinId,
  getMergePinNodeId,
  getOutputNodeId,
  getPinNodeId,
  oppositePinKind,
} from '../../spec/util'
import { State } from '../../State'
import { System } from '../../system'
import forEachKeyValue from '../../system/core/object/ForEachKeyValue/f'
import deepMerge from '../../system/f/object/DeepMerge/f'
import { isObjNotNull } from '../../system/f/object/DeepMerge/isObjNotNull'
import {
  GraphComponentSpec,
  GraphExposedPinSpec,
  GraphExposedPinsSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphSpecs,
  GraphSubComponentSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '../../types'
import { Dict } from '../../types/Dict'
import { GraphState } from '../../types/GraphState'
import { IO } from '../../types/IO'
import { UnitClass } from '../../types/UnitClass'
import { Unlisten } from '../../types/Unlisten'
import { forEach } from '../../util/array'
import callAll from '../../util/call/callAll'
import { clone, filterObj, mapObjVK, someObj } from '../../util/object'
import { objPromise } from '../../util/promise'
import { Element } from '../Element'
import Merge from '../Merge'
import { Stateful, Stateful_EE } from '../Stateful'
import { Unit, UnitEvents } from '../Unit'
import { WaitAll } from '../WaitAll'

export function isStateful(unit: U): boolean {
  return unit instanceof Stateful || (unit instanceof Graph && unit.stateful)
}

export function isElement(unit: U): boolean {
  return unit instanceof Element || (unit instanceof Graph && unit.element)
}

export type Graph_EE = G_EE & C_EE & Stateful_EE

export type GraphEvents = UnitEvents<Graph_EE> & Graph_EE

export class Graph<I = any, O = any>
  extends Primitive<I, O, GraphEvents>
  implements G, C, U
{
  __ = ['U', 'C', 'G']

  public stateful = false

  public element = false

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
  private _exposedMerge: Dict<U> = {}
  private _exposedEmptySubPin: Dict<Pin> = {}

  private _unit_err_count: Dict<number> = {}

  private _mergeToSelfUnit: Dict<string> = {}
  private _selfUniToMerge: Dict<string> = {}

  private _pinToMerge: Dict<{ input: Dict<string>; output: Dict<string> }> = {}

  private _branch: Dict<true> = {}

  private _statefulUnitCount: number = 0
  private _elementUnitCount: number = 0

  private _mergePinCount: Dict<number> = {}

  private _unitToMerge: Dict<Set<string>> = {}
  private _unitToMergeCount: Dict<Dict<number>> = {}

  // E

  private _children: Component_[] = []
  private _emitter: EventEmitter = new EventEmitter()

  constructor(
    graph: GraphSpec = {
      name: UNTITLED,
      inputs: {},
      outputs: {},
      units: {},
      merges: {},
      component: {},
    },
    branch: Dict<true> = {},
    system: System,
    pod: Pod
  ) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      pod
    )

    const {
      name = UNTITLED,
      inputs = {},
      outputs = {},
      units = {},
      merges = {},
      component = {},
      metadata = {},
      id,
    } = graph

    this._spec = {
      name,
      inputs: {},
      outputs: {},
      units: {},
      merges: {},
      component: {},
      metadata,
      id,
    }

    this._branch = branch

    this._addUnits(units)
    this._addMerges(merges)
    this._exposeInputSets(inputs)
    this._exposeOutputSets(outputs)

    this.setupComponent(component)

    this.addListener('reset', this._reset)
    this.addListener('play', this._play)
    this.addListener('pause', this._pause)
    this.addListener('destroy', this._destroy)
    this.addListener('take_err', this._takeErr)
    this.addListener('take_caught_err', this._takeErr)

    const f_inputs = filterObj(inputs, ({ functional }) => !!functional)
    const f_input_names = Object.keys(f_inputs)

    const waitAll = new WaitAll<any>(this.__system, this.__pod)

    waitAll.play()

    forEach(f_input_names, (name) => {
      const pin = new Pin()
      waitAll.addInput(name, pin)
      const _pin = this.getExposedInputPin(name)
      waitAll.setOutput(name, _pin)
      this.setInput(name, pin, {})
    })
  }

  private _getExposedSubPinNodeId = (
    type: IO,
    pin: GraphExposedSubPinSpec
  ): string => {
    const { unitId, pinId, mergeId } = pin
    if (mergeId) {
      return getMergePinNodeId(mergeId, type)
    } else {
      return getPinNodeId(unitId!, type, pinId!)
    }
  }

  private _setBranch(mergeId: string, type: IO, pinNodeId: string) {
    this._memSetBranch(mergeId, type, pinNodeId)
    this._simSetBranch(mergeId, type, pinNodeId)
  }

  private _memSetBranch(mergeId: string, type: IO, pinNodeId: string) {
    if (type === 'input') {
      this._pipedTo[pinNodeId] = mergeId
    } else {
      this._pipedFrom[pinNodeId] = mergeId
    }
  }

  private _simSetBranch(mergeId: string, type: IO, pinNodeId: string) {
    // console.log('Graph', '_simSetBranch', mergeId, type, pinNodeId)

    const merge = this._merge[mergeId]
    if (type === 'input') {
      const input = this._pin[pinNodeId]
      merge.setOutput(pinNodeId, input, {})
    } else {
      const output = this._pin[pinNodeId]
      merge.setInput(pinNodeId, output, {})
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

  private _ensureMergePin = (type: IO, mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    if (!this._pin[mergePinNodeId]) {
      const oppositeType = oppositePinKind(type)
      const mergePin = new Pin()
      this._pin[mergePinNodeId] = mergePin
      this._setBranch(mergeId, oppositeType, mergePinNodeId)
    }
  }

  private _memEnsureMergePin = (type: IO, mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    if (!this._pin[mergePinNodeId]) {
      const oppositeType = oppositePinKind(type)
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
    opt: PinOpt
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    this._ensureMergePin(type, mergeId)
    const subPin = this._pin[mergePinNodeId]
    this.setExposedSubPin(type, name, subPinId, subPin, opt)
  }

  private _memPlugPinToMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    this._ensureMergePin(type, mergeId)
    const subPin = this._pin[mergePinNodeId]
    this._memSetExposedSubPin(type, name, subPinId, subPin)
  }

  private _simPlugPinToMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    this._ensureMergePin(type, mergeId)
    const subPin = this._pin[mergePinNodeId]
    this._simSetExposedSubPin(type, name, subPinId, subPin)
  }

  private _plugPinToUnitPin = (
    type: IO,
    name: string,
    subPinId: string,
    unitId: string,
    pinId: string,
    opt: PinOpt
  ): void => {
    this._memPlugPinToUnitPin(type, name, subPinId, unitId, pinId)
    this._simPlugPinToUnitPin(type, name, subPinId, unitId, pinId)
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
    pinId: string
  ): void => {
    const subPin = this.getUnitPin(unitId, type, pinId)

    this._simSetExposedSubPin(type, name, subPinId, subPin)
  }

  private setExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin,
    opt: PinOpt
  ) {
    this._setExposedSubPin(type, name, subPinId, subPin, opt)

    this.emit('set_exposed_sub_pin', type, name, subPinId, subPin, opt)
  }

  private _setExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin,
    opt: PinOpt
  ) {
    const oppositeType = oppositePinKind(type)
    const exposedPinId = getExposedPinId(name, type)
    const exposedMerge = this._exposedMerge[exposedPinId]
    exposedMerge.setPin(subPinId, oppositeType, subPin, opt)
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
    subPin: Pin
  ) {
    const oppositeType = oppositePinKind(type)
    const exposedPinId = getExposedPinId(name, type)
    const exposedMerge = this._exposedMerge[exposedPinId]
    exposedMerge.setPin(subPinId, oppositeType, subPin, {})
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
      const errUnit = this.refUnit(errUnitId)
      const err = errUnit.getErr()
      this.err(err)
    } else {
      this.takeErr()
    }
  }

  private _destroy = () => {
    forEachKeyValue(this._unit, (u) => u.destroy())
    forEachKeyValue(this._merge, (m) => m.destroy())
  }

  private _reset = (): void => {
    // TODO
  }

  private _play(): void {
    forEachKeyValue(this._unit, (u) => u.play())

    forEach(this._children, (c) => c.play())
  }

  private _pause(): void {
    forEachKeyValue(this._unit, (u) => u.pause())

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

  private _incElementCount(): void {
    this._elementUnitCount++
    if (this._elementUnitCount === 1) {
      this.setElement()
    }
  }

  private _decElementCount(): void {
    this._elementUnitCount--
    if (this._elementUnitCount === 0) {
      this.setNotElement()
    }
  }

  public setElement(): void {
    this.element = true
    this.emit('element')
  }

  public setNotElement(): void {
    this.element = false
    this.emit('not_element')
  }

  public isStateful(): boolean {
    return this.stateful
  }

  public _setStateful(): void {
    this.stateful = true
    this.emit('stateful')
  }

  public _setStateless(): void {
    this.stateful = false
    this.emit('stateless')
  }

  private _incStatefulCount(): void {
    this._statefulUnitCount++
    if (this._statefulUnitCount === 1) {
      this._setStateful()
    }
  }

  private _decStatefulCount(): void {
    this._statefulUnitCount--
    if (this._statefulUnitCount === 0) {
      this._setStateless()
    }
  }

  public getSpec = (): GraphSpec => {
    return this._spec
  }

  public getSpecs(): GraphSpecs {
    // TODO
    return {}
  }

  public getUnitSpec(id: string): GraphUnitSpec {
    return this._spec.units[id]
  }

  public refUnits = (): Dict<Unit> => {
    return this._unit
  }

  public refMergePin = (mergeId: string, type: IO): Pin => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    return this._pin[mergePinNodeId]
  }

  public exposeOutputSets = (outputs: GraphExposedPinsSpec): void => {
    forEachKeyValue(outputs, this.exposeOutputSet)
  }

  private _exposeOutputSets = (outputs: GraphExposedPinsSpec): void => {
    forEachKeyValue(outputs, this._exposeOutputSet)
  }

  public exposeOutputSet = (
    input: GraphExposedPinSpec,
    pinId: string
  ): void => {
    this.exposePinSet('output', pinId, input)
  }

  private _exposeOutputSet = (
    input: GraphExposedPinSpec,
    pinId: string
  ): void => {
    this._exposePinSet('output', pinId, input)
  }

  public exposeOutput = (
    subPinId: string,
    pinSpec: GraphExposedSubPinSpec,
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
    subPin: GraphExposedSubPinSpec,
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

  public isExposedOutput(pin: GraphExposedSubPinSpec): boolean {
    const outputs = this._spec.outputs || {}
    const nodeId = this._getExposedSubPinNodeId('output', pin)
    return someObj(outputs, ({ pin }) => {
      return someObj(
        pin,
        (o) => this._getExposedSubPinNodeId('output', o) === nodeId
      )
    })
  }

  public getExposedOutput(pin: GraphExposedSubPinSpec): string {
    const outputs = this._spec.outputs || {}
    const nodeId = this._getExposedSubPinNodeId('output', pin)
    for (const outputId in outputs) {
      const output = outputs[outputId]
      const { pin } = output
      for (const subPinId in pin) {
        const subPin = pin[subPinId]
        if (this._getExposedSubPinNodeId('output', subPin) === nodeId) {
          return outputId
        }
      }
    }
  }

  public exposeInputSets = (inputs: GraphExposedPinsSpec): void => {
    forEachKeyValue(inputs, this.exposeInputSet)
  }

  private _exposeInputSets = (inputs: GraphExposedPinsSpec): void => {
    forEachKeyValue(inputs, this._exposeInputSet)
  }

  public exposeInputSet = (input: GraphExposedPinSpec, pinId: string): void => {
    this.exposePinSet('input', pinId, input)
  }

  private _exposeInputSet = (
    input: GraphExposedPinSpec,
    pinId: string
  ): void => {
    this._exposePinSet('input', pinId, input)
  }

  public exposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    emit: boolean = true,
    exposedPin = new Pin(),
    exposedMerge = new Merge(this.__system, this.__pod)
  ): void => {
    // console.log('Graph', 'exposePinSet', type, pinId, pinSpec)

    exposedMerge.play()

    this._exposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)

    emit && this.emit('expose_pin_set', type, pinId, pinSpec)
    emit && this.emit('leaf_expose_pin_set', [], type, pinId, pinSpec)
  }

  public _exposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    exposedPin = new Pin(),
    exposedMerge = new Merge(this.__system, this.__pod)
  ): void => {
    exposedMerge.play()

    this._memExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
    this._simExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
  }

  public memExposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge
  ) => {
    this._memExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
  }

  private _memExposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge
  ) => {
    this._spec[`${type}s`] = this._spec[`${type}s`] || {}
    this._spec[`${type}s`][pinId] = clone(pinSpec)

    const { pin } = pinSpec

    const exposedNodeId = getExposedPinId(pinId, type)

    this._exposedPin[exposedNodeId] = exposedPin
    this._exposedMerge[exposedNodeId] = exposedMerge

    forEachKeyValue(
      pin,
      (subPinSpec: GraphExposedSubPinSpec, subPinId: string) => {
        this._memExposePin(type, pinId, subPinId, subPinSpec)
      }
    )
  }

  private _simExposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    exposedPin: Pin,
    exposedMerge: Merge
  ) {
    const { pin, ref } = pinSpec

    exposedMerge.setPin(pinId, type, exposedPin)

    forEachKeyValue(
      pin,
      (subPinSpec: GraphExposedSubPinSpec, subPinId: string) => {
        this._simExposePin(type, pinId, subPinId, subPinSpec)
      }
    )

    exposedMerge.play()

    this.setPin(pinId, type, exposedPin, { ref })
  }

  public setPinSetFunctional(
    type: IO,
    name: string,
    functional: boolean
  ): void {
    // TODO
  }

  public exposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec,
    emit: boolean = true
  ): void => {
    this._exposePin(type, pinId, subPinId, subPinSpec)

    emit && this.emit('expose_pin', type, pinId, subPinId, subPinSpec)
  }

  private _exposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    this._memExposePin(type, pinId, subPinId, subPinSpec)
    this._simExposePin(type, pinId, subPinId, subPinSpec)
  }

  public memExposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    this._memExposePin(type, pinId, subPinId, subPinSpec)
  }

  private _memExposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    const { unitId, pinId: _pinId, mergeId } = subPinSpec

    if (mergeId || (unitId && _pinId)) {
      this._memPlugPin(type, pinId, subPinId, subPinSpec)
    } else {
      this._memPlugPin(type, pinId, subPinId, subPinSpec)
    }
  }

  private _simExposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    const { unitId, pinId: _pinId, mergeId } = subPinSpec

    if (mergeId || (unitId && _pinId)) {
      this._simPlugPin(type, pinId, subPinId, subPinSpec)
    } else {
      //
    }
  }

  public exposeInput = (
    subPinId: string,
    pinSpec: GraphExposedSubPinSpec,
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

    emit && this.emit('cover_pin_set', type, id, pinSpec)
    emit && this.emit('leaf_cover_pin_set', [], type, id, pinSpec)
  }

  public _coverPinSet = (type: IO, id: string): void => {
    this._simCoverPinSet(type, id)
    this._memCoverPinSet(type, id)
  }

  private _memCoverPinSet = (type: IO, pinId: string): void => {
    const pinSpec = this.getExposedPinSpec(type, pinId)

    const { pin } = pinSpec

    const exposedNodeId = getExposedPinId(pinId, type)

    forEachKeyValue(
      pin,
      (subPinSpec: GraphExposedSubPinSpec, subPinId: string) => {
        this._memCoverPin(type, pinId, subPinId)
      }
    )

    delete this._exposedPin[exposedNodeId]
    delete this._exposedMerge[exposedNodeId]

    delete this._spec[`${type}s`][pinId]
  }

  private _simCoverPinSet = (type: IO, pinId: string): void => {
    const exposedNodeId = getExposedPinId(pinId, type)

    const exposedMerge = this._exposedMerge[exposedNodeId]

    exposedMerge.removePin(type, pinId)

    this.removePin(type, pinId)
  }

  private _memPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    const { mergeId, unitId, pinId: _pinId } = subPinSpec

    // RETURN
    // if (unitId && _pinId) {
    //   if (this.isUnitRefPin(unitId, type, _pinId) || _pinId === SELF) {
    //     this._spec[`${type}s`][pinId].ref = true
    //     this.setPinRef(type, pinId, true)
    //   } else {
    //     this._spec[`${type}s`][pinId].ref = false
    //     this.setPinRef(type, pinId, false)
    //   }
    // } else if (mergeId) {
    //   if (this._mergeToSelfUnit[mergeId]) {
    //     this._spec[`${type}s`][pinId].ref = true
    //     this.setPinRef(type, pinId, true)
    //   } else {
    //     this._spec[`${type}s`][pinId].ref = false
    //     this.setPinRef(type, pinId, false)
    //   }
    // }

    const types = `${type}s`
    const spec_types = (this._spec[types] = this._spec[types] || {})
    const spec_types_pin = (spec_types[pinId] = spec_types[pinId] || {})
    const spec_types_pin_pin = (spec_types_pin.pin = spec_types_pin.pin || {})
    spec_types_pin_pin[subPinId] = subPinSpec
  }

  public plugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', 'plugPin', pinId, subPinId, subPinSpec)
    this._plugPin(type, pinId, subPinId, subPinSpec)

    this.emit('plug_pin', type, pinId, subPinId, subPinSpec)
  }

  private _plugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', '_plugPin', pinId, subPinId, subPinSpec)

    const { mergeId, unitId, pinId: _pinId } = subPinSpec

    const pinSpec = this.getExposedPinSpec(type, pinId)

    this._memPlugPin(type, pinId, subPinId, subPinSpec)

    const { ref } = pinSpec

    const opt = { ref: !!ref }

    if (mergeId) {
      this._plugPinToMerge(type, pinId, subPinId, mergeId, opt)
    } else {
      this._plugPinToUnitPin(type, pinId, subPinId, unitId!, _pinId!, opt)
    }
  }

  private _simPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', '_simPlugPin', pinId, subPinId, subPinSpec)

    const { mergeId, unitId, pinId: _pinId } = subPinSpec

    if (mergeId) {
      this._simPlugPinToMerge(type, pinId, subPinId, mergeId)
    } else {
      this._simPlugPinToUnitPin(type, pinId, subPinId, unitId!, _pinId!)
    }
  }

  public plugInput = (
    subPinId: string,
    subPin: GraphExposedSubPinSpec,
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

    emit && this.emit('cover_pin', type, pinId, subPinId, subPinSpec)
  }

  private _coverPin = (type: IO, id: string, subPinId: string): void => {
    this._simCoverPin(type, id, subPinId)
    this._memCoverPin(type, id, subPinId)
  }

  private _memCoverPin = (type: IO, id: string, subPinId: string): void => {
    const pinSpec = this._spec[`${type}s`][id] as GraphExposedPinSpec
    const subPinSpec = pinSpec['pin'][subPinId] as GraphExposedSubPinSpec

    const { mergeId } = subPinSpec

    if (type === 'output') {
      if (mergeId) {
        this._memRemoveMergeOutput(mergeId)
      }
    }

    delete pinSpec['pin'][subPinId]
  }

  private _simCoverPin = (type: IO, id: string, subPinId: string): void => {
    const subPinSpec = this.getSubPinSpec(type, id, subPinId)

    const { mergeId } = subPinSpec

    if (type === 'output') {
      if (mergeId) {
        this._simRemoveMergeOutput(mergeId)
      }
    }
  }

  public getSubPinSpec = (
    type: IO,
    pinId: string,
    subPinId: string
  ): GraphExposedSubPinSpec => {
    return this._spec[`${type}s`][pinId]['pin'][subPinId]
  }

  public unplugPin = (type: IO, pinId: string, subPinId: string): void => {
    // console.log('Graph', 'unplugPin', pinId, subPinId)
    this._unplugPin(type, pinId, subPinId)

    this.emit('unplug_pin', type, pinId, subPinId)
  }

  private _unplugPin = (type: IO, pinId: string, subPinId: string): void => {
    // console.log('Graph', 'unplugPin', pinId, subPinId)
    this._memUnplugPin(type, pinId, subPinId)
    this._simUnplugPin(type, pinId, subPinId)
  }

  private _memUnplugPin = (type: IO, pinId: string, subPinId: string): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._spec[`${type}s`][pinId].pin[subPinId] = {}

    const isOutput = type === 'output'

    if (isOutput) {
      const { mergeId } = subPinSpec

      if (mergeId) {
        this._memRemoveMergeOutput(mergeId)
      }
    }

    const emptySubPinId = `${pinId}/${subPinId}`
    const emptySubPin = new Pin()
    this._exposedEmptySubPin[emptySubPinId] = emptySubPin

    this._memSetExposedSubPin(type, pinId, subPinId, emptySubPin)
  }

  private _simUnplugPin = (type: IO, pinId: string, subPinId: string): void => {
    // console.log('Graph', '_simUnplugPin', pinId, subPinId)

    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    const isOutput = type === 'output'

    if (isOutput) {
      const { mergeId } = subPinSpec

      if (mergeId) {
        this._simRemoveMergeOutput(mergeId)
      }
    }

    const pin = this.getPin(type, pinId)
    const isRef = this.hasRefPinNamed(type, pinId)

    const emptySubPinId = `${pinId}/${subPinId}`
    const emptySubPin = this._exposedEmptySubPin[emptySubPinId]

    this._simSetExposedSubPin(type, pinId, subPinId, emptySubPin)

    if (isOutput) {
      if (isRef) {
        pin.take()
      }
    }
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

  public isExposedInput(pin: GraphExposedSubPinSpec): boolean {
    const inputs = this._spec.inputs || {}
    const pinNodeId = this._getExposedSubPinNodeId('input', pin)
    return someObj(inputs, ({ pin }) => {
      return someObj(pin, (i) => {
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

  public getExposedPinSpec(type: IO, pinId: string): GraphExposedPinSpec {
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

  public getExposedInputSpec(pinId: string): GraphExposedPinSpec {
    const inputs = this._spec.inputs || {}
    return inputs[pinId]
  }

  public getExposedOutputSpec(pinId: string): GraphExposedPinSpec {
    const outputs = this._spec.outputs || {}
    return outputs[pinId]
  }

  public hasUnit(id: string): boolean {
    return !!this._unit[id]
  }

  public hasMerge(id: string): boolean {
    return !!this._merge[id]
  }

  public refUnit(id: string): Unit<any, any> {
    if (!this._unit[id]) {
      throw new Error('Cannot find unit')
    }
    return this._unit[id]
  }

  public refGraph(id: string): G {
    const graph = this.refUnit(id) as Graph
    return graph
  }

  public getUnitByPath(path: string[]): Unit<any, any> {
    let unit: Unit<any, any> = this
    for (const id of path) {
      unit = (unit as Graph).refUnit(id)
    }
    return unit
  }

  public async read(): Promise<State> {
    return this.getGraphState()
  }

  public write(state: State): void {
    this.setGraphState(state)
  }

  public async setGraphState(state: State): Promise<void> {
    for (const unit_id in state) {
      const unit = this.refUnit(unit_id)
      if (
        unit instanceof Stateful ||
        (unit instanceof Graph && unit.stateful)
      ) {
        const unit_state = state[unit_id]
        unit.write(unit_state)
      } else {
        throw new Error('unit is not stateful')
      }
    }
  }

  public async getUnitState(unitId: string): Promise<State> {
    const unit = this.refUnit(unitId)
    if (unit instanceof Stateful || (unit instanceof Graph && unit.stateful)) {
      return unit.read()
    } else {
      return null
    }
  }

  public async getGraphState(): Promise<GraphState> {
    // @ts-ignore
    const _stateful_unit: Dict<V> = filterObj(this._unit, (unit, unitId) => {
      return (
        unit instanceof Stateful || (unit instanceof Graph && unit.stateful)
      )
    })

    const state_p = mapObjVK(_stateful_unit, (unit) => {
      return unit.read()
    })

    const state = await objPromise<Dict<any>>(state_p)

    return state
  }

  public getGraphChildren(): Dict<any> {
    const children = {}
    for (const unitId in this._unit) {
      const unit = this.refUnit(unitId)
      if (unit instanceof Element || (unit instanceof Graph && unit.element)) {
        const unit_children = (unit as C).refChildren()
        if (unit_children !== undefined) {
          children[unitId] = unit_children
        }
      }
    }
    return children
  }

  public getUnitPin(id: string, type: IO, pinId: string): Pin {
    return this.refUnit(id).getPin(type, pinId)
  }

  getUnitPinData(
    id: string,
    type: IO,
    pinId: string
  ): { input: Dict<any>; output: Dict<any> } {
    return { input: {}, output: {} } // TODO
  }

  public getUnitInput(id: string, pinId: string): Pin {
    return this.refUnit(id).getInput(pinId)
  }

  public getUnitOutput(id: string, pinId: string): Pin {
    return this.refUnit(id).getOutput(pinId)
  }

  public setUnitErr(unitId: string, err: string): void {
    const unit = this.refUnit(unitId)
    unit.err(err)
  }

  public takeUnitErr(unitId: string): string | null {
    const unit = this.refUnit(unitId)
    const err = unit.takeErr()
    return err
  }

  public getGraphPinData = (): object => {
    const state = {}
    forEachKeyValue(this._unit, (unit: Unit, unitId: string) => {
      const unitPinData = unit.getPinData()
      state[unitId] = unitPinData
    })
    return state
  }

  public getGraphMergeInputData = (): Dict<any> => {
    const state = {}
    forEachKeyValue(this._merge, (merge: Merge<any>, mergeId: string) => {
      const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

      const mergeInputPin = this._pin[mergeInputPinId]
      if (mergeInputPin) {
        const mergeInputData = mergeInputPin.peak()
        state[mergeId] = mergeInputData
      }
    })
    return state
  }

  public getGraphErr = (): Dict<string | null> => {
    const unit_err: Dict<string | null> = {}
    forEachKeyValue(this._unit, (unit: Unit, unit_id: string) => {
      const err = unit.getErr()
      unit_err[unit_id] = err
    })
    return unit_err
  }

  public getUnitInputData = (unitId: string): Dict<any> => {
    const unit = this.refUnit(unitId)
    const data = unit.getInputData()
    return data
  }

  public refMerges(): { [id: string]: Merge } {
    return this._merge
  }

  public refMerge(mergeId: string): Merge {
    return this._merge[mergeId]
  }

  public getUnitCount(): number {
    return Object.keys(this._unit).length
  }

  public getMergeCount(): number {
    return Object.keys(this._merge).length
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
    return Object.keys(merge).length
  }

  public getMergePinCount(mergeId: string): number {
    return this._mergePinCount[mergeId]
  }

  public addUnits = (units: GraphUnitsSpec): void => {
    forEachKeyValue(units, this.addUnit.bind(this))
  }

  private _addUnits = (units: GraphUnitsSpec): void => {
    forEachKeyValue(units, this._addUnit.bind(this))
  }

  private injectSubComponent = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: C
  ): void => {
    const { classes } = this.__system

    const { children = [] } = unitSpec

    for (const child of children) {
      const { id } = child

      const ChildClass = fromId(
        id,
        { ...this.__system.specs, ...this.__pod.specs },
        classes
      )

      unit.appendChild(ChildClass)
      // TODO state
    }

    this._incElementCount()

    this.setSubComponent(unitId)

    this.componentAppend(unitId, unitSpec)
  }

  private setSubComponent = (unitId: string): void => {
    // console.log('Graph', 'setSubComponent', unitId)
    this._spec.component = this._spec.component || {}
    this._spec.component.subComponents =
      this._spec.component.subComponents || {}
    this._spec.component.subComponents[unitId] = { children: [] }
  }

  private componentAppend = (unitId: string, unitSpec: GraphUnitSpec): void => {
    this._componentAppend(unitId)

    this.emit('component_append', unitId, unitSpec)
  }

  private _componentAppend = (unitId: string): void => {
    // console.log('Graph', '_componentAppend', unitId)
    this._spec.component.children = this._spec.component.children || []
    this._spec.component.children.push(unitId)
  }

  private componentRemove = (unitId: string): void => {
    this._componentRemove(unitId)

    this.emit('component_remove', unitId)
  }

  private _componentRemove = (unitId: string): void => {
    const i = this._spec.component.children.indexOf(unitId)

    this._spec.component.children.splice(i, 1)

    if (this._spec.render === undefined) {
      if (this._spec.component.children.length === 0) {
        delete this._spec.component.children
      }
    }
  }

  public removeSubComponent = (unitId: string): void => {
    // console.log('Graph', 'removeSubComponent', unitId)

    this._removeSubComponent(unitId)
  }

  private _removeSubComponent = (unitId: string): void => {
    // console.log('Graph', '_removeSubComponent', unitId)

    const { subComponents } = this._spec.component
    const subComponent = subComponents[unitId]
    const { children = [] } = subComponent

    for (const chlid_id of children) {
      this._spec.component.children.push(chlid_id)
    }

    delete subComponents[unitId]
  }

  private _subComponentAppendChild = (
    subComponentId: string,
    childId: string,
    slot: string
  ): void => {
    this._memSubComponentAppendChild(subComponentId, childId, slot)
    this._simSubComponentAppendChild(subComponentId, childId, slot)
  }

  private _memSubComponentAppendChild = (
    subComponentId: string,
    childId: string,
    slot: string
  ): void => {
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
    const subComponentUnit = this.refUnit(subComponentId) as Element | Graph
    const childUnit = this.refUnit(childId) as Element | Graph

    subComponentUnit.registerParentRoot(childUnit, slotName)
  }

  private _unit_unlisten: Dict<Unlisten> = {}

  public addUnit(
    unitSpec: GraphUnitSpec,
    unitId: string,
    unit: Unit | null = null,
    emit: boolean = true
  ): Unit {
    // console.log('Graph', 'addUnit', unitSpec, unitId)
    unit = this._addUnit(unitSpec, unitId, unit)

    emit && this.emit('add_unit', unitId, unit)
    emit && this.emit('leaf_add_unit', unit, [unitId])

    return unit
  }

  public _addUnit(
    unitSpec: GraphUnitSpec,
    unitId: string,
    unit: Unit | null = null
  ): Unit {
    // console.log('Graph', 'addUnit', unitSpec, unitId)
    if (this._unit[unitId]) {
      throw new Error('duplicated unit id')
    }

    if (!unit) {
      unit = unitFromSpec(unitSpec, this._branch, this.__system, this.__pod)
    }

    this._memAddUnit(unitId, unitSpec, unit)
    this._simAddUnit(unitId, unitSpec, unit)

    return unit
  }

  public memAddUnit(unitId: string, unitSpec: GraphUnitSpec, unit: Unit): void {
    this._memAddUnit(unitId, unitSpec, unit)
  }

  private _memAddUnit(
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: Unit
  ): void {
    this.emit('before_add_unit', unitId, unit)

    const all_unlisten: Unlisten[] = []

    this._spec.units = this._spec.units || {}

    this._spec.units[unitId] = unitSpec

    unit.setParent(this)

    this._unit[unitId] = unit

    const set_unit_pin = (type: IO, pinId: string) => {
      // console.log('set_unit_pin', unitId, type, pinId)

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

      const mergeId = this._pipedTo[pinNodeId]

      if (mergeId) {
        this._removePinFromMerge(mergeId, unitId, type, pinId)
      }

      delete this._pin[pinNodeId]
      delete this._unitPins[pinNodeId]
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

    all_unlisten.push(unit.addListener('err', on_unit_err))

    const on_unit_err_removed = () => {
      const index = this._errUnitIds.indexOf(unitId)
      if (index > -1) {
        this._errUnitIds.splice(index, 1)
        if (index === 0) {
          this.takeErr()
          this._nextErr()
        }
      }
    }

    all_unlisten.push(unit.prependListener('take_err', on_unit_err_removed))
    all_unlisten.push(unit.prependListener('catch_err', on_unit_err_removed))

    if (unit instanceof Graph) {
      all_unlisten.push(
        unit.addListener('leaf_add_unit', (unit: Unit, path: string[]) => {
          this.emit('leaf_add_unit', unit, [...path, unitId])
        })
      )

      all_unlisten.push(
        unit.addListener('leaf_remove_unit', (unit: Unit, path: string[]) => {
          this.emit('leaf_remove_unit', unit, [...path, unitId])
        })
      )

      all_unlisten.push(
        unit.addListener(
          'leaf_expose_pin_set',
          (
            path: string[],
            type: IO,
            pinId: string,
            pinSpec: GraphExposedPinSpec
          ) => {
            this.emit(
              'leaf_expose_pin_set',
              [...path, unitId],
              type,
              pinId,
              pinSpec
            )
          }
        )
      )

      all_unlisten.push(
        unit.addListener(
          'leaf_cover_pin_set',
          (path: string[], type: IO, pinId: string) => {
            const pinSpec = unit.getExposedPinSpec(type, pinId)

            this.emit(
              'leaf_cover_pin_set',
              [...path, unitId],
              type,
              pinId,
              pinSpec
            )
          }
        )
      )
    }

    if (unit instanceof Stateful || (unit instanceof Graph && unit.stateful)) {
      all_unlisten.push(
        // @ts-ignore
        unit.addListener('leaf_set', ({ name, data, path }) => {
          this.emit('leaf_set', { name, data, path: [unitId, ...path] })
        })
      )

      this._incStatefulCount()
    }

    if (unit instanceof Element) {
      this.injectSubComponent(unitId, unitSpec, unit)
    }

    if (unit instanceof Graph && unit.stateful) {
      if (unit.element) {
        this.injectSubComponent(unitId, unitSpec, unit)

        all_unlisten.push(
          unit.addListener('element', () => {
            this._on_unit_element(unitId, unitSpec, unit as any) // TODO
          })
        )
        all_unlisten.push(
          unit.addListener('not_element', () => {
            this._on_unit_not_element(unitId)
          })
        )

        all_unlisten.push(
          unit.addListener('leaf_append_child', ({ bundle, path }) => {
            this.emit('leaf_append_child', { bundle, path: [unitId, ...path] })
          })
        )

        all_unlisten.push(
          unit.addListener('leaf_remove_child_at', ({ at, path }) => {
            this.emit('leaf_remove_child_at', { at, path: [unitId, ...path] })
          })
        )
      }

      if (unit.stateful) {
        all_unlisten.push(unit.addListener('stateful', this._on_unit_stateful))
        all_unlisten.push(
          unit.addListener('stateless', this._on_unit_stateless)
        )
      }
    }

    const unlisten = callAll(all_unlisten)

    this._unit_unlisten[unitId] = unlisten
  }

  private _simAddUnit(unitId: string, unitSpec: GraphUnitSpec, unit: U): void {
    const { specs, classes } = this.__system || { specs: {}, classes: {} }

    forEachKeyValue(unitSpec.input || {}, ({ data }, pinId: string) => {
      const input = unit.getInput(pinId)
      if (data !== undefined) {
        data = evaluate(data, specs, classes)
        input.push(data)
      }
    })

    const on_unit_err = (err: string): void => {
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

    if (unit.hasErr()) {
      on_unit_err(unit.getErr())
    }

    if (!this._paused) {
      unit.play()
    }
  }

  private _on_unit_stateful = (): void => {
    this._incStatefulCount()
  }

  private _on_unit_stateless = (): void => {
    this._decStatefulCount()
  }

  private _on_unit_element = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: C
  ): void => {
    this.injectSubComponent(unitId, unitSpec, unit)

    this._incElementCount()
  }

  private _on_unit_not_element = (unitId: string): void => {
    // TODO

    this._decElementCount()
  }

  public removeUnit(unitId: string): U {
    const unit = this._removeUnit(unitId)

    this.emit('remove_unit', unitId, unit)
    this.emit('leaf_remove_unit', unit, [unitId])

    return unit
  }

  private _moveUnit(id: string, unitId: string, inputId: string): void {
    const fromUnit = this.refUnit(id)

    this._simRemoveUnit(id)
    this._memRemoveUnit(id)

    const toUnit = this.refUnit(unitId)

    toUnit.push(inputId, fromUnit)
  }

  public moveUnit(id: string, unitId: string, inputId: string): void {
    this._moveUnit(id, unitId, inputId)

    this.emit('move_unit', id, unitId, inputId)
  }

  private removeUnitFromMerge(unitId: string, mergeId: string): void {
    this._removeUnitFromMerge(unitId, mergeId)

    this.emit('remove_unit_from_merge', unitId, mergeId)
  }

  private _removeUnitFromMerge(unitId: string, mergeId: string): void {
    this._simRemoveUnitFromMerge(unitId, mergeId)
    this._memRemoveUnitFromMerge(unitId, mergeId)
  }

  private _memRemoveUnitFromMerge(unitId: string, mergeId: string): void {
    const merge = this.getMergeSpec(mergeId)
    const mergeUnit = merge[unitId]
    const { input = {}, output = {} } = mergeUnit
    forEachKeyValue(input, (_, inputPinId) => {
      this._memRemovePinFromMerge(mergeId, unitId, 'input', inputPinId)
    })
    forEachKeyValue(output, (_, outputPinId) => {
      this._memRemovePinFromMerge(mergeId, unitId, 'output', outputPinId)
    })
  }

  private _simRemoveUnitFromMerge(unitId: string, mergeId: string): void {
    const merge = this.getMergeSpec(mergeId)
    const mergeUnit = merge[unitId]
    const { input = {}, output = {} } = mergeUnit
    forEachKeyValue(input, (_, inputPinId) => {
      this._simRemovePinFromMerge(mergeId, unitId, 'input', inputPinId)
    })
    forEachKeyValue(output, (_, outputPinId) => {
      this._simRemovePinFromMerge(mergeId, unitId, 'output', outputPinId)
    })
  }

  private _removeUnit(unitId: string): Unit {
    const unit = this.refUnit(unitId)

    this._simRemoveUnit(unitId)
    this._memRemoveUnit(unitId)

    unit.destroy()

    return unit
  }

  public memRemoveUnit(unitId: string): void {
    this._memRemoveUnit(unitId)
  }

  private _memRemoveUnit(unitId: string): void {
    this.emit('before_remove_unit', unitId)

    const unit = this.refUnit(unitId)

    const unlisten = this._unit_unlisten[unitId]

    delete this._unit_unlisten[unitId]

    unlisten()

    const unitToMerge = this._unitToMerge[unitId] || new Set()
    const unitToMergeCount = this._unitToMergeCount[unitId] || {}
    for (const mergeId of unitToMerge) {
      const unitMergeCount = unitToMergeCount[mergeId]
      const mergePinCount = this.getMergePinCount(mergeId)
      if (mergePinCount - unitMergeCount < 2) {
        this._memRemoveMerge(mergeId)
      } else {
        this._memRemoveUnitFromMerge(unitId, mergeId)
      }
    }

    if (unit instanceof Stateful || (unit instanceof Graph && unit.stateful)) {
      this._decStatefulCount()
    }

    if (unit instanceof Element || (unit instanceof Graph && unit.element)) {
      this._decElementCount()

      this._removeSubComponent(unitId)

      this.componentRemove(unitId)
    }

    unit.setParent(null)

    delete this._pinToMerge[unitId]

    delete this._spec.units![unitId]

    delete this._unit[unitId]
  }

  private _simRemoveUnit = (unitId: string): void => {
    const unit = this.refUnit(unitId)

    if (unit.hasErr()) {
      this._removeErrUnit(unitId)
    }

    // const selfMergeId = this._selfUniToMerge[unitId]
    // if (selfMergeId) {
    //   this._simRemovePinFromMerge(selfMergeId, unitId, 'output', SELF)
    // }

    let exposedOutputId: string
    if ((exposedOutputId = this.getExposedOutput({ unitId, pinId: SELF }))) {
      this.takeOutput(exposedOutputId)
    }

    const unitToMerge = this._unitToMerge[unitId] || new Set()
    const unitToMergeCount = this._unitToMergeCount[unitId] || {}
    for (const mergeId of unitToMerge) {
      const unitMergeCount = unitToMergeCount[mergeId]
      const mergePinCount = this.getMergePinCount(mergeId)
      if (mergePinCount - unitMergeCount < 2) {
        this._simRemoveMerge(mergeId)
      } else {
        this._simRemoveUnitFromMerge(unitId, mergeId)
      }
    }
  }

  public addMerges = (merges: GraphMergesSpec): void => {
    forEachKeyValue(merges, this.addMerge)
  }

  private _addMerges = (merges: GraphMergesSpec): void => {
    forEachKeyValue(merges, this._addMerge)
  }

  public addMerge = (
    mergeSpec: GraphMergeSpec,
    mergeId: string,
    emit: boolean = true
  ): void => {
    // console.log('Graph', 'addMerge', mergeId)

    this._addMerge(mergeSpec, mergeId)

    emit && this.emit('add_merge', mergeId, mergeSpec)
  }

  public memAddMerge(
    mergeId: string,
    mergeSpec: GraphMergesSpec,
    merge: Merge
  ): void {
    this._memAddMerge(mergeId, mergeSpec, merge)
  }

  private _addMerge = (mergeSpec: GraphMergeSpec, mergeId: string): void => {
    // console.log('Graph', '_addMerge', mergeId)

    let ref = false

    for (const unitId in mergeSpec) {
      const mergeUnitSpec = mergeSpec[unitId]

      const unit = this.refUnit(unitId)

      const { input, output } = mergeUnitSpec

      for (const inputPinId in input) {
        if (unit.hasRefInputNamed(inputPinId)) {
          ref = true
          break
        }
      }

      for (const outputPinId in output) {
        if (unit.hasRefOutputNamed(outputPinId)) {
          ref = true
          break
        }
      }
    }

    const merge = new Merge(this.__system, this.__pod)

    merge.play()

    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

    const mergeInputPin = new Pin()

    merge.addInput(mergeInputPinId, mergeInputPin, { ref })

    this._memAddMerge(mergeId, mergeSpec, merge)
    this._simAddMerge(mergeId, mergeSpec, merge)
  }

  private _memAddMerge = (
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge
  ): void => {
    this.emit('before_add_merge', mergeId, mergeSpec, merge)

    this._spec.merges = this._spec.merges || {}
    this._spec.merges[mergeId] = mergeSpec

    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

    const mergeInputPin = merge.getInput(mergeInputPinId)

    this._pin[mergeInputPinId] = mergeInputPin
    this._merge[mergeId] = merge

    forEachKeyValue(mergeSpec, ({ input, output }, unitId) => {
      forEachKeyValue(input || {}, (_, inputId) => {
        this._memAddPinToMerge(mergeId, unitId, 'input', inputId)
      })
      forEachKeyValue(output || {}, (_, outputId) => {
        this._memAddPinToMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _simAddMerge(
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge<any>
  ): void {
    forEachKeyValue(mergeSpec, ({ input, output }, unitId) => {
      forEachKeyValue(input || {}, (_, inputId) => {
        this._simAddPinToMerge(mergeId, unitId, 'input', inputId)
      })
      forEachKeyValue(output || {}, (_, outputId) => {
        this._simAddPinToMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _simAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    forEachKeyValue(
      (this._spec[`${type}s`] || {}) as GraphExposedPinsSpec,
      ({ pin }, id) => {
        for (let subPinId in pin) {
          const subPinSpec = pin[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._simUnplugPin(type, id, subPinId)
            this._simPlugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._simSetBranch(mergeId, type, pinNodeId)
  }

  private _memAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    if (type === 'output' && pinId === SELF) {
      this._mergeToSelfUnit[mergeId] = unitId
      this._selfUniToMerge[unitId] = mergeId
    }

    this._spec = addPinToMerge({ id: mergeId, unitId, type, pinId }, this._spec)

    this._mergePinCount[mergeId] = this._mergePinCount[mergeId] || 0
    this._mergePinCount[mergeId]++

    this._unitToMerge[unitId] = this._unitToMerge[unitId] || new Set()
    this._unitToMerge[unitId].add(mergeId)

    this._unitToMergeCount[unitId] = this._unitToMergeCount[unitId] || {}
    this._unitToMergeCount[unitId][mergeId] =
      this._unitToMergeCount[unitId][mergeId] || 0
    this._unitToMergeCount[unitId][mergeId]++

    this._pinToMerge[unitId] = this._pinToMerge[unitId] || {
      input: {},
      output: {},
    }
    this._pinToMerge[unitId][type][pinId] = mergeId

    forEachKeyValue(
      (this._spec[`${type}s`] || {}) as GraphExposedPinsSpec,
      ({ pin }, id) => {
        for (let subPinId in pin) {
          const subPinSpec = pin[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._memUnplugPin(type, id, subPinId)
            this._memPlugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._pinToMerge[unitId] = this._pinToMerge[unitId] || {
      input: {},
      output: {},
    }
    this._pinToMerge[unitId][type][pinId] = mergeId

    this._memSetBranch(mergeId, type, pinNodeId)
  }

  public memRemoveMerge(mergeId: string): void {
    this._memRemoveMerge(mergeId)
  }

  private _memRemoveMerge(mergeId: string): void {
    this.emit('before_remove_merge', mergeId)

    forEachKeyValue(this._spec.inputs || {}, ({ pin }, inputId) => {
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        if (subPinSpec.mergeId === mergeId) {
          this._memUnplugInput(subPinId, inputId)
          break
        }
      }
    })
    forEachKeyValue(this._spec.outputs || {}, ({ pin }, outputId) => {
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        if (subPinSpec.mergeId === mergeId) {
          this._memUnplugOutput(subPinId, outputId)
          break
        }
      }
    })

    const merge = clone(this._spec.merges![mergeId])

    forEachKeyValue(merge, ({ input, output }, unitId) => {
      forEachKeyValue(input || {}, (_, inputId: string) => {
        this._memRemovePinFromMerge(mergeId, unitId, 'input', inputId)
      })
      forEachKeyValue(output || {}, (_, outputId: string) => {
        this._memRemovePinFromMerge(mergeId, unitId, 'output', outputId)
      })
    })

    const selfUnitId = this._mergeToSelfUnit[mergeId]
    if (selfUnitId) {
      delete this._mergeToSelfUnit[mergeId]
      delete this._selfUniToMerge[selfUnitId]
    }

    delete this._merge[mergeId]

    delete this._mergePinCount[mergeId]

    // @ts-ignore
    this._spec = removeMerge({ id: mergeId }, this._spec)
  }

  public isUnitRefPin(unitId: string, type: IO, name: string): boolean {
    const unit = this.refUnit(unitId)
    const isRefPin = unit.hasRefPinNamed(type, name)
    return isRefPin
  }

  public isUnitRefInput(unitId: string, name: string): boolean {
    const unit = this.refUnit(unitId)
    const isRefPin = unit.hasRefInputNamed(name)
    return isRefPin
  }

  public addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void => {
    this._addPinToMerge(mergeId, unitId, type, pinId)

    this.emit('add_pin_to_merge', mergeId, unitId, type, pinId)
  }

  private _addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void => {
    // console.log('Graph', '_addPinToMerge', mergeId, unitId, type, pinId)

    this._validateMergeId(mergeId)
    this._validateUnitId(unitId)

    if (type === 'output' && pinId === SELF) {
      this._mergeToSelfUnit[mergeId] = unitId
      this._selfUniToMerge[unitId] = mergeId
    }

    this._spec = addPinToMerge({ id: mergeId, unitId, type, pinId }, this._spec)

    this._mergePinCount[mergeId] = this._mergePinCount[mergeId] || 0
    this._mergePinCount[mergeId]++

    this._unitToMerge[unitId] = this._unitToMerge[unitId] || new Set()
    this._unitToMerge[unitId].add(mergeId)

    this._unitToMergeCount[unitId] = this._unitToMergeCount[unitId] || {}
    this._unitToMergeCount[unitId][mergeId] =
      this._unitToMergeCount[unitId][mergeId] || 0
    this._unitToMergeCount[unitId][mergeId]++

    forEachKeyValue(
      (this._spec[`${type}s`] || {}) as GraphExposedPinsSpec,
      ({ pin }, id) => {
        for (let subPinId in pin) {
          const subPinSpec = pin[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._unplugPin(type, id, subPinId)
            this._plugPin(type, id, subPinId, { mergeId })
          }
        }
      }
    )

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._pinToMerge[unitId] = this._pinToMerge[unitId] || {
      input: {},
      output: {},
    }
    this._pinToMerge[unitId][type][pinId] = mergeId

    this._setBranch(mergeId, type, pinNodeId)
  }

  public removeMerge(mergeId: string) {
    // console.log('Graph', 'removeMerge', mergeId)
    this._removeMerge(mergeId)

    this.emit('remove_merge', mergeId)
  }

  public _removeMerge(mergeId: string) {
    // console.log('Graph', 'removeMerge', mergeId)
    this._validateMergeId(mergeId)

    this._simRemoveMerge(mergeId)
    this._memRemoveMerge(mergeId)
  }

  private _simRemoveMerge(mergeId: string) {
    // console.log('Graph', '_simRemoveMerge', mergeId)

    forEachKeyValue(this._spec.inputs || {}, ({ pin }, inputId) => {
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        if (subPinSpec.mergeId === mergeId) {
          this._simUnplugInput(subPinId, inputId)
          break
        }
      }
    })
    forEachKeyValue(this._spec.outputs || {}, ({ pin }, outputId) => {
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        if (subPinSpec.mergeId === mergeId) {
          this._simUnplugOutput(subPinId, outputId)
          break
        }
      }
    })

    const merge = clone(this._spec.merges![mergeId])

    forEachKeyValue(merge, ({ input, output }, unitId) => {
      forEachKeyValue(input || {}, (_, inputId: string) => {
        this._simRemovePinFromMerge(mergeId, unitId, 'input', inputId)
      })
      forEachKeyValue(output || {}, (_, outputId: string) => {
        this._simRemovePinFromMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  public removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ) {
    this._removePinFromMerge(mergeId, unitId, type, pinId, false)

    this.emit('remove_pin_from_merge', mergeId, unitId, type, pinId)
  }

  public _removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    take: boolean = true
  ) {
    this._validateMergeId(mergeId)
    this._validateUnitId(unitId)

    this._simRemovePinFromMerge(mergeId, unitId, type, pinId, take)
    this._memRemovePinFromMerge(mergeId, unitId, type, pinId)
  }

  private _memRemovePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
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

    this._spec = _removePinFromMerge(
      { id: mergeId, unitId, type, pinId },
      this._spec
    )

    this._mergePinCount[mergeId]--

    this._unitToMergeCount[unitId][mergeId]--
    if (this._unitToMergeCount[unitId][mergeId] === 0) {
      delete this._unitToMergeCount[unitId][mergeId]
      this._unitToMerge[unitId].delete(mergeId)
    }

    if (this._pinToMerge[unitId]) {
      delete this._pinToMerge[unitId][type][pinId]
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

          forEachKeyValue(merge.getOutputs(), (pin, name): void => {
            merge.takeOutput(name)
          })
        }
      }
    }
  }

  public mergeMerges(mergeIds: string[]) {
    this._mergeMerges(mergeIds)

    this.emit('merge_merges', mergeIds)
  }

  private _mergeMerges(mergeIds: string[]) {
    const firstMergeId = mergeIds[0]
    forEach(mergeIds.splice(1), (mergeId) => {
      const mergeSpec = clone(this._spec.merges![mergeId])
      forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
        this._removePinFromMerge(mergeId, unitId, type, pinId)
        this._addPinToMerge(firstMergeId, unitId, type, pinId)
      })
    })
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
      merges[mergeId][unitId][type]![pinId]
    )
  }

  public togglePinMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ) {
    if (this.isPinMergedTo(mergeId, unitId, type, pinId)) {
      this.removePinFromMerge(mergeId, unitId, type, pinId)
    } else {
      this.addPinToMerge(mergeId, unitId, type, pinId)
    }
  }

  public setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean
  ) {
    if (type === 'input') {
      this.setUnitInputConstant(unitId, pinId, constant)
    } else {
      this.setUnitOutputConstant(unitId, pinId, constant)
    }
  }

  public setUnitInputConstant(
    unitId: string,
    pinId: string,
    constant: boolean
  ) {
    this._spec = setUnitInputConstant({ unitId, pinId, constant }, this._spec)

    const unit = this.refUnit(unitId)
    unit.setInputConstant(pinId, constant)
  }

  public setUnitOutputConstant(
    unitId: string,
    pinId: string,
    constant: boolean
  ) {
    this._spec = setUnitOutputConstant({ unitId, pinId, constant }, this._spec)

    const unit = this.refUnit(unitId)
    unit.setOutputConstant(pinId, constant)
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
    const unit = this.refUnit(unitId)

    if (ignored) {
      forEachPinOnMerges(
        this._spec.merges!,
        (mergeId, _unitId, _type, _pinId) => {
          if (_unitId === unitId && _type === type && _pinId === pinId) {
            this._removePinFromMerge(mergeId, unitId, type, pinId)
          }
        }
      )

      forEachKeyValue(this._spec.outputs, ({ pin }, id) => {
        for (let subPinId in pin) {
          const subPinSpec = pin[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._unplugPin(type, id, subPinId)
            break
          }
        }
      })
    }

    unit.setPinIgnored(type, pinId, ignored)
  }

  public setUnitPinData(unitId: string, type: IO, pinId: string, data: any) {
    const unit = this.refUnit(unitId)
    unit.setPinData(type, pinId, data)
  }

  public setUnitInputData(unitId: string, pinId: string, data: any): void {
    const unit = this.refUnit(unitId)
    unit.setPinData('input', pinId, data)
  }

  public setUnitOutputData(unitId: string, pinId: string, data: any): void {
    const unit = this.refUnit(unitId)
    unit.setPinData('output', pinId, data)
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
    this.emit('metadata', { path, data })
  }

  public appendParentRoot(
    subComponentId: string,
    childId: string,
    slotName: string
  ): void {
    this._subComponentAppendChild(subComponentId, childId, slotName)

    this.emit('sub_component_append_child', subComponentId, childId, slotName)
  }

  public appendParentRootChildren(
    subComponentId: string,
    children: string[],
    slotMap: Dict<string>
  ): void {
    for (const childId of children) {
      const slotName = slotMap[childId] || 'default'

      this._subComponentAppendChild(subComponentId, childId, slotName)
    }

    this.emit(
      'sub_component_append_children',
      subComponentId,
      children,
      slotMap
    )
  }

  public appendRoot(subComponentId: string): void {
    this._componentAppend(subComponentId)

    this.emit('append_root', subComponentId)
  }

  public removeRoot(subComponentId: string): void {
    this._removeRoot(subComponentId)
  }

  private _removeRoot(subComponentId: string): void {
    this._simRemoveRoot(subComponentId)
    this._memRemoveRoot(subComponentId)
  }

  public memRemoveRoot(subComponentId: string): void {
    this._memRemoveRoot(subComponentId)
  }

  private _memRemoveRoot(subComponentId: string): void {
    const index = this._spec.component.children.indexOf(subComponentId)
    if (index > -1) {
      this._spec.component.children.splice(index, 1)

      // AD HOC
      if (!this._spec.component.children.length) {
        delete this._spec.component
      }
    } else {
      throw new Error('Root not found')
    }
  }

  private _simRemoveRoot(subComponentId: string): void {
    //
  }

  public moveSubgraphInto(
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
    nextSubComponentParent: Dict<string | null>,
    nextSubComponentChildrenMap: Dict<string[]>
  ): void {
    this._moveSubgraphInto(
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextSubComponentParent,
      nextSubComponentChildrenMap
    )

    this.emit(
      'move_sugraph_into',
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextSubComponentParent,
      nextSubComponentChildrenMap
    )
  }

  private _moveSubgraphInto(
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
  ): void {
    const { merge, link, unit } = nodeIds

    const unitIgnoredPin: Dict<{ input: Set<string>; output: Set<string> }> = {}

    for (const { unitId, type, pinId } of link) {
      unitIgnoredPin[unitId] = unitIgnoredPin[unitId] || {
        input: new Set(),
        output: new Set(),
      }
      unitIgnoredPin[unitId][type].add(pinId)
    }

    const merges: GraphMergesSpec = {}

    for (const mergeId of merge) {
      const merge = this.getMergeSpec(mergeId)

      merges[mergeId] = merge

      forEachPinOnMerge(merge, (unitId, type, pinId) => {
        unitIgnoredPin[unitId] = unitIgnoredPin[unitId] || {
          input: new Set(),
          output: new Set(),
        }
        unitIgnoredPin[unitId][type].add(pinId)
      })
    }

    for (const unitId of unit) {
      const nextUnitId = nextIdMap.unit[unitId] || unitId
      const nextUnitSubComponentParent =
        nextSubComponentParentMap[unitId] || null
      const nextSubComponentChildren = nextSubComponentChildrenMap[unitId] || []

      const ignoredPins = unitIgnoredPin[unitId] || {
        input: new Set(),
        output: new Set(),
      }
      const unitPinIdMap = nextPinIdMap[unitId] || { input: {}, output: {} }

      const ignoredMerges = new Set<string>()

      this._moveUnitInto(
        graphId,
        unitId,
        nextUnitId,
        ignoredPins,
        ignoredMerges,
        unitPinIdMap,
        nextUnitSubComponentParent,
        nextSubComponentChildren
      )
    }

    for (const { unitId, type, pinId } of link) {
      const { mergeId, oppositePinId } = nextIdMap.link[unitId][type][pinId]

      this._moveLinkPinInto(
        graphId,
        unitId,
        type,
        pinId,
        mergeId,
        oppositePinId
      )
    }

    for (const mergeId of merge) {
      const { nextInputMergePinId, nextOutputMergePinId } =
        nextMergePinId[mergeId] || {}

      const mergeSpec = merges[mergeId]

      const unitIgnored = new Set<string>(unit)

      this._moveMergeInto(
        graphId,
        mergeId,
        mergeSpec,
        nextInputMergePinId,
        nextOutputMergePinId,
        nextPinIdMap,
        unitIgnored,
        unitIgnoredPin
      )
    }
  }

  public moveUnitInto(
    graphId: string,
    unitId: string,
    nextUnitId: string,
    ignoredPin: { input: Set<string>; output: Set<string> },
    ignoredMerge: Set<string>,
    nextPinMap: {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    },
    nextUnitSubComponentParent: string | null,
    nextSubComponentChildren: string[]
  ): void {
    this._moveUnitInto(
      graphId,
      unitId,
      nextUnitId,
      ignoredPin,
      ignoredMerge,
      nextPinMap,
      nextUnitSubComponentParent,
      nextSubComponentChildren
    )

    this.emit(
      'move_unit_into',
      graphId,
      unitId,
      nextUnitId,
      ignoredPin,
      ignoredMerge,
      nextPinMap,
      nextUnitSubComponentParent,
      nextSubComponentChildren
    )
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

  private _moveUnitInto(
    graphId: string,
    unitId: string,
    nextUnitId: string,
    ignoredPin: { input: Set<string>; output: Set<string> },
    ignoredMerge: Set<string>,
    pinIdMap: {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    },
    nextSubComponentParent: string | null,
    nextSubComponentChildren: string[]
  ): void {
    // console.log('Graph', '_moveUnitInto', graphId, unitId, nextUnitId)

    const graph = this.refUnit(graphId) as Graph

    const unitSpec = this._spec.units[unitId]

    const unit = this.refUnit(unitId)

    graph.memAddUnit(nextUnitId, unitSpec, unit)

    if (nextSubComponentParent) {
      if (graph.hasUnit(nextSubComponentParent)) {
        graph.removeRoot(nextUnitId)
        graph.appendParentRoot(nextSubComponentParent, nextUnitId, 'default')
      }
    }

    if (nextSubComponentChildren) {
      for (const nextSubComponentChildId of nextSubComponentChildren) {
        if (graph.hasUnit(nextSubComponentChildId)) {
          graph.removeRoot(nextSubComponentChildId)
          graph.appendParentRoot(nextUnitId, nextSubComponentChildId, 'default')
        }
      }
    }

    const movePinInto = (type: IO, pinId: string): void => {
      if (!ignoredPin[type].has(pinId) && !unit.isPinIgnored(type, pinId)) {
        const { pinId: nextPinId, subPinId: nextSubPinId } =
          pinIdMap[type][pinId]

        const mergeId =
          this._pinToMerge[unitId] &&
          this._pinToMerge[unitId][type] &&
          this._pinToMerge[unitId][type][pinId]

        const swapMergePin = mergeId && !ignoredMerge.has(mergeId)

        if (swapMergePin) {
          this._removePinFromMerge(mergeId, unitId, type, pinId, false)
        }

        if (graph.hasPinNamed(type, nextPinId)) {
          graph.memExposePin(type, nextPinId, nextSubPinId, {
            unitId: nextUnitId,
            pinId,
          })
        } else {
          const unitPin = unit.getPin(type, pinId)

          const unitPinData = unitPin.peak()

          const unitPinRef = unit.hasRefPinNamed(type, pinId)

          const oppositeType = oppositePinKind(type)

          const nextUnitPinNodeId = getPinNodeId(nextUnitId, type, pinId)

          const nextExposedPin = new Pin({ data: unitPinData })
          const nextExposedMerge = new Merge(this.__system, this.__pod)

          nextExposedMerge.play()

          nextExposedMerge.setPin(pinId, type, nextExposedPin)
          nextExposedMerge.setPin(nextUnitPinNodeId, oppositeType, unitPin)

          graph.memExposePinSet(
            type,
            nextPinId,
            {
              pin: {
                '0': {
                  unitId: nextUnitId,
                  pinId,
                },
              },
            },
            nextExposedPin,
            nextExposedMerge
          )

          const ref = unitPinRef

          graph.setPin(nextPinId, type, nextExposedPin, { ref })

          if (swapMergePin) {
            this._addPinToMerge(mergeId, graphId, type, nextPinId)
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

    this._memRemoveUnit(unitId)
  }

  public moveLinkPinInto(
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    mergeId: string | null = null,
    oppositePinId: string | null = null,
    emit: boolean = true
  ): void {
    // console.log('Graph', 'moveLinkPinInto')
    this._moveLinkPinInto(graphId, unitId, type, pinId, mergeId, oppositePinId)

    emit &&
      this.emit(
        'move_link_pin_into',
        graphId,
        unitId,
        type,
        pinId,
        mergeId,
        oppositePinId
      )
  }

  private _moveLinkPinInto(
    graphId: string,
    unitId: string,
    type: IO,
    pinId: string,
    mergeId: string | null,
    oppositePinId: string | null
  ): void {
    // console.log('Graph', '_moveLinkPinInto')

    const graph = this.refUnit(graphId) as Graph

    if (graphId === unitId) {
      graph.coverPinSet(type, pinId, false)
    } else {
      if (mergeId && oppositePinId) {
        const oppositeType = oppositePinKind(type)

        if (this.hasMerge(mergeId)) {
          this._addPinToMerge(mergeId, unitId, type, pinId)
        } else {
          graph.exposePinSet(
            oppositeType,
            oppositePinId,
            { pin: { '0': {} } },
            false
          )

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

          this._addMerge(merge, mergeId)
        }
      }
    }
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
    const mergeSpec = this.getMergeSpec(mergeId)

    this._moveMergeInto(
      graphId,
      mergeId,
      mergeSpec,
      nextInputMergeId,
      nextOutputMergeId,
      nextPinIdMap
    )

    this.emit(
      'move_merge_into',
      graphId,
      mergeId,
      nextInputMergeId,
      nextOutputMergeId,
      nextPinIdMap
    )
  }

  private _moveMergeInto(
    graphId: string,
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    nextInputMergeId: string | null,
    nextOutputMergeId: string | null,
    nextPinIdMap: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>,
    unitIgnored: Set<string> = new Set(),
    unitIgnoredPin: Dict<{ input: Set<string>; output: Set<string> }> = {}
  ): void {
    // console.log('Graph', '_moveMergeInto', graphId, mergeId)

    const graph = this.refGraph(graphId)
    const merge = this.refMerge(mergeId)

    if (this.hasMerge(mergeId)) {
      this._removeMerge(mergeId)
    }

    let pinIntoCount: number = 0

    const moveLinkPinInto = (unitId: string, type: IO, pinId: string): void => {
      if (unitIgnored.has(unitId)) {
        pinIntoCount++
      }

      if (unitIgnoredPin[unitId] && unitIgnoredPin[unitId][type].has(pinId)) {
        return
      }

      const unitNextPinId = nextPinIdMap[unitId] || {}

      const unitNextPin = unitNextPinId[type] && unitNextPinId[type][pinId]

      if (unitNextPin) {
        const { pinId: nextPinId, subPinId: nextSubPinId } =
          unitNextPinId[type][pinId]

        const isInput = type === 'input'

        const nextMergeId = isInput ? nextInputMergeId : nextOutputMergeId

        this._moveLinkPinInto(
          graphId,
          unitId,
          type,
          pinId,
          nextMergeId,
          nextPinId
        )
      }
    }

    forEachPinOnMerge(mergeSpec, moveLinkPinInto)

    if (pinIntoCount > 1) {
      graph.addMerge(mergeSpec, mergeId, false)
    } else {
      // TODO
      // AD HOC
      // add identity
    }
  }

  public explodeUnit(
    graphId: string,
    mapUnitId: Dict<string>,
    mapMergeId: Dict<string>
  ): void {
    // console.log('Graph', 'explodeUnit', graphId, mapUnitId, mapMergeId)

    this._explodeUnit(graphId, mapUnitId, mapMergeId)

    this.emit('explode_unit', graphId, mapUnitId, mapMergeId)
  }

  public _explodeUnit(
    graphId: string,
    mapUnitId: Dict<string>,
    mapMergeId: Dict<string>
  ): void {
    // console.log('Graph', '_explodeUnit', graphId, mapUnitId, mapMergeId)

    const graph = this.refUnit(graphId) as Graph

    const units = { ...graph.refUnits() }

    for (const unitId in units) {
      const newUnitId = mapUnitId[unitId] || unitId

      const unit = graph.refUnit(unitId)
      const unitSpec = graph.getUnitSpec(unitId)

      graph.memRemoveUnit(unitId)

      this._memAddUnit(newUnitId, unitSpec, unit)
    }

    const merges = { ...graph.refMerges() }

    for (const mergeId in merges) {
      const newMergeId = mapMergeId[mergeId] || mergeId

      const merge = graph.refMerge(mergeId)
      const mergeSpec = graph.getMergeSpec(mergeId)

      graph.memRemoveMerge(mergeId)

      const mergeInputPinId = getMergePinNodeId(mergeId, 'input')
      const newMergeInputPinId = getMergePinNodeId(newMergeId, 'input')

      merge.renameInput(mergeInputPinId, newMergeInputPinId)

      this._memAddMerge(newMergeId, mergeSpec, merge)
    }

    this._simRemoveUnit(graphId)
    this._memRemoveUnit(graphId)
  }

  setupComponent(component: GraphComponentSpec): void {
    const { slots = [], subComponents = {}, children = [] } = component

    for (const subComponentId in subComponents) {
      const subComponent = subComponents[subComponentId]
      this.setupSubComponent(subComponentId, subComponent)
    }

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]
      const [unitId, slotName] = slot
      const slotUnit = this.refUnit(unitId) as Element | Graph
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

  setupSubComponent(
    subComponentId: string,
    subComponent: GraphSubComponentSpec
  ): void {
    const { children = [], childSlot = {} } = subComponent
    for (const childId of children) {
      // AD HOC
      // should get parent from memory
      this.componentRemove(childId)

      const slot = childSlot[childId] || 'default'
      this._subComponentAppendChild(subComponentId, childId, slot)
    }
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

  appendChild(Class: UnitClass): number {
    return appendChild(this, this._children, Class)
  }

  pushChild(Class: UnitClass): number {
    return pushChild(this, this._children, Class)
  }

  pullChild(at: number): UnitClass {
    throw pullChild(this, this._children, at)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): UnitClass {
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

  refEmitter(): EE {
    return this._emitter
  }
}
