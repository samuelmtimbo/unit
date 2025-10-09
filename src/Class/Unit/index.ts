import { $, $Events } from '../$'
import { SELF } from '../../constant/SELF'
import { DuplicatedInputFoundError } from '../../exception/DuplicatedInputFoundError'
import { DuplicatedOutputFoundError } from '../../exception/DuplicatedOutputFoundError'
import { InputNotFoundError } from '../../exception/InputNotFoundError'
import { InvalidArgumentType } from '../../exception/InvalidArgumentType'
import { OutputNotFoundError } from '../../exception/OutputNotFoundError'
import { Pin, Pin_M } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { PinOpts } from '../../PinOpts'
import { Pins } from '../../Pins'
import { stringify } from '../../spec/stringify'
import { System } from '../../system'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keys } from '../../system/f/object/Keys/f'
import { Spec } from '../../types'
import { AllKeys } from '../../types/AllKeys'
import { Dict } from '../../types/Dict'
import { U, U_EE } from '../../types/interface/U'
import { IO } from '../../types/IO'
import { Key } from '../../types/Key'
import { None } from '../../types/None'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { pull, push, removeAt } from '../../util/array'
import { mapObjVK } from '../../util/object'
import { Memory } from './Memory'

export type SnapshotOpt = {
  deep?: boolean
  state?: boolean
  system?: boolean
  error?: boolean
  metadata?: boolean
}

export type BundleOpt = SnapshotOpt & {}

export type PinMap<T> = Dict<Pin<T[keyof T]>>

const toPinMap = <T>(
  names: string[],
  opts: PinOpts,
  system: System
): {
  [K in keyof T]?: Pin<T[K]>
} => {
  return names.reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Pin(opts[name] ?? {}, system),
    }),
    {}
  )
}

export interface ION<I, O> {
  i?: string[]
  o?: string[]
}

export interface Opt {
  input?: PinOpts
  output?: PinOpts
}

export const DEFAULT_PIN_OPT: PinOpt = {
  ref: false,
}

export type PinOf<T> = Pin<T[keyof T]>

export type UnitEvents<_EE extends Dict<any[]>> = $Events<_EE & U_EE> & U_EE

export interface U_M {}

export class Unit<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    _EE extends UnitEvents<_EE> & Dict<any[]> = UnitEvents<U_EE>,
  >
  extends $<_EE>
  implements U<I, O>
{
  public __: string[] = ['U']
  public id: string

  public lazy: boolean = false

  public _parent: Unit | null = null

  public _input: Partial<AllKeys<I, Pin>> = {}
  public _output: Partial<AllKeys<O, Pin>> = {}

  public _data_input: Partial<AllKeys<I, Pin>> = {}
  public _data_output: Partial<AllKeys<O, Pin>> = {}

  public _ref_input: Partial<AllKeys<I, Pin>> = {}
  public _ref_output: Partial<AllKeys<O, Pin>> = {}

  protected _i_opt: Partial<Record<keyof I, PinOpt>> = {}
  protected _o_opt: Partial<Record<keyof O, PinOpt>> = {}

  protected _i_name_set: Set<keyof I> = new Set()
  protected _o_name_set: Set<keyof O> = new Set()

  protected _d_i_name: Set<keyof I> = new Set()
  protected _d_o_name: Set<keyof O> = new Set()

  protected _r_i_name: Set<Key> = new Set()
  protected _r_o_name: Set<Key> = new Set()

  protected _o_count: number = 0
  protected _i_count: number = 0

  protected _d_i_count: number = 0
  protected _d_o_count: number = 0

  protected _r_i_count: number = 0
  protected _r_o_count: number = 0

  protected _err: string | null = null

  protected _selfInput: Pin
  protected _selfOutput: Pin<any>

  public ref: any | null = null

  public _paused: boolean = true

  public _opt: Opt

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super(system)

    const { input, output } = opt

    const inputMap = toPinMap<I>(i, opt.input ?? {}, this.__system)
    const outputMap = toPinMap<O>(o, opt.output ?? {}, this.__system)

    this.setInputs(inputMap, input)
    this.setOutputs(outputMap, output)

    this._selfInput = new Pin<U>(
      { data: this, constant: false, ref: true },
      this.__system
    )
    this._selfOutput = new Pin<any>(
      { data: this, constant: false, ref: true },
      this.__system
    )

    this._selfOutput.addListener('drop', () => {
      throw new Error('self output cannot be dropped')
    })

    this.id = id
  }

  public isElement() {
    return false
  }

  public isPinIgnored<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K): boolean {
    const pin = this.getPin(type, pinId)
    const ignored = pin.ignored()
    return ignored
  }

  public isPinConstant<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K): boolean {
    const pin = this.getPin(type, pinId)
    const constant = pin.constant()
    return constant
  }

  public isPinRef<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K): boolean {
    const input = type === 'input'

    if (!input && pinId === SELF) {
      return true
    }

    const ref =
      (input && !!this._ref_input[pinId as keyof I]) ||
      (!input && !!this._ref_output[pinId as keyof O])

    return ref
  }

  public setParent(parent: Unit | null, ...extra: any[]) {
    this._parent = parent

    this.emit('parent', this._parent)
  }

  public removeParent() {
    this._parent = null

    this.emit('parent', null)
  }

  public setPinIgnored<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K, ignored: boolean): void {
    if (type === 'input') {
      this.setInputIgnored(pinId as keyof I, ignored)
    } else {
      this.setOutputIgnored(pinId as keyof O, ignored)
    }
  }

  public setPinConstant<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K, constant: boolean): void {
    this.getPin(type, pinId).constant(constant)

    this.emit('set_pin_constant', type, pinId, constant)
  }

  private _memSetPinOptData<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K): void {
    if (type === 'input') {
      this._memSetInputData(pinId as keyof I)
    } else {
      this._memSetOutputData(pinId as keyof O)
    }
  }

  private _memSetInputData<K extends keyof I>(pinId: K): void {
    const input = this._input[pinId]

    this._memRemoveRefInput(pinId)
    this._memAddDataInput(pinId, input)
  }

  private _memSetOutputData<K extends keyof O>(pinId: K): void {
    const output = this._output[pinId]

    this._memRemoveRefOutput(pinId)
    this._memAddDataOutput(pinId, output)
  }

  private _memSetPinRef<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: IO, pinId: K): void {
    if (type === 'input') {
      this._memSetInputRef(pinId as keyof I)
    } else {
      this._memSetOutputRef(pinId as keyof O)
    }
  }

  private _memSetInputRef<K extends keyof I>(pinId: K): void {
    const input = this._input[pinId]

    this._memRemoveDataInput(pinId)
    this._memAddRefInput(pinId, input)
  }

  private _memSetOutputRef<K extends keyof O>(pinId: K): void {
    const output = this._output[pinId]

    this._memRemoveDataOutput(pinId)
    this._memAddRefOutput(pinId, output)
  }

  public setPinRef<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, pinId: K, ref: boolean): void {
    if (ref) {
      if (this.hasRefPinNamed(type, pinId)) {
        return
      } else {
        this._memSetPinRef(type, pinId)
      }
    } else {
      if (this.hasPinNamed(type, pinId)) {
        return
      } else {
        this._memSetPinOptData(type, pinId)
      }
    }
  }

  public setInputRef<K extends keyof I>(pinId: K, ref: boolean): void {
    this.setPinRef('input', pinId, ref)
  }

  public setOutputRef<K extends keyof O>(pinId: K, ref: boolean): void {
    this.setPinRef('output', pinId, ref)
  }

  public setInputIgnored<K extends keyof I>(
    pinId: K,
    ignore: boolean
  ): boolean {
    const input = this.getInput(pinId)

    if (this.hasRefInputNamed(pinId)) {
      return
    }

    // return input.ignored(ignore)
  }

  public setOutputIgnored<K extends keyof O>(
    pinId: K,
    ignore: boolean
  ): boolean {
    const output = this.getOutput(pinId)

    return output.ignored(ignore)
  }

  public setInputs(inputs: Pins<I>, opts: PinOpts = {}): void {
    for (const name in inputs) {
      const input = inputs[name]
      const opt = opts[name]

      this.setInput(name, input, opt)
    }
  }

  public setPin<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    pinId: K,
    pin: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean = true
  ) {
    if (type === 'input') {
      this.setInput(pinId as keyof I, pin, opt, propagate)
    } else {
      this.setOutput(pinId as keyof O, pin, opt, propagate)
    }
  }

  public setInput<K extends keyof I>(
    pinId: K,
    input: Pin<I[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean = true
  ) {
    this._setInput(pinId, input, opt, propagate)

    this.emit('set_input', pinId, input, opt, propagate)
  }

  public _setInput<K extends keyof I>(
    pinId: K,
    input: Pin<I[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean
  ) {
    if (this.hasInputNamed(pinId)) {
      this.removeInput(pinId, propagate)
    }

    this._i_count++

    this._i_name_set.add(pinId)

    this._input[pinId] = input
    this._i_opt[pinId] = opt

    const { ref } = opt

    if (ref) {
      this._memAddRefInput(pinId, input)
    } else {
      this._memAddDataInput(pinId, input)
    }
  }

  private _memAddDataInput<K extends keyof I>(name: K, input: PinOf<I>): void {
    this._d_i_count++
    this._d_i_name.add(name)
    this._data_input[name] = input
  }

  private _memAddRefInput<K extends keyof I>(name: K, input: PinOf<I>): void {
    this._r_i_count++
    this._r_i_name.add(name)
    this._ref_input[name] = input
  }

  private _validateInputName(name: any): void {
    if (typeof name === 'string') {
      if (!this.hasInputNamed(name)) {
        throw new InputNotFoundError(name)
      }
    } else {
      throw new InvalidArgumentType('name should be a string')
    }
  }

  private _validateOutputName(name: any): void {
    if (typeof name === 'string') {
      if (!this.hasOutputNamed(name)) {
        throw new OutputNotFoundError(name)
      }
    } else {
      throw new InvalidArgumentType('name should be a string')
    }
  }

  public addPin<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K,
    pin: Pin<any>,
    opt: PinOpt,
    propagate?: boolean
  ): void {
    if (type === 'input') {
      this.addInput(name as keyof I, pin, opt, propagate)
    } else {
      this.addOutput(name as keyof O, pin, opt, propagate)
    }
  }

  public addInput<K extends keyof I>(
    name: K,
    input: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate?: boolean
  ): void {
    if (this.hasInputNamed(name)) {
      throw new DuplicatedInputFoundError(name)
    }
    this.setInput(name, input, opt, propagate)
  }

  public removeInput<K extends keyof I>(
    name: K,
    propagate: boolean = false
  ): void {
    if (!this.hasInputNamed(name)) {
      throw new InputNotFoundError(name as string)
    }

    const input = this._input[name]

    this.emit('before_remove_input', name, input)

    this._i_count--
    this._i_name_set.delete(name)

    const opt = this._i_opt[name]

    const { ref } = opt

    if (ref) {
      this._memRemoveRefInput(name)
    } else {
      this._memRemoveDataInput(name)
    }

    delete this._i_opt[name]
    delete this._input[name]

    input.destroy()

    this.emit('remove_input', name, input, propagate)
  }

  private _memRemoveDataInput = <K extends keyof I>(name: K): void => {
    this._d_i_count--
    this._d_i_name.delete(name)
    delete this._data_input[name]
  }

  private _memRemoveRefInput = <K extends keyof I>(name: K): void => {
    this._r_i_count--
    this._r_i_name.delete(name)
    delete this._ref_input[name]
  }

  public setOutputs(outputs: Pins<O>, opts: PinOpts = {}): void {
    for (let name in outputs) {
      const output = outputs[name]
      const opt = opts[name]
      this.setOutput(name, output, opt)
    }
  }

  public setOutput<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean = true
  ) {
    this._setOutput(name, output, opt, propagate)

    this.emit('set_output', name, output, opt, propagate)
  }

  public _setOutput<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean
  ) {
    if (this.hasOutputNamed(name)) {
      this.removeOutput(name, propagate)
    }

    if (name === SELF) {
      this._selfOutput = output
    }

    this._o_count++
    this._o_name_set.add(name)

    this._o_opt[name] = opt

    const { ref } = opt

    if (ref) {
      this._memAddRefOutput(name, output)
    } else {
      this._memAddDataOutput(name, output)
    }

    this._output[name] = output
  }

  private _memAddRefOutput = <K extends keyof O>(
    name: K,
    output: Pin<O[keyof O]>
  ): void => {
    this._r_o_count++
    this._r_o_name.add(name)

    this._memSetRefOutput(name, output)
  }

  private _memSetRefOutput = <K extends keyof O>(
    name: K,
    output: Pin<O[keyof O]>
  ): void => {
    this._ref_output[name] = output
  }

  private _memAddDataOutput = <K extends keyof O>(
    name: K,
    output: Pin<O[keyof O]>
  ): void => {
    this._d_o_count++
    this._d_o_name.add(name)

    this._memSetDataOutput(name, output)
  }

  private _memSetDataOutput = <K extends keyof O>(
    name: K,
    output: Pin<O[keyof O]>
  ): void => {
    this._data_output[name] = output
  }

  public addOutput<K extends keyof O>(
    name: K,
    output: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate?: boolean
  ): void {
    if (this.hasOutputNamed(name)) {
      throw new DuplicatedOutputFoundError(name)
    }
    this.setOutput(name, output, opt, propagate)
  }

  private _memRemoveRefPin = (type: IO, name: string): void => {
    if (type === 'input') {
      this._memRemoveRefInput(name)
    } else {
      this._memRemoveRefOutput(name)
    }
  }

  private _memRemoveRefOutput = <K extends keyof O>(name: K): void => {
    this._r_o_count--
    this._r_o_name.delete(name)
    delete this._ref_output[name]
  }

  private _memRemoveDataOutput = <K extends keyof O>(name: K): void => {
    this._d_o_count--
    this._d_o_name.delete(name)
    delete this._data_output[name]
  }

  public removeOutput<K extends keyof O>(name: K, propagate: boolean): void {
    if (!this.hasOutputNamed(name)) {
      throw new OutputNotFoundError(name)
    }

    const output = this._output[name]

    this.emit('before_remove_output', name, output)

    this._o_count--
    this._o_name_set.delete(name)

    const opt = this._o_opt[name]

    const { ref } = opt

    if (ref) {
      this._memRemoveRefOutput(name)
    } else {
      this._memRemoveDataOutput(name)
    }

    delete this._o_opt[name]
    delete this._output[name]

    output.destroy()

    this.emit('remove_output', name, output, propagate)
  }

  public removePin<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, name: K, propagate: boolean): void {
    if (type === 'input') {
      this.removeInput(name as keyof I, propagate)
    } else {
      this.removeOutput(name as keyof O, propagate)
    }
  }

  public getPin<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    pinId: K
  ): Pin<any> {
    if (type === 'input') {
      return this.getInput(pinId as keyof I)
    } else {
      return this.getOutput(pinId as keyof O)
    }
  }

  public getInputs(): Pins<I> {
    return this._input
  }

  public getDataInputs(): Pins<Partial<I>> {
    return this._data_input
  }

  public getRefInputs(): Pins<Partial<I>> {
    return this._ref_input
  }

  public getInput(name: keyof I): Pin<any> {
    if (name === SELF) {
      return this._selfInput
    }
    this._validateInputName(name)
    return this._input[name]
  }

  public getOutputs(): Pins<O> {
    return this._output
  }

  public getDataOutputs(): Pins<Partial<O>> {
    return this._data_output
  }

  public getRefOutputs(): Pins<Partial<O>> {
    return this._ref_output
  }

  public getOutput<K extends keyof O>(name: K): Pin<O[K]> {
    if (name === SELF) {
      return this._selfOutput
    }

    this._validateOutputName(name)

    return this._output[name]
  }

  public push<K extends keyof I>(name: K, data: any): void {
    this.pushInput(name, data)
  }

  public pushInput<K extends keyof I>(name: K, data: I[K]): void {
    this._validateInputName(name)
    this.getInput(name).push(data)
  }

  public pushAllInput(data: Partial<I>): void {
    forEachValueKey(data, (value, name) => this.pushInput(name, value))
  }

  public pushOutput<K extends keyof O>(name: K, data: O[K]): void {
    this.getOutput(name).push(data)
  }

  public pushAllOutput(data: Partial<O>): void {
    forEachValueKey(data, (value, name) => this.pushOutput(name, value))
  }

  public pushAll(data: Partial<I>): void {
    this.pushAllInput(data)
  }

  public pullInput<K extends keyof I>(name: K): I[K] {
    return this.getInput(name).pull()
  }

  public pullOutput<K extends keyof O>(name: K): O[K] {
    return this.getOutput(name).pull()
  }

  public pullPin<
    T extends IO,
    P extends T extends 'input' ? I : O,
    K extends keyof P,
  >(type: T, name: K): P[K] {
    return (
      type === 'input'
        ? this.pullInput(name as keyof I)
        : this.pullOutput(name as keyof O)
    ) as P[K]
  }

  public takePin<
    T extends IO,
    P extends T extends 'input' ? I : O,
    K extends keyof P,
  >(type: T, name: K): P[K] {
    return (
      type === 'input'
        ? this.takeInput(name as keyof I)
        : this.takeOutput(name as keyof O)
    ) as P[K]
  }

  public takeInput<K extends keyof I>(name: K): I[K] {
    this._validateInputName(name)

    return this.getInput(name).take()
  }

  public takeOutput<K extends keyof O>(name: K): O[K] {
    return this.getOutput(name).take()
  }

  public take<K extends keyof O>(name: K): O[K] {
    return this.takeOutput(name)
  }

  public takeAll(): Dict<any> {
    return mapObjVK<Pin<any>, any>(this._output, (output) => output.take())
  }

  public peakInput<K extends keyof I>(name: K): I[K] {
    return this.getInput(name).peak()
  }

  public peakOutput<K extends keyof O>(name: K): O[K] {
    return this.getOutput(name).peak()
  }

  public peak<K extends keyof O>(name: K): O[K] {
    return this.peakOutput(name)
  }

  public peakAllOutput(): Dict<any> {
    return mapObjVK<Pin<any>, any>(this._output, (pin) => pin.peak())
  }

  public peakAll(): Dict<any> {
    return this.peakAllOutput()
  }

  public hasPinNamed<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, name: K): boolean {
    if (type === 'input') {
      return this.hasInputNamed(name as keyof I)
    } else {
      return this.hasOutputNamed(name as keyof O)
    }
  }

  public hasInputNamed<K extends keyof I>(name: K): boolean {
    return this._input[name] !== undefined
  }

  public hasOutputNamed<K extends keyof O>(name: K): boolean {
    return this._output[name] !== undefined
  }

  public hasDataPinNamed(type: IO, name: string): boolean {
    if (type === 'input') {
      return this.hasDataInputNamed(name)
    } else {
      return this.hasDataOutputNamed(name)
    }
  }

  public hasDataInputNamed(name: string): boolean {
    return this._d_i_name.has(name)
  }

  public hasDataOutputNamed(name: string): boolean {
    return this._d_o_name.has(name)
  }

  public hasRefPinNamed<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, name: K): boolean {
    if (type === 'input') {
      return this.hasRefInputNamed(name as keyof I)
    } else {
      return this.hasRefOutputNamed(name as keyof O)
    }
  }

  public hasRefInputNamed<K extends keyof I>(name: K): boolean {
    return this._r_i_name.has(name)
  }

  public renamePin<
    T extends IO,
    K extends T extends 'input' ? keyof I : keyof O,
  >(type: T, name: K, newName: K): void {
    if (type === 'input') {
      this.renameInput(name as keyof I, newName as keyof I)
    } else {
      this.renameOutput(name as keyof O, newName as keyof O)
    }
  }

  public renameInput<K extends keyof I>(
    name: K,
    newName: K,
    propagate: boolean = true
  ): void {
    // console.log('renameInput', name, newName, propagate)

    if (!this.hasInputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const input = this._input[name]
    const opt = this._i_opt[name]

    this._i_name_set.delete(name)
    this._i_name_set.add(newName)

    delete this._input[name]
    delete this._i_opt[name]

    this._input[newName] = input
    this._i_opt[newName] = opt

    const { ref } = opt

    if (ref) {
      this._r_i_name.delete(name)
      this._r_i_name.add(newName)

      delete this._ref_input[name]

      this._ref_input[newName] = input
    } else {
      this._d_i_name.delete(name)
      this._d_i_name.add(newName)

      delete this._data_input[name]

      this._data_input[newName] = input
    }

    this.emit('rename_input', name, newName)
  }

  public renameOutput<K extends keyof O>(
    name: K,
    newName: K,
    propagate: boolean = true
  ): void {
    if (!this.hasOutputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const output = this._output[name]
    const opt = this._o_opt[name]

    this._o_name_set.delete(name)
    this._o_name_set.add(newName)

    delete this._output[name]
    this._output[newName] = output

    delete this._o_opt[name]
    this._o_opt[newName] = opt

    const { ref } = opt

    if (ref) {
      this._r_o_name.delete(name)
      this._r_o_name.add(newName)

      delete this._ref_output[name]
      this._ref_output[newName] = output
    } else {
      this._d_o_name.delete(name)
      this._d_o_name.add(newName)

      delete this._data_output[name]
      this._data_output[newName] = output
    }

    this.emit('rename_output', name, newName)
  }

  public getInputOpt<K extends keyof I>(name: K): PinOpt {
    return this._i_opt[name]
  }

  public getOutputOpt<K extends keyof O>(name: K): PinOpt {
    return this._o_opt[name]
  }

  public hasRefOutputNamed<K extends keyof O>(name: K): boolean {
    return this._r_o_name.has(name)
  }

  public getInputCount(): number {
    return this._i_count
  }

  public getOutputCount(): number {
    return this._o_count
  }

  public getInputNames(): string[] {
    return keys(this._input)
  }

  public getOutputNames(): string[] {
    return keys(this._output)
  }

  public setPinData(
    type: IO,
    pinId: string,
    data: any,
    propagate: boolean = true
  ): void {
    const pin = this.getPin(type, pinId)
    pin.push(data, false, propagate)

    this.emit('set_pin_data', type, pinId, data)
  }

  public removePinData(
    type: IO,
    pinId: string,
    propagate: boolean = true
  ): void {
    const pin = this.getPin(type, pinId)

    pin.take(propagate)
  }

  public setInputConstant(pinId: string, constant: boolean): void {
    const input = this.getInput(pinId)
    input.constant(constant)
  }

  public setOutputConstant(pinId: string, constant: boolean): void {
    const output = this.getOutput(pinId)
    output.constant(constant)
  }

  public getCatchErr(): boolean {
    return this._catchErr
  }

  private _catcherCallback: ((err: string | null) => void)[] = []
  private _catcherDoneCount: number = 0
  private _catcherDone: boolean[] = []

  protected _catchErr: boolean = false
  protected _caughtErr: string | null = null

  public caughtErr(): string | null {
    return this._caughtErr
  }

  public catch(callback: (err: string) => void): {
    unlisten: Unlisten
    done: () => void
  } {
    push(this._catcherCallback, callback)
    push(this._catcherDone, false)

    this._catchErr = true

    const err = this._err

    if (err) {
      this._err = null
      this._caughtErr = err
      this.emit('catch_err', err)
    }

    const _check_all_done = () => {
      if (this._catcherDoneCount === this._catcherCallback.length) {
        _all_done()
      }
    }

    const _all_done = () => {
      const caughtErr = this._caughtErr

      this._caughtErr = null
      this._catcherDoneCount = 0
      this._catcherDone.fill(false)

      this.emit('take_caught_err', caughtErr)
    }

    const unlisten = () => {
      const i = this._catcherCallback.indexOf(callback)

      if (i > -1) {
        pull(this._catcherCallback, callback)

        const done = this._catcherDone[i]

        removeAt(this._catcherDone, i)

        if (this._catcherCallback.length === 0) {
          const err = this._caughtErr
          this._catchErr = false
          if (err !== null) {
            this._caughtErr = null
            this.err(err)
            this.emit('take_caught_err', err)
          }
        }

        if (!done) {
          _check_all_done()
        }
      } else {
        throw new Error('unregistered Catcher cannot call unlisten')
      }
    }

    const done = () => {
      if (this._caughtErr) {
        const i = this._catcherCallback.indexOf(callback)
        if (i > -1) {
          const done = this._catcherDone[i]
          if (done) {
            throw new Error('catcher cannot be done twice')
          } else {
            this._catcherDone[i] = true
            this._catcherDoneCount++
            _check_all_done()
          }
        } else {
          throw new Error('unregistered Catcher cannot call done')
        }
      } else {
        // throw new Error("catcher cannot call done when there's no caught error")
      }
    }

    return { unlisten, done }
  }

  public getConfig(): Opt {
    return this._opt
  }

  public reset(): void {
    this.takeErr()

    this.emit('reset')

    for (const name of this._d_i_name) {
      const input = this.getInput(name)

      if (input.constant() && input.active()) {
        input.push(input.peak())
      }
    }
  }

  public pause(): void {
    if (!this._paused) {
      this._paused = true
      this.emit('pause')
    }
  }

  public play(): void {
    if (this._paused) {
      this._paused = false
      this.emit('play')
    }
  }

  public paused(): boolean {
    return this._paused
  }

  public getSelfPin(): Pin<U> {
    return this._selfOutput
  }

  public err(err?: string | Error | None): string | null {
    // console.log('Unit', 'err', err)
    // everything is alright when there is no err
    if (err) {
      if (err instanceof Error) {
        err = err.message
      }
      if (this._catchErr) {
        this._caughtErr = err
        for (const callback of this._catcherCallback) {
          callback(err)
        }
      } else {
        // exceptions in unit are isolated to the unit
        // they do not kill the application
        // they are expected though to stop the unit from functioning
        this._err = err
        this.emit('err', err)
      }
    }
    return this._err
  }

  public hasErr(): boolean {
    return this._err !== null
  }

  public getErr(): string | null {
    return this._err
  }

  public takeErr(): string | null {
    const err = this._err
    if (err) {
      this._err = null
      this.emit('take_err', err)
    }
    return err
  }

  public takeCaughtErr(): string | null {
    const err = this._caughtErr
    if (err) {
      this._caughtErr = null

      for (const callback of this._catcherCallback) {
        callback(null)
      }

      this.emit('take_caught_err', err)
    }
    return err
  }

  public destroy(): void {
    super.destroy()

    for (const name of this._i_name_set) {
      const pin = this.getInput(name)

      pin.destroy()
    }

    for (const name of this._o_name_set) {
      const pin = this.getOutput(name)

      pin.destroy()
    }

    this._selfInput.destroy()
    this._selfOutput.destroy()
  }

  public getPinData(type: IO, pinId: string): any {
    const pin = this.getPin(type, pinId)

    const data = pin.peak()

    return data
  }

  public getPinsData(): { input: Partial<I>; output: Partial<O> } {
    const data: { input: Partial<I>; output: Partial<O> } = {
      input: {},
      output: {},
    }
    forEachValueKey(this._input, (input, inputId) => {
      data.input[inputId] = input.peak()
    })
    forEachValueKey(this._output, (output, outputId) => {
      data.output[outputId] = output.peak()
    })
    return data
  }

  public getInputData(): Partial<I> {
    const data: Partial<I> = {}
    forEachValueKey(this._input, (input, inputId) => {
      if (!input.empty()) {
        const datum = input.peak()
        data[inputId] = datum
      }
    })
    return data
  }

  public getRefInputData(): Partial<I> {
    const data: Partial<I> = {}

    forEachValueKey(this._ref_input, (input, inputId) => {
      if (!input.empty()) {
        let datum = input.peak()
        data[inputId] = datum
      }
    })

    return data
  }

  public getSpec(): Spec {
    return this.__system.getSpec(this.id)
  }

  public getUnitBundleSpec({
    deep = false,
    system = false,
    state = false,
    error = false,
  }: BundleOpt = {}): UnitBundleSpec {
    const memory = this.snapshot({ deep, state })

    const input = mapObjVK<Pin<any>, any>(this._input, (input) => {
      const ignored = input.ignored()
      const constant = input.constant()
      const _data = input.peak()
      const data =
        constant && _data !== undefined ? stringify(_data) : undefined

      return {
        ignored,
        constant,
        data,
      }
    })

    const output = mapObjVK<Pin<any>, any>(this._output, (output) => {
      const ignored = output.ignored()
      const constant = output.constant()
      const data = undefined

      return {
        ignored,
        constant,
        data,
      }
    })

    const specs = {}

    const { id } = this

    if (system) {
      specs[id] = this.__system.specs[id]
    }

    const bundle: UnitBundleSpec = {
      unit: { id, memory, input, output },
      specs,
    }

    if (error) {
      const err = this.getErr()

      if (err) {
        bundle.unit.err = err
      }
    }

    return bundle
  }

  public snapshotSelf(opt: SnapshotOpt = {}): Dict<any> {
    if (opt.error && this.hasErr()) {
      return { err: this._err }
    }

    return undefined
  }

  public snapshotInput<T extends keyof I>(pinId: T): Pin_M<I[T]> {
    return this.getInput(pinId).snapshot()
  }

  public snapshotInputs(): Partial<Record<keyof I, Pin_M>> {
    const state: Partial<Record<keyof I, Pin_M>> = {}

    for (const name of this._i_name_set) {
      state[name] = this.snapshotInput(name)
    }

    return state
  }

  public snapshotOutput<T extends keyof O>(pinId: T): Pin_M<O[T]> {
    return this.getOutput(pinId).snapshot()
  }

  public snapshotOutputs(): Partial<Record<keyof O, Pin_M>> {
    const state: Partial<Record<keyof O, Pin_M>> = {}

    for (const name of this._o_name_set) {
      state[name] = this.snapshotOutput(name)
    }

    return state
  }

  public snapshot(opt: SnapshotOpt = { deep: true }): Memory {
    const { deep, state } = opt

    if (!deep && !state) {
      return undefined
    }

    return {
      input: (deep && this.snapshotInputs()) || undefined,
      output: (deep && this.snapshotOutputs()) || undefined,
      memory: ((deep || state) && this.snapshotSelf(opt)) || undefined,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    return
  }

  public restoreInputs(state: Dict<Pin_M>): void {
    for (const name in state) {
      const memory = state[name]

      this.restoreInput(name, memory)
    }
  }

  public restoreInput(pinId: string, state: Pin_M): void {
    this.getInput(pinId).restore(state)
  }

  public restoreOutputs(state: Dict<Pin_M>): void {
    for (const name in state) {
      const memory = state[name]

      this.restoreOutput(name, memory)
    }
  }

  public restoreOutput(pinId: string, state: Pin_M): void {
    this.getOutput(pinId).restore(state)
  }

  public restore(state: Memory): void {
    const { input, output, memory } = state

    this.restoreInputs(input)
    this.restoreOutputs(output)
    this.restoreSelf(memory ?? {})

    this.emit('restore')
  }
}
