import { $ } from '../$'
import { ObjectUpdateType } from '../../ObjectUpdateType'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Pins } from '../../Pins'
import { Primitive } from '../../Primitive'
import { bundleSpec, unitBundleSpec } from '../../bundle'
import { isComponentEvent } from '../../client/isComponentEvent'
import {
  animate,
  appendChild,
  appendChildren,
  appendParentChild,
  cancelAnimation,
  hasChild,
  insertChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  refRoot,
  refSlot,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  reorderParentRoot,
  reorderRoot,
  stopPropagation,
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { GRAPH_DEFAULT_EVENTS } from '../../constant/GRAPH_DEFAULT_EVENTS'
import { SELF } from '../../constant/SELF'
import { deepSet_ } from '../../deepSet'
import { CodePathNotImplementedError } from '../../exception/CodePathNotImplemented'
import { MergeNotFoundError } from '../../exception/MergeNotFoundError'
import { ReadOnlyError } from '../../exception/ObjectReadOnly'
import { UnitNotFoundError } from '../../exception/UnitNotFoundError'
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
import { cloneUnit, cloneUnitClass } from '../../spec/cloneUnit'
import { evaluateData } from '../../spec/evaluateDataValue'
import { bundleFromId } from '../../spec/fromId'
import { applyUnitDefaultIgnored } from '../../spec/fromSpec'
import {
  insertSubComponentChild,
  removeRoot,
  removeSubComponentChild,
} from '../../spec/reducers/component'
import {
  coverPin,
  coverPinSet,
  exposePinSet,
  plugPin,
  removeMerge,
  removePinFromMerge,
  removeUnitPinData,
  renameUnitInMerges,
  renameUnitPin,
  setComponentSize,
  setPinSetDefaultIgnored,
  setPinSetFunctional,
  setPinSetId,
  setSubComponentSize,
  setUnitPinConstant,
  setUnitPinData,
  setUnitSize,
  unplugPin,
} from '../../spec/reducers/spec'
import { stringify } from '../../spec/stringify'
import { unitFromBundleSpec } from '../../spec/unitFromSpec'
import { getSubComponentParentId } from '../../spec/util/component'
import {
  findMergePlugOfType,
  findUnitPinPlug,
  findUnitPlugs,
  forEachInputOnMerge,
  forEachPinOnMerge,
  forEachPinOnMerges,
  getMergePinCount,
  getMergePinNodeId,
  getOutputNodeId,
  getPinNodeId,
  getPlugSpecs,
  getUnitMergesSpec,
  hasMerge,
  hasMergePin,
  isPinRef,
  isSelfPin,
  opposite,
} from '../../spec/util/spec'
import { System } from '../../system'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keyCount } from '../../system/core/object/KeyCount/f'
import { keys } from '../../system/f/object/Keys/f'
import {
  GraphComponentSpec,
  GraphPinsSpec,
  GraphPlugOuterSpec,
  GraphSubComponentSpec,
  GraphSubPinSpec,
  GraphUnitOuterSpec,
  Spec,
} from '../../types'
import { Action } from '../../types/Action'
import { BundleSpec } from '../../types/BundleSpec'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitMerges } from '../../types/GraphUnitMerges'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
import { IO } from '../../types/IO'
import { IOOf, forIOObjKV } from '../../types/IOOf'
import { UnitBundle } from '../../types/UnitBundle'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { AnimationSpec, C, C_EE, ComponentSetup } from '../../types/interface/C'
import { ComponentEvents, Component_ } from '../../types/interface/Component'
import { G, G_EE, G_MoveSubgraphIntoArgs } from '../../types/interface/G'
import { J } from '../../types/interface/J'
import { U, U_EE } from '../../types/interface/U'
import { forEach, insert, remove } from '../../util/array'
import { callAll } from '../../util/call/callAll'
import { clone } from '../../util/clone'
import {
  _keyCount,
  deepDelete,
  deepDestroy,
  deepGet,
  deepGetOrDefault,
  deepSet,
  forEachObjKV,
  getObjSingleKey,
  isEmptyObject,
  mapObjKV,
  omit,
  someObj,
} from '../../util/object'
import { weakMerge } from '../../weakMerge'
import { Element_ } from '../Element'
import Merge from '../Merge'
import { SnapshotOpt, Unit, UnitEvents } from '../Unit'
import { Memory } from '../Unit/Memory'
import { UnitRemovePinDataData, UnitTakeInputData } from '../Unit/interface'
import { WaitAll } from '../WaitAll'
import {
  GraphAddMergeData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphAddUnitGhostData,
  GraphBulkEditData,
  GraphCloneUnitData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphMoveSubComponentRootData,
  GraphMoveSubGraphData,
  GraphMoveSubGraphIntoData,
  GraphMoveSubGraphOutOfData,
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
  GraphSetUnitIdData,
  GraphSetUnitPinConstant,
  GraphSetUnitPinDataData,
  GraphSetUnitPinIgnoredData,
  GraphSetUnitSizeData,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from './interface'
import { isRefMerge } from './isRefMerge'
import { moveSubgraph } from './moveSubgraph'

export type Graph_EE = G_EE & C_EE & U_EE

export type GraphEvents = UnitEvents<Graph_EE> & Graph_EE

export class Graph<I extends Dict<any> = any, O extends Dict<any> = any>
  extends Primitive<I, O, GraphEvents>
  implements G<I, O>, C, U<I, O>, J<Dict<any>>
{
  __ = ['U', 'C', 'G', 'EE', 'J']

  private _element: boolean = false

  private _spec: GraphSpec

  private _unit: Dict<Unit> = {}

  private _merge: Record<string, Merge> = {}

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

  private _exposedPin: IOOf<Dict<Pin>> = {}
  private _exposedMerge: IOOf<Dict<Merge>> = {}
  private _exposedEmptySubPin: IOOf<Dict<Dict<Pin>>> = {
    input: {},
    output: {},
  }

  private _mergeToSelfUnit: Dict<string> = {}
  private _selfUniToMerge: Dict<string> = {}

  private _pinToMerge: Dict<IOOf<Dict<string>>> = {}

  private _branch: Dict<true> = {}

  private _mergePinCount: Dict<number> = {}

  private _unitToMerge: Dict<Set<string>> = {}
  private _unitToMergeCount: Dict<Dict<number>> = {}

  private _children: Component_[] = []
  private _animations?: AnimationSpec[]
  private _stopPropagation?: Dict<number>
  private _stopImmediatePropagation?: Dict<number>
  private _preventDefault?: Dict<number>

  private _waitAll: IOOf<WaitAll> = {}

  private _plugUnlisten: IOOf<Dict<Dict<Unlisten>>> = {}

  private _removingUnit: Set<string>

  private _destroying: boolean

  constructor(
    spec: GraphSpec,
    branch: Dict<true> = {},
    system: System,
    id?: string,
    push?: boolean
  ) {
    if (!spec.id) {
      system.newSpec(spec, id)
    }

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

    const {
      inputs = {},
      outputs = {},
      units = {},
      merges = {},
      component = {},
      render = false,
    } = this._spec

    this._branch = branch

    this._waitAll = {
      input: new WaitAll<any>(this.__system),
      output: new WaitAll<any>(this.__system),
    }

    this._element = render

    this.addListener('reset', this._reset)
    this.addListener('play', this._play)
    this.addListener('pause', this._pause)
    this.addListener('destroy', this._destroy)
    this.addListener('take_err', this._takeErr)
    this.addListener('take_caught_err', this._takeErr)

    this._initAddUnits(units, push)
    this._initMerges(merges)
    this._initInputSets(inputs)
    this._initOutputSets(outputs)
    this._initSetComponent(component)

    const { global } = system

    this.register()

    deepSet_(global.graph, [this.id, this.__global_id], this)

    system.registerUnit(id)
  }

  async get<K extends string>(name: K): Promise<any> {
    const unitId = name

    return this.getUnit(unitId)
  }

  set<K extends string>(name: K, data: any): Promise<void> {
    throw new ReadOnlyError('graph')
  }

  delete<K extends string>(name: K): Promise<void> {
    throw new ReadOnlyError('graph')
  }

  async hasKey<K extends string>(name: K): Promise<boolean> {
    return !!this._unit[name]
  }

  async keys(): Promise<string[]> {
    return keys(this._unit)
  }

  async deepGet(path: string[]): Promise<any> {
    if (path.length === 0) {
      return this
    }

    const [unitId, ...rest] = path

    const unit = this.getUnit(unitId)

    if (rest.length > 0) {
      if (!(unit instanceof Graph)) {
        throw new Error('deep unit is not a graph')
      }

      return unit.deepGet(rest)
    }

    return unit
  }

  deepSet(path: string[], data: any): Promise<void> {
    throw new ReadOnlyError('graph')
  }

  deepDelete(path: string[]): Promise<void> {
    throw new ReadOnlyError('graph')
  }

  subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    throw new CodePathNotImplementedError()
  }

  private _onPinSetRenamed = <
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(
    type: T,
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ) => {
    // console.log('Graph', '_onPinSetRenamed', type, name, newName, opt, newOpt)

    const oppositeType = opposite(type)

    const { functional } = opt

    const exposedPin = deepGet(this._exposedPin, [type, name])
    const exposedMerge = deepGet(this._exposedMerge, [type, name])

    exposedMerge.renamePin(type, name, newName)

    if (functional) {
      this._unplugFromWaitAll(type, name)
    }

    deepDestroy(this._exposedPin, [type, name])
    deepDestroy(this._exposedMerge, [type, name])

    deepSet(this._exposedPin, [type, newName], exposedPin)
    deepSet(this._exposedMerge, [type, newName], exposedMerge)

    const emptySubPins = deepGet(this._exposedEmptySubPin, [type, name])

    deepDelete(this._exposedEmptySubPin, [type, name])

    for (const subPinId in { ...emptySubPins }) {
      const emptySubPin = emptySubPins[subPinId]

      deepSet(this._exposedEmptySubPin, [type, newName, subPinId], emptySubPin)
    }

    const pinSpec = this.getExposedPinSpec(type, newName)

    const { plug = {} } = pinSpec

    for (const subPinId in plug) {
      const subPin = plug[subPinId]

      const { unitId, pinId, kind = type } = subPin

      if (unitId && pinId) {
        deepSet(this._pinToPlug, [subPin.unitId, kind, subPin.pinId], {
          pinId: newName,
          subPinId,
          type: kind,
          kind,
        })
      }
    }
  }

  public onInputRenamed<K extends keyof I>(
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    // console.log('Graph', 'onInputRenamed', name, newName, opt, newOpt)

    super.onInputRenamed(name, newName, opt, newOpt)

    this._onPinSetRenamed('input', name, newName, opt, newOpt)
  }

  public onOutputRenamed<K extends keyof O>(
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ) {
    // console.log('Graph', 'onOutputRenamed', name, newName, opt, newOpt)

    super.onOutputRenamed(name, newName, opt, newOpt)

    this._onPinSetRenamed('output', name, newName, opt, newOpt)
  }

  isUnitPinConstant(unitId: string, type: IO, pinId: string): boolean {
    const unit = this.getUnit(unitId)

    const constant = unit.isPinConstant(type, pinId)

    return constant
  }

  isUnitPinRef(unitId: string, type: IO, pinId: string): boolean {
    const unit = this.getUnit(unitId)

    const ref = unit.isPinRef(type, pinId)

    return ref
  }

  getUnitPinData(unitId: string, type: IO, pinId: string): any {
    const unit = this.getUnit(unitId)

    const data = unit.getPinData(type, pinId)

    return data
  }

  removeUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    this._removeUnitPinData(unitId, type, pinId, fork, bubble)

    emit && this.edit('remove_unit_pin_data', unitId, type, pinId, [])
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
    const mergePin = this._ensureMergePin('input', mergeId)

    mergePin.push(data)
  }

  private _removeMergeData(mergeId: string) {
    const mergePin = this._ensureMergePin('input', mergeId)

    mergePin.take()
  }

  private _plugToWaitAll = <
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(
    type: T,
    name: K
  ): void => {
    const oppositeType = opposite(type)

    const pin = this.getExposedPin(type, name)

    const data = pin.peak()

    const oppositePin = new Pin({ data }, this.__system)

    const waitAll = deepGet(this._waitAll, [type])
    const exposedMerge = deepGet(this._exposedMerge, [type, name]) as Merge

    exposedMerge.removePin(type, name, false)

    waitAll.addPin(type, name, pin, {}, false)
    waitAll.setPin(oppositeType, name, oppositePin, {}, false)

    exposedMerge.addPin(type, name, oppositePin, {}, false)
  }

  private _unplugFromWaitAll = <
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(
    type: T,
    name: K
  ): void => {
    const oppositeType = opposite(type)

    const pin = this.getExposedInputPin(name as keyof I)

    const exposedMerge = deepGet(this._exposedMerge, [type, name]) as Merge

    const waitAll = this._waitAll[type]

    exposedMerge.removePin(type, name, false)

    waitAll.removePin(type, name, false)
    waitAll.removePin(oppositeType, name, false)

    exposedMerge.addPin(type, name, pin, {}, false)
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

  private _removeUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    const unit = this.getUnit(unitId)

    if (unit.hasInputNamed(pinId) && unit.isPinConstant(type, pinId)) {
      fork && this._fork(undefined, true, bubble)
    }

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

  private _simRemoveBranch(
    mergeId: string,
    type: IO,
    pinNodeId: string,
    propagate: boolean
  ): void {
    // console.log('Graph', '_simRemoveBranch', mergeId, type, pinNodeId)

    if (type === 'input') {
      this._merge[mergeId].removeOutput(pinNodeId, propagate)
    } else {
      this._merge[mergeId].removeInput(pinNodeId, propagate)
    }
  }

  private _ensureMergePin = (
    type: IO,
    mergeId: string,
    data: any = undefined,
    propagate: boolean = false
  ): Pin => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    let mergePin = this._pin[mergePinNodeId]

    if (!this._pin[mergePinNodeId]) {
      const oppositeType = opposite(type)

      mergePin = new Pin({ data }, this.__system)

      this._pin[mergePinNodeId] = mergePin

      this._setBranch(mergeId, oppositeType, mergePinNodeId, propagate)
    }

    return mergePin
  }

  private _memEnsureMergePin = (type: IO, mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    if (!this._pin[mergePinNodeId]) {
      const oppositeType = opposite(type)

      const mergePin = new Pin({}, this.__system)

      this._pin[mergePinNodeId] = mergePin

      this._memSetBranch(mergeId, oppositeType, mergePinNodeId)
    }
  }

  private _memRemoveMergeOutput = (mergeId: string): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, 'output')

    if (this._pin[mergePinNodeId]) {
      this._memRemoveBranch(mergeId, 'input', mergePinNodeId)

      delete this._pin[mergePinNodeId]
    }
  }

  private _simRemoveMergeOutput = (
    mergeId: string,
    propagate: boolean
  ): void => {
    const mergePinNodeId = getMergePinNodeId(mergeId, 'output')

    if (this._pin[mergePinNodeId]) {
      this._simRemoveBranch(mergeId, 'input', mergePinNodeId, propagate)
    }
  }

  private _plugPinToMerge = (
    type: IO,
    pinId: string,
    subPinId: string,
    mergeId: string,
    data: any,
    opt: PinOpt,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_plugPinToMerge', type, pinId, subPinId, mergeId, opt)

    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    this._ensureMergePin(type, mergeId, data, propagate)

    const subPin = this._pin[mergePinNodeId]

    this._setExposedSubPin(type, pinId, type, subPinId, subPin, opt, propagate)
  }

  private _simPlugPinToMerge = (
    type: IO,
    pinId: string,
    subPinId: string,
    mergeId: string,
    data: any,
    propagate: boolean = true
  ): void => {
    // console.log('_simPlugPinToMerge', {
    //   type,
    //   pinId,
    //   subPinId,
    //   data,
    //   propagate,
    // })

    const mergePinNodeId = getMergePinNodeId(mergeId, type)

    this._ensureMergePin(type, mergeId, data, propagate)

    const subPin = this._pin[mergePinNodeId]

    this._simSetExposedSubPin(type, pinId, type, subPinId, subPin, propagate)
  }

  private _simUnplugPinFromMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string,
    propagate: boolean
  ): void => {
    this._simRemoveExposedSubPin(type, name, subPinId, propagate)
  }

  private _simUnplugPinFromUnitPin = (
    type,
    pinId,
    subPinId,
    _unitId,
    _pinId,
    _type,
    propagate: boolean
  ) => {
    this._simRemoveExposedSubPin(type, pinId, subPinId, propagate)
  }

  private _plugPinToUnitPin = (
    type: IO,
    name: string,
    subPinId: string,
    unitId: string,
    kind: IO,
    pinId: string,
    opt: PinOpt,
    propagate: boolean = false
  ): void => {
    this._memPlugPinToUnitPin(type, name, subPinId, unitId, kind, pinId)
    this._simPlugPinToUnitPin(
      type,
      name,
      subPinId,
      unitId,
      kind,
      pinId,
      propagate
    )
  }

  private _memPlugPinToUnitPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    unitId: string,
    kind: IO,
    pinId_: string
  ): void => {
    const subPin = this.getUnitPin(unitId, kind, pinId_)

    deepSet(this._pinToPlug, [unitId, kind, pinId_], { pinId, subPinId, type })

    this._memSetExposedSubPin(type, pinId, subPinId, subPin)
  }

  private _memPlugPinToMerge = (
    type: IO,
    name: string,
    subPinId: string,
    mergeId: string
  ): void => {
    //
  }

  private _simPlugPinToUnitPin = (
    type: IO,
    name: string,
    subPinId: string,
    unitId: string,
    kind: IO,
    pinId: string,
    propagate: boolean = true
  ): void => {
    const subPin = this.getUnitPin(unitId, kind, pinId)

    if (type === 'input' && kind === 'input') {
      const pin = this.getPin(type, name)

      if (subPin.active() && !pin.active()) {
        const data = subPin.peak()

        propagate && pin.push(data, true)
      }

      const unlisten = callAll([
        subPin.addListener('data', (data, backpropagation) => {
          if (backpropagation) {
            if (data instanceof $) {
              pin.push(data, true)
            }
          }
        }),
      ])

      deepSet(this._plugUnlisten, [type, name, subPinId], unlisten)
    }

    this._simSetExposedSubPin(type, name, kind, subPinId, subPin, propagate)
  }

  private _setExposedSubPin(
    type: IO,
    name: string,
    kind: IO,
    subPinId: string,
    subPin: Pin,
    opt: PinOpt,
    propagate: boolean = true
  ) {
    // console.log('Graph', '_setExposedSubPin', type, name, kind, subPinId, subPin, opt)

    this._simSetExposedSubPin(type, name, kind, subPinId, subPin, propagate)
  }

  private _memSetExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    subPin: Pin
  ) {
    //
  }

  private _simSetExposedSubPin(
    type: IO,
    name: string,
    kind: IO,
    subPinId: string,
    subPin: Pin,
    propagate: boolean = true
  ) {
    // console.log(
    //   'Graph',
    //   '_simSetExposedSubPin',
    //   type,
    //   name,
    //   kind,
    //   subPinId,
    //   subPin,
    //   propagate
    // )

    const oppositeType = opposite(type)

    const exposedMerge = deepGet(this._exposedMerge, [type, name])

    const type_ =
      type === kind ||
      deepGetOrDefault(
        this._exposedEmptySubPin,
        [type, name, subPinId],
        undefined
      )
        ? oppositeType
        : type

    exposedMerge.setPin(type_, subPinId, subPin, {}, propagate)
  }

  private _simRemoveExposedSubPin(
    type: IO,
    name: string,
    subPinId: string,
    propagate: boolean
  ) {
    const subPinSpec = this.getSubPinSpec(type, name, subPinId)

    const { kind = type } = subPinSpec

    const oppositeType = opposite(type)

    const exposedMerge = deepGet(this._exposedMerge, [type, name]) as Merge

    const type_ =
      type === kind ||
      deepGetOrDefault(
        this._exposedEmptySubPin,
        [type, name, subPinId],
        undefined
      )
        ? oppositeType
        : type

    exposedMerge.removePin(type_, subPinId, propagate)
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

  private _destroy = (path: string[]) => {
    if (path.length > 0) {
      return
    }

    this._spec = clone(this._spec)

    this._destroying = true

    forEachValueKey(this._unit, (u) => u.destroy())
    forEachValueKey(this._merge, (m) => m.destroy())

    this._waitAll.input.destroy()
    this._waitAll.output.destroy()

    forIOObjKV(this._exposedPin, (type, name, pin) => {
      pin.destroy()
    })
    forIOObjKV(this._exposedMerge, (type, name, merge) => {
      merge.destroy()
    })
    forIOObjKV(this._exposedEmptySubPin, (type, name, pins) => {
      for (const subPinId in pins) {
        const pin = pins[subPinId]

        pin.destroy()
      }
    })

    const { global } = this.__system

    this.__system.unregisterUnit(this.id)

    deepDestroy(global.graph, [this.id, this.__global_id])

    this._destroying = false
  }

  private _reset = (): void => {
    forEachValueKey(this._unit, (u) => u.reset())
    forEach(this._children, (c) => c.reset())

    this.emit('call', { method: 'reset', data: [] })
  }

  private _play(): void {
    forEachValueKey(this._merge, (m) => m.play())
    forEachValueKey(this._unit, (u) => u.play())

    forEach(this._children, (c) => c.play())
  }

  private _pause(): void {
    forEachValueKey(this._merge, (m) => m.pause())
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
    return !!this._element
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

  public getBundleSpec({ deep, system, state }: SnapshotOpt = {}): BundleSpec {
    const { spec, specs } = bundleSpec(this._spec, this.__system.specs, system)

    const spec_ = clone(spec)

    if (deep) {
      forEachObjKV(this._unit, (unitId, unit) => {
        const unitMemory = unit.snapshot({ deep, state })

        deepSet(spec_, ['units', unitId, 'memory'], unitMemory)
      })
    }

    return { spec: spec_, specs }
  }

  public getUnitBundleSpec({
    deep = false,
    system = false,
    state = false,
  }: SnapshotOpt = {}): UnitBundleSpec {
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

    const memory = this.snapshot({ deep, state })

    const unit = { id, input, output, memory }

    const bundle = unitBundleSpec(unit, this.__system.specs, system)

    return bundle
  }

  public snapshotSelf(opt: SnapshotOpt = {}): Dict<any> {
    const { deep, state } = opt

    const snapshot: {
      unit?: Dict<Memory>
      merge?: Dict<Memory>
      exposedMerge?: IOOf<Dict<Memory>>
      waitAll?: Memory
    } = {}

    if (deep || state) {
      snapshot.unit = {}

      for (const unitId in this._unit) {
        const unit = this._unit[unitId]

        const unit_state = unit.snapshot(opt)

        snapshot.unit[unitId] = unit_state
      }
    }

    if (deep) {
      snapshot.merge = {}

      for (const mergeId in this._merge) {
        const merge = this._merge[mergeId]

        const merge_state = merge.snapshot(opt)

        snapshot.merge[mergeId] = merge_state
      }

      snapshot.exposedMerge = {}

      forIOObjKV(this._exposedMerge, (type, pinId) => {
        const merge = deepGet(this._exposedMerge, [type, pinId])

        const mergeState = merge.snapshot()

        deepSet(snapshot.exposedMerge, [type, pinId], mergeState)
      })

      snapshot.waitAll = {}

      snapshot.waitAll = this._waitAll['input'].snapshot(opt)
    }

    return snapshot
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

    forIOObjKV(this._exposedMerge, (type, pinId) => {
      if (this.hasDataPinNamed(type, pinId)) {
        const merge = deepGet(this._exposedMerge, [type, pinId])

        const mergeState = deepGetOrDefault(
          state,
          ['exposedMerge', type, pinId],
          undefined
        )

        if (mergeState) {
          merge.restore(mergeState)
        }
      }
    })

    const wait_all_state = state.waitAll

    if (wait_all_state) {
      this._waitAll['input'].restore(wait_all_state)
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
    this.plugPin('output', id, subPinId, undefined, subPin)
  }

  public unplugOutput = (subPinId: string, id: string): void => {
    this.unplugPin('output', id, subPinId)
  }

  public _unplugOutput = (
    subPinId: string,
    id: string,
    propagate: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    this._unplugPin('output', id, subPinId, propagate, fork, bubble)
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
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    // console.log('Graph', 'exposePinSet', type, pinId, pinSpec, data)

    this._exposePinSet(type, pinId, pinSpec, data, propagate, fork, bubble)

    data = this.getPin(type, pinId).peak()

    emit && this.edit('expose_pin_set', type, pinId, pinSpec, data, [])

    if (this._transacting) {
      this._transaction.push(makeExposePinSetAction(type, pinId, pinSpec, data))
    }
  }

  setUnitSize(
    unitId: string,
    width: number,
    height: number,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._setUnitSize(unitId, width, height, fork, bubble)

    emit && this.edit('set_unit_size', unitId, width, height, [])
  }

  setSubComponentSize(
    unitId: string,
    width: number,
    height: number,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._setSubComponentSize(unitId, width, height, fork, bubble)

    emit && this.edit('set_sub_component_size', unitId, width, height, [])
  }

  setComponentSize(
    unitId: string,
    width: number,
    height: number,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._setComponentSize(width, height, fork, bubble)

    emit && this.edit('set_component_size', unitId, width, height, [])
  }

  public _exposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    data?: any,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    // console.log('Graph', '_exposePinSet', type, pinId, pinSpec, data, propagate)

    const exposedPin = new Pin({ data }, this.__system)

    const exposeMerge = new Merge(this.__system)

    fork && this._fork(undefined, true, bubble)

    this._specExposePinSet(type, pinId, pinSpec)
    this._memExposePinSet(type, pinId, pinSpec, exposedPin, exposeMerge)
    this._simExposePinSet(
      type,
      pinId,
      pinSpec,
      data,
      exposedPin,
      exposeMerge,
      propagate && data === undefined
    )
  }

  public _initPinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_initPinSet', type, pinId, pinSpec, exposedPin)

    const { ref } = pinSpec

    const exposedPin = new Pin({ ref }, this.__system)

    const exposedMerge = new Merge(this.__system)

    this._memExposePinSet(type, pinId, pinSpec, exposedPin, exposedMerge)
    this._simExposePinSet(
      type,
      pinId,
      pinSpec,
      undefined,
      exposedPin,
      exposedMerge,
      propagate
    )
  }

  public _specExposePinSet = (
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec
  ): void => {
    // console.log('Graph', '_specExposePinSet', type, pinId, pinSpec)

    exposePinSet({ type, pinId, pinSpec }, this._spec)

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

    deepSet(this._exposedPin, [type, pinId], exposedPin)
    deepSet(this._exposedMerge, [type, pinId], exposedMerge)

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._memExposePin(type, pinId, subPinId, subPinSpec)
    })
  }

  private _simExposePinSet(
    type: IO,
    pinId: string,
    pinSpec: GraphPinSpec,
    data: any | undefined,
    exposedPin: Pin,
    exposedMerge: Merge,
    propagate: boolean = true
  ) {
    const { plug, ref, functional } = pinSpec

    exposedMerge.setPin(type, pinId, exposedPin)

    this.setPin(type, pinId, exposedPin, { ref }, propagate)

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._simExposePin(type, pinId, subPinId, subPinSpec, data, propagate)
    })

    if (functional) {
      this._plugToWaitAll(type, pinId)
    }
  }

  public isPinSetFunctional = (type: IO, pinId: string): boolean => {
    return !!this._spec[`${type}s`][pinId].functional
  }

  public setPinSetFunctional(
    type: IO,
    pinId: string,
    functional: boolean,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    if (type === 'output') {
      throw new Error('cannot set output pin set functional')
    }

    this._setPinSetFunctional(type, pinId, functional, fork, bubble)

    emit && this.edit('set_pin_set_functional', type, pinId, functional, [])
  }

  private _setPinSetFunctional(
    type: IO,
    name: string,
    functional: boolean,
    fork: boolean,
    bubble: boolean
  ): void {
    // console.log('_setPinSetFunctional', type, name, functional, fork, bubble)

    fork && this._fork(undefined, true, bubble)

    this._specSetPinSetFunctional(type, name, functional)
    this._memSetPinSetFunctional(type, name, functional)
    this._simSetPinSetFunctional(type, name, functional)
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

  private _memSetPinSetFunctional(
    type: IO,
    pinId: string,
    functional: boolean
  ): void {
    deepSet(this._i_opt, [type, pinId, 'functional'], functional)
  }

  private _simSetPinSetFunctional(
    type: IO,
    pinId: string,
    functional: boolean
  ): void {
    if (functional) {
      this._plugToWaitAll(type, pinId)
    } else {
      this._unplugFromWaitAll(type, pinId)
    }
  }

  public setPinSetDefaultIgnored(
    type: IO,
    pinId: string,
    defaultIgnored: boolean,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._setPinSetDefaultIgnored(type, pinId, defaultIgnored, fork, bubble)

    this.edit('set_pin_set_default_ignored', type, pinId, defaultIgnored, [])
  }

  private _setPinSetDefaultIgnored(
    type: IO,
    pinId: string,
    ignored: boolean,
    fork: boolean,
    bubble: boolean
  ): void {
    fork && this._fork(undefined, true, bubble)

    this._specSetPinSetDefaultIgnored(type, pinId, ignored)
    this._memSetPinSetDefaultIgnored(type, pinId, ignored)
    this._simSetPinSetDefaultIgnored(type, pinId, ignored)
  }

  private _specSetPinSetDefaultIgnored(
    type: IO,
    pinId: string,
    defaultIgnored: boolean
  ): void {
    setPinSetDefaultIgnored({ type, pinId, defaultIgnored }, this._spec)
  }

  private _memSetPinSetDefaultIgnored(
    type: IO,
    pinId: string,
    ignored: boolean
  ): void {
    //
  }

  private _simSetPinSetDefaultIgnored(
    type: IO,
    pinId: string,
    ignored: boolean
  ): void {
    //
  }

  public setPinSetId(
    type: IO,
    pinId: string,
    nextPinId: string,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._setPinSetId(type, pinId, nextPinId, fork, bubble)

    this.renamePin(type, pinId, nextPinId)

    emit && this.edit('set_pin_set_id', type, pinId, nextPinId, [])
  }

  public _setPinSetId(
    type: IO,
    pinId: string,
    nextPinId: string,
    fork: boolean,
    bubble: boolean
  ): void {
    // console.log('Graph', '_setPinSetId', type, pinId, nextPinId)

    fork && this._fork(undefined, true, bubble)

    this._specSetPinSetId(type, pinId, nextPinId)
  }

  private _specSetPinSetId(type: IO, pinId: string, nextPinId: string): void {
    setPinSetId({ type, pinId, nextPinId }, this._spec)
  }

  public exposePin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    emit: boolean = true,
    propagate: boolean = true
  ): void => {
    this._exposePin(type, pinId, subPinId, subPinSpec, propagate)

    emit && this.edit('expose_pin', type, pinId, subPinId, subPinSpec, [])

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
    subPinSpec: GraphSubPinSpec,
    propagate: boolean = true
  ): void => {
    this._specExposePin(type, pinId, subPinId, subPinSpec)
    this._memExposePin(type, pinId, subPinId, subPinSpec)
    this._simExposePin(type, pinId, subPinId, subPinSpec, propagate)
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
    data: any,
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
      this._simPlugPin(type, pinId, subPinId, subPinSpec, data, propagate)
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

  public coverPinSet = (
    type: IO,
    id: string,
    emit: boolean = true,
    propagate: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    const pinSpec = this.getExposedPinSpec(type, id)

    this._coverPinSet(type, id, propagate, fork, bubble)

    emit && this.edit('cover_pin_set', type, id, pinSpec, undefined, [])

    if (this._transacting) {
      this._transaction.push(makeCoverPinSetAction(type, id, pinSpec))
    }
  }

  public _coverPinSet = (
    type: IO,
    pinId: string,
    propagate: boolean = true,
    fork: boolean,
    bubble: boolean
  ): void => {
    // console.log('Graph', '_coverPinSet', type, pinId)

    fork && this._fork(undefined, true, bubble)

    this._simCoverPinSet(type, pinId, propagate)
    this._memCoverPinSet(type, pinId)
    this._specCoverPinSet(type, pinId)
  }

  private _memCoverPinSet = (type: IO, pinId: string): void => {
    // console.log('Graph', '_memCoverPinSet', type, pinId)

    const pinSpec = this.getExposedPinSpec(type, pinId)

    const { plug } = pinSpec

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._memCoverPin(type, pinId, subPinId)
    })

    deepDestroy(this._exposedPin, [type, pinId])

    const exposedMerge = deepGet(this._exposedMerge, [type, pinId])

    deepDestroy(this._exposedMerge, [type, pinId])

    exposedMerge.destroy()
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

  private _simCoverPinSet = (
    type: IO,
    pinId: string,
    propagate: boolean = false
  ): void => {
    const pinSpec = this.getExposedPinSpec(type, pinId)

    const { plug } = pinSpec

    forEachValueKey(plug, (subPinSpec: GraphSubPinSpec, subPinId: string) => {
      this._simCoverPin(type, pinId, subPinId, propagate)
    })

    this.removePin(type, pinId, propagate)
  }

  private _specSetPinRef = (type: IO, pinId: string, ref: boolean) => {
    deepSet(this._spec, [`${type}s`, pinId, 'ref'], ref)
  }

  private _memPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): boolean => {
    const { mergeId, unitId: _unitId, pinId: _pinId, kind = type } = subPinSpec

    let ref = undefined

    if (_unitId && _pinId) {
      if (this.isUnitRefPin(_unitId, kind, _pinId) || _pinId === SELF) {
        ref = true
      }

      this._memPlugPinToUnitPin(type, pinId, subPinId, _unitId, kind, _pinId)
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

      this._memPlugPinToMerge(type, pinId, subPinId, mergeId)
    } else {
      this._memPlugEmptyPin(type, pinId, subPinId)
    }

    return ref
  }

  private _specPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec
  ): void => {
    // console.log('Graph', '_specPlugPin', type, pinId, subPinId, subPinSpec)

    const {
      mergeId: _mergeId,
      unitId: _unitId,
      pinId: _pinId,
      kind = type,
    } = subPinSpec

    let ref = undefined

    if (_unitId && _pinId) {
      if (this.isUnitRefPin(_unitId, kind, _pinId) || _pinId === SELF) {
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
    data: any,
    emit: boolean = true,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    // console.log(
    //   'Graph',
    //   'plugPin',
    //   type,
    //   pinId,
    //   subPinId,
    //   subPinSpec,
    //   data,
    //   emit,
    //   propagate,
    //   fork
    // )

    this._plugPin(
      type,
      pinId,
      subPinId,
      subPinSpec,
      data,
      propagate,
      fork,
      bubble
    )

    emit && this.edit('plug_pin', type, pinId, subPinId, subPinSpec, [])
  }

  private _memRemoveEmptyPin = (type: IO, pinId: string, subPinId: string) => {
    delete this._exposedEmptySubPin[type][pinId][subPinId]

    if (this._exposedEmptySubPin[type]?.[pinId]) {
      if (keyCount(this._exposedEmptySubPin[type][pinId]) === 0) {
        delete this._exposedEmptySubPin[type][pinId]
      }
    }
  }

  private _simUnplugPinFromEmpty = (
    type: IO,
    pinId: string,
    subPinId: string
  ) => {
    this._simRemoveExposedSubPin(type, pinId, subPinId, false)
  }

  private _plugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    data: any,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    // console.log('Graph', '_plugPin', type, pinId, subPinId, subPinSpec)

    const { mergeId, unitId, pinId: _pinId, kind = type } = subPinSpec

    fork && this._fork(undefined, true, bubble)

    if (
      deepGetOrDefault(
        this._exposedEmptySubPin,
        [type, pinId, subPinId],
        undefined
      )
    ) {
      this._simUnplugPinFromEmpty(type, pinId, subPinId)
      this._memRemoveEmptyPin(type, pinId, subPinId)
    }

    this._specPlugPin(type, pinId, subPinId, subPinSpec)
    const ref = this._memPlugPin(type, pinId, subPinId, subPinSpec)

    const opt = { ref: !!ref }

    if (mergeId) {
      this._plugPinToMerge(type, pinId, subPinId, mergeId, data, opt, propagate)
    } else if (unitId && _pinId) {
      this._plugPinToUnitPin(
        type,
        pinId,
        subPinId,
        unitId,
        kind,
        _pinId,
        opt,
        propagate
      )
    } else {
      //
    }

    if (ref !== undefined) {
      this.setPinRef(type, pinId, ref)
    }
  }

  public isRefMerge = (mergeId: string): boolean => {
    const mergeSpec = this.getMergeSpec(mergeId)

    return isRefMerge(this, mergeSpec)
  }

  edit(event: string, ...args: any[]): void {
    // @ts-ignore
    super.emit(event, ...args)
    super.emit('edit', [event, ...args])
  }

  private _simPlugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    subPinSpec: GraphSubPinSpec,
    data: any,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_simPlugPin', pinId, subPinId, subPinSpec)

    const { mergeId, unitId, pinId: _pinId, kind = type } = subPinSpec

    if (mergeId) {
      propagate = propagate || this.isRefMerge(mergeId)

      this._simPlugPinToMerge(type, pinId, subPinId, mergeId, data, propagate)
    } else {
      propagate = propagate || this.isUnitPinRef(unitId, kind, _pinId)

      this._simPlugPinToUnitPin(
        type,
        pinId,
        subPinId,
        unitId!,
        kind,
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
    this.plugPin('input', id, subPinId, undefined, subPin)
  }

  public unplugInput = (
    subPinId: string,
    id: string,
    propagate: boolean = false
  ): void => {
    this.unplugPin('input', id, subPinId, propagate)
  }

  public _unplugInput = (
    subPinId: string,
    id: string,
    propagate: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    this._unplugPin('input', id, subPinId, propagate, fork, bubble)
  }

  public coverPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._coverPin(type, pinId, subPinId, fork, bubble)

    emit && this.edit('cover_pin', type, pinId, subPinId, subPinSpec, [])

    if (this._transacting) {
      this._transaction.push(
        makeUnplugPinAction(type, pinId, subPinId, subPinSpec)
      )
    }
  }

  private _coverPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    fork: boolean,
    bubble: boolean
  ): void => {
    fork && this._fork(undefined, fork, bubble)

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

  private _simCoverPin = (
    type: IO,
    id: string,
    subPinId: string,
    propagate: boolean = false
  ): void => {
    const subPinSpec = this.getSubPinSpec(type, id, subPinId)

    const { mergeId, unitId, pinId } = subPinSpec

    if (type === 'output') {
      if (mergeId) {
        // this._simRemoveMergeOutput(mergeId)
      }
    }

    this._simUnplugPin(type, id, subPinId, propagate)

    if (mergeId || (unitId && pinId)) {
      this._simRemoveExposedSubPin(type, id, subPinId, propagate)
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
    emit: boolean = true,
    propagate: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    // console.log('Graph', 'unplugPin', type, pinId, subPinId)

    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._unplugPin(type, pinId, subPinId, propagate, fork, bubble)

    emit && this.edit('unplug_pin', type, pinId, subPinId, subPinSpec, [])
  }

  private _unplugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean,
    fork: boolean,
    bubble: boolean
  ): void => {
    // console.log('Graph', '_unplugPin', type, pinId, subPinId)

    fork && this._fork(undefined, true, bubble)

    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    this._simUnplugPin(type, pinId, subPinId, propagate)
    this._memUnplugPin(type, pinId, subPinId)
    this._specUnplugPin(type, pinId, subPinId)

    const { mergeId } = subPinSpec

    if (mergeId) {
      const mergePinCount = this.getMergePinCount(mergeId)

      if (mergePinCount === 0) {
        this._removeMerge(mergeId, false)
      }
    }
  }

  private _specUnplugPin = (
    type: IO,
    pinId: string,
    subPinId: string
  ): void => {
    // console.log('Graph', '_specUnplugPin', type, pinId, subPinId)

    unplugPin({ type, pinId, subPinId }, this._spec)
  }

  private _memUnplugPin = (
    type: IO,
    pinId_: string,
    subPinId: string
  ): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId_, subPinId)

    const { unitId, pinId, kind = type } = subPinSpec

    if (unitId && pinId) {
      deepDelete(this._pinToPlug, [subPinSpec.unitId, kind, subPinSpec.pinId])
    }

    const output = type === 'output'

    if (output) {
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
    let emptySubPin = deepGetOrDefault(
      this._exposedEmptySubPin,
      [type, pinId, subPinId],
      null
    )

    if (!emptySubPin) {
      emptySubPin = new Pin({}, this.__system)

      deepSet(this._exposedEmptySubPin, [type, pinId, subPinId], emptySubPin)
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
    this._simPlugEmptyPin(type, pinId, subPinId, propagate)
  }

  private __simUnplugPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean = true
  ): void => {
    const subPinSpec = this.getSubPinSpec(type, pinId, subPinId)

    const {
      mergeId: _mergeId,
      unitId: _unitId,
      pinId: _pinId,
      kind = type,
    } = subPinSpec

    const input = type === 'input'
    const output = type === 'output'

    const pin = this.getPin(type, pinId)

    const active = pin.active()

    if (_mergeId) {
      if (output) {
        this._simRemoveMergeOutput(_mergeId, propagate)
      }

      this._simUnplugPinFromMerge(type, pinId, subPinId, _mergeId, propagate)

      if (propagate) {
        const merge = this.getMergeSpec(_mergeId)

        forEachInputOnMerge(merge, (unitId, pinId) => {
          this._removeUnitPinData(unitId, 'input', pinId)
        })

        if (input && active) {
          const outputPlugs = findMergePlugOfType(
            this._spec,
            'output',
            _mergeId
          )

          for (const outputPlug of outputPlugs) {
            const { pinId } = outputPlug

            this.removePinData('output', pinId)
          }
        }
      }
    } else if (_unitId && _pinId) {
      const unit = this.getUnit(_unitId)

      const refPin = unit.isPinRef(kind, _pinId)

      const inputPin = kind === 'input'
      const outputPin = kind === 'output'

      this._simUnplugPinFromUnitPin(
        type,
        pinId,
        subPinId,
        _unitId,
        _pinId,
        kind,
        propagate
      )

      if (outputPin) {
        if (refPin) {
          pin.take()
        }
      } else {
        if (propagate || (refPin && inputPin)) {
          unit.takePin(kind, _pinId)
        }
      }
    }

    const unlisten = deepGetOrDefault(
      this._plugUnlisten,
      [type, pinId, subPinId],
      undefined
    )

    if (unlisten) {
      unlisten()

      deepDestroy(this._plugUnlisten, [type, pinId, subPinId])
    }
  }

  public isPinRef(type: IO, pinId: any): boolean {
    const { specs } = this.__system

    const ref = isPinRef({ type, pinId }, this._spec, specs, new Set())

    return ref
  }

  private _simPlugEmptyPin = (
    type: IO,
    pinId: string,
    subPinId: string,
    propagate: boolean = true
  ): void => {
    // console.log('Graph', '_simPlugEmptyPin', type, pinId, subPinId)

    const emptySubPin = this._ensureEmptySubPin(type, pinId, subPinId)

    this._simSetExposedSubPin(
      type,
      pinId,
      type,
      subPinId,
      emptySubPin,
      propagate
    )
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
    const { inputs = { plug: {} } } = this._spec

    const pinNodeId = this._getExposedSubPinNodeId('input', pin)

    return someObj(inputs, ({ plug }) => {
      return someObj(plug, (i) => {
        const exposedSubPinNodeId = this._getExposedSubPinNodeId('input', i)

        return exposedSubPinNodeId === pinNodeId
      })
    })
  }

  public getExposedPin = <
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(
    type: T,
    id: K
  ): Pin => {
    if (type === 'input') {
      return this.getExposedInputPin(id as keyof I)
    } else {
      return this.getExposedOutputPin(id as keyof O)
    }
  }

  public getExposedInputPin = <K extends keyof I>(id: K): Pin<I[K]> => {
    return deepGet(this._exposedPin, ['input', id])
  }

  public getExposedOutputPin = <K extends keyof O>(id: K): Pin<O[K]> => {
    return deepGet(this._exposedPin, ['output', id])
  }

  public getExposedPinSpecs(): IOOf<GraphPinsSpec> {
    return {
      input: this.getExposedInputSpecs(),
      output: this.getExposedOutputSpecs(),
    }
  }

  public getExposedPinSpec<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K): GraphPinSpec {
    if (type === 'input') {
      return this.getExposedInputSpec(pinId as keyof I)
    } else {
      return this.getExposedOutputSpec(pinId as keyof O)
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

  public getExposedInputSpec<K extends keyof I>(pinId: K): GraphPinSpec {
    const inputs = this._spec.inputs || {}

    return inputs[pinId as string]
  }

  public getPlugSpec(type: IO, pinId: string, subPinId: string): GraphPinSpec {
    return this._spec[`${type}s`][pinId]['plug'][subPinId]
  }

  public getExposedInputSpecs(): GraphPinsSpec {
    const inputs = this._spec.inputs || {}

    return inputs
  }

  public getExposedOutputSpec<K extends keyof O>(pinId: K): GraphPinSpec {
    const outputs = this._spec.outputs || {}

    return outputs[pinId as string]
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

  public getSubComponent(unitId: string): Component_<any> {
    const unit = this.getUnit(unitId) as Component_

    return unit
  }

  public getGraph(unitId: string): Graph {
    const graph = this.getUnit(unitId) as Graph

    return graph
  }

  public removeUnitGhost(
    unitId: string,
    nextUnitId: string,
    spec: GraphSpec,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): { specId: string; bundle: UnitBundleSpec } {
    const data = this._removeUnitGhost(unitId, nextUnitId, spec, fork, bubble)

    const { bundle } = data

    emit && this.edit('remove_unit_ghost', unitId, nextUnitId, bundle, [])

    return data
  }

  public addUnitGhost(
    unitId: string,
    nextUnitId: string,
    nextUnitBundle: UnitBundleSpec,
    nextUnitPinMap: IOOf<Dict<string>>,
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

    emit && this.edit('add_unit_ghost', unitId, nextUnitId, nextUnitBundle, [])
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

          deepSet(outerSpec.merges, [type, pinId], {
            mergeId,
            otherPin: {
              unitId: otherUnitId,
              type: otherUnitPinType,
              pinId: otherUnitPinId,
            },
          })
        } else {
          deepSet(outerSpec.merges, [type, pinId], { mergeId, otherPin: null })
        }
      })
    }

    return outerSpec
  }

  private _addUnitGhost(
    unitId: string,
    nextUnitId: string,
    nextUnitBundle: UnitBundleSpec,
    nextUnitPinMap: IOOf<Dict<string>>
  ) {
    const { specs } = nextUnitBundle

    this.__system.injectSpecs(specs)

    const outerSpec = this.getUnitOuterSpec(unitId)

    this._removeUnit(unitId, false)

    this._addUnitBundleSpec(nextUnitId, nextUnitBundle)

    forIOObjKV(
      outerSpec.merges,
      (type, pinId, { mergeId, otherPin, exposedPin }) => {
        const nextPinId = deepGetOrDefault(nextUnitPinMap, [type, pinId], pinId)

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
            undefined,
            { mergeId }
          )
        }
      }
    )

    forIOObjKV(outerSpec.exposed, (type, pinId, outerPin) => {
      const nextPinId = deepGetOrDefault(nextUnitPinMap, [type, pinId], pinId)

      this._plugPin(
        outerPin.type,
        outerPin.pinId,
        outerPin.subPinId,
        {
          unitId: nextUnitId,
          pinId: nextPinId,
          kind: outerPin.type,
        },
        undefined
      )
    })
  }

  private _removeUnitGhost(
    unitId: string,
    nextUnitId: string,
    spec: GraphSpec,
    fork: boolean,
    bubble: boolean
  ): { specId: string; bundle: UnitBundleSpec } {
    const { specs } = this.__system

    const newSpec = this.__system.newSpec(spec)

    const outerSpec = this.getUnitOuterSpec(unitId)

    const unitSpec = this.getGraphUnitSpec(unitId)

    const unit = this._removeUnit(unitId, false, undefined, fork, bubble)

    const bundle = unitBundleSpec(unitSpec, specs, false)

    this._addUnitBundleSpec(nextUnitId, {
      unit: { id: newSpec.id },
      specs: {
        [newSpec.id]: newSpec,
      },
    })

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
            mergeId
          )
        } else {
          this._addPinToMerge(mergeId, nextUnitId, type, pinId)
        }

        if (exposedPin) {
          this._plugPin(
            exposedPin.type,
            exposedPin.pinId,
            exposedPin.subPinId,
            { mergeId },
            undefined
          )
        }
      }
    )

    forIOObjKV(outerSpec.exposed, (type, pinId, outerPin) => {
      this._plugPin(
        outerPin.type,
        outerPin.pinId,
        outerPin.subPinId,
        {
          unitId: nextUnitId,
          pinId,
          kind: outerPin.type,
        },
        undefined
      )
    })

    bundle.unit.memory = unit.snapshot()

    return { specId: newSpec.id, bundle }
  }

  public getUnitByPath(path: string[]): Unit<any, any> {
    let unit: Unit<any, any> = this

    for (const id of path) {
      unit = (unit as Graph).getUnit(id)
    }

    return unit
  }

  public getGraphChildren(): Dict<any> {
    const children = {}
    for (const unitId in this._unit) {
      const unit = this.getUnit(unitId)
      if (unit.isElement()) {
        // @ts-ignore
        const unitChildren = unit.refChildren()
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

  getMergeData(mergeId: string): any {
    const merge = this.getMerge(mergeId)

    const data = merge.getData()

    return data
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
    const state: Dict<any> = {}

    forEachValueKey(this._merge, (merge: Merge<any>, mergeId) => {
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

      deepSet(plugs, [type, pinId, subPinId], plug)
    })

    return plugs
  }

  public getPlugSpecs(): IOOf<Dict<Dict<GraphSubPinSpec>>> {
    return getPlugSpecs(this._spec)
  }

  public getPlug(type: IO, pinId: string, subPinId: string): Pin {
    const oppositeType = opposite(type)

    const exposedMerge = deepGet(this._exposedMerge, [type, pinId])

    const plug = exposedMerge.getPin(oppositeType, subPinId)

    return plug
  }

  public getMerge(mergeId: string): Merge {
    return this._merge[mergeId]
  }

  public refExposedMerges(): IOOf<Dict<Merge>> {
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
  ): GraphPlugOuterSpec | null {
    let pinSpec: GraphPlugOuterSpec = null

    this._forEachSpecPinOfType(type, (pinId, subPinId, subPinSpec) => {
      if (subPinSpec.mergeId === mergeId) {
        pinSpec = { pinId, subPinId, type, kind: subPinSpec.kind ?? type }
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
    bundle?: UnitBundleSpec,
    parentId?: string | null,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    this._addUnit(unitId, unit, bundle, parentId, fork, bubble)

    bundle = bundle ?? unit.getUnitBundleSpec({})

    emit && this.edit('add_unit', unitId, bundle, unit, [])

    if (this._transacting) {
      this._transaction.push(makeAddUnitAction(unitId, bundle))
    }
  }

  public fork(specId?: string, emit: boolean = true) {
    this._fork(specId, emit)
  }

  private _fork(specId?: string, emit: boolean = true, bubble: boolean = true) {
    if (this.__system.shouldFork(this.id)) {
      const prevSpecId = this.id

      const [id, spec] = this.__system.forkSpec(this._spec, specId)

      this.__system.unregisterUnit(this.id)

      this.id = id
      this._spec = spec

      this.__system.registerUnit(id)

      emit && this.emit('fork', prevSpecId, clone(spec), bubble, [])
    }
  }

  private _initAddUnit(
    unitId: string,
    unit: GraphUnitSpec,
    push: boolean = true
  ): void {
    const bundle = unitBundleSpec(unit, this.__system.specs, false)

    const _unit = unitFromBundleSpec(
      this.__system,
      bundle,
      this.__system.specs,
      push,
      this._branch
    )

    this._memAddUnit(unitId, _unit, bundle)
    this._simAddUnit(unitId, { unit }, _unit, null, false)
  }

  private _initAddUnits(units: GraphUnitsSpec, push: boolean): void {
    forEachValueKey(units, (unit: Unit, unitId: string) => {
      this._initAddUnit(unitId, unit, push)
    })
  }

  private _addUnit = (
    unitId: string,
    unit: Unit,
    bundle: UnitBundleSpec = null,
    parentId: string | null,
    fork: boolean = true,
    bubble: boolean = true
  ) => {
    // console.log('_addUnit', unitId, unit, bundle)

    fork && this._fork(undefined, true, bubble)

    if (this._unit[unitId]) {
      throw new Error('duplicated unit id ' + unitId)
    }

    bundle = bundle ?? unit.getUnitBundleSpec({})

    this.__system.injectSpecs(bundle.specs)

    this.emit('before_add_unit', unitId, unit, [])

    this._specAddUnit(unitId, unit, bundle, parentId)
    this._memAddUnit(unitId, unit, bundle)
    this._simAddUnit(unitId, bundle, unit, parentId)

    return unit
  }

  public addUnitSpecs = (units: GraphUnitsSpec): void => {
    this._addUnitSpecs(units)
  }

  private _addUnitSpecs = (units: GraphUnitsSpec): void => {
    forEachValueKey(units, (unit, unitId) => {
      this._addUnitBundleSpec(unitId, { unit })
    })
  }

  private injectSubComponent = (
    unitId: string,
    unitSpec: GraphUnitSpec,
    unit: Component_,
    emit?: boolean
  ): void => {
    this._specInjectSubComponent(unitId)
    this._simInjectSubComponent(unitId, unitSpec, unit)

    const bundle = unit.getUnitBundleSpec({})

    emit && this.emit('set_sub_component', unitId, bundle)
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

      const ChildBundle = bundleFromId(id, this.__system.specs, classes)

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

      const ChildBundle = bundleFromId(id, this.__system.specs, classes)

      unit.appendChild(ChildBundle)
    }

    this._specInjectSubComponent(unitId)
  }

  private _specInjectSubComponent = (unitId: string): void => {
    // console.log('Graph', '_specInjectSubComponent', unitId)

    deepSet(this._spec, ['component', 'subComponents', unitId], {
      children: [],
    })
  }

  private _specAppendRoot = (unitId: string): void => {
    // console.log('Graph', '_specAppendRoot', unitId)

    this._spec.component.children = this._spec.component.children || []
    this._spec.component.children.push(unitId)
  }

  private _specRemoveSubComponent = (
    unitId: string,
    parentId: string | null
  ): void => {
    // console.log('Graph', '_specRemoveSubComponent', unitId)

    const { subComponents } = this._spec.component

    const subComponent = subComponents[unitId]

    const { children = [] } = subComponent

    for (const childId of children) {
      if (parentId) {
        this._spec.component.subComponents[parentId].children.push(childId)
      } else {
        this._spec.component.children.push(childId)
      }
    }

    if (this._spec.component.slots) {
      this._spec.component.slots = this._spec.component?.slots?.filter(
        ([subComponentId, slotName]) => {
          return subComponentId !== unitId
        }
      )
    }

    delete subComponents[unitId]
  }

  private _getSubComponentParentId = (unitId: string): string | null => {
    return getSubComponentParentId(this._spec, unitId)
  }

  private _getSubComponentSlotName = (unitId: string): string | null => {
    const parentId = this._getSubComponentParentId(unitId)

    return deepGetOrDefault(
      this._spec,
      ['component', 'subComponents', parentId, 'childSlot', unitId],
      'default'
    )
  }

  private _appendSubComponentChild = (
    subComponentId: string,
    childId: string,
    slot: string,
    fork: boolean,
    bubble: boolean
  ): void => {
    // console.log('Graph', '_appendSubComponentChild', subComponentId, childId, slot)

    fork && this._fork(undefined, true, bubble)

    this._specSubComponentAppendChild(subComponentId, childId, slot)
    this._simSubComponentAppendChild(subComponentId, childId, slot)
  }

  private _insertSubComponentChild = (
    subComponentId: string,
    childId: string,
    at: number,
    slot: string,
    emit?: boolean
  ): void => {
    // console.log('Graph', '_insertSubComponentChild', subComponentId, childId, at, slot)

    this._fork()

    this._specSubComponentInsertChild(subComponentId, childId, at, slot)
    this._simSubComponentInsertChild(subComponentId, childId, at, slot, emit)
  }

  private _simRemoveSubComponentFromParent = (
    subComponentId: string,
    emit: boolean
  ): void => {
    // console.log('Graph', '_simRemoveSubComponentFromParent', subComponentId)

    const currentParentId = this._getSubComponentParentId(subComponentId)

    if (currentParentId) {
      this._simSubComponentRemoveChild(currentParentId, subComponentId)
    } else {
      this._simRemoveRoot(subComponentId, emit)
    }
  }

  private _specRemoveSubComponentChild = (
    subComponentId: string,
    childId: string
  ) => {
    removeSubComponentChild({ subComponentId, childId }, this._spec.component)
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

  private _specSubComponentInsertChild = (
    subComponentId: string,
    childId: string,
    at: number,
    slot: string
  ) => {
    insertSubComponentChild(
      { parentId: subComponentId, childId, at },
      this._spec.component
    )
  }

  private _simSubComponentAppendChild = (
    subComponentId: string,
    childId: string,
    slotName: string
  ): void => {
    const subComponentUnit = this.getUnit(subComponentId) as Element_ | Graph
    const childUnit = this.getUnit(childId) as Element_ | Graph

    subComponentUnit.registerParentRoot(childUnit, slotName)
  }

  private _simSubComponentInsertChild = (
    subComponentId: string,
    childId: string,
    at: number,
    slotName: string,
    emit: boolean
  ) => {
    const subComponentUnit = this.getUnit(subComponentId) as Element_ | Graph
    const childUnit = this.getUnit(childId) as Element_ | Graph

    subComponentUnit.registerParentRoot(childUnit, slotName, at, emit)
  }

  private _unitUnlisten: Dict<Unlisten> = {}

  public addUnitSpec(
    unitId: string,
    bundle: UnitBundleSpec,
    parentId?: string | null,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): Unit {
    // console.log('Graph', 'addUnit', bundle, unitId)

    const specs_ = weakMerge(this.__system.specs, bundle.specs ?? {})

    applyUnitDefaultIgnored(bundle.unit, specs_)

    const unit = unitFromBundleSpec(
      this.__system,
      bundle,
      specs_,
      true,
      this._branch
    )

    this.addUnit(unitId, unit, bundle, parentId, emit, fork, bubble)

    return unit
  }

  private _addUnitSpec(
    unitId: string,
    bundle: UnitBundleSpec,
    parentId: string | null,
    fork: boolean = true,
    bubble: boolean = true
  ): Unit {
    // console.log('Graph', 'addUnit', bundle, unitId, fork)

    const specs = weakMerge(this.__system.specs, bundle.specs ?? {})

    applyUnitDefaultIgnored(bundle.unit, specs)

    const unit = unitFromBundleSpec(
      this.__system,
      bundle,
      specs,
      true,
      this._branch
    )

    this._addUnit(unitId, unit, bundle, parentId, fork, bubble)

    return unit
  }

  public _addUnitBundleSpec(unitId: string, bundle: UnitBundleSpec): Unit {
    // console.log('Graph', '_addUnitBundleSpec', unitId, bundle)

    const unit = unitFromBundleSpec(
      this.__system,
      bundle,
      this.__system.specs,
      true,
      this._branch
    )

    this._addUnit(unitId, unit, bundle, null)

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
    bundle: UnitBundleSpec = null,
    parentId: string | null = null
  ): void {
    // console.log('Graph', '_specAddUnit', unitId, bundle?.unit)

    bundle = bundle ?? unit.getUnitBundleSpec({})

    const { unit: unitSpec } = bundle

    deepSet(this._spec, ['units', unitId], unitSpec)

    if (unit.isElement()) {
      this._specInjectSubComponent(unitId)
      this._specAppendRoot(unitId)
    }
  }

  private setUnitPin = (unitId: string, type: IO, pinId: string) => {
    const unit = this.getUnit(unitId)

    const pinNodeId = getPinNodeId(unitId, type, pinId)
    const pin = unit.getPin(type, pinId)

    this._pin[pinNodeId] = pin
  }

  private setUnitInput = (unitId: string, pinId: string) => {
    this.setUnitPin(unitId, 'input', pinId)
  }

  private setUnitOutput = (unitId: string, pinId: string) => {
    this.setUnitPin(unitId, 'output', pinId)
  }

  private _memAddUnit(
    unitId: string,
    unit: Unit,
    bundle: UnitBundleSpec = null
  ): void {
    // console.log('Graph', '_memAddUnit', unitId, unit)

    bundle = bundle ?? unit.getUnitBundleSpec({})

    const { unit: unitSpec } = bundle

    const all_unlisten: Unlisten[] = []

    unit.setParent(this as any)

    this._unit[unitId] = unit

    const remove_unit_pin = (type: IO, pinId: string) => {
      const pinNodeId = getPinNodeId(unitId, type, pinId)

      const pipedToMerge = this._pipedTo[pinNodeId]
      const pipedFromMerge = this._pipedFrom[pinNodeId]

      const pinPlug = findUnitPinPlug(this._spec, unitId, type, pinId)

      if (pipedToMerge) {
        this._removePinOrMerge(pipedToMerge, unitId, type, pinId, false, false)
      }

      if (pipedFromMerge) {
        this._removePinOrMerge(
          pipedFromMerge,
          unitId,
          type,
          pinId,
          false,
          false
        )
      }

      if (pinPlug) {
        this._unplugPin(
          type,
          pinPlug.pinId,
          pinPlug.subPinId,
          false,
          false,
          false
        )
      }

      delete this._pipedTo[pinNodeId]
      delete this._pipedFrom[pinNodeId]

      delete this._pin[pinNodeId]

      deepDelete(this._spec, ['units', unitId, type, pinId])
      deepDelete(this._spec, ['units', unitId, 'memory', type, pinId])
    }

    const remove_unit_input = (pinId: string): void => {
      remove_unit_pin('input', pinId)
    }

    const remove_unit_output = (pinId: string): void => {
      remove_unit_pin('output', pinId)
    }

    const rename_unit_pin = (type: IO, name: string, newName: string) => {
      // console.log('rename_unit_pin', type, name, newName)

      const pinNodeId = getPinNodeId(unitId, type, name)
      const nextPinNodeId = getPinNodeId(unitId, type, newName)

      const mergeId = deepGetOrDefault(
        this._pinToMerge,
        [unitId, type, name],
        null
      )

      if (mergeId) {
        const merge = this.getMerge(mergeId)

        const oppositeType = opposite(type)

        merge.renamePin(oppositeType, pinNodeId, nextPinNodeId)

        deepSet(this._pinToMerge, [unitId, type, newName], mergeId)

        delete this._pinToMerge[unitId][type][name]

        if (this._pipedTo[pinNodeId]) {
          this._pipedTo[nextPinNodeId] = this._pipedTo[pinNodeId]

          delete this._pipedTo[pinNodeId]
        }
        if (this._pipedFrom[pinNodeId]) {
          this._pipedFrom[nextPinNodeId] = this._pipedFrom[pinNodeId]

          delete this._pipedFrom[pinNodeId]
        }

        renameUnitPin(
          { unitId, type, pinId: name, newPinId: newName },
          this._spec
        )
      }

      this._pin[nextPinNodeId] = this._pin[pinNodeId]

      delete this._pin[pinNodeId]
    }

    const inputs = unit.getInputNames()
    const outputs = unit.getOutputNames()

    const boundSetUnitInput = this.setUnitInput.bind(this, unitId)
    const boundSetUnitOutput = this.setUnitOutput.bind(this, unitId)

    forEach(inputs, boundSetUnitInput)
    forEach(outputs, boundSetUnitOutput)

    let unit_pin_listener: Dict<IOOf<Dict<Function>>> = {}

    const setup_unit_constant_pin = (type: IO, pinId: string) => {
      const pin = this.getUnitPin(unitId, type, pinId)

      const set = (data: any) => {
        if (this._paused) {
          return
        }

        if (!this._preventFork) {
          this._fork()
        }

        this._specSetUnitPinData(unitId, type, pinId, data)

        this.edit('set_unit_pin_data', unitId, type, pinId, data, [])
      }

      const edit = (data: Graph) => {
        const Class = data.constructor

        set(Class)
      }

      const pin_data_unlisten = pin.addListener('data', set)
      const pin_edit_unlisten = pin.addListener('edit', edit)

      const pin_unlisten = callAll([pin_data_unlisten, pin_edit_unlisten])

      deepSet(unit_pin_listener, [unitId, type, pinId], pin_unlisten)

      all_unlisten.push(pin_unlisten)
    }

    forEach(inputs, (pinId) => {
      if (unit.isPinConstant('input', pinId)) {
        setup_unit_constant_pin('input', pinId)
      }
    })

    all_unlisten.push(
      unit.addListener('destroy', (path: string[] = []) => {
        const bubble = () => {
          this.emit('destroy', [unitId, ...path])
        }

        if (
          this._destroying ||
          (this._removingUnit && this._removingUnit.has(unitId))
        ) {
          return
        }

        if (path.length > 0) {
          bubble()

          return
        }

        const fork = !this.__done

        this._removeUnit(unitId, false, false, fork, true)

        bubble()
      })
    )
    all_unlisten.push(unit.addListener('set_input', boundSetUnitInput))
    all_unlisten.push(
      unit.addListener('before_remove_input', remove_unit_input)
    )
    all_unlisten.push(unit.addListener('set_output', boundSetUnitOutput))
    all_unlisten.push(
      unit.addListener('before_remove_output', remove_unit_output)
    )
    all_unlisten.push(
      unit.addListener('rename_input', rename_unit_pin.bind(this, 'input'))
    )
    all_unlisten.push(
      unit.addListener('rename_output', rename_unit_pin.bind(this, 'output'))
    )
    all_unlisten.push(
      unit.addListener(
        'set_pin_constant',
        (type: IO, pinId: string, constant: boolean) => {
          this._specSetUnitPinConstant(unitId, type, pinId, constant)

          const data = this.getUnitPinData(unitId, type, pinId)

          if (constant) {
            setup_unit_constant_pin(type, pinId)
          } else {
            const pin_data_unlisten = deepGetOrDefault(
              unit_pin_listener,
              [unitId, type, pinId],
              undefined
            )

            if (pin_data_unlisten) {
              pin_data_unlisten()

              remove(all_unlisten, pin_data_unlisten)

              deepDestroy(unit_pin_listener, [unitId, type, pinId])
            }
          }
        }
      )
    )

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
      for (const DEFAULT_EVENT of GRAPH_DEFAULT_EVENTS) {
        all_unlisten.push(
          unit.addListener(DEFAULT_EVENT as keyof G_EE, (...args) => {
            this.emit(
              DEFAULT_EVENT,
              // @ts-ignore
              ...args
                .slice(0, -1)
                .concat([[unitId, ...(args[args.length - 1] ?? [])]])
            )
          })
        )
      }

      all_unlisten.push(
        unit.prependListener(
          'fork',
          (
            forkId: string,
            spec: GraphSpec,
            bubble: boolean,
            path: string[]
          ) => {
            if (path.length === 0) {
              bubble && this._fork()

              deepSet(this._spec, ['units', unitId, 'id'], spec.id)
            }
          }
        )
      )
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
      }
    }

    const unlisten = callAll(all_unlisten)

    this._unitUnlisten[unitId] = unlisten
  }

  private _simAddUnit(
    unitId: string,
    bundle: UnitBundleSpec,
    unit: Unit,
    parentId: string | null,
    registerRoot: boolean = true
  ): void {
    if (unit.isElement()) {
      this.emit('set_sub_component', unitId, bundle)

      if (registerRoot) {
        if (parentId) {
          const parentComponent = this.getUnit(parentId) as Component_

          parentComponent.registerParentRoot(unit as Component_, 'default')
        } else {
          this.registerRoot(unit as Component_, true)
        }
      }

      this._simInjectSubComponent(unitId, bundle.unit, unit as Component_)
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
    const parentId = getSubComponentParentId(this._spec, unitId)

    this._specRemoveSubComponent(unitId, parentId)
  }

  public removeUnit(
    unitId: string,
    emit: boolean = true,
    take: boolean = true,
    destroy: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): U {
    const unit = this.getUnit(unitId)

    const unitBundle = unit.getUnitBundleSpec({})

    this._removeUnit(unitId, take, destroy, fork, bubble)

    emit && this.edit('remove_unit', unitId, unitBundle, unit, [])

    if (this._transacting) {
      this._transaction.push(makeRemoveUnitAction(unitId, unitBundle))
    }

    return unit
  }

  public cloneUnit(
    unitId: string,
    newUnitId: string,
    parentId?: string | null,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): Unit {
    const newUnit = this._cloneUnit(unitId, newUnitId, parentId, fork, bubble)

    emit && this.edit('clone_unit', unitId, newUnitId, newUnit, [])

    return newUnit
  }

  private _cloneUnit(
    unitId: string,
    newUnitId: string,
    parentId: string | null = null,
    fork: boolean = true,
    bubble: boolean = true
  ): Unit {
    // console.log('_cloneUnit', unitId, newUnitId, parentId)

    const unit = this.getUnit(unitId)

    const [newUnit, bundle] = cloneUnit(unit, { deep: true })

    this._addUnit(newUnitId, newUnit, bundle, parentId, fork, bubble)

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

    if (mergeUnit) {
      forIOObjKV(mergeUnit, (type, pinId) => {
        callback(type, pinId)
      })
    }
  }

  private _removeUnit(
    unitId: string,
    take: boolean = true,
    destroy: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ): Unit {
    // console.log('_removeUnit', unitId, take, destroy, fork)

    const unit = this.getUnit(unitId)

    this._removingUnit = this._removingUnit ?? new Set()
    this._removingUnit.add(unitId)

    fork && this._fork(undefined, true, bubble)

    this.emit('before_remove_unit', unitId, unit, [])

    const isComponent = this._isUnitComponent(unitId)

    this._simRemoveUnit(unitId, take)
    this._memRemoveUnit(unitId)
    this._specRemoveUnit(unitId, isComponent)

    destroy && unit.destroy()

    this._removingUnit.delete(unitId)
    if (!this._removingUnit.size) {
      this._removingUnit = undefined
    }

    return unit
  }

  private _specRemoveUnit(unitId: string, removeComponent: boolean): void {
    // console.log('Graph', '_specRemoveUnit', unitId, removeComponent)

    if (removeComponent) {
      const parentId = getSubComponentParentId(this._spec, unitId)

      this._specRemoveSubComponentFromParent(unitId)
      this._specRemoveSubComponent(unitId, parentId)
    }

    this._specUnplugUnit(unitId)

    delete this._spec.units[unitId]
  }

  private _memRemoveUnit(
    unitId: string,
    removeFromMerge: boolean = true
  ): void {
    // console.log('_memRemoveUnit', unitId, removeFromMerge)

    const unit = this.getUnit(unitId)

    const unlisten = this._unitUnlisten[unitId]

    unlisten()

    if (removeFromMerge) {
      this._memUnplugUnit(unitId)
    }

    unit.setParent(null)

    delete this._unitToMergeCount[unitId]
    delete this._unitToMerge[unitId]
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
      kind: 'output',
    })

    this._simUnplugUnit(unitId, take)

    if (take) {
      if (exposedOutputId) {
        this.takeOutput(exposedOutputId)
      }
    }

    if (unit.isElement()) {
      const subComponentSpec = this._spec.component?.subComponents[unitId] ?? {}

      const parentId = getSubComponentParentId(this._spec, unitId)

      const { children = [] } = subComponentSpec

      for (const childId of children) {
        const child = this.getSubComponent(childId)

        this._simSubComponentRemoveChild(unitId, childId)

        if (parentId) {
          const parent = this.getSubComponent(parentId)

          parent.registerParentRoot(child, 'default')
        } else {
          this.registerRoot(child, false)
        }
      }

      this._simRemoveSubComponentFromParent(unitId, true)
    }
  }

  private _specUnplugUnit = (unitId: string): void => {
    const { merges } = this._spec

    const _merges = clone(merges)

    forEachPinOnMerges(_merges, (mergeId, mergeUnitId, type, pinId) => {
      const merge = clone(this.getMergeSpec(mergeId))

      if (mergeUnitId === unitId) {
        if (merge) {
          delete merge[unitId]

          const mergePinCount = getMergePinCount(merge)

          if (mergePinCount < 2) {
            const mergeInputPlug = this.findMergeExposedSubPin('input', mergeId)
            const mergeOutputPlug = this.findMergeExposedSubPin(
              'output',
              mergeId
            )

            const mergeSpec = clone(this.getMergeSpec(mergeId))

            delete mergeSpec[unitId]

            const otherMergeUnitId = getObjSingleKey(mergeSpec)
            const otherMergeUnitPinType = getObjSingleKey(
              mergeSpec?.[otherMergeUnitId] ?? {}
            ) as IO
            const otherMergeUnitPinId = getObjSingleKey(
              mergeSpec?.[otherMergeUnitId]?.[otherMergeUnitPinType] ?? {}
            )

            this._specRemoveMerge(mergeId)

            if (otherMergeUnitId) {
              if (mergeInputPlug) {
                this._specPlugPin(
                  'input',
                  mergeInputPlug.pinId,
                  mergeInputPlug.subPinId,
                  {
                    unitId: otherMergeUnitId,
                    pinId: otherMergeUnitPinId,
                    kind: otherMergeUnitPinType,
                  }
                )
              }

              if (mergeOutputPlug) {
                this._specPlugPin(
                  'output',
                  mergeOutputPlug.pinId,
                  mergeOutputPlug.subPinId,
                  {
                    unitId: otherMergeUnitId,
                    pinId: otherMergeUnitPinId,
                    kind: otherMergeUnitPinType,
                  }
                )
              }
            }
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
        const mergeInputPlug = this.findMergeExposedSubPin('input', mergeId)
        const mergeOutputPlug = this.findMergeExposedSubPin('output', mergeId)

        const mergeSpec = clone(this.getMergeSpec(mergeId))

        delete mergeSpec[unitId]

        const otherMergeUnitId = getObjSingleKey(mergeSpec)
        const otherMergeUnitPinType = getObjSingleKey(
          mergeSpec?.[otherMergeUnitId] ?? {}
        ) as IO
        const otherMergeUnitPinId = getObjSingleKey(
          mergeSpec?.[otherMergeUnitId]?.[otherMergeUnitPinType] ?? {}
        )

        this._simRemoveMerge(mergeId, take)

        if (otherMergeUnitId) {
          if (mergeInputPlug) {
            this._simPlugPin(
              'input',
              mergeInputPlug.pinId,
              mergeInputPlug.subPinId,
              {
                unitId: otherMergeUnitId,
                pinId: otherMergeUnitPinId,
                kind: otherMergeUnitPinType,
              },
              undefined,
              false
            )
          }

          if (mergeOutputPlug) {
            this._simPlugPin(
              'output',
              mergeOutputPlug.pinId,
              mergeOutputPlug.subPinId,
              {
                unitId: otherMergeUnitId,
                pinId: otherMergeUnitPinId,
                kind: otherMergeUnitPinType,
              },
              undefined,
              false
            )
          }
        }
      } else {
        this._simRemoveUnitFromMerge(unitId, mergeId, take)
      }
    }

    this._forEachSpecPinPlug((type, pinId, subPinId, subPinSpec) => {
      if (subPinSpec.unitId === unitId) {
        this._simUnplugPin(type, pinId, subPinId, take)
      }
    })
  }

  private _addUnitMerges = (
    merges: GraphUnitMerges,
    propagate: boolean = true
  ): void => {
    forEachValueKey(merges, (merge, mergeId) => {
      if (this.hasMerge(mergeId)) {
        forEachPinOnMerge(merge, (mergeUnitId, type, pinId) => {
          if (this.hasMergePin(mergeId, mergeUnitId, type, pinId)) {
            //
          } else {
            this._addPinToMerge(mergeId, mergeUnitId, type, pinId, propagate)
          }
        })
      } else {
        this._addMerge(merge, mergeId, undefined, propagate)
      }
    })
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
    fork?: boolean
  ): void => {
    // console.log('Graph', 'addMerge', mergeId, mergeSpec, emit, propagate, fork)

    const merge = this._addMerge(mergeSpec, mergeId, propagate, fork)

    emit && this.edit('add_merge', mergeId, mergeSpec, merge, [])

    if (this._transacting) {
      this._transaction.push(makeAddMergeAction(mergeId, mergeSpec))
    }
  }

  private _memUnplugUnit(unitId: string) {
    const unitToMerge = clone(this._unitToMerge[unitId] || new Set<string>())
    const unitToMergeCount = clone(this._unitToMergeCount[unitId] || {})

    const unitToPlug = clone(this._pinToPlug[unitId] ?? {})

    forIOObjKV(unitToPlug, (kind, unitPinId, { pinId, subPinId, type }) => {
      this._memUnplugPin(type, pinId, subPinId)
    })

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

    // merge.pause()

    const mergeInputPinId = getMergePinNodeId(mergeId, 'input')

    const mergeInputPin = new Pin({}, this.__system)

    merge.addInput(mergeInputPinId, mergeInputPin)

    // if (!this._paused) {
    //   merge.play()
    // }

    return merge
  }

  private _pinToPlug: Dict<
    IOOf<Dict<{ pinId: string; subPinId: string; type: IO }>>
  > = {}

  private _addMerge = (
    mergeSpec: GraphMergeSpec,
    mergeId: string,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): Merge => {
    // console.log('Graph', '_addMerge', mergeId, mergeSpec, propagate)

    fork && this._fork(undefined, true, bubble)

    const merge = this._createMerge(mergeId)

    this.emit('before_add_merge', mergeId, mergeSpec, merge, [])

    const plugs: { type: IO; pinId: string; subPinId: string }[] = []

    forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
      const plug = deepGetOrDefault(
        this._pinToPlug,
        [unitId, type, pinId],
        undefined
      )

      if (plug) {
        plugs.push({
          type: plug.type,
          pinId: plug.pinId,
          subPinId: plug.subPinId,
        })

        this._unplugPin(
          plug.type,
          plug.pinId,
          plug.subPinId,
          false,
          false,
          false
        )
      }
    })

    this._specAddMerge(mergeId, mergeSpec, merge)
    this._memAddMerge(mergeId, mergeSpec, merge)
    this._simAddMerge(mergeId, mergeSpec, merge, propagate)

    forEach(plugs, (plug) => {
      this._plugPin(
        plug.type,
        plug.pinId,
        plug.subPinId,
        { mergeId },
        undefined,
        propagate
      )
    })

    return merge
  }

  private _specAddMerge = (
    mergeId: string,
    mergeSpec: GraphMergeSpec,
    merge: Merge
  ): void => {
    // console.log('Graph', '_specAddMerge', mergeId, mergeSpec)

    deepSet(this._spec, ['merges', mergeId], mergeSpec)

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
    const pinNodeId = getPinNodeId(unitId, type, pinId)

    propagate = propagate || this.isUnitRefPin(unitId, type, pinId)

    this._simSetBranch(mergeId, type, pinNodeId, propagate)
  }

  private _specAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    // console.log('Graph', '_specAddPinToMerge', mergeId, unitId, type, pinId)

    deepSet(this._spec, ['merges', mergeId, unitId, type, pinId], true)
  }

  private _memAddPinToMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ): void {
    // console.log('Graph', '_memAddPinToMerge', mergeId, unitId, type, pinId)

    if (isSelfPin(type, pinId)) {
      this._mergeToSelfUnit[mergeId] = unitId
      this._selfUniToMerge[unitId] = mergeId
    }

    this._mergePinCount[mergeId] = this._mergePinCount[mergeId] || 0
    this._mergePinCount[mergeId]++

    this._unitToMerge[unitId] = this._unitToMerge[unitId] || new Set()
    this._unitToMerge[unitId].add(mergeId)

    this._unitToMergeCount[unitId] = this._unitToMergeCount[unitId] || {}
    this._unitToMergeCount[unitId][mergeId] =
      this._unitToMergeCount[unitId][mergeId] || 0
    this._unitToMergeCount[unitId][mergeId]++

    deepSet(this._pinToMerge, [unitId, type, pinId], mergeId)

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._memSetBranch(mergeId, type, pinNodeId)
  }

  private _memRemoveMerge(mergeId: string): void {
    // console.log('Graph', '_memRemoveMerge', mergeId)

    this._memRemoveAllMergePlug(mergeId)
    this._memRemoveAllMergePin(mergeId)
    this._memRemoveAllMergeRef(mergeId)

    const mergeInputNodeId = getMergePinNodeId(mergeId, 'input')
    const mergeOutputNodeId = getMergePinNodeId(mergeId, 'output')

    delete this._pin[mergeInputNodeId]
    delete this._pin[mergeOutputNodeId]

    delete this._merge[mergeId]
    delete this._mergePinCount[mergeId]
  }

  private _specRemoveMerge(mergeId: string): void {
    // console.log('Graph', '_specRemoveMerge', mergeId)

    this._specRemoveAllMergePlug(mergeId)
    this._specRemoveAllMergePin(mergeId)

    removeMerge({ mergeId }, this._spec)
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

  public isUnitRefInput(unitId: string, pinId: string): boolean {
    const unit = this.getUnit(unitId)
    const isRefPin = unit.hasRefInputNamed(pinId)
    return isRefPin
  }

  public addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    emit: boolean = true,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void => {
    this._addPinToMerge(mergeId, unitId, type, pinId, propagate, fork, bubble)

    emit && this.edit('add_pin_to_merge', mergeId, unitId, type, pinId, [])
  }

  private _addPinToMerge = (
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
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

    const plug = deepGetOrDefault(
      this._pinToPlug,
      [unitId, type, pinId],
      undefined
    )

    if (plug) {
      this._unplugPin(type, plug.pinId, plug.subPinId, propagate, fork, bubble)
    }

    this._specAddPinToMerge(mergeId, unitId, type, pinId)
    this._memAddPinToMerge(mergeId, unitId, type, pinId)
    this._simAddPinToMerge(mergeId, unitId, type, pinId, propagate)

    if (plug) {
      this._plugPin(
        type,
        plug.pinId,
        plug.subPinId,
        { mergeId },
        undefined,
        propagate
      )
    }
  }

  public removeMerge(
    mergeId: string,
    emit: boolean = true,
    take: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    // console.log('Graph', 'removeMerge', mergeId, emit, take, fork)

    const mergeSpec = this.getMergeSpec(mergeId)

    const merge = this._removeMerge(mergeId, take, fork, bubble)

    emit && this.edit('remove_merge', mergeId, mergeSpec, merge, [])

    if (this._transacting) {
      this._transaction.push(makeRemoveMergeAction(mergeId, mergeSpec))
    }
  }

  public _removeMerge(
    mergeId: string,
    propagate: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ): Merge {
    // console.log('Graph', '_removeMerge', mergeId, propagate)

    fork && this._fork(undefined, true, bubble)

    this._validateMergeId(mergeId)

    const merge = this.getMerge(mergeId)
    const mergeSpec = this.getMergeSpec(mergeId)

    this.emit('before_remove_merge', mergeId, mergeSpec, merge, [])

    this._simRemoveMerge(mergeId, propagate)
    this._memRemoveMerge(mergeId)
    this._specRemoveMerge(mergeId)

    merge.destroy()

    return merge
  }

  private _simRemoveMerge(mergeId: string, take: boolean) {
    // console.log('Graph', '_simRemoveMerge', mergeId, take)
    //
    const merge = this.getMerge(mergeId)

    this._simRemoveAllPlugsFromMerge(mergeId, take)
    this._simRemoveAllPinsFromMerge(mergeId, take)
  }

  private _simRemoveAllPlugsFromMerge = (
    mergeId: string,
    take: boolean = true
  ) => {
    // console.log('Graph', '_simRemoveAllPlugsFromMerge', mergeId, this._spec.outputs)

    this._forEachSpecPinPlug(
      (
        type: IO,
        pinId: string,
        subPinId: string,
        subPinSpec: GraphSubPinSpec
      ) => {
        if (subPinSpec.mergeId === mergeId) {
          this._simUnplugPin(type, pinId, subPinId, take)
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
          this._simUnplugPin(type, pinId, subPinId)
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
      forEachValueKey(output || {}, (_, outputId) => {
        this._simRemovePinFromMerge(mergeId, unitId, 'output', outputId, false)
      })
      forEachValueKey(input || {}, (_, inputId) => {
        this._simRemovePinFromMerge(mergeId, unitId, 'input', inputId, take)
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
    propagate: boolean = false,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    this._removePinFromMerge(
      mergeId,
      unitId,
      type,
      pinId,
      propagate,
      fork,
      bubble
    )

    emit && this.edit('remove_pin_from_merge', mergeId, unitId, type, pinId, [])
  }

  private _removePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    propagate: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    // console.log('Graph', '_removePinFromMerge', mergeId, unitId, type, pinId)

    fork && this._fork(undefined, true, bubble)

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
    propagate: boolean,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    const mergePinCount = this._mergePinCount[mergeId]

    if (mergePinCount > 2) {
      this._removePinFromMerge(
        mergeId,
        unitId,
        type,
        pinId,
        propagate,
        fork,
        bubble
      )
    } else {
      this._removeMerge(mergeId, propagate, fork, bubble)
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

    removePinFromMerge({ mergeId, unitId, type, pinId }, this._spec)
  }

  private _simRemovePinFromMerge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string,
    take: boolean = true
  ): void {
    // console.log('Graph', '_simRemovePinFromMerge', mergeId, unitId, type, pinId)

    const pinNodeId = getPinNodeId(unitId, type, pinId)

    this._simRemoveBranch(mergeId, type, pinNodeId, take)

    if (
      take ||
      isSelfPin(type, pinId) ||
      this.isUnitRefPin(unitId, type, pinId)
    ) {
      const pin = this._pin[pinNodeId]

      const mergeSpec = this.getMergeSpec(mergeId)

      if (this.isUnitRefPin(unitId, type, pinId)) {
        if (type === 'output') {
          forEachInputOnMerge(mergeSpec, (unitId, pinId): void => {
            this._removeUnitPinData(unitId, 'input', pinId)
          })
        } else {
          pin.take()
        }
      } else {
        pin.take()
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

  setUnitPinSetId(
    unitId: string,
    type: IO,
    pinId: string,
    newPinId: string,
    emit: boolean = true
  ): void {
    const unit = this.getUnit(unitId) as Graph

    unit.setPinSetId(type, pinId, newPinId, false)

    emit && this.edit('set_unit_pin_set_id', unitId, type, pinId, newPinId, [])
  }

  public setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    this._setUnitPinConstant(unitId, type, pinId, constant, fork, bubble)

    const data = this.getUnitPinData(unitId, type, pinId)

    emit &&
      this.edit(
        'set_unit_pin_constant',
        unitId,
        type,
        pinId,
        constant,
        data,
        []
      )
  }

  private _setUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean,
    fork: boolean,
    bubble: boolean
  ) {
    fork && this._fork(undefined, true, bubble)

    this._specSetUnitPinConstant(unitId, type, pinId, constant)

    if (!constant) {
      const data = deepGetOrDefault(
        this._spec,
        ['units', unitId, type, pinId, 'data'],
        undefined
      )

      if (data !== undefined) {
        removeUnitPinData({ unitId, type, pinId }, this._spec)
      }
    }

    const unit = this.getUnit(unitId)

    unit.setPinConstant(type, pinId, constant)
  }

  private _specSetUnitPinConstant(
    unitId: string,
    type: IO,
    pinId: string,
    constant: boolean
  ) {
    setUnitPinConstant({ unitId, type, pinId, constant }, this._spec)
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
    ignored: boolean,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._setUnitPinIgnored(unitId, type, pinId, ignored, fork, bubble)

    this.edit('set_unit_pin_ignored', unitId, type, pinId, ignored, [])
  }

  private _setUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean,
    fork: boolean,
    bubble: boolean
  ): void {
    fork && this._fork(undefined, true, bubble)

    this._specSetUnitPinIgnored(unitId, type, pinId, ignored)
    this._simSetUnitPinIgnored(unitId, type, pinId, ignored, fork)
  }

  private _specSetUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean
  ): void {
    deepSet(this._spec, ['units', unitId, type, pinId, 'ignored'], ignored)
  }

  private _simSetUnitPinIgnored(
    unitId: string,
    type: IO,
    pinId: string,
    ignored: boolean,
    fork: boolean
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

      forEachValueKey(this._spec[`${type}s`] || {}, ({ plug }, id) => {
        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]

          if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
            this._unplugPin(type, id, subPinId, false, false, false)

            break
          }
        }
      })
    }

    unit.setPinIgnored(type, pinId, ignored)
  }

  public setUnitId(unitId: string, newUnitId: string, name: string): void {
    this._setUnitId(unitId, newUnitId, name)

    this.edit('set_unit_id', unitId, newUnitId, name, [])
  }

  public setName(name: string, emit: boolean = true, fork: boolean = true) {
    this._setName(name, fork)

    emit && this.edit('set_name', name, [])
  }

  private _setName(name: string, fork: boolean = true) {
    fork && this._fork()

    this._specSetName(name)
  }

  private _specSetName(name: string) {
    this._spec.name = name
  }

  public _setUnitId(unitId: string, newUnitId: string, name: string): void {
    const newUnitMerges = clone(this.getUnitMergesSpec(unitId))
    const newUnitPlugs = clone(this.getUnitPlugsSpec(unitId))

    renameUnitInMerges(unitId, newUnitMerges, newUnitId)

    const unit = this.getUnit(unitId) as Graph

    this._removeUnit(unitId, false) as Graph

    this._addUnit(newUnitId, unit, null, null)
    this._addUnitMerges(newUnitMerges, false)
    this._addUnitPlugs(newUnitId, newUnitPlugs, false)

    unit.setName(name)
  }

  private _addUnitPlugs(
    unitId: string,
    plugs: GraphUnitPlugs,
    propagate: boolean = true
  ) {
    forIOObjKV(
      plugs,
      (type: IO, pinId: string, plugSpec: GraphPlugOuterSpec) => {
        this._plugPin(
          plugSpec.type,
          plugSpec.pinId,
          plugSpec.subPinId,
          {
            unitId,
            pinId,
            kind: type,
          },
          undefined,
          propagate
        )
      }
    )
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

  private _preventFork: boolean = false

  public setUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    data: any,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ) {
    this._preventFork = !fork

    this._setUnitPinData(unitId, type, pinId, data, fork, bubble)

    this._preventFork = false

    emit && this.edit('set_unit_pin_data', unitId, type, pinId, data, [])
  }

  private _setUnitPinData(
    unitId: string,
    type: IO,
    pinId: string,
    data: any,
    fork: boolean,
    bubble: boolean
  ) {
    const unit = this.getUnit(unitId)

    if (unit.hasInputNamed(pinId) && unit.isPinConstant(type, pinId)) {
      fork && this._fork(undefined, true, bubble)
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
    const { specs, classes } = this.__system

    const unit = this.getUnit(unitId)

    if (
      type === 'input' &&
      unit.hasInputNamed(pinId) &&
      unit.isPinConstant(type, pinId)
    ) {
      if (data instanceof Unit) {
        ;[data] = cloneUnitClass(data)
      }

      setUnitPinData(
        {
          unitId,
          type,
          pinId,
          data: evaluateData(data, specs, classes),
        },
        this._spec,
        specs,
        classes
      )
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

  public setMetadata(path: string[], data: any): void {
    deepSet_(this._spec.metadata, path, data)

    this.edit('set_metadata', { path, data }, [])
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
    slotMap: Dict<string>,
    index: number,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    // console.log('moveSubComponentRoot', subComponentId, children, slotMap, index)

    const prevParentMap = this.getSubComponentsParentMap(children)
    const prevSlotMap = this.getSubComponentsParentMap(children)

    for (let i = 0; i < children.length; i++) {
      const childId = children[i]

      const slotName = slotMap[childId] || 'default'

      this._moveSubComponentRoot(
        subComponentId,
        childId,
        index + i,
        slotName,
        fork,
        bubble
      )
    }

    emit &&
      this.edit(
        'move_sub_component_root',
        subComponentId,
        prevParentMap,
        children,
        index,
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
    this._simRemoveRoot(subComponentId, true)
    this._specRemoveRoot(subComponentId)
  }

  private _specRemoveRoot(subComponentId: string): void {
    removeRoot({ childId: subComponentId }, this._spec.component)
  }

  private _simRemoveRoot(subComponentId: string, emit: boolean): void {
    const subComponent = this.getUnit(subComponentId) as Component_

    this.unregisterRoot(subComponent, emit)
  }

  public moveSubgraphInto(
    ...[
      graphId,
      graphBundle,
      graphSpec,
      specId,
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
    this._moveSubgraphInto(
      graphId,
      graphBundle,
      graphSpec,
      specId,
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

    this.edit(
      'move_subgraph_into',
      graphId,
      graphBundle,
      graphSpec,
      specId,
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
      []
    )
  }

  private _moveSubgraphInto(
    graphId: string,
    graphBundle: BundleSpec,
    graphSpec: GraphSpec,
    specId: string,
    nodeIds: GraphMoveSubGraphData['nodeIds'],
    nextIdMap: GraphMoveSubGraphData['nextIdMap'],
    nextPinIdMap: GraphMoveSubGraphData['nextPinIdMap'],
    nextMergePinId: GraphMoveSubGraphData['nextMergePinId'],
    nextPlugSpec: GraphMoveSubGraphData['nextPlugSpec'],
    nextSubComponentParentMap: GraphMoveSubGraphData['nextSubComponentParentMap'],
    nextSubComponentChildrenMap: GraphMoveSubGraphData['nextSubComponentChildrenMap'],
    nextSubComponentIndexMap: GraphMoveSubGraphData['nextSubComponentIndexMap'],
    nextUnitPinMergeMap: GraphMoveSubGraphData['nextUnitPinMergeMap'],
    nextSubComponentSlot: GraphMoveSubGraphData['nextSubComponentSlot'],
    nextSubComponentParentSlot: GraphMoveSubGraphData['nextSubComponentParentSlot'],
    fork: boolean = true
  ) {
    const graph = this.getUnit(graphId) as Graph

    fork && graph.fork(specId)
    graph.startTransaction()

    this.__moveSubgraphInto(
      graphId,
      graphBundle,
      graphSpec,
      specId,
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

    graph.endTransaction()
  }

  private __moveSubgraphInto(
    graphId: string,
    graphBundle: BundleSpec,
    graphSpec: GraphSpec,
    specId: string,
    nodeIds: GraphMoveSubGraphData['nodeIds'],
    nextIdMap: GraphMoveSubGraphData['nextIdMap'],
    nextPinIdMap: GraphMoveSubGraphData['nextPinIdMap'],
    nextMergePinId: GraphMoveSubGraphData['nextMergePinId'],
    nextPlugSpec: GraphMoveSubGraphData['nextPlugSpec'],
    nextSubComponentParentMap: GraphMoveSubGraphData['nextSubComponentParentMap'],
    nextSubComponentChildrenMap: GraphMoveSubGraphData['nextSubComponentChildrenMap'],
    nextSubComponentIndexMap: GraphMoveSubGraphData['nextSubComponentIndexMap'],
    nextUnitPinMergeMap: GraphMoveSubGraphData['nextUnitPinMergeMap'],
    nextSubComponentSlot: GraphMoveSubGraphData['nextSubComponentSlot'],
    nextSubComponentParentSlot: GraphMoveSubGraphData['nextSubComponentParentSlot']
  ) {
    const graph = this.getUnit(graphId) as Graph

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
        nextUnitPinMergeMap,
        nextSubComponentIndexMap,
        nextSubComponentSlot,
        nextSubComponentParentSlot,
      },
      {
        merges,
      },
      false
    )
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

  public getUnitMergesSpec(unitId: string): GraphMergesSpec {
    return getUnitMergesSpec(this._spec, unitId)
  }

  public getPinMergeId(unitId: string, type: IO, pinId: string): string | null {
    const mergeId = deepGetOrDefault(
      this._pinToMerge,
      [unitId, type, pinId],
      null
    )

    return mergeId
  }

  public getUnitPlugsSpec(unitId: string): GraphUnitPlugs {
    return findUnitPlugs(this._spec, unitId)
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

    this.edit('bulk_edit', this._transaction, true, [])

    this._transacting = false
  }

  private _isUnitComponent = (unitId: string): boolean => {
    const unit = this.getUnit(unitId)

    const isComponent = unit.isElement()

    return isComponent
  }

  public moveSubgraphOutOf(
    ...[
      graphId,
      graphBundle,
      graphSpec,
      specId,
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

    this.__moveSubgraphOutOf(
      graphId,
      graphBundle,
      graphSpec,
      specId,
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

    this.edit(
      'move_subgraph_out_of',
      graphId,
      graphBundle,
      specId,
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
      []
    )
  }

  private _moveSubgraphOutOf(
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

    graph.startTransaction()
    graph.fork()

    this.__moveSubgraphOutOf(
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

    graph.endTransaction()
  }

  private __moveSubgraphOutOf(
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
    const graph = this.getUnit(graphId) as Graph

    const merges = clone(this.getUnitMergesSpec(graphId))
    const plugs = clone(this.getUnitPlugsSpec(graphId))

    const collapseMap: GraphMoveSubGraphData = {
      nodeIds,
      nextSpecId: null,
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
    }

    const connectOpt = {
      merges,
      plugs,
    }

    moveSubgraph(graph, this, graphId, collapseMap, connectOpt, true)
  }

  public getGraphUnitBundleSpec(graphId: string): BundleSpec {
    const graph = this.getUnit(graphId) as Graph

    const graphBundle = graph.getBundleSpec()

    return graphBundle
  }

  public getGraphUnitGraphSpec(graphId: string): GraphSpec {
    const graph = this.getUnit(graphId) as Graph

    const spec = graph.getSpec()

    return spec
  }

  public getGraphUnitUnitBundleSpec(graphId: string): UnitBundleSpec {
    const unit = this.getUnit(graphId) as Graph

    const unitBundle = unit.getUnitBundleSpec({})

    return unitBundle
  }

  private _removeSubComponentFromParent(
    subComponentId: string,
    emit: boolean,
    fork: boolean,
    bubble: boolean
  ) {
    fork && this._fork(undefined, true, bubble)

    this._simRemoveSubComponentFromParent(subComponentId, emit)
    this._specRemoveSubComponentFromParent(subComponentId)
  }

  public reorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number,
    emit: boolean = true,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._reorderSubComponent(parentId, childId, to, fork, bubble)

    emit && this.edit('reorder_sub_component', parentId, childId, to, [])
  }

  private _reorderSubComponent(
    parentId: string | null,
    childId: string,
    to: number,
    fork: boolean,
    bubble: boolean
  ): void {
    fork && this._fork(undefined, true, bubble)

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
    to: number,
    slotName: string,
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    // console.log('Graph', 'moveRoot', parentId, childId, to, slotName)

    this._moveSubComponentRoot(parentId, childId, to, slotName, fork, bubble)
  }

  private _moveSubComponentRoot(
    parentId: string | null,
    childId: string,
    to: number,
    slotName: string,
    fork: boolean,
    bubble: boolean
  ): void {
    this._removeSubComponentFromParent(childId, false, fork, bubble)

    if (parentId) {
      this._insertSubComponentChild(parentId, childId, to, slotName, false)
    } else {
      this._specAppendRoot(childId)

      const subComponent = this.getSubComponent(childId)

      this.registerRoot(subComponent, false)
    }
  }

  private _initSetComponent(component: GraphComponentSpec): void {
    const { slots = [], subComponents = {}, children = [] } = component

    for (const subComponentId in subComponents) {
      const subComponent = subComponents[subComponentId]

      this._initAddSubComponent(subComponentId, subComponent)
    }

    for (const childId of children) {
      const child = this.getUnit(childId) as Component_

      this.registerRoot(child, false)
    }

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]

      const [unitId, slotName] = slot

      const _slotName = i === 0 ? 'default' : `${i}`

      this._slot[_slotName] = unitId
    }
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

  private _root: Component_[] = []
  private _parent_root: Component_[] = []
  private _parent_children: Component_[] = []
  private _slot: Dict<string> = {}

  appendParentChild(component: Component_, slotName: string): void {
    return appendParentChild(this, this._parent_children, component, slotName)
  }

  removeParentChild(component: Component_): void {
    return removeParentChild(this, this._parent_children, component)
  }

  registerRoot(component: Component_, emit: boolean): void {
    return registerRoot(this, this._root, component, emit)
  }

  unregisterRoot(component: Component_, emit: boolean): void {
    return unregisterRoot(this, this._root, component, emit)
  }

  registerParentRoot(
    component: Component_,
    slotName: string,
    at?: number,
    emit?: boolean
  ): void {
    return registerParentRoot(
      this,
      this._parent_root,
      component,
      slotName,
      at,
      emit
    )
  }

  unregisterParentRoot(component: Component_): void {
    return unregisterParentRoot(this, this._parent_root, component)
  }

  reorderRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderRoot(this, this._root, component, to)
  }

  reorderParentRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderParentRoot(this, this._parent_root, component, to)
  }

  insertChild(Bundle: UnitBundle, at: number): void {
    return insertChild(this, this._children, Bundle, at)
  }

  appendChild(Bundle: UnitBundle): number {
    return appendChild(this, this._children, Bundle)
  }

  appendChildren(Bundles: UnitBundle[]): number {
    return appendChildren(this, this._children, Bundles)
  }

  pushChild(Bundle: UnitBundle): number {
    return pushChild(this, this._children, Bundle)[0]
  }

  pullChild(at: number): Component_ {
    return pullChild(this, this._children, at)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): Component_ {
    return removeChild(this, this._children, at)
  }

  refRoot(at: number): Component_ {
    return refRoot(this, this._root, at)
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

  setSlot(slotName: string, subComponentId: string): void {
    this._slot[slotName] = subComponentId
  }

  getSlot(slotName: string): string {
    return this._slot[slotName]
  }

  getAnimations(): AnimationSpec[] {
    return this._animations ?? []
  }

  animate(keyframes: Keyframe[], opt: KeyframeAnimationOptions): void {
    this._animations = this._animations ?? []

    animate(this, this._animations, keyframes, opt)
  }

  cancelAnimation(id: string): void {
    cancelAnimation(this, this._animations, id)

    if (!this._animations.length) {
      this._animations = undefined
    }
  }

  stopPropagation(name: string): Unlisten {
    this._stopPropagation = this._stopPropagation ?? {}

    const unlisten = stopPropagation(this, this._stopPropagation, name)

    return () => {
      unlisten()

      if (!keyCount(this._stopPropagation)) {
        this._stopPropagation = undefined
      }
    }
  }

  getSetup(): ComponentSetup {
    const setup: ComponentSetup = {
      animations: this._animations ?? [],
      events: this.eventNames().filter(isComponentEvent),
      stopPropagation: Object.keys(this._stopPropagation ?? {}),
      stopImmediatePropagation: Object.keys(
        this._stopImmediatePropagation ?? {}
      ),
      preventDefault: Object.keys(this._preventDefault ?? {}),
    }

    return setup
  }

  bulkEdit(
    actions: Action[],
    fork: boolean = true,
    bubble: boolean = true
  ): void {
    this._bulkEdit(actions, fork, bubble)

    this.edit('bulk_edit', actions, false, [])
  }

  private _bulkEdit(actions: Action[], fork: boolean, bubble: boolean): void {
    // console.log('Graph', 'bulkEdit', actions)

    actions = clone(actions)

    for (const action of actions) {
      processAction(
        action,
        {
          addUnitSpec: (data: GraphAddUnitData) => {
            const { unitId, bundle, parentId, merges, plugs } = data

            this._addUnitSpec(unitId, bundle, parentId, fork, bubble)

            if (parentId) {
              this._appendSubComponentChild(
                parentId,
                unitId,
                'default',
                fork,
                bubble
              )
            }

            if (merges) {
              this._addUnitMerges(merges, true)
            }

            if (plugs) {
              this._addUnitPlugs(unitId, plugs)
            }
          },
          cloneUnit: (data: GraphCloneUnitData) => {
            const { unitId, newUnitId } = data

            this._cloneUnit(unitId, newUnitId)
          },
          removeUnit: (data: GraphRemoveUnitData) => {
            const { unitId } = data

            this._removeUnit(unitId, false, true, fork)
          },
          exposePinSet: (data: GraphExposePinSetData) => {
            const { type, pinId, pinSpec, data: data_ } = data

            this._exposePinSet(type, pinId, pinSpec, data_, true, fork)
          },
          exposePin: (data: GraphExposePinData) => {
            const { type, pinId, subPinId, subPinSpec } = data

            this._exposePin(type, pinId, subPinId, subPinSpec)
          },
          coverPin: (data: GraphCoverPinData) => {
            const { type, pinId, subPinId } = data

            this._coverPin(type, pinId, subPinId, fork, bubble)
          },
          coverPinSet: (data: GraphCoverPinSetData) => {
            const { type, pinId } = data

            this._coverPinSet(type, pinId, undefined, fork, bubble)
          },
          plugPin: (data: GraphPlugPinData) => {
            const { type, pinId, subPinId, subPinSpec } = data

            this._plugPin(type, pinId, subPinId, subPinSpec, undefined)
          },
          unplugPin: (data: GraphUnplugPinData) => {
            const { type, pinId, subPinId, take } = data

            this._unplugPin(type, pinId, subPinId, take, fork, bubble)
          },
          removeMerge: (data: GraphRemoveMergeData) => {
            const { mergeId } = data

            this._removeMerge(mergeId, undefined, fork, bubble)
          },
          removePinFromMerge: (data: GraphRemovePinFromMergeData) => {
            const { mergeId, unitId, type, pinId } = data

            this._removePinFromMerge(
              mergeId,
              unitId,
              type,
              pinId,
              undefined,
              fork,
              bubble
            )
          },
          removeUnitGhost: (data: GraphRemoveUnitGhostData) => {
            const { unitId, nextUnitId, nextUnitSpec } = data

            this._removeUnitGhost(
              unitId,
              nextUnitId,
              nextUnitSpec,
              fork,
              bubble
            )
          },
          addUnitGhost: (data: GraphAddUnitGhostData) => {
            const { unitId, nextUnitId, nextUnitBundle, nextUnitPinMap } = data

            this._addUnitGhost(
              unitId,
              nextUnitId,
              nextUnitBundle,
              nextUnitPinMap
            )
          },
          addMerge: (data: GraphAddMergeData) => {
            const { mergeId, mergeSpec } = data

            this._addMerge(mergeSpec, mergeId, undefined, fork, undefined)
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

            this._setPinSetId(type, pinId, nextPinId, fork, bubble)
          },
          setPinSetFunctional: (data: GraphSetPinSetFunctionalData) => {
            const { type, pinId, functional } = data

            this._setPinSetFunctional(type, pinId, functional, fork, bubble)
          },
          setUnitPinConstant: (data: GraphSetUnitPinConstant) => {
            const { unitId, type, pinId, constant } = data

            this._setUnitPinConstant(
              unitId,
              type,
              pinId,
              constant,
              fork,
              bubble
            )
          },
          setUnitPinIgnored: (data: GraphSetUnitPinIgnoredData) => {
            const { unitId, type, pinId, ignored } = data

            this._setUnitPinIgnored(unitId, type, pinId, ignored, fork, bubble)
          },
          setUnitPinData: (_data: GraphSetUnitPinDataData) => {
            const { unitId, type, pinId, data } = _data

            this._setUnitPinData(unitId, type, pinId, data, fork, bubble)
          },
          setUnitId: (data: GraphSetUnitIdData) => {
            const { unitId, newUnitId, name } = data

            this._setUnitId(unitId, newUnitId, name)
          },
          removeUnitPinData: (data: GraphRemoveUnitPinDataData) => {
            const { unitId, type, pinId } = data

            this._removeUnitPinData(unitId, type, pinId, fork)
          },
          removeMergeData: (data: GraphRemoveMergeData) => {
            const { mergeId } = data

            this._removeMergeData(mergeId)
          },
          moveSubComponentRoot: (data: GraphMoveSubComponentRootData) => {
            const { parentId, children, slotMap, index } = data

            for (let i = 0; i < children.length; i++) {
              const childId = children[i]

              const slotName = slotMap[childId] || 'default'

              this._moveSubComponentRoot(
                parentId,
                childId,
                index + i,
                slotName,
                fork,
                bubble
              )
            }
          },
          moveSubgraphInto: (data: GraphMoveSubGraphIntoData) => {
            const {
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
            } = data

            this._moveSubgraphInto(
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
              fork
            )
          },
          moveSubgraphOutOf: (data: GraphMoveSubGraphOutOfData) => {
            const {
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
            } = data

            this._moveSubgraphOutOf(
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
          },
          reorderSubComponent: (data: GraphReorderSubComponentData) => {
            const { parentId, childId, to } = data

            this._reorderSubComponent(parentId, childId, to, fork, bubble)
          },
          removePinData: (data: UnitRemovePinDataData) => {
            const { type, pinId } = data

            this.removePinData(type, pinId)
          },
          takeInput: (data: UnitTakeInputData) => {
            const { pinId } = data

            this.removePinData('input', pinId)
          },
          setUnitSize: (data: GraphSetUnitSizeData) => {
            const { unitId, width, height } = data

            this._setUnitSize(unitId, width, height, fork, bubble)
          },
          setSubComponentSize: (data: GraphSetUnitSizeData) => {
            const { unitId, width, height } = data

            this._setSubComponentSize(unitId, width, height, fork, bubble)
          },
          setComponentSize: (data: GraphSetComponentSizeData) => {
            const { width, height } = data

            this._setComponentSize(width, height, fork, bubble)
          },
          bulkEdit: (data: GraphBulkEditData) => {
            const { actions } = data

            this.bulkEdit(actions, fork, bubble)
          },
        },
        () => {
          //
        }
      )
    }
  }

  private _setUnitSize(
    unitId: string,
    width: number,
    height: number,
    fork: boolean,
    bubble: boolean
  ) {
    fork && this._fork(undefined, true, bubble)

    this._specSetUnitSize(unitId, width, height)
  }

  private _specSetUnitSize(unitId: string, width: number, height: number) {
    setUnitSize({ unitId, width, height }, this._spec)
  }

  private _setSubComponentSize(
    unitId: string,
    width: number,
    height: number,
    fork: boolean,
    bubble: boolean
  ) {
    fork && this._fork(undefined, true, bubble)

    this._specSetSubComponentSize(unitId, width, height)
  }

  private _specSetSubComponentSize(
    unitId: string,
    width: number,
    height: number
  ) {
    setSubComponentSize({ unitId, width, height }, this._spec)
  }

  private _setComponentSize(
    width: number,
    height: number,
    fork: boolean,
    bubble: boolean
  ) {
    fork && this._fork(undefined, true, bubble)

    this._specSetComponentSize(width, height)
  }

  private _specSetComponentSize(width: number, height: number) {
    setComponentSize({ width, height }, this._spec)
  }
}
