import callAll from '../../callAll'
import { Callback } from '../../Callback'
import { Component } from '../../client/component'
import { listenGlobalComponent } from '../../client/globalComponent'
import {
  appendChild,
  child,
  children,
  hasChild,
  pullChild,
  pushChild,
  removeChild,
} from '../../component/component'
import { SELF } from '../../constant/SELF'
import { UNTITLED } from '../../constant/STRING'
import { GraphState } from '../../GraphState'
import { C } from '../../interface/C'
import { G } from '../../interface/G'
import { U } from '../../interface/U'
import { V } from '../../interface/V'
import Merge from '../../Merge'
import { ObjectSource } from '../../ObjectSource'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
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
  GraphSubComponentSpec,
  GraphUnitSpec,
  UnitsSpec,
} from '../../types'
import { Dict } from '../../types/Dict'
import { UnitClass } from '../../types/UnitClass'
import { Units } from '../../Units'
import { Unlisten } from '../../Unlisten'
import { forEach } from '../../util/array'
import { clone, filterObj, mapObj, someObj } from '../../util/object'
import { objPromise } from '../../util/promise'
import { WaitAll } from '../../WaitAll'
import { Element } from '../Element/Element'
import { Stateful } from '../Stateful'
import { Unit } from '../Unit'
import { Config } from '../Unit/Config'

export class UnitNotFoundError extends Error {
  constructor() {
    super('unit not found')
  }
}

export class MergeNotFoundError extends Error {
  constructor() {
    super('merge not found')
  }
}

export function hasState(unit: U): boolean {
  return unit instanceof Stateful || (unit instanceof Graph && unit.stateful)
}

export function hasElement(unit: U): boolean {
  return unit instanceof Element || (unit instanceof Graph && unit.element)
}

export class Graph<I = any, O = any> extends Primitive implements G, C, U {
  _ = ['U', 'C', 'G']

  public stateful = false

  public element = false

  private _spec: GraphSpec

  private _unit: Units = {}

  private _merge: { [mergeId: string]: Merge<any> } = {}

  private _pipedFrom: {
    [output: string]: string
  } = {}

  private _pipedTo: {
    [input: string]: string
  } = {}

  private _errUnitIds: string[] = []

  private _pin: {
    [id: string]: Pin<any>
  } = {}
  private _unitPins: {
    [id: string]: Pin<any>
  } = {}

  private _exposedPin: Dict<Pin<any>> = {}
  private _exposedMerge: Dict<Merge<any>> = {}
  private _exposedEmptySubPin: Dict<Pin<any>> = {}

  private _unit_err_count: Dict<number> = {}

  private _mergeToSelfUnit: Dict<string> = {}
  private _selfUniToMerge: Dict<string> = {}

  private _pinToMerge: Dict<{ input: Dict<string>; output: Dict<string> }> = {}

  private _branch: Dict<true> = {}

  private _statefulUnitCount: number = 0
  private _elementUnitCount: number = 0

  protected _component_source: ObjectSource<Component> = new ObjectSource()

  private _mergePinCount: Dict<number> = {}

  private _unitToMerge: Dict<Set<string>> = {}
  private _unitToMergeCount: Dict<Dict<number>> = {}

  constructor(
    graph: GraphSpec = {
      name: UNTITLED,
      inputs: {},
      outputs: {},
      units: {},
      merges: {},
      component: {},
    },
    config: Config = {},
    branch: Dict<true> = {}
  ) {
    super(
      {
        i: [],
        o: [],
      },
      { ...config, paused: true, state: {} }
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

    const waitAll = new WaitAll()
    forEach(f_input_names, (name) => {
      const pin = new Pin<any>()
      waitAll.addInput(name, pin)
      const _pin = this.getExposedInputPin(name)
      waitAll.setOutput(name, _pin)
      this.setInput(name, pin, {})
    })

    const { state = {} } = config

    this.setGraphState(state)

    const { globalId } = this

    listenGlobalComponent(globalId, (component) => {
      this._component_source.set(component)
    })
  }

  pushChild(Class: UnitClass): number {
    return pushChild(this, this._children, Class)
  }

  pullChild(at: number): UnitClass {
    throw pullChild(this, this._children, at)
  }

  private _getExposedSubPinNodeId = (
    type: 'input' | 'output',
    pin: GraphExposedSubPinSpec
  ): string => {
    const { unitId, pinId, mergeId } = pin
    if (mergeId) {
      return getMergePinNodeId(mergeId, type)
    } else {
      return getPinNodeId(unitId!, type, pinId!)
    }
  }

  private _set_branch(
    mergeId: string,
    type: 'input' | 'output',
    pinNodeId: string
  ) {
    const merge = this._merge[mergeId]
    if (type === 'input') {
      this._pipedTo[pinNodeId] = mergeId
      const input = this._pin[pinNodeId]
      merge.setOutput(pinNodeId, input)
    } else {
      this._pipedFrom[pinNodeId] = mergeId
      const output = this._pin[pinNodeId]
      this._merge[mergeId].setInput(pinNodeId, output)
    }
  }

  private _memRemoveBranch(
    mergeId: string,
    type: 'input' | 'output',
    pinNodeId: string
  ): void {
    if (type === 'input') {
      delete this._pipedTo[pinNodeId]
    } else {
      delete this._pipedFrom[pinNodeId]
    }
  }

  private _simRemoveBranch(
    mergeId: string,
    type: 'input' | 'output',
    pinNodeId: string
  ): void {
    if (type === 'input') {
      this._merge[mergeId].removeOutput(pinNodeId)
    } else {
      this._merge[mergeId].removeInput(pinNodeId)
    }
  }

  private _removeBranch(
    mergeId: string,
    type: 'input' | 'output',
    pinNodeId: string
  ): void {
    this._simRemoveBranch(mergeId, type, pinNodeId)
    this._memRemoveBranch(mergeId, type, pinNodeId)
  }

  private _ensureMergePin = (
    type: 'input' | 'output',
    mergeId: string
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    if (!this._pin[mergePinNodeId]) {
      const oppositeType = oppositePinKind(type)
      const mergePin = new Pin<any>()
      this._pin[mergePinNodeId] = mergePin
      this._set_branch(mergeId, oppositeType, mergePinNodeId)
    }
  }

  private _removeMergeOutput = (mergeId: string): void => {
    this.simRemoveMergeOutput(mergeId)
    this.memRemoveMergeOutput(mergeId)
  }

  private memRemoveMergeOutput = (mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, 'output')
    if (this._pin[mergePinNodeId]) {
      this._memRemoveBranch(mergeId, 'input', mergePinNodeId)
      delete this._pin[mergePinNodeId]
    }
  }

  private simRemoveMergeOutput = (mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, 'output')
    if (this._pin[mergePinNodeId]) {
      this._simRemoveBranch(mergeId, 'input', mergePinNodeId)
    }
  }

  private _plugPinToMerge = (
    type: 'input' | 'output',
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

  private _plugPinToUnitPin = (
    type: 'input' | 'output',
    name: string,
    subPinId: string,
    unitId: string,
    pinId: string,
    opt: PinOpt
  ): void => {
    const subPin = this.getUnitPin(unitId, type, pinId)
    this.setExposedSubPin(type, name, subPinId, subPin, opt)
  }

  private setExposedSubPin(
    type: 'input' | 'output',
    name: string,
    subPinId: string,
    subPin: Pin<any>,
    opt: PinOpt
  ) {
    this._setExposedSubPin(type, name, subPinId, subPin, opt)
    this.emit('set_exposed_sub_pin', type, name, subPinId, subPin)
  }

  private _setExposedSubPin(
    type: 'input' | 'output',
    name: string,
    subPinId: string,
    subPin: Pin<any>,
    opt: PinOpt
  ) {
    const oppositeType = oppositePinKind(type)
    const exposedPinId = getExposedPinId(name, type)
    const exposedMerge = this._exposedMerge[exposedPinId]
    exposedMerge.setPin(subPinId, oppositeType, subPin, opt)
  }

  private _memSetExposedSubPin(
    type: 'input' | 'output',
    name: string,
    subPinId: string,
    subPin: Pin<any>
  ) {
    // TODO
  }

  private _simSetExposedSubPin(
    type: 'input' | 'output',
    name: string,
    subPinId: string,
    subPin: Pin<any>
  ) {
    const oppositeType = oppositePinKind(type)
    const exposedPinId = getExposedPinId(name, type)
    const exposedMerge = this._exposedMerge[exposedPinId]
    exposedMerge.setPin(subPinId, oppositeType, subPin)
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

  private _reset = () => {
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
    this.emit('statefull')
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

  public getUnitSpec(id: string): GraphUnitSpec {
    return this._spec.units[id]
  }

  public refUnits = (): Units => {
    return this._unit
  }

  public refMergePin = (
    mergeId: string,
    type: 'input' | 'output'
  ): Pin<any> => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)
    return this._pin[mergePinNodeId]
  }

  public exposeOutputSets = (outputs: GraphExposedPinsSpec): void => {
    forEachKeyValue(outputs, this.exposeOutputSet)
  }

  private _exposeOutputSets = (outputs: GraphExposedPinsSpec): void => {
    forEachKeyValue(outputs, this._exposeOutputSet)
  }

  public exposeOutputSet = (input: GraphExposedPinSpec, id: string): void => {
    this.exposePinSet('output', id, input)
  }

  private _exposeOutputSet = (input: GraphExposedPinSpec, id: string): void => {
    this._exposePinSet('output', id, input)
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
    type: 'input' | 'output',
    pinId: string,
    pinSpec: GraphExposedPinSpec,
    emit: boolean = true
  ): void => {
    this._exposePinSet(type, pinId, pinSpec)

    emit && this.emit('expose_pin_set', type, pinId, pinSpec)
  }

  public _exposePinSet = (
    type: 'input' | 'output',
    pinId: string,
    pinSpec: GraphExposedPinSpec
  ): void => {
    this._spec[`${type}s`] = this._spec[`${type}s`] || {}
    this._spec[`${type}s`][pinId] = clone(pinSpec)

    const { pin, ref } = pinSpec

    const exposedNodeId = getExposedPinId(pinId, type)

    const exposedPin = new Pin<any>()
    this._exposedPin[exposedNodeId] = exposedPin

    const exposedMerge = new Merge()
    this._exposedMerge[exposedNodeId] = exposedMerge
    exposedMerge.setPin(pinId, type, exposedPin)

    forEachKeyValue(
      pin,
      (subPinSpec: GraphExposedSubPinSpec, subPinId: string) => {
        this._exposePin(type, pinId, subPinId, subPinSpec)
      }
    )

    this.setPin(pinId, type, exposedPin, { ref })
  }

  public setPinSetFunctional(
    type: 'input' | 'output',
    name: string,
    functional: boolean
  ): void {
    // TODO
  }

  public exposePin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec,
    emit: boolean = true
  ): void => {
    this._exposePin(type, pinId, subPinId, subPinSpec)

    emit && this.emit('expose_pin', type, pinId, subPinId, subPinSpec)
  }

  private _exposePin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    const { unitId, pinId: _pinId, mergeId } = subPinSpec
    if (mergeId || (unitId && _pinId)) {
      this.plugPin(type, pinId, subPinId, subPinSpec)
    } else {
      this._memPlugPin(type, pinId, subPinId, subPinSpec)
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

  public coverPinSet = (type: 'input' | 'output', id: string): void => {
    this._coverPinSet(type, id)
    this.emit('cover_pin_set', type, id)
  }

  private _coverPinSet = (type: 'input' | 'output', id: string): void => {
    // TODO
    delete this._spec[`${type}s`][id]
    this.removePin(id, type)
  }

  private _memPlugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    this._spec[`${type}s`] = this._spec[`${type}s`] || {}
    this._spec[`${type}s`][pinId] = this._spec[`${type}s`][pinId] || {}
    this._spec[`${type}s`][pinId].pin = this._spec[`${type}s`][pinId].pin || {}
    this._spec[`${type}s`][pinId].pin[subPinId] = subPinSpec
  }

  public plugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', 'plugPin', pinId, subPinId, subPinSpec)
    this._plugPin(type, pinId, subPinId, subPinSpec)
    this.emit('plug_pin', type, pinId, subPinId, subPinSpec)
  }

  private _plugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string,
    subPinSpec: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', '_plugPin', pinId, subPinId, subPinSpec)
    const { mergeId, unitId, pinId: _pinId } = subPinSpec

    // RETURN
    // if (_pinId === SELF) {
    //   this.setOutputOpt(name, { ref: true })
    //   this._spec[`${type}s`][pinId].ref = true
    // }

    const pinSpec = this.getExposedPinSpec(pinId, type)

    this._memPlugPin(type, pinId, subPinId, subPinSpec)

    const { ref } = pinSpec

    const opt = { ref: !!ref }

    if (mergeId) {
      this._plugPinToMerge(type, pinId, subPinId, mergeId, opt)
    } else {
      this._plugPinToUnitPin(type, pinId, subPinId, unitId!, _pinId!, opt)
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
    type: 'input' | 'output',
    id: string,
    subPinId: string
  ): void => {
    this._coverPin(type, id, subPinId)
    this.emit('cover_pin', type, id, subPinId)
  }

  private _coverPin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string
  ): void => {
    const pinSpec = this._spec[`${type}s`][id] as GraphExposedPinSpec
    const subPinSpec = pinSpec['pin'][subPinId] as GraphExposedSubPinSpec

    const { mergeId } = subPinSpec

    if (mergeId && type === 'output') {
      this._removeMergeOutput(mergeId)
    }

    delete pinSpec['pin'][subPinId]
  }

  public getSubPinSpec = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string
  ): GraphExposedSubPinSpec => {
    return this._spec[`${type}s`][pinId]['pin'][subPinId]
  }

  public unplugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string
  ): void => {
    // console.log('Graph', 'unplugPin', pinId, subPinId)
    this._unplugPin(type, pinId, subPinId)

    this.emit('unplug_pin', type, pinId, subPinId)
  }

  private _unplugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string
  ): void => {
    // console.log('Graph', 'unplugPin', pinId, subPinId)
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._spec[`${type}s`][pinId].pin[subPinId] = {}

    const exposedPinId = getExposedPinId(pinId, type)
    const exposedMerge = this._exposedMerge[exposedPinId]

    const isOutput = type === 'output'

    if (isOutput) {
      const { mergeId } = subPinSpec
      
      if (mergeId) {
        this._removeMergeOutput(mergeId)
      }
  
      if (this.hasRefOutputNamed(pinId)) {
        console.log('AHA')
        this.takeOutput(pinId)
      }
    }

    

    const emptySubPinId = `${pinId}/${subPinId}`
    const emptySubPin = new Pin()
    this._exposedEmptySubPin[emptySubPinId] = emptySubPin

    this._setExposedSubPin(type, pinId, subPinId, emptySubPin, {})
  }

  private _memUnplugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string
  ): void => {
    // TODO
  }

  private _simUnplugPin = (
    type: 'input' | 'output',
    pinId: string,
    subPinId: string
  ): void => {
    // TODO
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

  public getExposedPinSpec(
    pinId: string,
    type: 'input' | 'output'
  ): GraphExposedPinSpec {
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

  public refUnit(id: string): U<any, any> {
    if (!this._unit[id]) {
      throw new Error(`cannot find unit with id ${id}`)
    }
    return this._unit[id]
  }

  public getUnitByPath(path: string[]): U<any, any> {
    let unit: U<any, any> = this
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

    const state_p = mapObj(_stateful_unit, (unit) => {
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
        const unit_children = (unit as C).children()
        if (unit_children !== undefined) {
          children[unitId] = unit_children
        }
      }
    }
    return children
  }

  public getUnitPin(
    id: string,
    type: 'input' | 'output',
    pinId: string
  ): Pin<any> {
    return this.refUnit(id).getPin(type, pinId)
  }

  getUnitPinData(id: string, type: 'input' | 'output', pinId: string) {
    throw new Error('Method not implemented.')
  }

  public getUnitInput(id: string, pinId: string): Pin<any> {
    return this.refUnit(id).getInput(pinId)
  }

  public getUnitOutput(id: string, pinId: string): Pin<any> {
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

  public refMerges(): { [id: string]: Merge<any> } {
    return this._merge
  }

  public refMerge(mergeId: string): Merge<any> {
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

  public addUnits = (units: UnitsSpec): void => {
    forEachKeyValue(units, this.addUnit.bind(this))
  }

  private _addUnits = (units: UnitsSpec): void => {
    forEachKeyValue(units, this._addUnit.bind(this))
  }

  private injectSubComponent = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: C
  ): void => {
    const { children = [] } = unitSpec

    for (const child of children) {
      const { id, state } = child
      const ChildClass = fromId(id, globalThis.__specs)
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
  }

  public removeSubComponent = (unitId: string): void => {
    // console.log('Graph', 'removeSubComponent', unitId)
    this._removeSubComponent(unitId)

    this.emit('remove_sub_component', unitId)
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

  public subComponentAppend = (
    subComponentId: string,
    childId: string,
    slot: string
  ): void => {
    this._subComponentAppend(subComponentId, childId, slot)

    this.emit('sub_component_append', subComponentId, childId)
  }

  private _subComponentAppend = (
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

  public subComponentRemove = (): void => {
    // TODO
  }

  private _unit_unlisten: Dict<Unlisten> = {}

  public addUnit(
    unitSpec: GraphUnitSpec,
    unitId: string,
    unit: U | null = null,
    emit: boolean = true
  ): U {
    // console.log('Graph', 'addUnit', unitSpec, unitId)
    unit = this._addUnit(unitSpec, unitId, unit)

    emit && this.emit('add_unit', unitId, unit)

    emit && this.emit('leaf_add_unit', unit, [unitId])

    if (!this._paused) {
      unit.play()
    }

    return unit
  }

  public _addUnit(
    unitSpec: GraphUnitSpec,
    unitId: string,
    unit: U | null = null
  ): U {
    // console.log('Graph', 'addUnit', unitSpec, unitId)
    if (!unit) {
      unit = unitFromSpec(
        unitSpec,
        { paused: this._paused },
        globalThis.__specs,
        this._branch
      )
    }

    this.memAddUnit(unitId, unitSpec, unit)

    return unit
  }

  public memAddUnit(unitId: string, unitSpec: GraphUnitSpec, unit: U): void {
    if (this._unit[unitId]) {
      throw new Error('duplicated unit id')
    }

    const all_unlisten: Unlisten[] = []

    this._spec.units = this._spec.units || {}

    this._spec.units[unitId] = unitSpec

    this.emit('before_add_unit', unitId, unit)

    forEachKeyValue(unitSpec.input || {}, ({ data }, pinId: string) => {
      const input = unit.getInput(pinId)
      if (data !== undefined) {
        data = evaluate(data)
        input.push(data)
      }
    })

    unit.setParent(this)

    // @ts-ignore
    unit._id = unitId

    this._unit[unitId] = unit

    const set_unit_pin = (type: 'input' | 'output', pinId: string) => {
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

    const remove_unit_pin = (type: 'input' | 'output', pinId: string) => {
      const pinNodeId = getPinNodeId(unitId, type, pinId)

      const mergeId = this._pipedTo[pinNodeId]
      if (mergeId) {
        this.removePinFromMerge(mergeId, unitId, type, pinId)
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

    all_unlisten.push(unit._addListener('set_input', set_unit_input))
    all_unlisten.push(unit._addListener('remove_input', remove_unit_input))

    const outputs = unit.getOutputNames()
    forEach(outputs, set_unit_output)

    all_unlisten.push(unit._addListener('set_output', set_unit_output))
    all_unlisten.push(unit._addListener('remove_output', remove_unit_output))

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

    all_unlisten.push(unit._addListener('err', on_unit_err))

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

    all_unlisten.push(unit._prependListener('take_err', on_unit_err_removed))
    all_unlisten.push(unit._prependListener('catch_err', on_unit_err_removed))

    if (unit instanceof Graph) {
      all_unlisten.push(
        unit._addListener('leaf_add_unit', (unit: Unit, path: string[]) => {
          this.emit('leaf_add_unit', unit, [...path, unitId])
        })
      )

      all_unlisten.push(
        unit._addListener('leaf_remove_unit', (unit: Unit, path: string[]) => {
          this.emit('leaf_remove_unit', unit, [...path, unitId])
        })
      )
    }

    if (unit.hasErr()) {
      on_unit_err(unit.getErr())
    }

    if (unit instanceof Stateful || (unit instanceof Graph && unit.stateful)) {
      all_unlisten.push(
        unit._addListener('leaf_set', ({ name, data, path }) => {
          this.emit('leaf_set', { name, data, path: [unitId, ...path] })
        })
      )

      this._incStatefulCount()
    }

    if (unit instanceof Element || (unit instanceof Graph && unit.element)) {
      this.injectSubComponent(unitId, unitSpec, unit)
    }

    all_unlisten.push(unit._addListener('stateful', this._on_unit_stateful))
    all_unlisten.push(unit._addListener('stateless', this._on_unit_stateless))

    all_unlisten.push(
      unit._addListener('element', () => {
        this._on_unit_element(unitId, unitSpec, unit as any) // TODO
      })
    )
    all_unlisten.push(
      unit._addListener('not_element', () => {
        this._on_unit_not_element(unitId)
      })
    )

    all_unlisten.push(
      unit._addListener('leaf_append_child', ({ id, path }) => {
        this.emit('leaf_append_child', { id, path: [unitId, ...path] })
      })
    )

    all_unlisten.push(
      unit._addListener('leaf_remove_child_at', ({ at, path }) => {
        this.emit('leaf_remove_child_at', { at, path: [unitId, ...path] })
      })
    )

    const unlisten = callAll(all_unlisten)

    this._unit_unlisten[unitId] = unlisten
  }

  public memRemoveUnit(unitId: string): void {
    // TODO
    // remove exposed pins
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
    const fromUnit = this._removeUnit(id)

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
    const merge = this.getMergeSpec(mergeId)
    const mergeUnit = merge[unitId]
    const { input = {}, output = {} } = mergeUnit
    forEachKeyValue(input, (_, inputPinId) => {
      this._removePinFromMerge(mergeId, unitId, 'input', inputPinId)
    })
    forEachKeyValue(output, (_, outputPinId) => {
      this._removePinFromMerge(mergeId, unitId, 'output', outputPinId)
    })
  }

  private _removeUnit(unitId: string): U {
    const unit = this.refUnit(unitId)

    this.emit('before_remove_unit', unitId)

    const unlisten = this._unit_unlisten[unitId]

    delete this._unit_unlisten[unitId]

    unlisten()

    if (unit.hasErr()) {
      this._removeErrUnit(unitId)
    }

    const selfMergeId = this._selfUniToMerge[unitId]
    if (selfMergeId) {
      this._removePinFromMerge(selfMergeId, unitId, 'output', SELF)

      delete this._mergeToSelfUnit[selfMergeId]
      delete this._selfUniToMerge[unitId]
    }

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
        this._removeMerge(mergeId)
      } else {
        this._removeUnitFromMerge(unitId, mergeId)
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

    return unit
  }

  public addMerges = (merges: GraphMergesSpec): void => {
    forEachKeyValue(merges, this.addMerge)
  }

  private _addMerges = (merges: GraphMergesSpec): void => {
    forEachKeyValue(merges, this._addMerge)
  }

  public addMerge = (mergeSpec: GraphMergeSpec, mergeId: string): void => {
    // console.log('Graph', 'addMerge', mergeId)
    this._addMerge(mergeSpec, mergeId)

    this.emit('add_merge', mergeId, mergeSpec)
  }

  private _addMerge = (mergeSpec: GraphMergeSpec, mergeId: string): void => {
    // console.log('Graph', 'addMerge', mergeId)
    const merge = new Merge<any>()
    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')
    const mergeInputPin = new Pin()
    merge.addInput(mergeInputPinId, mergeInputPin)

    // this._memAddMerge(mergeId, mergeSpec, merge)
    // this._simAddMerge(mergeId, mergeSpec, merge)

    this._spec.merges = this._spec.merges || {}
    this._spec.merges[mergeId] = mergeSpec

    this._pin[mergeInputPinId] = mergeInputPin
    this._merge[mergeId] = merge

    this.emit('before_add_merge', mergeId, mergeSpec)

    forEachKeyValue(mergeSpec, ({ input, output }, unitId) => {
      forEachKeyValue(input || {}, (_, inputId) => {
        this._addPinToMerge(mergeId, unitId, 'input', inputId)
      })
      forEachKeyValue(output || {}, (_, outputId) => {
        this._addPinToMerge(mergeId, unitId, 'output', outputId)
      })
    })
  }

  private _memAddMerge = (
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge<any>
  ): void => {
    this._spec.merges = this._spec.merges || {}
    this._spec.merges[mergeId] = mergeSpec

    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

    const mergeInputPin = merge.getInput(mergeInputPinId)

    this._pin[mergeInputPinId] = mergeInputPin
    this._merge[mergeId] = merge

    this.emit('before_add_merge', mergeId, mergeSpec)

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
  ): void {}

  private _memAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
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

    this._set_branch(mergeId, type, pinNodeId)
  }

  public memRemoveMerge = (mergeId: string, merge: Merge<any>): void => {
    // TODO
  }

  public isUnitRefPin(
    unitId: string,
    type: 'input' | 'output',
    name: string
  ): boolean {
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
    type: 'input' | 'output',
    pinId: string
  ): void => {
    this._addPinToMerge(mergeId, unitId, type, pinId)

    this.emit('add_pin_to_merge', mergeId, unitId, type, pinId)
  }

  private _addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ): void => {
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

    this._set_branch(mergeId, type, pinNodeId)
  }

  public removeMerge(mergeId: string) {
    // console.log('Graph', 'removeMerge', mergeId)
    this._removeMerge(mergeId)

    this.emit('remove_merge', mergeId)
  }

  public _removeMerge(mergeId: string) {
    // console.log('Graph', 'removeMerge', mergeId)
    this._validateMergeId(mergeId)

    this.emit('before_remove_merge', mergeId)

    forEachKeyValue(this._spec.inputs || {}, ({ pin }, inputId) => {
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        if (subPinSpec.mergeId === mergeId) {
          this._unplugInput(subPinId, inputId)
          break
        }
      }
    })
    forEachKeyValue(this._spec.outputs || {}, ({ pin }, outputId) => {
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        if (subPinSpec.mergeId === mergeId) {
          this._unplugOutput(subPinId, outputId)
          break
        }
      }
    })

    const merge = clone(this._spec.merges![mergeId])

    forEachKeyValue(merge, ({ input, output }, unitId) => {
      forEachKeyValue(input || {}, (_, inputId: string) => {
        this._removePinFromMerge(mergeId, unitId, 'input', inputId)
      })
      forEachKeyValue(output || {}, (_, outputId: string) => {
        this._removePinFromMerge(mergeId, unitId, 'output', outputId)
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

  public removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) {
    this._removePinFromMerge(mergeId, unitId, type, pinId)

    this.emit('remove_pin_from_merge', mergeId, unitId, type, pinId)
  }

  public _removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) {
    this._validateMergeId(mergeId)
    this._validateUnitId(unitId)

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._removeBranch(mergeId, type, pinNodeId)

    if (type === 'input') {
      if (
        this._mergeToSelfUnit[mergeId] ||
        this.isUnitRefInput(unitId, pinId)
      ) {
        const pin = this._pin[pinNodeId]
        pin.take()
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

    delete this._pinToMerge[unitId][type][pinId]
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
    type: 'input' | 'output',
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
    type: 'input' | 'output',
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
    type: 'input' | 'output',
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
    type: 'input' | 'output',
    pinId: string,
    ignored: boolean
  ): void {
    const unit = this.refUnit(unitId)

    if (ignored) {
      forEachPinOnMerges(
        this._spec.merges!,
        (mergeId, _unitId, _type, _pinId) => {
          if (_unitId === unitId && _type === type && _pinId === pinId) {
            this.removePinFromMerge(mergeId, unitId, type, pinId)
          }
        }
      )

      forEachKeyValue(this._spec.outputs, ({ pin }, id) => {
        for (let subPinId in pin) {
          const subPinSpec = pin[subPinId]
          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this.unplugPin(type, id, subPinId)
            break
          }
        }
      })
    }

    unit.setPinIgnored(type, pinId, ignored)
  }

  public setUnitPinData(
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    data: any
  ) {
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

  public moveUnitInto(
    graphId: string,
    unitId: string,
    nextUnitId: string
  ): void {
    this._moveUnitInto(graphId, unitId, nextUnitId)

    this.emit('move_unit_into', graphId, unitId)
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
    nextUnitId: string
  ): void {
    // console.log('Graph', '_moveUnitInto', graphId, unitId)
    const graph = this.refUnit(graphId) as G

    const unit_spec = this._spec.units[unitId]

    const unit = this.refUnit(unitId)

    graph.addUnit(unit_spec, nextUnitId, unit, false)

    const movePinInto = (type: 'input' | 'output', pinId: string): void => {
      let nextPinId = pinId
      let i = 0
      while (graph.hasPinNamed(type, nextPinId)) {
        nextPinId = `${pinId}${i}`
        i++
      }

      graph.exposePinSet(
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
        false
      )

      const pin = graph.getPin(type, nextPinId)

      const pin_node_id = getPinNodeId(graphId, type, nextPinId)

      this._pin[pin_node_id] = pin

      const mergeId =
        this._pinToMerge[unitId] && this._pinToMerge[unitId][type][pinId]

      if (mergeId) {
        this._removePinFromMerge(mergeId, unitId, type, pinId)

        this._addPinToMerge(mergeId, graphId, type, nextPinId)
      }
    }

    const inputs = unit.getInputNames()
    for (let input_id of inputs) {
      movePinInto('input', input_id)
    }

    const outputs = unit.getOutputNames()
    for (let output_id of outputs) {
      movePinInto('output', output_id)
    }

    this._removeUnit(unitId)
  }

  public moveLinkPinInto(
    graphId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    nextPinId: string
  ): void {
    // TODO
  }

  public moveMergeInto(
    graphId: string,
    mergeId: string,
    nextMergeId: string
  ): void {
    // TODO
  }

  public explodeUnit(
    graphId: string,
    mapUnitId: Dict<string>,
    mapMergeId: Dict<string>
  ): void {
    console.log('Graph', graphId, mapUnitId, mapMergeId)
    const graph = this._removeUnit(graphId) as G

    const units = graph.refUnits()

    for (const unitId in units) {
      const newUnitId = mapUnitId[unitId] || unitId

      const unit = graph.refUnit(unitId)

      const unitSpec = graph.getUnitSpec(unitId)

      this._addUnit(unitSpec, newUnitId, unit)

      // graph.unplugUnit(unitId)
      // this.plugUnit(unitId, unitSpec, unit)
    }

    const merges = graph.refMerges()

    for (const mergeId in merges) {
      const newMergeId = mapMergeId[mergeId] || mergeId

      const merge = graph.refMerge(mergeId)

      // graph.unplugMerge(mergeId)
      // this._plugMerge(newMergeId, merge)
    }

    
  }

  setupComponent(component: GraphComponentSpec): void {
    const { slots, subComponents = {}, children = [] } = component

    for (const subComponentId in subComponents) {
      const subComponent = subComponents[subComponentId]
      this.setupSubComponent(subComponentId, subComponent)
    }

    // RETURN
    if (slots !== undefined) {
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
      this.subComponentAppend(subComponentId, childId, slot)
    }
  }

  // E

  public _children: (C & U)[] = []

  appendChild(Class: UnitClass): number {
    return appendChild(this, this._children, Class)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): UnitClass {
    return removeChild(this, this._children, at)
  }

  child(at: number): C {
    return child(this, this._children, at)
  }

  children(): C[] {
    return children(this, this._children)
  }

  component(callback: Callback<Component>): Unlisten {
    return this._component_source.connect(callback)
  }
}
